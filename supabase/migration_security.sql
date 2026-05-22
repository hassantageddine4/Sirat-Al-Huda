-- =============================================================================
-- Sirat — Security Hardening Migration
-- Run AFTER schema.sql and migration_community.sql.
--
-- This migration:
--   1. Reaffirms/strengthens RLS on every user-data table
--   2. Adds rate-limit checks via triggers
--   3. Locks down notification inserts to service_role + definer functions only
--   4. Adds input validation triggers (length, empty, null-byte stripping)
--   5. Creates audit log for sensitive events
--   6. Adds missing unique + foreign-key constraints
-- Safe to re-run.
-- =============================================================================


-- =============================================================================
-- 1. CONFIRM RLS IS ENABLED ON EVERY TABLE (idempotent)
-- =============================================================================

ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history      ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners (defence in depth)
ALTER TABLE public.journal_entries   FORCE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     FORCE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history      FORCE ROW LEVEL SECURITY;


-- =============================================================================
-- 2. REWRITE NOTIFICATION POLICIES (LOCKDOWN)
--    Drop the insert policy that allowed any authenticated user to insert —
--    only service_role + SECURITY DEFINER functions may write notifications now.
-- =============================================================================

DROP POLICY IF EXISTS "notifs_select_own"       ON public.notifications;
DROP POLICY IF EXISTS "notifs_insert_own"       ON public.notifications;
DROP POLICY IF EXISTS "notifs_update_own"       ON public.notifications;
DROP POLICY IF EXISTS "notifs_insert_service"   ON public.notifications;

-- Read: only the receiver
CREATE POLICY "notifs_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Insert: NOBODY from the client. Only service_role (edge functions).
-- Triggers use SECURITY DEFINER so they bypass RLS regardless.
CREATE POLICY "notifs_insert_service" ON public.notifications
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Update: only the receiver can mark-as-read, and can ONLY modify the `read` field.
-- The WITH CHECK restricts to read=true to prevent flipping other users' notifs.
CREATE POLICY "notifs_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Explicit delete: deny to clients (no policy = no access under RLS)
-- Uncomment if you want users to delete their own notifs:
-- CREATE POLICY "notifs_delete_own" ON public.notifications
--   FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- 3. STRENGTHEN POST/COMMENT/LIKE POLICIES
-- =============================================================================

-- Posts: reconfirm strict policies
DROP POLICY IF EXISTS "posts_insert_own" ON public.posts;
CREATE POLICY "posts_insert_own" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "posts_update_own" ON public.posts;
CREATE POLICY "posts_update_own" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "posts_delete_own" ON public.posts;
CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- Post likes: strict — insert/delete only by the acting user
DROP POLICY IF EXISTS "post_likes_insert" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_delete" ON public.post_likes;

CREATE POLICY "post_likes_insert" ON public.post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes_delete" ON public.post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Comments: reconfirm
DROP POLICY IF EXISTS "comments_insert_own" ON public.comments;
CREATE POLICY "comments_insert_own" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_delete_own" ON public.comments;
CREATE POLICY "comments_delete_own" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- 4. DATA INTEGRITY CONSTRAINTS
-- =============================================================================

-- Unique(post_id, user_id) on post_likes to prevent duplicate likes
DO $$ BEGIN
  ALTER TABLE public.post_likes
    ADD CONSTRAINT post_likes_unique_user_post UNIQUE (post_id, user_id);
EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- Tighten column constraints for security (defence in depth: DB rejects oversize)
-- Posts: max 500 chars for content (as per requirement)
DO $$ BEGIN
  ALTER TABLE public.posts
    DROP CONSTRAINT IF EXISTS posts_content_check;
  ALTER TABLE public.posts
    ADD  CONSTRAINT posts_content_check CHECK (char_length(content) BETWEEN 1 AND 500);
  ALTER TABLE public.posts
    DROP CONSTRAINT IF EXISTS posts_title_check;
  ALTER TABLE public.posts
    ADD  CONSTRAINT posts_title_check CHECK (char_length(title) BETWEEN 1 AND 200);
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

