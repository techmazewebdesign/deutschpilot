/**
 * POST /api/checkout/create-session
 *
 * Body: { level: "A2" | "B1" | "B2" | "C1" }
 * Creates a one-time-payment Stripe Checkout session for the given level
 * and returns its redirect URL. Requires a signed-in session (the
 * __session cookie) — the Firebase UID becomes client_reference_id /
 * metadata.userId so the webhook can grant access to the right user.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { createPlatformSubscriptionCheckout, platformSubscriptionPriceId } from "@/lib/stripe";
import { isPaidLevel, hasActivePlatformSubscription } from "@/lib/entitlements";
import { GERMAN_PAID_ENROLLMENT_NOTICE, GERMAN_PAID_ENROLLMENT_NOTICE_EN, isGermanPaidEnrollmentBlocked, isGermanPaidEnrollmentRequest, localeFromReferer, normalizeCheckoutLocale } from "@/lib/fernusg";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { level, product, withdrawalConsent, locale: bodyLocale } = body as { level?: string; product?: string; withdrawalConsent?: boolean; locale?: string };
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (process.env.NODE_ENV === "production" && !configuredOrigin) {
    return NextResponse.json({ error: "Application URL is not configured." }, { status: 503 });
  }
  const origin = (configuredOrigin || new URL(req.url).origin).replace(/\/+$/, "");
  const locale = normalizeCheckoutLocale(bodyLocale) ?? localeFromReferer(req.headers.get("referer"));
  if (!locale) return NextResponse.json({ error: "Checkout language is required." }, { status: 400 });
  if (isGermanPaidEnrollmentBlocked() && isGermanPaidEnrollmentRequest(locale, req.headers.get("x-vercel-ip-country"))) {
    return NextResponse.json({ error: locale === "de" ? GERMAN_PAID_ENROLLMENT_NOTICE : GERMAN_PAID_ENROLLMENT_NOTICE_EN, code: "german_paid_enrollment_paused" }, { status: 451 });
  }

  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (product !== "ai_trainer" && (!level || !isPaidLevel(level))) {
    return NextResponse.json({ error: "Invalid or missing level." }, { status: 400 });
  }

  if (!session.user.emailVerified || !session.user.email) {
    return NextResponse.json({ error: "Verify your email before subscribing." }, { status: 403 });
  }
  if (withdrawalConsent !== true) {
    return NextResponse.json({ error: "Immediate-access consent is required." }, { status: 400 });
  }

  const alreadyOwned = await hasActivePlatformSubscription(session.user.id);
  if (alreadyOwned) {
    return NextResponse.json({ error: "You already have an active subscription." }, { status: 409 });
  }

  if (!platformSubscriptionPriceId()) {
    console.error("[checkout] No platform subscription price configured");
    return NextResponse.json(
      { error: "Subscriptions are not available yet." },
      { status: 503 }
    );
  }

  try {
    const checkoutSession = await createPlatformSubscriptionCheckout({
      userId: session.user.id,
      email: session.user.email,
      locale,
      successUrl: `${origin}/${locale}/profile?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/${locale}/levels?subscription=cancelled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[checkout] create-session failed:", msg);
    return NextResponse.json({ error: locale === "de" ? GERMAN_PAID_ENROLLMENT_NOTICE : GERMAN_PAID_ENROLLMENT_NOTICE_EN }, { status: 500 });
  }
}
