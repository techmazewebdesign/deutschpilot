import type Stripe from "stripe";
import { isSubscriptionStatus, type StripeSubscriptionStatus } from "./subscription-state";

export type PlatformSubscriptionRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string;
  status: StripeSubscriptionStatus;
  cancel_at_period_end: boolean;
  current_period_end: string | null;
  canceled_at: string | null;
};

export function platformSubscriptionPeriodEnd(subscription: Stripe.Subscription): number | null {
  const legacy = (subscription as unknown as { current_period_end?: number }).current_period_end;
  if (typeof legacy === "number") return legacy;
  const ends = subscription.items.data
    .map((item) => (item as unknown as { current_period_end?: number }).current_period_end)
    .filter((value): value is number => typeof value === "number");
  return ends.length ? Math.max(...ends) : null;
}

export function platformSubscriptionRow(subscription: Stripe.Subscription, fallbackUserId?: string | null): PlatformSubscriptionRow {
  const userId = subscription.metadata.userId || fallbackUserId;
  if (!userId) throw new Error(`Subscription ${subscription.id} is missing userId metadata.`);
  if (subscription.metadata.product && subscription.metadata.product !== "deutschpilot_all_access") {
    throw new Error(`Subscription ${subscription.id} is not a DeutschPilot all-access subscription.`);
  }
  if (!isSubscriptionStatus(subscription.status)) {
    throw new Error(`Unsupported Stripe subscription status: ${subscription.status}`);
  }
  const periodEnd = platformSubscriptionPeriodEnd(subscription);
  return {
    user_id: userId,
    stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_end: periodEnd ? new Date(periodEnd * 1_000).toISOString() : null,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1_000).toISOString() : null,
  };
}

export function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const legacy = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
  if (typeof legacy === "string") return legacy;
  if (legacy?.id) return legacy.id;
  const parent = (invoice as unknown as {
    parent?: { subscription_details?: { subscription?: string | { id: string } | null } | null } | null;
  }).parent;
  const subscription = parent?.subscription_details?.subscription;
  if (typeof subscription === "string") return subscription;
  return subscription?.id ?? null;
}
