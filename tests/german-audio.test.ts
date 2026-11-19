import assert from "node:assert/strict";
import test from "node:test";
import { findGermanAudio, normalizeGermanText, parseGermanAudioManifest } from "../lib/german-audio";

const entry = { text: "die Äpfel", speaker: "female" as const, voice: "de-DE-Wavenet-A", src: "/audio/de/" + "a".repeat(64) + ".mp3" };

test("matches equivalent Unicode and whitespace without changing German pronunciation", () => {
  const manifest = parseGermanAudioManifest({ version: 1, entries: [entry] });
  assert.equal(findGermanAudio(manifest, "  die A\u0308pfel\n")?.src, entry.src);
  assert.equal(findGermanAudio(manifest, "die Apfel"), null);
  assert.equal(findGermanAudio(manifest, "die Äpfel", "male"), null);
  assert.equal(normalizeGermanText("Sie heißen Weiß."), "Sie heißen Weiß.");
});

test("rejects external audio, path traversal, and invalid voices", () => {
  for (const patch of [
    { src: "https://example.com/audio.mp3" },
    { src: "/audio/de/../../private.mp3" },
    { voice: "en-US-Wavenet-A" },
    { speaker: "unknown" },
    { text: " " },
  ]) assert.throws(() => parseGermanAudioManifest({ version: 1, entries: [{ ...entry, ...patch }] }));
});

test("an unpublished or missing recording never produces a playable URL", () => {
  assert.equal(findGermanAudio({ version: 1, entries: [] }, "die Bewerbung"), null);
  assert.throws(() => parseGermanAudioManifest({ version: 2, entries: [entry] }));
});
