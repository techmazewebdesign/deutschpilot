-- DeutschPilot platform subscription state. Stripe webhooks are authoritative.
-- Run once in Supabase before PAYWALL_ENABLED=true is permitted.

CREATE TABLE IF NOT EXISTS public.platform_subscriptions (
  user_id                    text PRIMARY KEY,
  stripe_customer_id         text UNIQUE,
  stripe_subscription_id     text UNIQUE,
  stripe_checkout_session_id text UNIQUE,
  status                     text NOT NULL CHECK (status IN (
    'active', 'trialing', 'past_due', 'canceled', 'incomplete',
    'incomplete_expired', 'unpaid', 'paused'
  )),
  cancel_at_period_end       boolean NOT NULL DEFAULT false,
  current_period_end         timestamptz,
  canceled_at                timestamptz,
  last_invoice_id            text,
  last_payment_status        text,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS platform_subscriptions_status_idx
  ON public.platform_subscriptions (status, current_period_end);

ALTER TABLE public.platform_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  event_id       text PRIMARY KEY,
  event_type     text NOT NULL,
  status         text NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  attempt_count  integer NOT NULL DEFAULT 1,
  last_error     text,
  processed_at   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.subscription_notifications (
  notification_key text PRIMARY KEY,
  stripe_event_id  text NOT NULL,
  user_id          text,
  recipient        text NOT NULL,
  notification_type text NOT NULL CHECK (notification_type IN (
    'payment_succeeded', 'payment_failed', 'cancellation_scheduled', 'subscription_canceled'
  )),
  status           text NOT NULL CHECK (status IN ('sending', 'sent', 'failed')),
  provider_message_id text,
  sent_at          timestamptz,
  last_error       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_notifications ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.subscription_cancellation_requests (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_subscription_id text NOT NULL,
  effective_at           timestamptz,
  status                 text NOT NULL CHECK (status IN ('received', 'scheduled', 'failed')),
  received_at            timestamptz NOT NULL DEFAULT now(),
  request_ip_hash        text,
  user_agent             text
);

ALTER TABLE public.subscription_cancellation_requests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.claim_stripe_webhook_event(p_event_id text, p_event_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE claimed boolean;
BEGIN
  INSERT INTO public.stripe_webhook_events (event_id, event_type, status)
  VALUES (p_event_id, p_event_type, 'processing')
  ON CONFLICT (event_id) DO UPDATE
    SET status = 'processing',
        event_type = EXCLUDED.event_type,
        attempt_count = stripe_webhook_events.attempt_count + 1,
        last_error = NULL,
        updated_at = now()
    WHERE stripe_webhook_events.status = 'failed'
       OR (stripe_webhook_events.status = 'processing'
           AND stripe_webhook_events.updated_at < now() - interval '5 minutes')
  RETURNING true INTO claimed;
  RETURN COALESCE(claimed, false);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_stripe_webhook_event(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_stripe_webhook_event(text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.set_platform_subscription_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_platform_subscription_updated_at ON public.platform_subscriptions;
CREATE TRIGGER trg_platform_subscription_updated_at
  BEFORE UPDATE ON public.platform_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_platform_subscription_updated_at();