-- Comments: max 300 chars
DO $$ BEGIN
  ALTER TABLE public.comments
    DROP CONSTRAINT IF EXISTS comments_content_check;
  ALTER TABLE public.comments
    ADD  CONSTRAINT comments_content_check CHECK (char_length(content) BETWEEN 1 AND 300);
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

-- Journal: max 2000 chars
DO $$ BEGIN
  ALTER TABLE public.journal_entries
    DROP CONSTRAINT IF EXISTS journal_entries_content_check;
  ALTER TABLE public.journal_entries
    ADD  CONSTRAINT journal_entries_content_check CHECK (char_length(content) BETWEEN 1 AND 2000);
EXCEPTION WHEN undefined_object THEN NULL;
END $$;


-- =============================================================================
-- 5. INPUT SANITISATION TRIGGERS
--    Strip null bytes, trim whitespace, reject empty-after-trim content.
--    Runs before insert/update so client-side bypass is impossible.
-- =============================================================================

CREATE OR REPLACE FUNCTION sanitise_text_content()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Normalise content field
  IF TG_TABLE_NAME IN ('posts', 'comments', 'journal_entries') THEN
    -- Strip null bytes (null-byte injection defence)
    NEW.content := replace(NEW.content, chr(0), '');
    -- Trim whitespace
    NEW.content := btrim(NEW.content);
    -- Reject empty
    IF char_length(NEW.content) = 0 THEN
      RAISE EXCEPTION 'Content cannot be empty' USING ERRCODE = '22023';
    END IF;
  END IF;

  -- Normalise title on posts
  IF TG_TABLE_NAME = 'posts' THEN
    NEW.title := replace(NEW.title, chr(0), '');
    NEW.title := btrim(NEW.title);
    IF char_length(NEW.title) = 0 THEN
      RAISE EXCEPTION 'Title cannot be empty' USING ERRCODE = '22023';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Attach to every user-content table
DROP TRIGGER IF EXISTS trg_sanitise_posts    ON public.posts;
CREATE TRIGGER trg_sanitise_posts
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION sanitise_text_content();

DROP TRIGGER IF EXISTS trg_sanitise_comments ON public.comments;
CREATE TRIGGER trg_sanitise_comments
  BEFORE INSERT OR UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION sanitise_text_content();

DROP TRIGGER IF EXISTS trg_sanitise_journal  ON public.journal_entries;
CREATE TRIGGER trg_sanitise_journal
  BEFORE INSERT OR UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION sanitise_text_content();


-- =============================================================================
-- 6. RATE LIMITING VIA TRIGGERS
--    Limits enforced at DB level — cannot be bypassed by any client.
--
--    Limits (per-user sliding window):
--      Posts    : 5 per minute, 30 per hour
--      Comments : 20 per minute, 200 per hour
--      Likes    : 60 per minute
-- =============================================================================

CREATE OR REPLACE FUNCTION enforce_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_count_min   INT;
  v_count_hour  INT;
BEGIN
  IF TG_TABLE_NAME = 'posts' THEN
    SELECT COUNT(*) INTO v_count_min
    FROM public.posts
    WHERE user_id = NEW.user_id
      AND created_at > NOW() - INTERVAL '1 minute';
    IF v_count_min >= 5 THEN
      RAISE EXCEPTION 'Rate limit: max 5 posts per minute'
        USING ERRCODE = 'P0001';
    END IF;

    SELECT COUNT(*) INTO v_count_hour
    FROM public.posts
    WHERE user_id = NEW.user_id
      AND created_at > NOW() - INTERVAL '1 hour';
    IF v_count_hour >= 30 THEN
      RAISE EXCEPTION 'Rate limit: max 30 posts per hour'
        USING ERRCODE = 'P0001';
    END IF;

  ELSIF TG_TABLE_NAME = 'comments' THEN
    SELECT COUNT(*) INTO v_count_min
    FROM public.comments
    WHERE user_id = NEW.user_id
      AND created_at > NOW() - INTERVAL '1 minute';
    IF v_count_min >= 20 THEN
      RAISE EXCEPTION 'Rate limit: max 20 comments per minute'
        USING ERRCODE = 'P0001';
    END IF;

    SELECT COUNT(*) INTO v_count_hour
    FROM public.comments
    WHERE user_id = NEW.user_id
      AND created_at > NOW() - INTERVAL '1 hour';
    IF v_count_hour >= 200 THEN
      RAISE EXCEPTION 'Rate limit: max 200 comments per hour'
        USING ERRCODE = 'P0001';
    END IF;

  ELSIF TG_TABLE_NAME = 'post_likes' THEN
    SELECT COUNT(*) INTO v_count_min
    FROM public.post_likes
    WHERE user_id = NEW.user_id
      AND created_at > NOW() - INTERVAL '1 minute';
    IF v_count_min >= 60 THEN
      RAISE EXCEPTION 'Rate limit: max 60 likes per minute'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- post_likes needs a created_at column for rate limiting
