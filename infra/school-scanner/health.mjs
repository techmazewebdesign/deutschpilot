// Authenticated byte/hash/ClamAV-freshness end-to-end probe; never logs token or body.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
try {
  const token = readFileSync(process.env.SCHOOL_SCANNER_TOKEN_FILE, "utf8").trim();
  const body = Buffer.from("%PDF-1.7 synthetic scanner health probe");
  const sha256 = createHash("sha256").update(body).digest("hex");
  const r = await fetch("http://127.0.0.1:3311/scan", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "X-Content-SHA256": sha256 },
    body,
    signal: AbortSignal.timeout(20000),
    redirect: "error",
  });
  const result = r.ok ? await r.json() : null;
  if (!r.ok || result?.verdict !== "clean" || result?.sha256 !== sha256) process.exitCode = 1;
} catch {
  process.exitCode = 1;
}
