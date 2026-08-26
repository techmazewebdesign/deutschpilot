/**
 * entitlements.ts — server-only. Answers "can this user access this level?"
 *
 * A1 is always free. One active/trialing platform subscription unlocks all
 * paid levels and premium learning materials. Stripe webhooks are the only
 * writers of public.platform_subscriptions.
 */
import { createAdminSupabaseClient } from "./supabaseAdmin";
import { subscriptionGrantsAccess, type StripeSubscriptionStatus } from "./subscription-state";

export type PaidLevel = "A2" | "B1" | "B2" | "C1";
export const PAID_LEVELS: PaidLevel[] = ["A2", "B1", "B2", "C1"];

export function isPaidLevel(level: string): level is PaidLevel {
  return (PAID_LEVELS as string[]).includes(level);
}

// Fail closed: the paywall is enabled unless an operator deliberately sets the
// emergency rollback switch to the exact value `false`.
const PAYWALL_ENABLED = process.env.PAYWALL_ENABLED !== "false";

export async function hasLevelAccess(userId: string, level: string, role?: string): Promise<boolean> {
  if (!PAYWALL_ENABLED) return true;
  if (role === "admin") return true; // admins always have full access, no locked rooms
  if (!isPaidLevel(level)) return true; // A1 (or anything else) — free

  return hasPlatformSubscription(userId);
}

export async function hasPlatformSubscription(userId: string, role?: string): Promise<boolean> {
  if (!PAYWALL_ENABLED) return true;
  if (role === "admin") return true;
  return hasActivePlatformSubscription(userId);
}

export async function hasActivePlatformSubscription(userId: string): Promise<boolean> {
  const sb = createAdminSupabaseClient();
  const { data, error } = await sb
    .from("platform_subscriptions")
    .select("status,cancel_at_period_end,current_period_end")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[entitlements] platform subscription lookup error:", error.message);
    return false;
  }
  if (!data) return false;
  return subscriptionGrantsAccess({
    status: data.status as StripeSubscriptionStatus,
    cancelAtPeriodEnd: Boolean(data.cancel_at_period_end),
    currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : null,
  });
}

/** Levels the user currently has access to, A1 plus any purchased ones. */
export async function purchasedLevels(userId: string): Promise<Set<string>> {
  const set = new Set<string>(["A1"]);
  if (await hasPlatformSubscription(userId)) {
    for (const level of PAID_LEVELS) set.add(level);
  }
  return set;
}
