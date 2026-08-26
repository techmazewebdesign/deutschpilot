export const STRIPE_SUBSCRIPTION_STATUSES = [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "unpaid",
  "paused",
] as const;

export type StripeSubscriptionStatus = (typeof STRIPE_SUBSCRIPTION_STATUSES)[number];

export type SubscriptionSnapshot = {
  status: StripeSubscriptionStatus;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
};

export function isSubscriptionStatus(value: string): value is StripeSubscriptionStatus {
  return (STRIPE_SUBSCRIPTION_STATUSES as readonly string[]).includes(value);
}

/**
 * Stripe is authoritative. Access is available only while the subscription is
 * paid/trialing. A scheduled cancellation remains `active` until period end,
 * so the user keeps access for the time already paid for. Past-due,
 * incomplete, unpaid, paused and deleted subscriptions fail closed.
 */
export function subscriptionGrantsAccess(snapshot: SubscriptionSnapshot, now = new Date()): boolean {
  if (snapshot.status !== "active" && snapshot.status !== "trialing") return false;
  if (!snapshot.currentPeriodEnd || !Number.isFinite(snapshot.currentPeriodEnd.getTime())) return false;
  return snapshot.currentPeriodEnd.getTime() > now.getTime();
}

export function unixSecondsToDate(value: number | null | undefined): Date | null {
  return typeof value === "number" && Number.isFinite(value) ? new Date(value * 1_000) : null;
}
