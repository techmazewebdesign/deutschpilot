import assert from "node:assert/strict";
import test from "node:test";
import { subscriptionGrantsAccess } from "./subscription-state";

const now = new Date("2026-08-26T12:00:00.000Z");
const future = new Date("2026-09-26T12:00:00.000Z");
const past = new Date("2026-08-25T12:00:00.000Z");

test("active and trialing subscriptions grant access", () => {
  assert.equal(subscriptionGrantsAccess({ status: "active", cancelAtPeriodEnd: false, currentPeriodEnd: future }, now), true);
  assert.equal(subscriptionGrantsAccess({ status: "trialing", cancelAtPeriodEnd: false, currentPeriodEnd: future }, now), true);
});

test("scheduled cancellation keeps access until period end", () => {
  assert.equal(subscriptionGrantsAccess({ status: "active", cancelAtPeriodEnd: true, currentPeriodEnd: future }, now), true);
  assert.equal(subscriptionGrantsAccess({ status: "active", cancelAtPeriodEnd: true, currentPeriodEnd: past }, now), false);
});

test("failed, incomplete and ended states never grant access", () => {
  for (const status of ["past_due", "canceled", "incomplete", "incomplete_expired", "unpaid", "paused"] as const) {
    assert.equal(subscriptionGrantsAccess({ status, cancelAtPeriodEnd: false, currentPeriodEnd: future }, now), false, status);
  }
});

test("unknown or invalid billing period fails closed", () => {
  assert.equal(subscriptionGrantsAccess({ status: "active", cancelAtPeriodEnd: false, currentPeriodEnd: null }, now), false);
  assert.equal(subscriptionGrantsAccess({ status: "trialing", cancelAtPeriodEnd: false, currentPeriodEnd: new Date("invalid") }, now), false);
});
