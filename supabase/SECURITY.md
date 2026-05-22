# Sirat — Security Hardening Guide

Production-grade security for the Supabase backend + client layer.

---

## 1. Threat model

| Threat                               | Mitigation                                       |
| ------------------------------------ | ------------------------------------------------ |
| User A reads User B's journal        | RLS + `FORCE ROW LEVEL SECURITY`                 |
| User spoofs `user_id` in a write     | RLS `WITH CHECK (auth.uid() = user_id)`          |
| Client creates fake notifications    | Service-role-only INSERT policy + DB triggers    |
| Spam flooding (posts/comments/likes) | DB triggers enforce per-user rate limits         |
| XSS via null bytes / control chars   | Sanitisation trigger strips them on every write  |
| Oversize payloads                    | `CHECK (char_length … ≤ N)` constraints          |
| Duplicate likes                      | `UNIQUE (post_id, user_id)` constraint           |
| OpenAI key leak                      | Key lives in Supabase secrets, never client      |
| Error message info leak              | Edge functions return generic safe messages      |
| Unauthenticated writes               | Edge functions call `requireUser()` first        |

---

## 2. Deployment order

Run migrations in this sequence in the Supabase SQL Editor:

1. `supabase/schema.sql` — base tables
2. `supabase/migration_community.sql` — comments + notifications + triggers
3. `supabase/migration_security.sql` — RLS hardening + rate limits

Then deploy the Edge Functions:

```bash
# set secrets (never commit these)
supabase secrets set OPENAI_API_KEY=sk-proj-...
# (SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected automatically)

# deploy all three write functions
supabase functions deploy create-post
supabase functions deploy create-comment
supabase functions deploy toggle-like

# the existing AI proxy
supabase functions deploy chat
```

---

## 3. Trust boundaries

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                         UNTRUSTED                               │
  │   React Native / Web client                                     │
  │   • Client-side validation is UX only                           │
  │   • No secrets here                                             │
  │   • supabase-js uses the anon key + user JWT                    │
  └───────────────────┬─────────────────────────────────────────────┘
                      │  HTTPS + Bearer JWT
                      ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                    SEMI-TRUSTED (Edge Functions)                │
  │   • JWT verified via requireUser()                              │
  │   • Input sanitised + validated                                 │
  │   • Per-IP rate-limit backstop                                  │
  │   • Audit-logs every attempt                                    │
  │   • Service role used ONLY for audit writes                     │
  └───────────────────┬─────────────────────────────────────────────┘
                      │
                      ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                    TRUSTED (Postgres + RLS)                     │
  │   • RLS + FORCE ROW LEVEL SECURITY on every user table          │
  │   • Sanitisation triggers (null-byte strip, empty reject)       │
  │   • Rate-limit triggers (per-user sliding windows)              │
  │   • CHECK constraints enforce length limits                     │
  │   • UNIQUE constraint prevents duplicate likes                  │
  │   • SECURITY DEFINER functions for notification creation        │
  └─────────────────────────────────────────────────────────────────┘
