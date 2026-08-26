import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { invoiceSubscriptionId, platformSubscriptionRow } from "@/lib/subscription-webhook";
import { sendSubscriptionLifecycleEmail, type SubscriptionEmailKind } from "@/lib/email";

export const runtime = "nodejs";

async function markEvent(eventId: string, status: "completed" | "failed", error?: unknown) {
  const sb = createAdminSupabaseClient();
  await sb.from("stripe_webhook_events").update({
    status,
    processed_at: status === "completed" ? new Date().toISOString() : null,
    last_error: error ? String(error instanceof Error ? error.message : error).slice(0, 1_000) : null,
    updated_at: new Date().toISOString(),
  }).eq("event_id", eventId);
}

async function claimEvent(event: Stripe.Event): Promise<"claimed" | "completed" | "busy"> {
  const sb = createAdminSupabaseClient();
  const { data, error } = await sb.rpc("claim_stripe_webhook_event", {
    p_event_id: event.id,
    p_event_type: event.type,
  });
  if (error) throw new Error(`Could not claim webhook event: ${error.message}`);
  if (data === true) return "claimed";
  const existing = await sb.from("stripe_webhook_events").select("status").eq("event_id", event.id).single();
  return existing.data?.status === "completed" ? "completed" : "busy";
}

async function existingUserId(subscriptionId: string): Promise<string | null> {
  const sb = createAdminSupabaseClient();
  const { data } = await sb.from("platform_subscriptions").select("user_id").eq("stripe_subscription_id", subscriptionId).maybeSingle();
  return data?.user_id ?? null;
}

async function existingSubscription(subscriptionId: string) {
  const sb = createAdminSupabaseClient();
  const { data } = await sb.from("platform_subscriptions")
    .select("user_id,status,cancel_at_period_end")
    .eq("stripe_subscription_id", subscriptionId).maybeSingle();
  return data;
}

async function syncSubscription(subscription: Stripe.Subscription, checkoutSessionId?: string | null) {
  const fallbackUserId = await existingUserId(subscription.id);
  const row = platformSubscriptionRow(subscription, fallbackUserId);
  const sb = createAdminSupabaseClient();
  const payload = checkoutSessionId ? { ...row, stripe_checkout_session_id: checkoutSessionId } : row;
  const { error } = await sb.from("platform_subscriptions").upsert(payload, { onConflict: "user_id" });
  if (error) throw new Error(`Could not sync subscription: ${error.message}`);
  return row;
}

async function customerEmail(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): Promise<string | null> {
  if (!customer) return null;
  if (typeof customer !== "string") return "email" in customer ? customer.email ?? null : null;
  const result = await stripe.customers.retrieve(customer);
  return !result.deleted ? result.email ?? null : null;
}

async function deliverNotification({
  event,
  userId,
  recipient,
  kind,
  amount,
  currency,
  invoiceUrl,
  accessUntil,
}: {
  event: Stripe.Event;
  userId: string;
  recipient: string | null;
  kind: SubscriptionEmailKind;
  amount?: number | null;
  currency?: string | null;
  invoiceUrl?: string | null;
  accessUntil?: Date | null;
}) {
  if (!recipient) return;
  const key = `${event.id}:${kind}`;
  const sb = createAdminSupabaseClient();
  const claimed = await sb.from("subscription_notifications").insert({
    notification_key: key,
    stripe_event_id: event.id,
    user_id: userId,
    recipient,
    notification_type: kind,
    status: "sending",
  });
  if (claimed.error?.code === "23505") {
    const existing = await sb.from("subscription_notifications").select("status").eq("notification_key", key).single();
    if (existing.data?.status !== "failed") return;
    const retry = await sb.from("subscription_notifications")
      .update({ status: "sending", last_error: null, updated_at: new Date().toISOString() })
      .eq("notification_key", key).eq("status", "failed")
      .select("notification_key").maybeSingle();
    if (retry.error || !retry.data) return;
  }
  if (claimed.error && claimed.error.code !== "23505") {
    throw new Error(`Could not claim notification: ${claimed.error.message}`);
  }

  const result = await sendSubscriptionLifecycleEmail({ to: recipient, kind, amount, currency, invoiceUrl, accessUntil });
  const update = result.ok
    ? { status: "sent", sent_at: new Date().toISOString(), provider_message_id: result.providerMessageId ?? null, last_error: null }
    : { status: "failed", last_error: result.error ?? "Unknown email error" };
  await sb.from("subscription_notifications").update(update).eq("notification_key", key);
  if (!result.ok) throw new Error(`Subscription email failed: ${result.error}`);
}

async function processEvent(event: Stripe.Event) {
  const object = event.data.object;

  if (event.type === "checkout.session.completed") {
    const session = object as Stripe.Checkout.Session;
    if (session.metadata?.product !== "deutschpilot_all_access") return;
    if (session.mode !== "subscription" || typeof session.subscription !== "string") {
      throw new Error(`Checkout ${session.id} is missing its subscription.`);
    }
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await syncSubscription(subscription, session.id);
    return;
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const eventSubscription = object as Stripe.Subscription;
    const previous = await existingSubscription(eventSubscription.id);
    // A valid Stripe event is not necessarily the newest event. Reading the
    // provider's current state prevents a delayed event from restoring access.
    const subscription = await stripe.subscriptions.retrieve(eventSubscription.id);
    const knownUserId = previous?.user_id ?? null;
    if (subscription.metadata.product !== "deutschpilot_all_access" && !knownUserId) return;
    const row = await syncSubscription(subscription);
    const recipient = await customerEmail(subscription.customer);
    const cancellationJustScheduled = event.type === "customer.subscription.updated"
      && subscription.cancel_at_period_end
      && previous?.cancel_at_period_end === false;
    if (cancellationJustScheduled) {
      await deliverNotification({
        event, userId: row.user_id, recipient, kind: "cancellation_scheduled",
        accessUntil: row.current_period_end ? new Date(row.current_period_end) : null,
      });
    }
    if (event.type === "customer.subscription.deleted") {
      await deliverNotification({ event, userId: row.user_id, recipient, kind: "subscription_canceled" });
    }
    return;
  }

  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const invoice = object as Stripe.Invoice;
    const subscriptionId = invoiceSubscriptionId(invoice);
    if (!subscriptionId) return;
    const knownUserId = await existingUserId(subscriptionId);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.metadata.product !== "deutschpilot_all_access" && !knownUserId) return;
    const row = await syncSubscription(subscription);
    const sb = createAdminSupabaseClient();
    await sb.from("platform_subscriptions").update({
      last_invoice_id: invoice.id,
      last_payment_status: event.type === "invoice.paid" ? "paid" : "failed",
    }).eq("stripe_subscription_id", subscriptionId);
    await deliverNotification({
      event,
      userId: row.user_id,
      recipient: invoice.customer_email ?? await customerEmail(invoice.customer),
      kind: event.type === "invoice.paid" ? "payment_succeeded" : "payment_failed",
      amount: event.type === "invoice.paid" ? invoice.amount_paid : invoice.amount_due,
      currency: invoice.currency,
      invoiceUrl: invoice.hosted_invoice_url,
    });
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    const claim = await claimEvent(event);
    if (claim === "completed") return NextResponse.json({ received: true, duplicate: true });
    if (claim === "busy") return NextResponse.json({ error: "Event is already processing." }, { status: 409 });
    await processEvent(event);
    await markEvent(event.id, "completed");
    return NextResponse.json({ received: true });
  } catch (error) {
    await markEvent(event.id, "failed", error);
    console.error("[stripe-webhook] Processing failed:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
