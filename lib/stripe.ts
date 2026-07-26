import Stripe from "stripe";
import type { PaidLevel } from "./entitlements";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-04-10",
  typescript: true,
});

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
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: { userId, level },
  });
}
