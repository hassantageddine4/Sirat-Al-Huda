// supabase/functions/toggle-like/index.ts
// Server-authoritative like toggle.
// Wraps the DB RPC `toggle_like(p_post_id)` which derives user from auth.uid().

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  CORS_HEADERS, handleOptions, requireUser, userClient, serviceClient,
  checkIpRate, logAudit, ok, fail, ValidationError,
} from "../_shared/auth.ts";

serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  try {
    const { user, ip } = await requireUser(req);
    checkIpRate(ip, 120);   // 120 like toggles per minute per IP

    const body   = await req.json().catch(() => ({}));
    const postId = body.post_id;

    if (typeof postId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId)) {
      throw new ValidationError("Invalid post id.");
    }

    const client = userClient(req.headers.get("Authorization")!);
    const { data, error } = await client.rpc("toggle_like", { p_post_id: postId });

    const svc = serviceClient();

    if (error) {
      if (error.code === "P0001" && error.message.startsWith("Rate limit")) {
        await logAudit(svc, {
          userId: user.id, event: "rate_limit_exceeded",
          detail: { action: "toggle_like", message: error.message }, ip,
        });
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
      throw new ValidationError("Could not toggle like.");
    }

    return ok({ action: data });   // "liked" | "unliked"

  } catch (err) {
    return fail(err);
  }
});
