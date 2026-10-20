import { test } from "node:test";
import { strict as assert } from "node:assert";
import {
  createLearningProgressHandler,
  type LearningProgressInput,
  type SchoolSyncStatus,
} from "../lib/learningProgressClient";
import { requireSchoolMutationOrigin, verifiedSchoolIdentity } from "../lib/school/http";

const input: LearningProgressInput = {
  lessonId: "00000000-0000-4000-8000-000000000001",
  courseId: "00000000-0000-4000-8000-000000000002",
  score: 84,
  completed: true,
};
function fixture(
  options: {
    status?: SchoolSyncStatus;
    saveFail?: boolean;
    syncFail?: boolean;
    otherCourse?: boolean;
  } = {}
) {
  const saved: { userId: string; input: LearningProgressInput }[] = [];
  const synced: { uid: string; lessonId: string }[] = [];
  const verifier = {
    verifyIdToken: async (token: string, revoked: boolean) => {
      assert.equal(revoked, true);
      if (token !== "verified") throw new Error("Invalid token");
      return { uid: "server-uid", email: "student@school.example", email_verified: true };
    },
    verifySessionCookie: async (cookie: string, revoked: boolean) => {
      assert.equal(revoked, true);
      if (cookie !== "verified") throw new Error("Invalid session");
      return { uid: "server-uid", email: "student@school.example", email_verified: true };
    },
  };
  const handler = createLearningProgressHandler({
    origin: requireSchoolMutationOrigin,
    identity: (request) =>
      verifiedSchoolIdentity(
        request,
        request.headers.get("x-synthetic-session") || undefined,
        verifier
      ),
    lessonCourse: async () => (options.otherCourse ? "different-course" : input.courseId),
    save: async (userId, value) => {
      if (options.saveFail) throw new Error("Storage unavailable");
      saved.push({ userId, input: value });
    },
    sync: async (identity, items) => {
      if (options.syncFail) throw new Error("School unavailable");
      synced.push({ uid: identity.id, lessonId: items[0].lessonId });
      return options.status || "synced";
    },
  });
  const request = (body: unknown = input, headers: Record<string, string> = {}) =>
    new Request("https://school.example/api/learning/progress", {
      method: "POST",
      headers: {
        origin: "https://school.example",
        "content-type": "application/json",
        "x-synthetic-session": "verified",
        ...headers,
      },
      body: JSON.stringify(body),
    });
  return { handler, request, saved, synced };
}

test("verified server UID owns saved result and school events use web lesson namespace", async () => {
  const f = fixture();
  const response = await f.handler(f.request());
  assert.equal(response.status, 200);
  assert.deepEqual(f.saved, [{ userId: "server-uid", input }]);
  assert.deepEqual(f.synced, [{ uid: "server-uid", lessonId: `web:${input.lessonId}` }]);
  assert.deepEqual(await response.json(), {
    saved: true,
    schoolSync: "synced",
    assessment: "self_reported_practice",
  });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});
test("cookie-less and revoked sessions cannot write or sync", async () => {
  for (const token of ["", "revoked"]) {
    const f = fixture();
    const response = await f.handler(f.request(input, { "x-synthetic-session": token }));
    assert.equal(response.status, 401);
    assert.equal(f.saved.length, 0);
    assert.equal(f.synced.length, 0);
  }
});
test("cross-origin cookie request denied; verified bearer native request allowed", async () => {
  const f = fixture();
  assert.equal(
    (await f.handler(f.request(input, { origin: "https://attacker.example" }))).status,
    403
  );
  assert.equal(f.saved.length, 0);
  const response = await f.handler(
    f.request(input, {
      authorization: "Bearer verified",
      origin: "https://unrelated-native-origin.example",
      "x-synthetic-session": "",
    })
  );
  assert.equal(response.status, 200);
  assert.equal(f.saved[0].userId, "server-uid");
});
test("forged user IDs, missing fields, malformed IDs and unbounded scores rejected", async () => {
  for (const payload of [
    { ...input, user_id: "victim" },
    { ...input, userId: "victim" },
    { ...input, score: 101 },
    { ...input, score: -1 },
    { ...input, score: 2.2 },
    { ...input, completed: "true" },
    { ...input, lessonId: "fake" },
    { lessonId: input.lessonId },
  ]) {
    const f = fixture();
    assert.equal((await f.handler(f.request(payload))).status, 400);
    assert.equal(f.saved.length, 0);
  }
});
test("lesson-course mismatch cannot create arbitrary learning records", async () => {
  const f = fixture({ otherCourse: true });
  assert.equal((await f.handler(f.request())).status, 404);
  assert.equal(f.saved.length, 0);
  assert.equal(f.synced.length, 0);
});
test("database failure never returns saved or school sync success", async () => {
  const f = fixture({ saveFail: true });
  const response = await f.handler(f.request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).saved, undefined);
  assert.equal(f.synced.length, 0);
});
test("ordinary nonmember and unconfigured school still save learning", async () => {
  for (const status of ["not_member", "not_configured"] as const) {
    const f = fixture({ status });
    const response = await f.handler(f.request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).schoolSync, status);
    assert.equal(f.saved.length, 1);
  }
});
test("school outage preserves saved result but reports pending without invented sync", async () => {
  const f = fixture({ syncFail: true });
  const response = await f.handler(f.request());
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.saved, true);
  assert.equal(result.schoolSync, "pending");
  assert.equal(f.saved.length, 1);
});
test("oversized and invalid JSON payloads cannot write", async () => {
  const f = fixture();
  assert.equal((await f.handler(f.request({ padding: "x".repeat(5000) }))).status, 413);
  const request = new Request("https://school.example/api/learning/progress", {
    method: "POST",
    headers: { origin: "https://school.example", "x-synthetic-session": "verified" },
    body: "{",
  });
  assert.equal((await f.handler(request)).status, 400);
  assert.equal(f.saved.length, 0);
});
