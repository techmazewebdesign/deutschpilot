import assert from "node:assert/strict";
import test from "node:test";

process.env.STRIPE_SECRET_KEY = "test_key_placeholder";
const stripeModule = import("./stripe");

test("Checkout binds Firebase identity to both session and subscription", async () => {
  const { buildPlatformSubscriptionCheckoutParams } = await stripeModule;
  const params = buildPlatformSubscriptionCheckoutParams({
    priceId: "price_test", userId: "firebase_uid", email: "learner@example.test", locale: "de",
    successUrl: "https://example.test/success", cancelUrl: "https://example.test/cancel", automaticTax: false,
  });
  assert.equal(params.mode, "subscription");
  assert.equal(params.client_reference_id, "firebase_uid");
  assert.equal(params.metadata?.userId, "firebase_uid");
  assert.equal(params.subscription_data?.metadata?.userId, "firebase_uid");
  assert.equal(params.subscription_data?.metadata?.product, "deutschpilot_all_access");
  assert.equal(params.consent_collection?.terms_of_service, "required");
});

test("Checkout leaves dynamic payment methods to Stripe and tax launch-gated", async () => {
  const { buildPlatformSubscriptionCheckoutParams } = await stripeModule;
  const params = buildPlatformSubscriptionCheckoutParams({
    priceId: "price_test", userId: "uid", email: "learner@example.test", locale: "en",
    successUrl: "https://example.test/success", cancelUrl: "https://example.test/cancel", automaticTax: false,
  });
  assert.equal(params.payment_method_types, undefined);
  assert.deepEqual(params.automatic_tax, { enabled: false });
  assert.equal(params.billing_address_collection, "required");
});
