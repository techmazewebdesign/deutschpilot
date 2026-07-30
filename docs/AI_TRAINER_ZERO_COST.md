# DeutschPilot AI Trainer: zero-cost operation and paid access

## What is implemented

The trainer never falls back to a paid AI provider.

- With `GROQ_API_KEY`, it can use the configured Groq model within that account's free limits.
- Without `GROQ_API_KEY`, or whenever Groq is unavailable or rate-limited, it uses the built-in deterministic German trainer.
- The deterministic trainer supports CEFR-level exercises, grammar explanations, vocabulary tests, sentence-correction prompts, and conversation practice.
- Every signed-in user has a bounded daily allowance. Limits are configurable.
- Paid access is disabled by default and fails closed.

This makes the software capable of operating with zero per-message AI charges. Hosting, payment processing, email, database, domain, or other infrastructure can still have their own costs.

## Environment variable names

AI provider:

- `GROQ_API_KEY`
- `GROQ_AI_TRAINER_MODEL`

Access controls:

- `AI_TRAINER_PAID_ENABLED`
- `AI_TRAINER_PREVIEW_DAILY_LIMIT`
- `AI_TRAINER_PREMIUM_DAILY_LIMIT`
- `AI_TRAINER_LAUNCH_DAILY_LIMIT`
- `AI_TRAINER_ADMIN_DAILY_LIMIT`

Stripe:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_AI_TRAINER`
- `AI_TRAINER_BILLING_MODE`
- `NEXT_PUBLIC_APP_URL`

Supabase server access:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not place secret values in source code, browser-visible variables, logs, screenshots, or documentation.

## Safe activation order

1. Apply `supabase/migration-ai-trainer-entitlements.sql` to the correct Supabase project.
2. Verify the existing `ai_trainer_usage` table is present.
3. Optionally create a Groq key and set `GROQ_API_KEY`. The trainer still works without it.
4. Create an AI Trainer product and Price in the correct Stripe account.
5. Set `STRIPE_PRICE_AI_TRAINER`.
6. Choose `AI_TRAINER_BILLING_MODE` as `subscription` or `payment`.
7. Keep `AI_TRAINER_PAID_ENABLED` unset while testing.
8. Test checkout, verified webhook delivery, entitlement creation, cancellation, expiry, refund handling, preview limits, premium limits, and the deterministic fallback.
9. Confirm the customer-facing price, billing interval, cancellation/refund terms, privacy notice, terms, and legal business details.
10. Set `AI_TRAINER_PAID_ENABLED=true` only after all checks pass.
11. Deploy, complete one controlled test purchase, verify the Stripe event and database entitlement, then refund or cancel the test according to the selected billing mode.

## Verification

Run:

```sh
npm run test:ai-trainer
npm run build
```

The paid switch must remain disabled if the migration, Stripe Price, verified webhook, legal text, or end-to-end purchase test is incomplete.
