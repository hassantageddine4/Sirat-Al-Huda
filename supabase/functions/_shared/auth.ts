// supabase/functions/_shared/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared auth helper for Supabase Edge Functions.
// Verifies the incoming Authorization header and returns the authenticated user.
// Also provides CORS helpers and safe error responses.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── CORS ─────────────────────────────────────────────────────────────────────
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── Env ──────────────────────────────────────────────────────────────────────
function getEnv(key: string): string {
  const v = Deno.env.get(key);
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

// Service-role client — has admin rights, bypasses RLS.
// Use ONLY for writes that are impossible from the client under RLS
// (e.g. inserting notifications, audit logs).
export function serviceClient(): SupabaseClient {
  return createClient(
    getEnv("SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

// User-scoped client — runs every query subject to the user's RLS.
export function userClient(authHeader: string): SupabaseClient {
  return createClient(
    getEnv("SUPABASE_URL"),
    getEnv("SUPABASE_ANON_KEY"),
    {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    }
  );
}

// ── Auth guard ───────────────────────────────────────────────────────────────
export type AuthedUser = {
  id:    string;
  email: string | null;
};

/**
 * Verifies the Authorization header and returns the authenticated user.
 * Throws if missing/invalid — callers should catch and return a 401.
 */
export async function requireUser(req: Request): Promise<{
  user:   AuthedUser;
  token:  string;
  ip:     string;
}> {
  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    throw new UnauthorisedError("Missing bearer token");
  }

  const token  = auth.slice("Bearer ".length).trim();
  const client = userClient(auth);

  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) {
    throw new UnauthorisedError("Invalid or expired session");
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("cf-connecting-ip")
    ?? "unknown";

  return {
    user:  { id: data.user.id, email: data.user.email ?? null },
    token,
    ip,
  };
}

// ── Safe error types ─────────────────────────────────────────────────────────
export class UnauthorisedError extends Error {
  status = 401;
}
export class ValidationError extends Error {
  status = 400;
}
export class RateLimitError extends Error {
  status = 429;
}

// ── Response helpers ─────────────────────────────────────────────────────────
export function ok(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

/**
 * Never expose internal errors. Map known errors to safe client messages.
 * Unknown errors → generic 500.
 */
export function fail(err: unknown): Response {
  // Known client-safe errors
  if (err instanceof UnauthorisedError) {
    return json(401, { error: "Not authenticated." });
  }
  if (err instanceof ValidationError) {
    return json(400, { error: err.message });
  }
  if (err instanceof RateLimitError) {
    return json(429, { error: err.message });
  }

  // Log the real error server-side for debugging, hide from client
  console.error("Unhandled error in edge function:", err);
  return json(500, { error: "An unexpected error occurred." });
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// ── Handle preflight ─────────────────────────────────────────────────────────
export function handleOptions(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  return null;
}

// ── Input sanitisation ───────────────────────────────────────────────────────
/**
 * Strip null bytes and control chars (except tab/newline/cr).
 * Trim whitespace. Enforce max length.
 * Throws ValidationError if empty after normalise or over max.
 */
export function cleanText(
  input: unknown,
  { min = 1, max, label = "text" }: { min?: number; max: number; label?: string }
): string {
  if (typeof input !== "string") {
    throw new ValidationError(`${label} must be a string.`);
  }
  // Strip null bytes + other control chars except \t \n \r
  const stripped = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  const trimmed  = stripped.trim();

  if (trimmed.length < min) {
    throw new ValidationError(`${label} is too short.`);
  }
  if (trimmed.length > max) {
    throw new ValidationError(`${label} exceeds ${max} characters.`);
  }
  return trimmed;
}

// ── Simple in-memory rate limiter (per-function-instance) ────────────────────
// Note: real per-user limits are enforced by DB triggers; this is just a
// coarse-grained backstop to stop cost runaway if someone floods a function.
const ipBuckets = new Map<string, number[]>();

export function checkIpRate(ip: string, maxPerMinute: number) {
  const now = Date.now();
  const window = 60_000;
  const arr = (ipBuckets.get(ip) ?? []).filter(t => now - t < window);
  if (arr.length >= maxPerMinute) {
    throw new RateLimitError("Too many requests. Please slow down.");
  }
  arr.push(now);
  ipBuckets.set(ip, arr);
}

// ── Audit logging helper ─────────────────────────────────────────────────────
export async function logAudit(
  svc: SupabaseClient,
  entry: { userId?: string | null; event: string; detail?: unknown; ip?: string }
) {
  try {
    await svc.from("audit_log").insert({
      user_id: entry.userId ?? null,
      event:   entry.event,
      detail:  entry.detail ?? null,
      ip:      entry.ip ?? null,
    });
  } catch {
    // Never let audit logging failures crash the function
  }
}
