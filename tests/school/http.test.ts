import { test } from "node:test";
import { strict as assert } from "node:assert";
import {
  verifiedSchoolIdentity,
  requireSchoolMutationOrigin,
  readSchoolJson,
} from "../../lib/school/http";
const claims = {
  uid: "synthetic",
  email: "synthetic@school.example",
  email_verified: true,
  role: "teacher",
};
test("native bearer and cookie identity both check revocation; teacher claim is not school permission", async () => {
  const calls: unknown[] = [];
  const auth = {
    async verifyIdToken(token: string, revoked: boolean) {
      calls.push(["token", token, revoked]);
      return claims;
    },
    async verifySessionCookie(cookie: string, revoked: boolean) {
      calls.push(["cookie", cookie, revoked]);
      return claims;
    },
  };
  const native = await verifiedSchoolIdentity(
    new Request("http://localhost/api/school", {
      headers: { Authorization: "Bearer synthetic-token" },
    }),
    undefined,
    auth
  );
  const web = await verifiedSchoolIdentity(
    new Request("http://localhost/api/school"),
    "synthetic-cookie",
    auth
  );
  assert.equal(native.id, web.id);
  assert.equal(native.admin, false);
  assert.deepEqual(calls, [
    ["token", "synthetic-token", true],
    ["cookie", "synthetic-cookie", true],
  ]);
});
test("forged, revoked, unverified, absent and malformed credentials fail closed", async () => {
  const auth = {
    async verifyIdToken() {
      throw new Error("revoked token");
    },
    async verifySessionCookie() {
      throw new Error("forged cookie");
    },
  };
  for (const request of [
    new Request("http://localhost/api/school"),
    new Request("http://localhost/api/school", { headers: { Authorization: "Bearer bad" } }),
    new Request("http://localhost/api/school", { headers: { Authorization: "Basic bad" } }),
  ])
    await assert.rejects(verifiedSchoolIdentity(request, "bad", auth));
  const unverified = {
    async verifyIdToken() {
      return { ...claims, email_verified: false };
    },
    async verifySessionCookie() {
      return claims;
    },
  };
  await assert.rejects(
    verifiedSchoolIdentity(
      new Request("http://localhost", { headers: { Authorization: "Bearer no" } }),
      undefined,
      unverified
    )
  );
});
test("cookie mutations enforce same-origin; bearer handled by revoked-checked auth", () => {
  assert.throws(() =>
    requireSchoolMutationOrigin(
      new Request("https://school.example/api/school", { method: "POST" })
    )
  );
  assert.throws(() =>
    requireSchoolMutationOrigin(
      new Request("https://school.example/api/school", {
        method: "POST",
        headers: { Origin: "https://attacker.example" },
      })
    )
  );
  requireSchoolMutationOrigin(
    new Request("https://school.example/api/school", {
      method: "POST",
      headers: { Origin: "https://school.example" },
    })
  );
  requireSchoolMutationOrigin(
    new Request("https://school.example/api/school", {
      method: "POST",
      headers: { Authorization: "Bearer checked-by-auth" },
    })
  );
});
test("JSON reader enforces streamed byte limit even without content-length and rejects malformed JSON", async () => {
  const request = new Request("http://localhost", {
    method: "POST",
    body: JSON.stringify({ action: "chat.read", classId: "test" }),
  });
  assert.deepEqual(await readSchoolJson(request), { action: "chat.read", classId: "test" });
  await assert.rejects(
    readSchoolJson(new Request("http://localhost", { method: "POST", body: "[" }))
  );
  await assert.rejects(
    readSchoolJson(new Request("http://localhost", { method: "POST", body: "x".repeat(100001) }))
  );
});
