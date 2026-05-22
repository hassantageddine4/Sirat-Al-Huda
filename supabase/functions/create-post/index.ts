// supabase/functions/create-post/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server-authoritative post creation.
//
// Why go through an Edge Function instead of inserting directly from the client?
//   • Guarantees server-side validation runs regardless of client code
//   • Centralised rate-limit backstop before hitting DB
//   • Safe error messages — never leaks internal DB errors
//   • Audit logging on every accepted/rejected request
//
// The DB still enforces the same rules via triggers + RLS — this function
// is defence in depth, not the sole security barrier.
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  CORS_HEADERS, handleOptions, requireUser, userClient, serviceClient,
  cleanText, checkIpRate, logAudit, ok, fail, ValidationError,
} from "../_shared/auth.ts";

const VALID_TAGS = new Set(["general", "spirituality", "quran", "hadith", "fiqh"]);

serve(async (req) => {
  // CORS preflight
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  try {
    // 1. AuthN
    const { user, ip } = await requireUser(req);

    // 2. IP-level coarse rate limit (10 posts per minute per IP)
    checkIpRate(ip, 10);

    // 3. Parse + validate input
    const body  = await req.json().catch(() => ({}));
    const title = cleanText(body.title,   { max: 200, label: "Title"   });
    const content = cleanText(body.content, { max: 500, label: "Content" });
    const tagRaw = typeof body.tag === "string" ? body.tag.toLowerCase() : "general";
    const tag    = VALID_TAGS.has(tagRaw) ? tagRaw : "general";

    // 4. Insert as the authenticated user (user-scoped client → RLS applies)
    //    user_id is forced to auth.uid() — body.user_id is ignored.
    const client  = userClient(req.headers.get("Authorization")!);
    const { data, error } = await client
      .from("posts")
      .insert({ user_id: user.id, title, content, tag })
      .select("id, title, content, tag, likes, created_at, user_id")
      .single();

    const svc = serviceClient();

    if (error) {
      // DB-level rate limit exceeded → return safe message
      if (error.code === "P0001" && error.message.startsWith("Rate limit")) {
        await logAudit(svc, {
          userId: user.id, event: "rate_limit_exceeded",
          detail: { table: "posts", message: error.message }, ip,
        });
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
      // Other DB errors — log but hide details from client
      await logAudit(svc, {
        userId: user.id, event: "post_insert_failed",
        detail: { code: error.code, message: error.message }, ip,
      });
      throw new ValidationError("Could not create post.");
    }

    // 5. Success audit
    await logAudit(svc, {
      userId: user.id, event: "post_created",
      detail: { postId: data.id, tag }, ip,
    });

    return ok({ post: data });

  } catch (err) {
    return fail(err);
  }
});