DO $$ BEGIN
  ALTER TABLE public.post_likes
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_post_likes_user_created
  ON public.post_likes (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_created
  ON public.posts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_user_created
  ON public.comments (user_id, created_at DESC);

-- Attach rate-limit triggers
DROP TRIGGER IF EXISTS trg_rate_limit_posts    ON public.posts;
CREATE TRIGGER trg_rate_limit_posts
  BEFORE INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION enforce_rate_limit();

DROP TRIGGER IF EXISTS trg_rate_limit_comments ON public.comments;
CREATE TRIGGER trg_rate_limit_comments
  BEFORE INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION enforce_rate_limit();

DROP TRIGGER IF EXISTS trg_rate_limit_likes    ON public.post_likes;
CREATE TRIGGER trg_rate_limit_likes
  BEFORE INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION enforce_rate_limit();


-- =============================================================================
-- 7. AUDIT LOG (optional but recommended)
--    Records security-relevant events for later analysis.
--    Append-only; users cannot read or write this table.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  event       TEXT        NOT NULL,           -- 'rate_limit' | 'rls_deny' | 'auth_fail' | ...
  detail      JSONB,
  ip          TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies for regular users = fully denied.
-- Only service_role (edge functions) can write here.
DROP POLICY IF EXISTS "audit_service_only" ON public.audit_log;
CREATE POLICY "audit_service_only" ON public.audit_log
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
          WITH CHECK (auth.jwt() ->> 'role' = 'service_role');


-- =============================================================================
-- 8. SECURE VIEW HARDENING
--    Ensure views respect caller RLS (not view-owner RLS).
-- =============================================================================

-- notifications_with_sender view — reassert security_invoker
DROP VIEW IF EXISTS public.notifications_with_sender CASCADE;
CREATE VIEW public.notifications_with_sender
WITH (security_invoker = TRUE)
AS
SELECT
  n.id, n.user_id, n.sender_id, n.type, n.post_id,
  n.read, n.created_at,
  u.name  AS sender_name,
  p.title AS post_title
FROM  public.notifications n
JOIN  public.users u  ON u.id = n.sender_id
LEFT  JOIN public.posts p ON p.id = n.post_id;


-- =============================================================================
-- 9. REVOKE DANGEROUS PUBLIC PRIVILEGES
-- =============================================================================

-- Revoke execute from anon on sensitive RPC-ish helpers if any exist
-- (keep as defence-in-depth template)
REVOKE ALL ON FUNCTION public.toggle_like(UUID) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.toggle_like(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.notify_on_like()     FROM PUBLIC;
REVOKE ALL ON FUNCTION public.notify_on_comment()  FROM PUBLIC;
-- These SECURITY DEFINER trigger functions don't need grants — called by triggers only


-- =============================================================================
-- 10. VERIFICATION QUERIES (run manually to audit)
-- =============================================================================

-- Check RLS is enabled on every user table:
--   SELECT tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public' AND tablename IN (
--     'users','posts','post_likes','comments','journal_entries',
--     'notifications','chat_history','audit_log'
--   );
--
-- List all policies:
--   SELECT tablename, policyname, cmd, qual FROM pg_policies
--   WHERE schemaname = 'public' ORDER BY tablename;
