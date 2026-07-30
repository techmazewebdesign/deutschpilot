-- DeutschPilot AI Trainer paid-access entitlement.
-- Identity remains Firebase UID (text). This is server-only commerce data
-- written by the verified Stripe webhook through the Supabase service role.

CREATE TABLE IF NOT EXISTS public.ai_trainer_entitlements (
  user_id                    text PRIMARY KEY,
  status                     text NOT NULL DEFAULT 'active'
                             CHECK (status IN ('active', 'past_due', 'canceled', 'refunded')),
  billing_mode               text NOT NULL
                             CHECK (billing_mode IN ('subscription', 'payment')),
  stripe_customer_id         text,
  stripe_subscription_id     text UNIQUE,
  stripe_payment_intent_id   text,
  stripe_checkout_session_id text NOT NULL UNIQUE,
  current_period_end         timestamptz,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_trainer_entitlements_status_idx
  ON public.ai_trainer_entitlements (status);

ALTER TABLE public.ai_trainer_entitlements
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

CREATE UNIQUE INDEX IF NOT EXISTS ai_trainer_entitlements_payment_intent_idx
  ON public.ai_trainer_entitlements (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

ALTER TABLE public.ai_trainer_entitlements ENABLE ROW LEVEL SECURITY;

-- No browser policies. Firebase-authenticated users do not have a Supabase
-- Auth identity, so reads and writes must stay behind authenticated server
-- routes using the service-role client.

CREATE TABLE IF NOT EXISTS public.ai_trainer_usage (
  user_id      text NOT NULL,
  date         date NOT NULL,
  message_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

ALTER TABLE public.ai_trainer_usage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_trainer_usage_open ON public.ai_trainer_usage;

CREATE OR REPLACE FUNCTION public.consume_ai_trainer_message(
  p_user_id text,
  p_date date,
  p_limit integer
)
RETURNS TABLE (allowed boolean, message_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_count integer;
BEGIN
  IF p_user_id IS NULL OR p_user_id = '' OR p_limit < 1 THEN
    RAISE EXCEPTION 'Invalid AI trainer usage request';
  END IF;

  INSERT INTO public.ai_trainer_usage AS usage (user_id, date, message_count)
  VALUES (p_user_id, p_date, 1)
  ON CONFLICT (user_id, date) DO UPDATE
    SET message_count = usage.message_count + 1
    WHERE usage.message_count < p_limit
  RETURNING usage.message_count INTO next_count;

  IF next_count IS NULL THEN
    SELECT usage.message_count
      INTO next_count
      FROM public.ai_trainer_usage AS usage
      WHERE usage.user_id = p_user_id AND usage.date = p_date;
    RETURN QUERY SELECT false, COALESCE(next_count, 0);
    RETURN;
  END IF;

  RETURN QUERY SELECT true, next_count;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_ai_trainer_message(text, date, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_ai_trainer_message(text, date, integer)
  TO service_role;

CREATE OR REPLACE FUNCTION public.set_ai_trainer_entitlement_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ai_trainer_entitlement_updated_at
  ON public.ai_trainer_entitlements;
CREATE TRIGGER trg_ai_trainer_entitlement_updated_at
  BEFORE UPDATE ON public.ai_trainer_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.set_ai_trainer_entitlement_updated_at();
