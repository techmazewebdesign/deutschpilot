#!/usr/bin/env node
/** Portable source only. Never packages application configuration or deployment artifacts. */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  lstatSync,
  readFileSync,
  realpathSync,
  mkdirSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exact = new Set([
  "scripts/package-school-module.mjs",
  "scripts/school-scanner.ts",
  "scripts/school-check-activation.ts",
  "scripts/school-import-aggregate.ts",
  "scripts/school-README.md",
  "lib/learningProgressClient.ts",
  "app/api/learning/progress/route.ts",
  "supabase/migration-school-platform.sql",
  "supabase/migration-legacy-private-access.sql",
  "tests/learning-progress.test.ts",
  "mobile/src/SchoolRegression.test.cjs",
  "docs/school-platform/BUILD_RECORD.md",
  "docs/school-platform/PORTING_GUIDE.md",
]);
export function allowed(path) {
  if (
    typeof path !== "string" ||
    path.includes("\\") ||
    path.startsWith("/") ||
    path.split("/").some((x) => x === ".." || x === "." || !x)
  )
    return false;
  if (
    /(^|\/)(node_modules|\.git|dist[^/]*|build[^/]*)\//i.test(path) ||
    /(^|\/)(\.env[^/]*|GoogleService-Info[^/]*|firebase-config[^/]*)(\/|$)/i.test(path) ||
    /\.(p12|p8|pem|key|mobileprovision|ipa|aab|apk|log|jsonl|sqlite|db)$/i.test(path)
  )
    return false;
  if (exact.has(path)) return true;
  if (
    /^(lib\/school|app\/api\/school|components\/school|app\/\[locale\]\/school)\/.+\.(ts|tsx|css)$/.test(
      path
    )
  )
    return true;
  if (/^tests\/school\/.+\.(ts|cjs|sql)$/.test(path)) return true;
  return /^mobile\/src\/School[A-Za-z0-9]*\.(ts|tsx|cjs)$/.test(path);
}
function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}
function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
function tar(entries, mtime) {
  const blocks = [];
  for (const { path, bytes } of entries) {
    const name = `school-module/${path}`;
    if (Buffer.byteLength(name) > 100) throw new Error(`Archive path too long: ${path}`);
    const h = Buffer.alloc(512);
    h.write(name, 0, 100);
    h.write("0000644\0", 100, 8);
    h.write("0000000\0", 108, 8);
    h.write("0000000\0", 116, 8);
    h.write(bytes.length.toString(8).padStart(11, "0") + "\0", 124, 12);
    h.write(mtime.toString(8).padStart(11, "0") + "\0", 136, 12);
    h.fill(32, 148, 156);
    h.write("0", 156, 1);
    h.write("ustar\0", 257, 6);
    h.write("00", 263, 2);
    const sum = h.reduce((a, b) => a + b, 0);
    h.write(sum.toString(8).padStart(6, "0") + "\0 ", 148, 8);
    blocks.push(h, bytes, Buffer.alloc((512 - (bytes.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return Buffer.concat(blocks);
}
function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const selfTest = args.includes("--self-test");
  if (
    args.some(
      (arg, i) =>
        !["--check", "--self-test", "--output-dir"].includes(arg) && args[i - 1] !== "--output-dir"
    )
  )
    throw new Error("Allowed arguments: --check, --self-test, --output-dir DIRECTORY");
  if (selfTest) {
    for (const path of [
      ".env",
      "lib/school/.env.local",
      "mobile/src/firebase-config.ts",
      "mobile/src/SchoolSecrets.p12",
      "lib/school/../../.env",
      "../lib/school/server.ts",
      "node_modules/example.ts",
      "lib/school/node_modules/x.ts",
      "docs/verification-school-2026-10-20/real-records.json",
      "app/[locale]/layout.tsx",
    ])
      assert.equal(allowed(path), false, path);
    for (const path of [
      "lib/school/server.ts",
      "components/school/school.css",
      "app/api/school/route.ts",
      "mobile/src/SchoolPortal.tsx",
      "supabase/migration-school-platform.sql",
    ])
      assert.equal(allowed(path), true, path);
    console.log("Allowlist self-test passed");
    if (!check) return;
  }
  const sourceCommit = git("rev-parse", "HEAD");
  const dirty = git("status", "--porcelain").length > 0;
  const paths = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: root }
  )
    .toString()
    .split("\0")
    .filter(Boolean)
    .filter(allowed)
    .sort();
  const entries = paths.map((path) => {
    const absolute = resolve(root, path);
    if (!existsSync(absolute)) throw new Error(`Source missing: ${path}`);
    for (let target = absolute; target !== root; target = dirname(target)) {
      if (lstatSync(target).isSymbolicLink()) throw new Error(`Symlink rejected: ${path}`);
    }
    if (!lstatSync(absolute).isFile()) throw new Error(`Not a regular file: ${path}`);
    const bytes = readFileSync(absolute);
    if (/-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/.test(bytes.toString("utf8")))
      throw new Error(`Private key material rejected: ${path}`);
    return { path, bytes };
  });
  const manifest = {
    format: "school-module-source-v1",
    sourceCommit,
    dirty,
    sourceCommitTime: git("show", "-s", "--format=%cI", "HEAD"),
    certifiedOrProductionVerified: false,
    exclusions:
      "No environments, credentials, configuration identities, real records, binaries, dependencies or host application checkout.",
    files: entries.map((e) => ({ path: e.path, size: e.bytes.length, sha256: hash(e.bytes) })),
  };
  if (check) {
    console.log(JSON.stringify({ mode: "check-only-no-archive", ...manifest }, null, 2));
    return;
  }
  if (dirty)
    throw new Error(
      "Archive refused: commit and review the complete source first. --check may inspect a dirty tree."
    );
  const index = args.indexOf("--output-dir");
  if (index < 0 || !args[index + 1])
    throw new Error("Explicit --output-dir beneath Documents required");
  const documents = realpathSync(resolve(homedir(), "Documents"));
  const output = resolve(args[index + 1]);
  const rel = relative(documents, output);
  if (output === root || output.startsWith(root + sep))
    throw new Error("Package output must be outside the source checkout");
  if (!rel || rel.startsWith(".." + sep) || rel === ".." || rel.startsWith(sep))
    throw new Error("Output must be a subdirectory of Documents");
  let ancestor = output;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  if (!realpathSync(ancestor).startsWith(documents + sep) && realpathSync(ancestor) !== documents)
    throw new Error("Output symlink leaves Documents");
  mkdirSync(output, { recursive: true });
  if (realpathSync(output) !== output) throw new Error("Output symlink rejected");
  const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + "\n");
  const archive = gzipSync(
    tar(
      [...entries, { path: "MANIFEST.json", bytes: manifestBytes }],
      Number(git("show", "-s", "--format=%ct", "HEAD"))
    ),
    { level: 9 }
  );
  const stem = `school-module-${sourceCommit.slice(0, 12)}`;
  const destination = resolve(output, `${stem}.tar.gz`);
  for (const target of [
    destination,
    resolve(output, `${stem}.manifest.json`),
    resolve(output, `${stem}.sha256`),
  ])
    if (existsSync(target)) throw new Error("Package destination already exists");
  writeFileSync(destination, archive, { flag: "wx" });
  writeFileSync(resolve(output, `${stem}.manifest.json`), manifestBytes, { flag: "wx" });
  writeFileSync(resolve(output, `${stem}.sha256`), `${hash(archive)}  ${stem}.tar.gz\n`, {
    flag: "wx",
  });
  console.log(
    JSON.stringify(
      { archive: destination, sha256: hash(archive), files: entries.length, sourceCommit, dirty },
      null,
      2
    )
  );
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
