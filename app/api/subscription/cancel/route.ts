import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { stripe } from "@/lib/stripe";
import { platformSubscriptionPeriodEnd } from "@/lib/subscription-webhook";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });

  const sb = createAdminSupabaseClient();
  const { data, error } = await sb.from("platform_subscriptions")
    .select("stripe_subscription_id,cancel_at_period_end,current_period_end")
    .eq("user_id", session.user.id).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load subscription." }, { status: 500 });
  if (!data?.stripe_subscription_id) return NextResponse.json({ error: "No subscription found." }, { status: 404 });
  if (data.cancel_at_period_end) {
    return NextResponse.json({ ok: true, cancelAtPeriodEnd: true, currentPeriodEnd: data.current_period_end });
  }

  const subscription = await stripe.subscriptions.update(data.stripe_subscription_id, { cancel_at_period_end: true });
  const periodEnd = platformSubscriptionPeriodEnd(subscription);
  return NextResponse.json({
    ok: true,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1_000).toISOString() : null,
  });
}