```

The database is the ultimate authority. Every security guarantee is
enforced at the DB level even if a client bypasses the edge function.

---

## 4. Per-table security summary

### `journal_entries`   (PRIVATE)

- RLS: `auth.uid() = user_id` on all 4 operations
- `FORCE ROW LEVEL SECURITY` enabled
- CHECK: `char_length(content) BETWEEN 1 AND 2000`
- Trigger: sanitise text on every insert/update
- Realtime: filter `user_id=eq.<uid>` (RLS filters again even if you forget)

### `posts`   (PUBLIC READ, OWNER WRITE)

- SELECT: any authenticated user
- INSERT: `auth.uid() = user_id`
- UPDATE/DELETE: owner only
- CHECK: title ≤ 200, content ≤ 500
- Trigger: sanitise + rate-limit (5/min, 30/hr per user)

### `comments`   (PUBLIC READ, OWNER WRITE)

- SELECT: any authenticated user
- INSERT: `auth.uid() = user_id`
- DELETE: owner only  (no UPDATE — edits disabled for audit trail)
- CHECK: content ≤ 300
- Trigger: sanitise + rate-limit (20/min, 200/hr per user)

### `post_likes`   (ACTOR-ONLY WRITE)

- SELECT: any authenticated user
- INSERT/DELETE: `auth.uid() = user_id`
- UNIQUE `(post_id, user_id)` — DB rejects duplicates
- Trigger: rate-limit (60/min per user)

### `notifications`   (LOCKDOWN)

- SELECT: `auth.uid() = user_id` only
- INSERT: service_role ONLY — client cannot create notifications
- UPDATE: receiver only (mark-as-read)
- Populated exclusively by `notify_on_like()` / `notify_on_comment()`
  SECURITY DEFINER triggers — bypass RLS at the DB level

### `audit_log`   (SYSTEM)

- RLS denies all client access
- Service-role only
- Records rate-limit hits, failed inserts, post/comment creation

---

## 5. Writes — client flow

Every write from the client takes one of two routes:

**Route A — direct DB (when RLS is sufficient)**

- `createEntry`, `updateEntry`, `deleteEntry` (journal)
- `deletePost`, `deleteComment` (owner-only deletes)

These write directly via `supabase.from(…)`. RLS + triggers enforce everything.

**Route B — via Edge Function (when cross-user effects exist)**

- `createPost`      → `supabase/functions/create-post`
- `addComment`      → `supabase/functions/create-comment`
- `toggleLike`      → `supabase/functions/toggle-like`
- AI chat messages  → `supabase/functions/chat`

The edge function:
1. Verifies the JWT (`requireUser`)
2. Validates and sanitises input (`cleanText`)
3. IP-level rate-limit backstop (`checkIpRate`)
4. Writes using a user-scoped client (RLS still applies)
5. Audit-logs success and failure

---

## 6. What the client must never do

- ❌ Trust `user.id` sent from the body of a request
- ❌ Insert into `notifications`
- ❌ Call OpenAI directly — always go through the `chat` edge function
- ❌ Store the service-role key anywhere
- ❌ Pass user IDs as RPC parameters (all RPCs derive from `auth.uid()`)

---

## 7. Verification checklist

Run these after deployment to confirm everything is live:

```sql
-- Every user table has RLS on
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users','posts','post_likes','comments',
                    'journal_entries','notifications','audit_log')
ORDER BY tablename;
-- → all rows should show rowsecurity = true

-- Every triggered table has triggers
SELECT event_object_table, trigger_name
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
-- → expect trg_sanitise_* , trg_rate_limit_* , trg_notify_on_*

-- No duplicate likes possible
SELECT conname FROM pg_constraint
WHERE conname = 'post_likes_unique_user_post';
-- → one row

-- Policies visible
SELECT tablename, policyname, cmd
FROM pg_policies WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

---

## 8. Local attack drills

Try these from an authenticated user context in Supabase SQL Editor
(use the anon/user key, not service role) — every one should FAIL:

```sql
-- Try to read someone else's journal entry
SELECT * FROM journal_entries WHERE user_id <> auth.uid();
-- Expected: 0 rows (RLS filtered)

-- Try to insert into notifications as a user
INSERT INTO notifications (user_id, sender_id, type)
VALUES (auth.uid(), auth.uid(), 'like');
-- Expected: permission denied / new row violates RLS

-- Try to like the same post twice
INSERT INTO post_likes (post_id, user_id) VALUES ('<id>', auth.uid());
INSERT INTO post_likes (post_id, user_id) VALUES ('<id>', auth.uid());
-- Expected: second one fails with unique constraint

-- Try to post a 1000-char post
INSERT INTO posts (user_id, title, content)
VALUES (auth.uid(), 'test', repeat('x', 1000));
-- Expected: check constraint violation

-- Try to spam 6 posts in a minute
-- (run 6 quick inserts) → 6th fails with "Rate limit: max 5 posts per minute"
```

All five should fail. If any succeeds, stop and audit — something is wrong.
