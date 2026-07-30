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
    const product = checkoutSession.metadata?.product;

    if (product === "ai_trainer") {
      if (!userId) {
        console.error(`[stripe-webhook] AI Trainer checkout missing userId — session=${checkoutSession.id}`);
        return NextResponse.json({ received: true });
      }

      const billingMode = checkoutSession.metadata?.billingMode === "payment"
        ? "payment"
        : "subscription";
      const subscriptionId = typeof checkoutSession.subscription === "string"
        ? checkoutSession.subscription
        : null;
      const customerId = typeof checkoutSession.customer === "string"
        ? checkoutSession.customer
        : null;
      const paymentIntentId = typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : null;
      const sb = createAdminSupabaseClient();
      const { error } = await sb.from("ai_trainer_entitlements").upsert({
        user_id: userId,
        status: "active",
        billing_mode: billingMode,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_payment_intent_id: paymentIntentId,
        stripe_checkout_session_id: checkoutSession.id,
        current_period_end: null,
      }, { onConflict: "user_id" });

      if (error) {
        console.error("[stripe-webhook] Failed to grant AI Trainer access:", error.message);
        return NextResponse.json({ error: "Failed to record AI Trainer entitlement." }, { status: 500 });
      }

      console.log(`[stripe-webhook] AI Trainer entitlement recorded — session=${checkoutSession.id}`);
      return NextResponse.json({ received: true });
    }

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

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    if (subscription.metadata?.product === "ai_trainer") {
      const active = event.type !== "customer.subscription.deleted"
        && (subscription.status === "active" || subscription.status === "trialing");
      const status = active
        ? "active"
        : subscription.status === "past_due"
          ? "past_due"
          : "canceled";
      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1_000).toISOString()
        : null;
      const sb = createAdminSupabaseClient();
      const { error } = await sb
        .from("ai_trainer_entitlements")
        .update({
          status,
          current_period_end: currentPeriodEnd,
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("[stripe-webhook] Failed to update AI Trainer subscription:", error.message);
        return NextResponse.json({ error: "Failed to update AI Trainer entitlement." }, { status: 500 });
      }
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : null;
    if (charge.refunded && paymentIntentId) {
      const sb = createAdminSupabaseClient();
      const { error } = await sb
        .from("ai_trainer_entitlements")
        .update({ status: "refunded" })
        .eq("billing_mode", "payment")
        .eq("stripe_payment_intent_id", paymentIntentId);

      if (error) {
        console.error("[stripe-webhook] Failed to revoke refunded AI Trainer access:", error.message);
        return NextResponse.json({ error: "Failed to update AI Trainer entitlement." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
