import type { SessionUser } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export type AITrainerAccessTier = "admin" | "launch_free" | "preview" | "premium";

export type AITrainerAccess = {
  tier: AITrainerAccessTier;
  dailyLimit: number;
  paidAccessEnabled: boolean;
  checkoutAvailable: boolean;
  premium: boolean;
};

function boundedPositiveInt(value: string | undefined, fallback: number, max: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

export function trainerAccessConfig() {
  const paidAccessEnabled = process.env.AI_TRAINER_PAID_ENABLED === "true";
  return {
    paidAccessEnabled,
    checkoutAvailable: paidAccessEnabled
      && Boolean(process.env.STRIPE_SECRET_KEY)
      && Boolean(process.env.STRIPE_PRICE_AI_TRAINER),
    previewDailyLimit: boundedPositiveInt(process.env.AI_TRAINER_PREVIEW_DAILY_LIMIT, 5, 100),
    premiumDailyLimit: boundedPositiveInt(process.env.AI_TRAINER_PREMIUM_DAILY_LIMIT, 30, 500),
    launchDailyLimit: boundedPositiveInt(process.env.AI_TRAINER_LAUNCH_DAILY_LIMIT, 20, 100),
    adminDailyLimit: boundedPositiveInt(process.env.AI_TRAINER_ADMIN_DAILY_LIMIT, 50, 500),
  };
}

export async function getAITrainerAccess(user: SessionUser): Promise<AITrainerAccess> {
  const config = trainerAccessConfig();
  if (user.role === "admin") {
    return {
      tier: "admin",
      dailyLimit: config.adminDailyLimit,
      paidAccessEnabled: config.paidAccessEnabled,
      checkoutAvailable: config.checkoutAvailable,
      premium: true,
    };
  }

  // Launch-safe default: until the owner explicitly enables paid access,
  // every signed-in learner keeps the current trainer experience.
  if (!config.paidAccessEnabled) {
    return {
      tier: "launch_free",
      dailyLimit: config.launchDailyLimit,
      paidAccessEnabled: false,
      checkoutAvailable: false,
      premium: true,
    };
  }

  try {
    const supabase = createAdminSupabaseClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("ai_trainer_entitlements")
      .select("status,current_period_end")
      .eq("user_id", user.id)
      .eq("status", "active")
      .or(`current_period_end.is.null,current_period_end.gt.${now}`)
      .maybeSingle();

    if (!error && data) {
      return {
        tier: "premium",
        dailyLimit: config.premiumDailyLimit,
        paidAccessEnabled: true,
        checkoutAvailable: config.checkoutAvailable,
        premium: true,
      };
    }
  } catch (error) {
    console.error("[ai-trainer-access] Entitlement lookup failed:", error instanceof Error ? error.message : String(error));
  }

  // Missing table, unavailable database, or no entitlement all fail to the
  // bounded preview—not to premium access and not to a broken page.
  return {
    tier: "preview",
    dailyLimit: config.previewDailyLimit,
    paidAccessEnabled: true,
    checkoutAvailable: config.checkoutAvailable,
    premium: false,
  };
}
