-- =============================================================================
-- Sirat App — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / ON CONFLICT.
-- =============================================================================


-- =============================================================================
-- EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- ENUM TYPES
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE mood_enum AS ENUM (
    'grateful', 'reflective', 'hopeful', 'struggling', 'peaceful'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE chat_role AS ENUM ('user', 'ai');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('post', 'reply');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- =============================================================================
-- TABLE: public.users
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id               UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT,
  email            TEXT        NOT NULL,
  religion         TEXT        NOT NULL DEFAULT 'Muslim',
  language         TEXT        NOT NULL DEFAULT 'English',
  goals            TEXT[]      NOT NULL DEFAULT '{}',
  pending_deletion BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own"  ON public.users;
DROP POLICY IF EXISTS "users_insert_own"  ON public.users;
DROP POLICY IF EXISTS "users_update_own"  ON public.users;
DROP POLICY IF EXISTS "users_delete_own"  ON public.users;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users_delete_own" ON public.users
  FOR DELETE USING (auth.uid() = id);


-- =============================================================================
-- TABLE: public.posts
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.posts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL CHECK (char_length(title)   BETWEEN 1 AND 300),
  content    TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
  tag        TEXT        NOT NULL DEFAULT 'general'
               CHECK (tag IN ('spirituality','quran','hadith','fiqh','general')),
  likes      INT         NOT NULL DEFAULT 0 CHECK (likes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_authenticated" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_own"            ON public.posts;
DROP POLICY IF EXISTS "posts_update_own"            ON public.posts;
DROP POLICY IF EXISTS "posts_delete_own"            ON public.posts;

CREATE POLICY "posts_select_authenticated" ON public.posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "posts_insert_own" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_update_own" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: public.replies
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.replies (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "replies_select_authenticated" ON public.replies;
DROP POLICY IF EXISTS "replies_insert_own"            ON public.replies;
DROP POLICY IF EXISTS "replies_update_own"            ON public.replies;
DROP POLICY IF EXISTS "replies_delete_own"            ON public.replies;

CREATE POLICY "replies_select_authenticated" ON public.replies
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "replies_insert_own" ON public.replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "replies_update_own" ON public.replies
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "replies_delete_own" ON public.replies
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: public.post_likes
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id UUID NOT NULL REFERENCES public.posts(id)  ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_likes_select" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_insert" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_delete" ON public.post_likes;

CREATE POLICY "post_likes_select" ON public.post_likes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "post_likes_insert" ON public.post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes_delete" ON public.post_likes
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: public.journal_entries
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 10000),
  mood       mood_enum   NOT NULL DEFAULT 'reflective',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "journal_select_own" ON public.journal_entries;
DROP POLICY IF EXISTS "journal_insert_own" ON public.journal_entries;
DROP POLICY IF EXISTS "journal_update_own" ON public.journal_entries;
DROP POLICY IF EXISTS "journal_delete_own" ON public.journal_entries;

CREATE POLICY "journal_select_own" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "journal_insert_own" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journal_update_own" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journal_delete_own" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: public.chat_history
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.chat_history (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role      chat_role   NOT NULL,
  message   TEXT        NOT NULL CHECK (char_length(message) BETWEEN 1 AND 10000),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_select_own" ON public.chat_history;
DROP POLICY IF EXISTS "chat_insert_own" ON public.chat_history;
DROP POLICY IF EXISTS "chat_delete_own" ON public.chat_history;

CREATE POLICY "chat_select_own" ON public.chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "chat_insert_own" ON public.chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_delete_own" ON public.chat_history
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: public.reports
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reports (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id  UUID         NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  content_id   UUID         NOT NULL,
  reason       TEXT         CHECK (char_length(reason) <= 500),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_insert_own" ON public.reports;
DROP POLICY IF EXISTS "reports_select_own" ON public.reports;

CREATE POLICY "reports_insert_own" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_select_own" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);


-- =============================================================================
-- TRIGGER: handle_new_user
-- Auto-creates a public.users row on every new Supabase Auth signup.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- FUNCTION: toggle_post_like
-- Atomically toggles a like and updates the counter.
-- Returns TRUE = now liked, FALSE = now unliked.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.toggle_post_like(
  p_post_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_liked BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM post_likes
    WHERE post_id = p_post_id AND user_id = p_user_id
  ) INTO v_liked;

  IF v_liked THEN
    DELETE FROM post_likes
    WHERE post_id = p_post_id AND user_id = p_user_id;

    UPDATE posts SET likes = GREATEST(likes - 1, 0)
    WHERE id = p_post_id;

    RETURN FALSE;
  ELSE
    INSERT INTO post_likes (post_id, user_id)
    VALUES (p_post_id, p_user_id)
    ON CONFLICT DO NOTHING;

    UPDATE posts SET likes = likes + 1
    WHERE id = p_post_id;

    RETURN TRUE;
  END IF;
END;
$$;


-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_posts_user_id     ON public.posts          (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_tag         ON public.posts          (tag);
CREATE INDEX IF NOT EXISTS idx_posts_created_at  ON public.posts          (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_post_id   ON public.replies        (post_id);
CREATE INDEX IF NOT EXISTS idx_replies_user_id   ON public.replies        (user_id);
CREATE INDEX IF NOT EXISTS idx_journal_user_id   ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_created   ON public.journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_user_id      ON public.chat_history   (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_timestamp    ON public.chat_history   (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_likes_post_id     ON public.post_likes     (post_id);


-- =============================================================================
-- MIGRATION: sect → religion
-- Run this if you already have the schema deployed and need to rename the column.
-- Safe to skip on a fresh deployment (column is already named religion above).
-- =============================================================================

DO $$
BEGIN
  -- Rename sect → religion if the old column still exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'users'
      AND column_name  = 'sect'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN sect TO religion;
    ALTER TABLE public.users ALTER COLUMN religion SET DEFAULT 'Muslim';
    UPDATE public.users SET religion = 'Muslim' WHERE religion IS NULL;
    ALTER TABLE public.users ALTER COLUMN religion SET NOT NULL;
  END IF;
END $$;

-- =============================================================================
-- MIGRATION: drop chat_history table
-- Run this if you already have chat_history deployed and want to remove it.
-- =============================================================================

DROP TABLE IF EXISTS public.chat_history CASCADE;
