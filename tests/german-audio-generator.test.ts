import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

function run(source: unknown, extra: string[] = []) {
  const directory = mkdtempSync(join(tmpdir(), "deutschpilot-voice-test-"));
  const filename = join(directory, "source.json");
  writeFileSync(filename, JSON.stringify(source));
  try {
    return spawnSync(process.execPath, [
      resolve("node_modules/tsx/dist/cli.mjs"),
      resolve("scripts/generate-german-audio.ts"),
      "--source", filename, ...extra,
    ], { encoding: "utf8", env: { PATH: process.env.PATH, NODE_ENV: "test" }, timeout: 10000 });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("dry run needs no provider credentials and deduplicates equivalent input", () => {
  const result = run([{ text: "die Äpfel" }, { text: " die A\u0308pfel\n", speaker: "female" }]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { mode: "dry-run", entries: 1, characters: 9, trialLimit: 8000 });
  assert.equal(result.stderr, "");
});

test("oversized and invalid source is rejected before authentication or network access", () => {
  for (const source of [
    [{ text: "Wort", speaker: "other" }],
    [{ text: " " }],
    [{ text: "ü".repeat(2100) }],
    Array.from({ length: 9 }, (_, i) => ({ text: String(i) + "a".repeat(1000) })),
  ]) {
    const result = run(source, ["--generate"]);
    assert.equal(result.status, 1);
    assert.doesNotMatch(result.stderr, /HTTP|authentication|credentials/);
  }
});

test("generation fails closed without the confirmed Cloud project", () => {
  const result = run([{ text: "Guten Tag!" }], ["--generate"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /confirmed GOOGLE_CLOUD_PROJECT/);
});
