import assert from "node:assert/strict";
import test from "node:test";
import { invoiceSubscriptionId, platformSubscriptionRow } from "./subscription-webhook";

test("maps webhook subscription to a server-owned entitlement row", () => {
  const row = platformSubscriptionRow({
    id: "sub_test",
    customer: "cus_test",
    status: "active",
    metadata: { userId: "firebase-user", product: "deutschpilot_all_access" },
    cancel_at_period_end: true,
    canceled_at: null,
    items: { data: [{ current_period_end: 1_800_000_000 }] },
  } as never);
  assert.equal(row.user_id, "firebase-user");
  assert.equal(row.status, "active");
  assert.equal(row.cancel_at_period_end, true);
  assert.equal(row.current_period_end, "2027-01-15T08:00:00.000Z");
});

test("rejects entitlements without an authenticated user binding", () => {
  assert.throws(() => platformSubscriptionRow({
    id: "sub_bad", customer: "cus_test", status: "active", metadata: {}, cancel_at_period_end: false,
    canceled_at: null, items: { data: [] },
  } as never), /missing userId/);
});

test("extracts subscription IDs from current invoice parent shape", () => {
  assert.equal(invoiceSubscriptionId({ parent: { subscription_details: { subscription: "sub_parent" } } } as never), "sub_parent");
});
