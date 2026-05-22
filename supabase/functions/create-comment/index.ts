// supabase/functions/create-comment/index.ts
// Server-authoritative comment creation.
// Same pattern as create-post: validate → user-scoped insert → audit log.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  CORS_HEADERS, handleOptions, requireUser, userClient, serviceClient,
  cleanText, checkIpRate, logAudit, ok, fail, ValidationError,
} from "../_shared/auth.ts";

serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  try {
    const { user, ip } = await requireUser(req);
    checkIpRate(ip, 40);  // 40 comments per minute per IP

    const body    = await req.json().catch(() => ({}));
    const postId  = body.post_id;
    const content = cleanText(body.content, { max: 300, label: "Comment" });

    // postId must be a UUID string
    if (typeof postId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId)) {
      throw new ValidationError("Invalid post id.");
    }

    // Insert as the authenticated user
    const client = userClient(req.headers.get("Authorization")!);
    const { data, error } = await client
      .from("comments")
      .insert({ post_id: postId, user_id: user.id, content })
      .select(`
        id, content, created_at, user_id,
        users ( id, name )
      `)
      .single();

    const svc = serviceClient();

    if (error) {
      if (error.code === "P0001" && error.message.startsWith("Rate limit")) {
        await logAudit(svc, {
          userId: user.id, event: "rate_limit_exceeded",
          detail: { table: "comments", message: error.message }, ip,
        });
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
      // 23503 = foreign_key_violation (post doesn't exist or was deleted)
      if (error.code === "23503") {
        throw new ValidationError("Post not found.");
      }
      await logAudit(svc, {
        userId: user.id, event: "comment_insert_failed",
        detail: { code: error.code, message: error.message, postId }, ip,
      });
      throw new ValidationError("Could not post comment.");
    }

    await logAudit(svc, {
      userId: user.id, event: "comment_created",
      detail: { commentId: data.id, postId }, ip,
    });

    return ok({ comment: data });

  } catch (err) {
    return fail(err);
  }
});
