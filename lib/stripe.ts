import Stripe from "stripe";
import type { PaidLevel } from "./entitlements";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-07-29.dahlia",
  typescript: true,
});

export function platformSubscriptionPriceId(): string | null {
  return process.env.STRIPE_PRICE_SUBSCRIPTION ?? null;
}

export function buildPlatformSubscriptionCheckoutParams({
  priceId, userId, email, locale, successUrl, cancelUrl, automaticTax,
}: {
  priceId: string;
  userId: string;
  email: string;
  locale: "de" | "en";
  successUrl: string;
  cancelUrl: string;
  automaticTax: boolean;
}): Stripe.Checkout.SessionCreateParams {
  const metadata = { userId, product: "deutschpilot_all_access", withdrawalConsent: "immediate_access_requested" };
  return {
    mode: "subscription",
    integration_identifier: "deutschpilot_web_qtzmxkpa",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    client_reference_id: userId,
    metadata,
    subscription_data: { metadata },
    billing_address_collection: "required",
    automatic_tax: { enabled: automaticTax },
    allow_promotion_codes: true,
    locale,
    success_url: successUrl,
    cancel_url: cancelUrl,
    consent_collection: { terms_of_service: "required" },
    custom_text: {
      submit: {
        message: locale === "de"
          ? "Mit der Zahlung verlangst du den sofortigen Beginn des digitalen Zugangs. Gesetzliche Widerrufsrechte bleiben nach Maßgabe der Widerrufsbelehrung bestehen."
          : "By paying, you request immediate digital access. Statutory withdrawal rights remain as described in the withdrawal notice.",
      },
    },
  };
}

export async function createPlatformSubscriptionCheckout({ userId, email, locale, successUrl, cancelUrl }: {
  userId: string;
  email: string;
  locale: "de" | "en";
  successUrl: string;
  cancelUrl: string;
}) {
  const priceId = platformSubscriptionPriceId();
  if (!priceId) throw new Error("STRIPE_PRICE_SUBSCRIPTION is not configured.");
  return stripe.checkout.sessions.create(buildPlatformSubscriptionCheckoutParams({
    priceId, userId, email, locale, successUrl, cancelUrl,
    automaticTax: process.env.STRIPE_TAX_ENABLED === "true",
  }));
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
}

// Static process.env.X reads (not a dynamic map) so each var name is
// greppable and each is genuinely optional until Rooz creates the
// matching Stripe Product/Price and sets it.
const LEVEL_PRICE_ENV: Record<PaidLevel, string | undefined> = {
  A2: process.env.STRIPE_PRICE_A2,
  B1: process.env.STRIPE_PRICE_B1,
  B2: process.env.STRIPE_PRICE_B2,
  C1: process.env.STRIPE_PRICE_C1,
};

export function priceIdForLevel(level: PaidLevel): string | null {
  return LEVEL_PRICE_ENV[level] ?? null;
}

export type AITrainerBillingMode = "subscription" | "payment";

export function aiTrainerBillingMode(): AITrainerBillingMode {
  return process.env.AI_TRAINER_BILLING_MODE === "payment" ? "payment" : "subscription";
}

export function aiTrainerPriceId(): string | null {
  return process.env.STRIPE_PRICE_AI_TRAINER ?? null;
}

export async function createLevelCheckoutSession({
  level,
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  level: PaidLevel;
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: { userId, level },
  });
}

export async function createAITrainerCheckoutSession({
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const mode = aiTrainerBillingMode();
  const metadata = {
    userId,
    product: "ai_trainer",
    billingMode: mode,
  };

  return stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata,
    ...(mode === "subscription" ? { subscription_data: { metadata } } : {}),
  });
}
