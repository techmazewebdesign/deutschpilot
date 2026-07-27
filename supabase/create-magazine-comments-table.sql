-- ============================================================
-- DeutschPilot – magazine_comments table
-- Publicly readable (guests can view), sign-in required to post.
-- Reads/writes go through API routes using the service-role client
-- only (matches this app's Firebase Auth + Supabase-service-role
-- architecture — there is no Supabase Auth session for RLS to key
-- off of).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.magazine_comments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug  text NOT NULL,
  user_id       text NOT NULL, -- Firebase UID
  author_name   text NOT NULL,
  body          text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS magazine_comments_article_slug_idx ON public.magazine_comments (article_slug, created_at);

ALTER TABLE public.magazine_comments ENABLE ROW LEVEL SECURITY;
