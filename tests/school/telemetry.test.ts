import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
const requireLocal = createRequire(import.meta.url);
const ts = requireLocal("typescript");
test("production DSN never enables school rollout telemetry or imports a capture SDK", async () => {
  for (const path of [
    "../../instrumentation.ts",
    "../../sentry.client.config.ts",
    "../../sentry.server.config.ts",
    "../../sentry.edge.config.ts",
  ]) {
    let externalImports = 0;
    const exports: Record<string, unknown> = {};
    const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    runInNewContext(code, {
      exports,
      process: {
        env: {
          NODE_ENV: "production",
          NEXT_PUBLIC_SENTRY_DSN: "https://synthetic@errors.invalid/project",
          NEXT_RUNTIME: "nodejs",
        },
      },
      require: () => {
        externalImports++;
        throw new Error("Telemetry import is forbidden before review");
      },
    });
    if (exports.register) await (exports.register as () => Promise<void>)();
    assert.equal(externalImports, 0);
  }
});
