import { test } from "node:test";
import { strict as assert } from "node:assert";
import { createServer } from "node:net";
import { assertClamAvFresh, assertFreshSignatureVersion } from "../../lib/school/scanner-health";
const now = Date.parse("2026-10-20T18:00:00Z");
test("signature health rejects stale, future, invalid and disabled-age verdicts", () => {
  assertFreshSignatureVersion("ClamAV 1.5.4/28157/Sun Oct 18 06:24:18 2026", now);
  for (const text of [
    "ClamAV 1.5.4/28157/Fri Oct 16 06:24:18 2026",
    "ClamAV 1.5.4/28157/Wed Oct 21 06:24:18 2026",
    "ClamAV invalid",
    "unknown",
  ])
    assert.throws(() => assertFreshSignatureVersion(text, now));
  assert.throws(() =>
    assertFreshSignatureVersion("ClamAV 1.5.4/28157/Sun Oct 18 06:24:18 2026", now, 0)
  );
});
test("clamd VERSION is queried and short health cache still rechecks signature age", async () => {
  let calls = 0;
  const server = createServer((socket) => {
    socket.on("data", (command) => {
      assert.equal(command.toString(), "zVERSION\0");
      calls++;
      socket.end("ClamAV 1.5.4/28157/Sun Oct 18 06:24:18 2026\0");
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const port = (server.address() as { port: number }).port;
    await assertClamAvFresh("127.0.0.1", port, now);
    await assertClamAvFresh("127.0.0.1", port, now + 1000);
    assert.equal(calls, 1);
    await assert.rejects(assertClamAvFresh("127.0.0.1", port, now + 4 * 86400000));
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
test("unavailable clamd fails closed", async () => {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as { port: number }).port;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await assert.rejects(assertClamAvFresh("127.0.0.1", port, now));
});
