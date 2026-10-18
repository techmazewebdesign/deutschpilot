# DeutschPilot access plans

## Product behavior

- Standard signup is free, requires Firebase email confirmation, and does not ask for a card. It grants the normal limited access (A1).
- The tester plan is selected during signup. After email confirmation, the user is sent to full-access checkout. Stripe collects a card and starts a 90-day trial; the subscription renews after the trial unless it is cancelled.
- Existing or non-tester users can enter a Stripe promotion code on `/[locale]/subscription`. The code must be configured in Stripe as a one-month-free promotion for the full-access recurring price.
- Server access is granted only by the Stripe webhook. Client UI never writes entitlements directly.

## Required configuration

Set these server-side environment variables before enabling the full-access checkout:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_FULL_ACCESS` — recurring full-access price
- `PAYWALL_ENABLED=true`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `MAIL_FROM=DeutschPilot <info@deutschpilot.de>`
- `MAIL_LOGO_URL=https://deutschpilot.de/Images/Deurschpilot_logo.png`

Run `supabase/migration-subscription-access.sql` in the DeutschPilot Supabase project and configure Stripe to send `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted` to `/api/webhooks/stripe`.

Before each production billing change, run `node scripts/backup-subscription-data.mjs` with the server environment loaded. It writes a mode-600 JSON backup of both `purchases` and `access_grants`; keep that file in protected backup storage and never commit it.

The account avatar/profile cover for `info@deutschpilot.de` is an email-provider account setting and must be set manually in that provider using the original DeutschPilot logo. The application can brand outgoing email and embed the logo, but SMTP credentials alone cannot change the provider account avatar.
