import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { platformSubscriptionPeriodEnd } from "@/lib/subscription-webhook";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Cancellation service is not configured." }, { status: 503 });
  const body = await req.json().catch(() => null) as { email?: string; subscriptionId?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const subscriptionId = body?.subscriptionId?.trim() ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || !/^sub_[A-Za-z0-9]+$/.test(subscriptionId)) {
    return NextResponse.json({ error: "Please provide the billing email and subscription reference." }, { status: 400 });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.metadata.product !== "deutschpilot_all_access") throw new Error("not matched");
    const customer = typeof subscription.customer === "string"
      ? await stripe.customers.retrieve(subscription.customer)
      : subscription.customer;
    const customerEmail = !customer.deleted ? customer.email?.trim().toLowerCase() : null;
    if (!customerEmail || customerEmail !== email) throw new Error("not matched");

    const updated = subscription.cancel_at_period_end
      ? subscription
      : await stripe.subscriptions.update(subscription.id, { cancel_at_period_end: true });
    const periodEnd = platformSubscriptionPeriodEnd(updated);
    const effectiveAt = periodEnd ? new Date(periodEnd * 1_000).toISOString() : null;
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = createHash("sha256").update(`${process.env.AUTH_SECRET ?? ""}:${forwarded}`).digest("hex");
    const audit = await createAdminSupabaseClient().from("subscription_cancellation_requests").insert({
      stripe_subscription_id: subscription.id,
      effective_at: effectiveAt,
      status: "scheduled",
      request_ip_hash: ipHash,
      user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    });
    if (audit.error) console.error("[public-cancel] Cancellation scheduled but audit insert failed:", audit.error.message);
    return NextResponse.json({ ok: true, receivedAt: new Date().toISOString(), effectiveAt });
  } catch {
    return NextResponse.json({ error: "The supplied billing details could not be matched." }, { status: 400 });
  }
}
