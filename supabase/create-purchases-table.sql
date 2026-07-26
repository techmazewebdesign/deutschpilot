-- ============================================================
-- DeutschPilot – purchases table (one-time per-level unlock)
-- A1 is always free; A2/B1/B2/C1 require a completed purchase row
-- here before /rooms, /lessons, /exercises, or /courses content for
-- that level is served. Written by the Stripe webhook only
-- (service-role client) — never inserted from the client.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.purchases (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 text NOT NULL, -- Firebase UID, matching student_progress.user_id / session.user.id — NOT profiles.id
  level                   text NOT NULL CHECK (level IN ('A2', 'B1', 'B2', 'C1')),
  stripe_checkout_session_id text NOT NULL UNIQUE,
  stripe_payment_intent_id   text,
  amount_cents            integer NOT NULL,
  currency                text NOT NULL DEFAULT 'eur',
  status                  text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'refunded')),
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS purchases_user_level_completed_idx
  ON public.purchases (user_id, level)
  WHERE status = 'completed';

CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON public.purchases (user_id);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- No client-side policies: reads/writes go through server routes using
-- the service-role key only (matches the rest of this app's Firebase
-- Auth + Supabase-service-role architecture — there is no Supabase Auth
-- session for RLS to key off of).
