-- DeutschPilot access plans
-- Standard users receive A1/limited access without a card.
-- Full access is granted only by the Stripe webhook for a 90-day trial or
-- a promotion-backed subscription.
CREATE TABLE IF NOT EXISTS public.access_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  access_tier text NOT NULL CHECK (access_tier IN ('full')),
  access_source text NOT NULL CHECK (access_source IN ('tester_trial', 'promotion', 'manual')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'expired')),
  ends_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_checkout_session_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS access_grants_active_user_idx
  ON public.access_grants (user_id)
  WHERE access_tier = 'full' AND status IN ('pending', 'active', 'past_due');
CREATE INDEX IF NOT EXISTS access_grants_subscription_idx
  ON public.access_grants (stripe_subscription_id);

ALTER TABLE public.access_grants ENABLE ROW LEVEL SECURITY;
