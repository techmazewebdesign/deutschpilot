import assert from "node:assert/strict";
import { test } from "node:test";
import { displayText, displayHtml } from "../lib/displayText";

test("formats editorial punctuation while preserving spelling and identifiers", () => {
  assert.equal(displayText("Deutsch lernen — jeden Tag"), "Deutsch lernen: jeden Tag");
  assert.equal(displayText("A1–C1"), "A1 bis C1");
  assert.equal(displayText("E-Mail, KI-Feedback, 2026-11-01"), "E-Mail, KI-Feedback, 2026-11-01");
  assert.equal(displayText(null), "");
});

test("formats visible lesson HTML without changing links or attributes", () => {
  assert.equal(displayHtml('<p data-note="A–B">Lernen — üben <a href="/a-b">A1–C1</a></p>'), '<p data-note="A–B">Lernen: üben <a href="/a-b">A1 bis C1</a></p>');
});
