import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
const token = "synthetic-local-scanner-token-only-1234567890";
async function adapter(version: string) {
  let versions = 0,
    streams = 0;
  const clamd = createServer((socket) =>
    socket.on("data", (chunk) => {
      if (chunk.toString().startsWith("zVERSION")) {
        versions++;
        socket.end(version + "\0");
      } else {
        streams++;
        socket.end("stream: OK\0");
      }
    })
  );
  await new Promise<void>((resolve) => clamd.listen(0, "127.0.0.1", resolve));
  const clamPort = (clamd.address() as { port: number }).port;
  const probe = createServer();
  await new Promise<void>((resolve) => probe.listen(0, "127.0.0.1", resolve));
  const port = (probe.address() as { port: number }).port;
  await new Promise<void>((resolve) => probe.close(() => resolve()));
  const child = spawn(
    process.execPath,
    [createRequire(import.meta.url).resolve("tsx/cli"), "scripts/school-scanner.ts"],
    {
      cwd: process.cwd(),
      env: {
        NODE_ENV: "test",
        PATH: process.env.PATH,
        SCHOOL_SCANNER_TOKEN: token,
        CLAMAV_HOST: "127.0.0.1",
        CLAMAV_PORT: String(clamPort),
        SCHOOL_SCANNER_PORT: String(port),
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  const closed = new Promise<void>((resolve) => child.on("close", () => resolve()));
  let timer: ReturnType<typeof setTimeout>;
  try {
    await new Promise<void>((resolve, reject) => {
      timer = setTimeout(() => reject(Error("Scanner startup timeout")), 10000);
      child.stdout.on("data", () => resolve());
      child.on("exit", () => reject(Error("Scanner exited before startup")));
    });
  } catch (e) {
    child.kill();
    await closed;
    clamd.close();
    throw e;
  } finally {
    clearTimeout(timer!);
  }
  const body = Buffer.from("%PDF-1.7 synthetic scanner test");
  return {
    counts: () => ({ versions, streams }),
    request: (auth = true, hash = true) =>
      fetch(`http://127.0.0.1:${port}/scan`, {
        method: "POST",
        headers: {
          ...(auth ? { Authorization: `Bearer ${token}` } : {}),
          "X-Content-SHA256": hash ? createHash("sha256").update(body).digest("hex") : "bad",
        },
        body,
      }),
    async close() {
      child.kill();
      await closed;
      await new Promise<void>((resolve) => clamd.close(() => resolve()));
    },
  };
}
test("actual loopback adapter rejects auth and hash before contacting clamd", async () => {
  const h = await adapter("ClamAV invalid");
  try {
    assert.equal((await h.request(false)).status, 403);
    assert.equal((await h.request(true, false)).status, 400);
    assert.deepEqual(h.counts(), { versions: 0, streams: 0 });
  } finally {
    await h.close();
  }
});
test("actual loopback adapter never scans or returns clean for stale/future/invalid signatures", async () => {
  for (const version of [
    "ClamAV 1.5.4/1/Tue Oct 20 00:00:00 2020",
    "ClamAV 1.5.4/1/Tue Oct 20 00:00:00 2099",
    "ClamAV invalid",
  ]) {
    const h = await adapter(version);
    try {
      assert.equal((await h.request()).status, 503);
      assert.deepEqual(h.counts(), { versions: 1, streams: 0 });
    } finally {
      await h.close();
    }
  }
});
