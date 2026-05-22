// src/services/transcriptionService.js
// ─────────────────────────────────────────────────────────────────────────────
// Client wrapper around the /transcribe Supabase Edge Function.
// The OpenAI key lives ONLY in the server — this file never references it.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "./supabaseClient";

/**
 * Send a recorded audio Blob to the secure backend and return the Arabic
 * transcription text. Returns { text, error } — never throws.
 *
 * @param {Blob} audioBlob  Recording from MediaRecorder
 * @returns {Promise<{text: string, error: string|null}>}
 */
export async function transcribeAudio(audioBlob) {
  if (!(audioBlob instanceof Blob) || audioBlob.size === 0) {
    return { text: "", error: "No audio to transcribe." };
  }

  // Size guard — matches the server cap so we fail fast on client before upload
  if (audioBlob.size > 15 * 1024 * 1024) {
    return { text: "", error: "Recording is too long. Please keep under 1 minute." };
  }

  try {
    const form = new FormData();
    const ext  = audioBlob.type.includes("webm") ? "webm"
               : audioBlob.type.includes("ogg")  ? "ogg"
               : audioBlob.type.includes("mp4")  ? "m4a"
               : "webm";
    form.append("file", audioBlob, `recitation.${ext}`);

    const { data, error } = await supabase.functions.invoke("transcribe", {
      body: form,
    });

    if (error) {
      // Try to read the server's safe error message
      let msg = "Could not transcribe audio.";
      try {
        const res = error.context?.response;
        if (res) {
          const body = await res.text();
          const parsed = JSON.parse(body);
          if (parsed?.error) msg = parsed.error;
        }
      } catch { /* keep default */ }
      return { text: "", error: msg };
    }

    if (!data?.text) {
      return { text: "", error: "No speech detected. Please try again." };
    }

    return { text: data.text, error: null };
  } catch (err) {
    return { text: "", error: err?.message ?? "Network error." };
  }
}
