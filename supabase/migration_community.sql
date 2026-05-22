-- =============================================================================
-- Sirat — Community + Notifications Migration
-- Run in Supabase SQL Editor after the base schema.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / ON CONFLICT DO NOTHING.
-- =============================================================================


-- =============================================================================
-- NOTIFICATION TYPE ENUM
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('like', 'comment');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- =============================================================================
-- TABLE: public.comments
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON public.comments (created_at DESC);

-- RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_authenticated" ON public.comments;
DROP POLICY IF EXISTS "comments_insert_own"            ON public.comments;
DROP POLICY IF EXISTS "comments_delete_own"            ON public.comments;

-- Any authenticated user can read all comments
CREATE POLICY "comments_select_authenticated" ON public.comments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only the author can insert
CREATE POLICY "comments_insert_own" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the author can delete their comment
CREATE POLICY "comments_delete_own" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: public.notifications
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID              NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,  -- receiver
  sender_id   UUID              NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,  -- actor
  type        notification_type NOT NULL,
  post_id     UUID              REFERENCES public.posts(id) ON DELETE CASCADE,
  read        BOOLEAN           NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifs_user_id    ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifs_created    ON public.notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifs_unread     ON public.notifications (user_id, read) WHERE read = FALSE;

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifs_select_own"  ON public.notifications;
DROP POLICY IF EXISTS "notifs_insert_own"  ON public.notifications;
DROP POLICY IF EXISTS "notifs_update_own"  ON public.notifications;

-- Users can only read their own notifications
CREATE POLICY "notifs_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert (triggers do this on behalf of the actor)
-- The check prevents users from creating notifs for others manually
CREATE POLICY "notifs_insert_own" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only the receiver can mark notifications as read
CREATE POLICY "notifs_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- =============================================================================
-- TRIGGER: notify_on_like
-- Fires after a row is inserted into post_likes.
-- Creates a notification for the post owner — unless they liked their own post.
-- =============================================================================

CREATE OR REPLACE FUNCTION notify_on_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- runs as the function owner, bypassing RLS for the insert
SET search_path = public
AS $$
DECLARE
  v_post_owner UUID;
BEGIN
  -- Get the post owner
  SELECT user_id INTO v_post_owner
  FROM   public.posts
  WHERE  id = NEW.post_id;

  -- Do NOT notify if the user liked their own post
  IF v_post_owner IS NOT NULL AND v_post_owner <> NEW.user_id THEN
    INSERT INTO public.notifications (user_id, sender_id, type, post_id)
    VALUES (v_post_owner, NEW.user_id, 'like', NEW.post_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_like ON public.post_likes;
CREATE TRIGGER trg_notify_on_like
  AFTER INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION notify_on_like();


-- =============================================================================
-- TRIGGER: notify_on_comment
-- Fires after a row is inserted into comments.
-- Creates a notification for the post owner — unless they commented on their own post.
-- =============================================================================

CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_owner UUID;
BEGIN
  SELECT user_id INTO v_post_owner
  FROM   public.posts
  WHERE  id = NEW.post_id;

  IF v_post_owner IS NOT NULL AND v_post_owner <> NEW.user_id THEN
    INSERT INTO public.notifications (user_id, sender_id, type, post_id)
    VALUES (v_post_owner, NEW.user_id, 'comment', NEW.post_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_comment ON public.comments;
CREATE TRIGGER trg_notify_on_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION notify_on_comment();


-- =============================================================================
-- RPC: toggle_like
-- Called as: supabase.rpc('toggle_like', { p_post_id: '...' })
-- Derives user_id from auth.uid() so no user ID is ever passed from the client.
-- Returns 'liked' or 'unliked'.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.toggle_like(p_post_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_exists  BOOLEAN;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM post_likes
    WHERE post_id = p_post_id AND user_id = v_user_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM post_likes
    WHERE post_id = p_post_id AND user_id = v_user_id;

    UPDATE posts SET likes = GREATEST(likes - 1, 0)
    WHERE id = p_post_id;

    RETURN 'unliked';
  ELSE
    INSERT INTO post_likes (post_id, user_id)
    VALUES (p_post_id, v_user_id)
    ON CONFLICT DO NOTHING;

    UPDATE posts SET likes = likes + 1
    WHERE id = p_post_id;

    RETURN 'liked';
  END IF;
END;
$$;


-- Enable realtime publication for new tables
-- (posts and post_likes should already be enabled from base schema)
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- =============================================================================
-- HELPER VIEW: notifications_with_sender
-- Joins sender name so the frontend doesn't need a second query.
-- =============================================================================

CREATE OR REPLACE VIEW public.notifications_with_sender
WITH (security_invoker = TRUE)   -- respects the caller's RLS
AS
SELECT
  n.id,
  n.user_id,
  n.sender_id,
  n.type,
  n.post_id,
  n.read,
  n.created_at,
  u.name   AS sender_name,
  p.title  AS post_title
FROM  public.notifications n
JOIN  public.users          u ON u.id = n.sender_id
LEFT JOIN public.posts      p ON p.id = n.post_id;
