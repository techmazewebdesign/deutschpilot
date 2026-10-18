/**
 * entitlements.ts — server-only. Answers "can this user access this level?"
 *
 * A1 is always free. A2/B1/B2/C1 require a 'completed' row in
 * public.purchases for that user_id + level (written only by the Stripe
 * webhook — see app/api/webhooks/stripe/route.ts).
 */
import { createAdminSupabaseClient } from "./supabaseAdmin";

export type PaidLevel = "A2" | "B1" | "B2" | "C1";
export const PAID_LEVELS: PaidLevel[] = ["A2", "B1", "B2", "C1"];

export function isPaidLevel(level: string): level is PaidLevel {
  return (PAID_LEVELS as string[]).includes(level);
}

// Standard accounts are intentionally limited to A1. Set PAYWALL_ENABLED=false
// only for a controlled preview where all levels must remain open.
const PAYWALL_ENABLED = process.env.PAYWALL_ENABLED !== "false";

export async function hasFullAccess(userId: string): Promise<boolean> {
  const sb = createAdminSupabaseClient();
  const { data, error } = await sb
    .from("access_grants")
    .select("id")
    .eq("user_id", userId)
    .eq("access_tier", "full")
    .eq("status", "active")
    .gt("ends_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("[entitlements] full-access lookup error:", error.message);
    return false;
  }
  return !!data;
}

export async function hasLevelAccess(userId: string, level: string, role?: string): Promise<boolean> {
  if (!PAYWALL_ENABLED) return true;
  if (role === "admin") return true; // admins always have full access, no locked rooms
  if (!isPaidLevel(level)) return true; // A1 (or anything else) — free

  if (await hasFullAccess(userId)) return true;

  const sb = createAdminSupabaseClient();
  const { data, error } = await sb
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("level", level)
    .eq("status", "completed")
    .maybeSingle();

  if (error) {
    console.error("[entitlements] hasLevelAccess lookup error:", error.message);
    return false; // fail closed — never grant access on a DB error
  }
  return !!data;
}

/** Levels the user currently has access to, A1 plus any purchased ones. */
export async function purchasedLevels(userId: string): Promise<Set<string>> {
  const sb = createAdminSupabaseClient();
  const { data, error } = await sb
    .from("purchases")
    .select("level")
    .eq("user_id", userId)
    .eq("status", "completed");

  const set = new Set<string>(["A1"]);
  if (error) {
    console.error("[entitlements] purchasedLevels lookup error:", error.message);
    return set;
  }
  for (const row of data ?? []) set.add((row as { level: string }).level);
  return set;
}
