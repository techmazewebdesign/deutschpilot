import { test } from "node:test";
import { strict as assert } from "node:assert";
import { decorateSchoolProgress } from "../../lib/school/progress-metadata";
test("native progress uses shipped lesson labels and keeps self-reported score unchanged", async () => {
  const decorated = await decorateSchoolProgress([
    {
      id: "uid:a1-greetings",
      studentId: "uid",
      lessonId: "a1-greetings",
      completed: true,
      score: 0,
      updatedAt: "2026-10-20",
    },
    {
      id: "uid:unknown",
      studentId: "uid",
      lessonId: "unrecognised",
      completed: false,
      score: 20,
      updatedAt: "2026-10-20",
    },
  ]);
  assert.equal(decorated.items[0].lessonTitle, "Begrüßungen");
  assert.equal(decorated.items[0].level, "A1");
  assert.equal(decorated.items[0].source, "mobile");
  assert.equal(decorated.items[0].score, 0);
  assert.equal(decorated.items[1].lessonTitle, undefined);
  assert.equal(decorated.items[1].source, "unknown");
  assert.equal(decorated.pending, false);
});
