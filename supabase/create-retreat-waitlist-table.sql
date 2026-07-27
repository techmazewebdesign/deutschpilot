-- ============================================================
-- DeutschPilot – retreat_waitlist table
-- Public, unauthenticated signups (guests can join the waitlist
-- without an account) — written via service-role client only.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.retreat_waitlist (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email             text NOT NULL,
  preferred_region  text,
  preferred_dates   text,
  locale            text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS retreat_waitlist_email_idx ON public.retreat_waitlist (email);

ALTER TABLE public.retreat_waitlist ENABLE ROW LEVEL SECURITY;

-- No client-side policies: writes go through /api/retreats/waitlist
-- using the service-role key only.
