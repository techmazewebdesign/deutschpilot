import type Stripe from "stripe";

export type AccessTier = "standard" | "full";
export type AccessSource = "tester_trial" | "promotion" | "manual";

export const FULL_ACCESS_TRIAL_DAYS = 90;

export function fullAccessEndsAt(subscription: Stripe.Subscription): string | null {
  const timestamp = subscription.trial_end ?? subscription.current_period_end;
  return timestamp ? new Date(timestamp * 1_000).toISOString() : null;
}

export function isActiveSubscriptionStatus(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}
