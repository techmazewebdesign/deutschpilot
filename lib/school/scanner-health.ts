import { connect } from "node:net";
export function assertFreshSignatureVersion(version: string, now = Date.now(), maxAgeHours = 72) {
  const timestamp = version.replace(/\0/g, "").trim().split("/").at(-1);
  const builtAt = Date.parse(`${timestamp} UTC`);
  if (
    !version.startsWith("ClamAV ") ||
    !Number.isFinite(builtAt) ||
    builtAt > now ||
    now - builtAt > Math.min(maxAgeHours, 72) * 3600000 ||
    !Number.isFinite(maxAgeHours) ||
    maxAgeHours <= 0
  )
    throw new Error("ClamAV signatures are stale, invalid or in the future");
  return builtAt;
}
const cache = new Map<string, { version: string; checkedAt: number }>();
export async function assertClamAvFresh(
  host: string,
  port: number,
  now = Date.now(),
  maxAgeHours = 72
) {
  const key = `${host}:${port}`;
  const cached = cache.get(key);
  if (cached && now >= cached.checkedAt && now - cached.checkedAt < 30000) {
    assertFreshSignatureVersion(cached.version, now, maxAgeHours);
    return cached.version;
  }
  const version = await new Promise<string>((resolve, reject) => {
    const socket = connect(port, host);
    let result = "";
    socket.setTimeout(3000, () => socket.destroy(new Error("ClamAV health timeout")));
    socket.on("error", reject);
    socket.on("connect", () => socket.write("zVERSION\0"));
    socket.on("data", (chunk) => {
      result += chunk.toString();
      if (result.length > 4096) {
        socket.destroy(new Error("Invalid health reply"));
        return;
      }
      if (result.includes("\0")) {
        socket.end();
        resolve(result);
      }
    });
    socket.on("end", () => resolve(result));
  });
  assertFreshSignatureVersion(version, now, maxAgeHours);
  cache.set(key, { version, checkedAt: now });
  return version;
}
