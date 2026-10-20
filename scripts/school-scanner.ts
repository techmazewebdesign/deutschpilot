/** Trusted ClamAV adapter. Run behind a TLS reverse proxy; never expose plain HTTP publicly.
 * SCHOOL_SCANNER_TOKEN and CLAMAV_HOST required; CLAMAV_PORT defaults 3310.
 * node --import tsx scripts/school-scanner.ts ; app SCHOOL_SCANNER_URL=https://.../scan
 */
import { assertClamAvFresh } from "../lib/school/scanner-health";
import { createServer } from "node:http";
import { connect } from "node:net";
import { createHash, timingSafeEqual } from "node:crypto";
const token = process.env.SCHOOL_SCANNER_TOKEN;
const host = process.env.CLAMAV_HOST;
if (!token || !host) throw new Error("SCHOOL_SCANNER_TOKEN and CLAMAV_HOST required");
function same(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
async function scan(bytes: Buffer): Promise<"clean" | "rejected"> {
  return new Promise((resolve, reject) => {
    const socket = connect(Number(process.env.CLAMAV_PORT || 3310), host);
    let result = "";
    socket.setTimeout(15000, () => socket.destroy(new Error("Scanner timeout")));
    socket.on("error", reject);
    socket.on("data", (b) => {
      result += b.toString();
      if (result.length > 4096) socket.destroy(new Error("Invalid scanner response"));
    });
    socket.on("end", () => {
      if (/: OK\x00?$/.test(result.trim())) resolve("clean");
      else if (/ FOUND\x00?$/.test(result.trim())) resolve("rejected");
      else reject(new Error("Scanner failed"));
    });
    socket.on("connect", () => {
      socket.write("zINSTREAM\0");
      for (let offset = 0; offset < bytes.length; offset += 65536) {
        const chunk = bytes.subarray(offset, offset + 65536);
        const length = Buffer.alloc(4);
        length.writeUInt32BE(chunk.length);
        socket.write(length);
        socket.write(chunk);
      }
      socket.write(Buffer.alloc(4));
    });
  });
}
createServer(async (req, res) => {
  try {
    if (
      req.method !== "POST" ||
      req.url !== "/scan" ||
      !same(String(req.headers.authorization || ""), `Bearer ${token}`)
    ) {
      res.writeHead(403).end();
      return;
    }
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 10 * 1024 * 1024) {
        res.writeHead(413).end();
        return;
      }
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);
    const sha256 = createHash("sha256").update(body).digest("hex");
    if (req.headers["x-content-sha256"] !== sha256) {
      res.writeHead(400).end();
      return;
    }
    await assertClamAvFresh(
      host,
      Number(process.env.CLAMAV_PORT || 3310),
      Date.now(),
      Number(process.env.SCHOOL_SCANNER_MAX_SIGNATURE_AGE_HOURS || 72)
    );
    const verdict = await scan(body);
    res
      .writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" })
      .end(JSON.stringify({ sha256, verdict }));
  } catch {
    res.writeHead(503).end(JSON.stringify({ error: "Scanner unavailable" }));
  }
}).listen(Number(process.env.SCHOOL_SCANNER_PORT || 3311), "127.0.0.1", () =>
  process.stdout.write("School scanner listening on loopback; TLS proxy required\n")
);
