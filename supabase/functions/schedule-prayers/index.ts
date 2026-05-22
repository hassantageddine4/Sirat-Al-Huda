// supabase/functions/transcribe/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Secure speech-to-text endpoint.
//
// The client NEVER talks to OpenAI directly. It sends the recorded audio
// here as multipart/form-data; this function forwards it to Whisper using
// the OPENAI_API_KEY stored as a Supabase secret, then returns the Arabic
// transcription.
//
// Security controls:
//   • Requires a valid Supabase user JWT (requireUser)
//   • Rejects oversized uploads (15 MB cap)
//   • Rejects wrong mime types
//   • IP-level rate limit (10 transcriptions / minute)
//   • Key is read from Deno env — never in client bundle
//   • Safe error messages — never leaks OpenAI response details
//
// Deploy:
//   supabase secrets set OPENAI_API_KEY=sk-proj-...
//   supabase functions deploy transcribe
//
// Client usage:
//   const fd = new FormData();
//   fd.append("file", audioBlob, "recitation.webm");
//   await supabase.functions.invoke("transcribe", { body: fd });
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  CORS_HEADERS, handleOptions, requireUser,
  checkIpRate, serviceClient, logAudit,
  ok, fail, ValidationError,
} from "../_shared/auth.ts";

const OPENAI_URL   = "https://api.openai.com/v1/audio/transcriptions";
const MODEL        = "whisper-1";
const LANGUAGE     = "ar";        // force Arabic
const MAX_BYTES    = 15 * 1024 * 1024;  // 15 MB

// Allowed mime prefixes — covers webm/ogg/mp4/m4a/wav/mpeg
const ALLOWED_MIME = [
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-m4a",
  "audio/m4a",
];

serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  try {
    // 1. AuthN — JWT must be valid
    const { user, ip } = await requireUser(req);

    // 2. IP-level rate limit (coarse backstop)
    checkIpRate(ip, 10);

    // 3. Parse multipart form
    const form = await req.formData().catch(() => null);
    if (!form) throw new ValidationError("Invalid form data.");

    const file = form.get("file");
    if (!(file instanceof File)) {
      throw new ValidationError("Missing audio file.");
    }

    // 4. Validate file size + type
    if (file.size === 0)           throw new ValidationError("Empty audio file.");
    if (file.size > MAX_BYTES)     throw new ValidationError("Audio file too large (max 15 MB).");

    const mimeOk = ALLOWED_MIME.some(prefix => file.type.startsWith(prefix));
    if (!mimeOk) {
      throw new ValidationError("Unsupported audio format.");
    }

    // 5. Ensure the secret is actually configured
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not configured on the server");
      return new Response(
        JSON.stringify({ error: "Transcription service is not available." }),
        { status: 503, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // 6. Forward to OpenAI Whisper
    const upstream = new FormData();
    upstream.append("file", file, file.name || "recitation.webm");
    upstream.append("model", MODEL);
    upstream.append("language", LANGUAGE);
    upstream.append("response_format", "json");
    // A prompt helps Whisper pick Uthmani-style transcription
    upstream.append(
      "prompt",
      "This is a recitation of the Holy Quran in classical Arabic."
    );

    const whisperRes = await fetch(OPENAI_URL, {
      method:  "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body:    upstream,
    });

    if (!whisperRes.ok) {
      // Log the real reason server-side for debugging; do NOT leak it.
      const detail = await whisperRes.text().catch(() => "");
      console.error("Whisper error:", whisperRes.status, detail);

      await logAudit(serviceClient(), {
        userId: user.id,
        event:  "transcribe_upstream_error",
        detail: { status: whisperRes.status },
        ip,
      });

      // Map common upstream errors to safe user-facing messages
      if (whisperRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
      throw new ValidationError("Could not transcribe audio.");
    }

    const json = await whisperRes.json();
    const text = typeof json.text === "string" ? json.text.trim() : "";

    if (!text) {
      throw new ValidationError("No speech detected. Please try again.");
    }

    // 7. Audit success
    await logAudit(serviceClient(), {
      userId: user.id,
      event:  "transcribe_success",
      detail: { bytes: file.size, mime: file.type, length: text.length },
      ip,
    });

    return ok({ text });

  } catch (err) {
    return fail(err);
  }
});
