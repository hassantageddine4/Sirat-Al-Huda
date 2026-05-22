// supabase/functions/chat/index.ts
// Supabase Edge Function — OpenAI chat proxy.
// The OPENAI_API_KEY is stored as a Supabase secret (never in the client bundle).
//
// Deploy with:
//   supabase secrets set OPENAI_API_KEY=sk-proj-...
//   supabase functions deploy chat
//
// The client calls this via:
//   supabase.functions.invoke("chat", { body: { messages: [...] } })

import { serve }        from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_URL    = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL  = "gpt-4o-mini";
const MAX_TOKENS    = 600;
const MAX_USER_MSGS = 20; // sliding window — keep last 20 messages for context

const SYSTEM_PROMPT = `You are a knowledgeable Islamic guidance assistant for the Sirat app.
You provide clear, respectful, and accurate information about Islam, including prayer, Quran, hadith, fiqh, and daily worship.
Always remind users that your responses are for informational purposes only.
For formal religious rulings (fatwas), always advise consulting a qualified scholar.
Be concise, warm, and grounded in authentic Islamic sources.
Respond in the same language the user writes in.`;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    // ── Authenticate the caller ─────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status : 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status : 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // ── Parse request body ──────────────────────────────────────────────────
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status : 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Sanitise and trim the sliding window
    const sanitised = messages
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({
        role   : m.role    === "ai" ? "assistant" : m.role,
        content: String(m.content ?? "").slice(0, 2000),
      }))
      .slice(-MAX_USER_MSGS);

    // ── Call OpenAI ─────────────────────────────────────────────────────────
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status : 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const openaiRes = await fetch(OPENAI_URL, {
      method : "POST",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model     : OPENAI_MODEL,
        max_tokens: MAX_TOKENS,
        messages  : [{ role: "system", content: SYSTEM_PROMPT }, ...sanitised],
      }),
    });

    if (!openaiRes.ok) {
      const detail = await openaiRes.text();
      console.error("[chat fn] OpenAI error:", detail);
      return new Response(JSON.stringify({ error: "AI service unavailable. Please try again." }), {
        status : 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const openaiData = await openaiRes.json();
    const reply = openaiData.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ reply }), {
      status : 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[chat fn] Unexpected error:", err);
    return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
      status : 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
