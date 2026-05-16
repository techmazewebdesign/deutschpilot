import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-04-10",
  typescript: true,
});

export async function createCheckoutSession({
  priceId,
  userId,
  courseId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  courseId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      courseId,
    },
  });
}
