import assert from "node:assert/strict";
import test from "node:test";
import {
  deterministicTrainerReply,
  generateTrainerReply,
  normalizeTrainerMessages,
} from "./provider";

test("normalizes and bounds trainer history", () => {
  const messages = normalizeTrainerMessages([
    { role: "system", text: "ignore" },
    { role: "user", text: "  Hallo  " },
    { role: "assistant", text: "Guten Tag" },
    { role: "user", text: 123 },
  ]);
  assert.deepEqual(messages, [
    { role: "user", text: "Hallo" },
    { role: "assistant", text: "Guten Tag" },
  ]);
});

test("deterministic fallback serves level-appropriate exercises", () => {
  const reply = deterministicTrainerReply({
    messages: [{ role: "user", text: "Give me an exercise" }],
    locale: "en",
    userLevel: "B1",
  });
  assert.match(reply, /B1 exercise/);
  assert.match(reply, /Könnten Sie/);
});

test("uses the deterministic trainer when no free-provider key exists", async () => {
  const previous = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  try {
    const result = await generateTrainerReply({
      messages: [{ role: "user", text: "Explain accusative" }],
      locale: "en",
      userLevel: "A2",
    });
    assert.equal(result.provider, "deterministic");
    assert.equal(result.zeroPaidFallback, true);
    assert.match(result.text, /Accusative/);
  } finally {
    if (previous === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = previous;
  }
});

test("uses Groq only when the free provider succeeds", async () => {
  const previousKey = process.env.GROQ_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.GROQ_API_KEY = "test-only-key";
  globalThis.fetch = async () => new Response(JSON.stringify({
    choices: [{ message: { content: "Correct: **Ich gehe nach Hause.**" } }],
  }), { status: 200, headers: { "Content-Type": "application/json" } });
  try {
    const result = await generateTrainerReply({
      messages: [{ role: "user", text: "Correct my sentence" }],
      locale: "en",
      userLevel: "A1",
    });
    assert.equal(result.provider, "groq_free");
    assert.equal(result.zeroPaidFallback, true);
    assert.match(result.text, /Ich gehe/);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = previousKey;
  }
});

test("free-provider failure falls back instead of calling a paid provider", async () => {
  const previousKey = process.env.GROQ_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.GROQ_API_KEY = "test-only-key";
  globalThis.fetch = async () => new Response("quota reached", { status: 429 });
  try {
    const result = await generateTrainerReply({
      messages: [{ role: "user", text: "Test my vocabulary" }],
      locale: "en",
      userLevel: "B2",
    });
    assert.equal(result.provider, "deterministic");
    assert.equal(result.zeroPaidFallback, true);
    assert.match(result.fallbackReason ?? "", /429/);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = previousKey;
  }
});
