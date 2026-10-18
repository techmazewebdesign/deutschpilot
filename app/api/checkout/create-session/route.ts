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
import {
  aiTrainerPriceId,
  createAITrainerCheckoutSession,
  createLevelCheckoutSession,
  createFullAccessCheckoutSession,
  priceIdForLevel,
} from "@/lib/stripe";
import { isPaidLevel, hasFullAccess, hasLevelAccess } from "@/lib/entitlements";
import { getAITrainerAccess } from "@/lib/aiTrainer/access";
import { FREE_PILOT_MODE } from "@/lib/pilot";
import { GERMAN_PAID_ENROLLMENT_NOTICE, GERMAN_PAID_ENROLLMENT_NOTICE_EN, isGermanPaidEnrollmentBlocked, isGermanPaidEnrollmentRequest, localeFromReferer } from "@/lib/fernusg";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (FREE_PILOT_MODE) {
    return NextResponse.json(
      { error: "Paid access is disabled during the free pilot." },
      { status: 410 },
    );
  }

  const requestLocale = localeFromReferer(req.headers.get("referer")) ?? "en";
  if (isGermanPaidEnrollmentBlocked() && isGermanPaidEnrollmentRequest(requestLocale, req.headers.get("x-vercel-ip-country"))) {
    return NextResponse.json({ error: requestLocale === "de" ? GERMAN_PAID_ENROLLMENT_NOTICE : GERMAN_PAID_ENROLLMENT_NOTICE_EN }, { status: 451 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 }
    );
  }

  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { level, product, plan, promotionCode } = body as {
    level?: string;
    product?: string;
    plan?: string;
    promotionCode?: string;
  };
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const origin = (configuredOrigin || new URL(req.url).origin).replace(/\/+$/, "");
  const requestedLocale = req.headers.get("referer")?.match(/\/([a-z]{2})(?:\/|$)/)?.[1];
  const locale = requestedLocale === "de" ? "de" : "en";

  if (product === "full_access") {
    if (plan !== "tester_trial" && plan !== "promotion") {
      return NextResponse.json({ error: "Choose a valid full-access plan." }, { status: 400 });
    }
    if (plan === "tester_trial" && promotionCode) {
      return NextResponse.json({ error: "A tester trial does not use a promotion code." }, { status: 400 });
    }
    if (await hasFullAccess(session.user.id)) {
      return NextResponse.json({ error: "You already have full access." }, { status: 409 });
    }
    try {
      const checkoutSession = await createFullAccessCheckoutSession({
        userId: session.user.id,
        trial: plan === "tester_trial",
        promotionCode: plan === "promotion" ? promotionCode : undefined,
        successUrl: `${origin}/${locale}/subscription?purchase=success`,
        cancelUrl: `${origin}/${locale}/subscription?purchase=cancelled`,
      });
      return NextResponse.json({ url: checkoutSession.url });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[checkout] full-access session failed:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  if (product === "ai_trainer") {
    if (process.env.AI_TRAINER_PAID_ENABLED !== "true") {
      return NextResponse.json(
        { error: "AI Trainer paid access is not enabled yet." },
        { status: 503 },
      );
    }

    const access = await getAITrainerAccess(session.user);
    if (access.tier === "premium" || access.tier === "admin") {
      return NextResponse.json({ error: "You already have AI Trainer access." }, { status: 409 });
    }

    const priceId = aiTrainerPriceId();
    if (!priceId) {
      return NextResponse.json(
        { error: "AI Trainer checkout is not available yet." },
        { status: 503 },
      );
    }

    try {
      const checkoutSession = await createAITrainerCheckoutSession({
        priceId,
        userId: session.user.id,
        successUrl: `${origin}/${locale}/ai-trainer?purchase=success`,
        cancelUrl: `${origin}/${locale}/ai-trainer?purchase=cancelled`,
      });
      return NextResponse.json({ url: checkoutSession.url });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[checkout] AI Trainer session failed:", msg);
      return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
    }
  }

  if (!level || !isPaidLevel(level)) {
    return NextResponse.json({ error: "Invalid or missing level." }, { status: 400 });
  }

  const alreadyOwned = await hasLevelAccess(session.user.id, level);
  if (alreadyOwned) {
    return NextResponse.json({ error: "You already own this level." }, { status: 409 });
  }

  const priceId = priceIdForLevel(level);
  if (!priceId) {
    console.error(`[checkout] No Stripe price configured for level ${level}`);
    return NextResponse.json(
      { error: `Checkout for ${level} is not available yet.` },
      { status: 503 }
    );
  }

  try {
    const checkoutSession = await createLevelCheckoutSession({
      level,
      priceId,
      userId: session.user.id,
      successUrl: `${origin}/${locale}/levels?purchase=success&level=${level}`,
      cancelUrl: `${origin}/${locale}/levels?purchase=cancelled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[checkout] create-session failed:", msg);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
