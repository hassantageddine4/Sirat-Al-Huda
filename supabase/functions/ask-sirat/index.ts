// supabase/functions/ask-sirat/index.ts
// Edge Function for Ask Sirat — source-backed Islamic AI assistant.
// The OPENAI_API_KEY lives in Supabase secrets, never in the client bundle.
//
// Deploy:
//   supabase secrets set OPENAI_API_KEY=sk-...
//   supabase functions deploy ask-sirat

import { serve }        from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_URL    = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL  = "gpt-4o";
const MAX_TOKENS    = 1200;
const MAX_CONTEXT_CHARS = 12000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};



function buildSystemPrompt({ branch, scholar }) {
  const branchText = branch === "shia"
    ? "USER FOLLOWS: Twelver Shia tradition. Prioritize Shia sources: al-Kafi, Nahj al-Balagha, Mafatih al-Jinan, Bihar al-Anwar, Wasa'il al-Shia, sistani.org, al-islam.org, thaqalayn.net."
    : branch === "sunni"
    ? "USER FOLLOWS: Sunni tradition. Prioritize Sunni sources: Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah, sunnah.com."
    : "USER FOLLOWS: Not specified. Present shared Sunni and Shia views, mentioning differences respectfully.";

  const scholarText = scholar
    ? `USER FOLLOWS SCHOLAR: ${scholar}. Prioritize this scholar's rulings on fiqh. If unknown, say so rather than guess.`
    : "";

  const rules = [
    "You are Ask Sirat, an educational Islamic guidance assistant inside the Sirat app.",
    "Your tone is warm, calm, respectful, and clear — like a knowledgeable friend.",
    "",
    branchText,
    scholarText,
    "",
    "SOURCE PRIORITY (use in this order):",
    "1. App SOURCES below — verified internal content",
    "2. Trusted online Islamic references when app sources insufficient:",
    "   - Qur'an: quran.com, al-islam.org",
    "   - Sunni hadith: sunnah.com",
    "   - Shia hadith: thaqalayn.net, al-islam.org",
    "   - Shia rulings: sistani.org",
    "3. General established Islamic knowledge with citation to specific Qur'an verse, hadith collection, or trusted site",
    "",
    "CRITICAL RULES:",
    "1. NEVER invent hadiths, rulings, or sources. Only cite real verifiable references.",
    "2. Every Islamic claim must have a citation (Qur'an Surah:Ayah, hadith Collection+number, or scholar/site name).",
    "3. You are NOT a scholar or marja. End every fiqh ruling with: For binding rulings, consult a qualified scholar.",
    "4. For medical, legal, or emergency questions, advise professional help — do not substitute a religious answer.",
    "5. Never present sectarian views as universally agreed when they differ.",
    "6. Respond in the same language the user wrote in.",
    "",
    "RESPONSE FORMAT:",
    "- Direct answer (1-3 sentences)",
    "- Brief explanation grounded in citations",
    "- Sunni/Shia or scholar-specific notes when relevant",
    "- End with Sources: ... listing actual references",
    "- If applicable, suggest a related app section",
  ];
  return rules.join("\n");
}
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
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
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const question = String(body.question ?? "").slice(0, 2000);
    const branch = body.branch === "sunni" || body.branch === "shia" ? body.branch : null;
    const scholar = body.scholar ? String(body.scholar).slice(0, 100) : null;
    const sources = Array.isArray(body.sources)
      ? body.sources.slice(0, 50).map(s => ({
          type: String(s.type ?? "").slice(0, 40),
          ref: String(s.ref ?? "").slice(0, 200),
          text: String(s.text ?? "").slice(0, 3000),
        }))
      : [];

    if (!question) {
      return new Response(JSON.stringify({ error: "question is required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    let contextBlock = "SOURCES (from Sirat app):\n";
    let charBudget = MAX_CONTEXT_CHARS;
    for (const s of sources) {
      const entry = `\n[${s.type}: ${s.ref}]\n${s.text}\n`;
      if (entry.length > charBudget) break;
      contextBlock += entry;
      charBudget -= entry.length;
    }
    if (sources.length === 0) contextBlock += "\n(no app sources matched this question)";

    const systemPrompt = buildSystemPrompt({ branch, scholar });
    const userPrompt = `${contextBlock}\n\nQUESTION:\n${question}`;

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const openaiRes = await fetch(OPENAI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const detail = await openaiRes.text();
      console.error("[ask-sirat] OpenAI error:", detail);
      return new Response(JSON.stringify({ error: "AI service unavailable. Please try again." }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const data = await openaiRes.json();
    const answer = data.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ answer, citations: sources.map(s => ({ type: s.type, ref: s.ref })) }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[ask-sirat] Unexpected error:", err);
    return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
