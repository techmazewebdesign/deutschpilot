import test from "node:test";
import assert from "node:assert/strict";
import { isGermanPaidEnrollmentAllowed, isGermanPaidEnrollmentBlocked, isGermanPaidEnrollmentRequest, localeFromReferer, normalizeCheckoutLocale } from "./fernusg";

test("German paid enrollment is fail-closed unless explicitly enabled", () => {
  delete process.env.DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_ALLOWED;
  delete process.env.DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_APPROVAL_REFERENCE;
  assert.equal(isGermanPaidEnrollmentBlocked(), true);
  process.env.DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_ALLOWED = "true";
  assert.equal(isGermanPaidEnrollmentAllowed(), false);
  process.env.DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_APPROVAL_REFERENCE = "Counsel memo 2026-09-14";
  assert.equal(isGermanPaidEnrollmentAllowed(), true);
  assert.equal(isGermanPaidEnrollmentBlocked(), false);
  delete process.env.DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_ALLOWED;
  delete process.env.DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_APPROVAL_REFERENCE;
});

test("checkout locale only accepts supported locales", () => {
  assert.equal(normalizeCheckoutLocale("de"), "de");
  assert.equal(normalizeCheckoutLocale("fr"), null);
  assert.equal(localeFromReferer("https://www.deutschpilot.de/de/profile"), "de");
  assert.equal(localeFromReferer("https://www.deutschpilot.de/en/profile"), "en");
  assert.equal(localeFromReferer("https://www.deutschpilot.de/profile"), null);
});

test("German enrollment hold covers the German flow and users located in Germany", () => {
  assert.equal(isGermanPaidEnrollmentRequest("de", "US"), true);
  assert.equal(isGermanPaidEnrollmentRequest("en", "DE"), true);
  assert.equal(isGermanPaidEnrollmentRequest("en", "US"), false);
});
