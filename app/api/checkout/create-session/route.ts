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
import { createLevelCheckoutSession, priceIdForLevel } from "@/lib/stripe";
import { isPaidLevel, hasLevelAccess } from "@/lib/entitlements";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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

  const { level } = body as { level?: string };
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

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const locale = req.headers.get("referer")?.match(/\/([a-z]{2})\//)?.[1] ?? "en";

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
