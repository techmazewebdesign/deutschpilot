/**
 * POST /api/webhooks/stripe
 *
 * Stripe webhook endpoint. On a completed checkout, writes a row to
 * public.purchases (service-role client) so lib/entitlements.ts grants
 * access to that level for that user. Idempotent via the unique
 * constraint on stripe_checkout_session_id — Stripe retries webhooks,
 * so a duplicate event must be a harmless no-op, not a duplicate grant
 * or a thrown error (which would make Stripe keep retrying forever).
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { isPaidLevel } from "@/lib/entitlements";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    console.error("[stripe-webhook] Missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] Signature verification failed:", msg);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const userId = checkoutSession.metadata?.userId ?? checkoutSession.client_reference_id;
    const level = checkoutSession.metadata?.level;

    if (!userId || !level || !isPaidLevel(level)) {
      console.error(
        `[stripe-webhook] checkout.session.completed missing/invalid metadata — userId=${userId} level=${level} session=${checkoutSession.id}`
      );
      // Acknowledge anyway — this is a data problem on our side, not something
      // Stripe retrying will fix, and we don't want it retried forever.
      return NextResponse.json({ received: true });
    }

    const sb = createAdminSupabaseClient();
    const { error } = await sb.from("purchases").insert({
      user_id: userId,
      level,
      stripe_checkout_session_id: checkoutSession.id,
      stripe_payment_intent_id:
        typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : null,
      amount_cents: checkoutSession.amount_total ?? 0,
      currency: checkoutSession.currency ?? "eur",
      status: "completed",
    });

    // Unique-violation on stripe_checkout_session_id (Stripe retried this
    // same event) is expected and fine — anything else is a real problem.
    if (error && error.code !== "23505") {
      console.error("[stripe-webhook] Failed to record purchase:", error.message);
      return NextResponse.json({ error: "Failed to record purchase." }, { status: 500 });
    }

    console.log(`[stripe-webhook] ✓ Purchase recorded — user=${userId} level=${level} session=${checkoutSession.id}`);
  }

  return NextResponse.json({ received: true });
}
