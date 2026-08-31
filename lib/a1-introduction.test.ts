import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkIntroduction, introductionQuestions as questions, introductionText, practiceCopy, type PracticeAnswers } from "./a1-introduction";

const perfect = Object.fromEntries(questions.map(q => [q.id, q.correct]));
test("seven unique questions with exactly one valid answer and both explanations", () => {
  assert.equal(questions.length, 7);
  assert.equal(new Set(questions.map(q => q.id)).size, 7);
  assert.equal(questions.filter(q => q.group === "reading").length, 4);
  for (const q of questions) {
    assert.equal(new Set(q.options).size, q.options.length);
    assert.ok(q.options[q.correct]);
    assert.ok(q.explanation.de && q.explanation.en);
  }
});
test("German and English controls have matching keys and no empty copy", () => {
  assert.deepEqual(Object.keys(practiceCopy.de), Object.keys(practiceCopy.en));
  for (const copy of Object.values(practiceCopy)) assert.ok(Object.values(copy).every(Boolean));
});
test("story supports the four reading answers", () => {
  for (const fragment of ["ich heiße Nora", "aus Polen", "in Bremen", "Am Dienstag"]) assert.ok(introductionText.includes(fragment));
});
test("empty or incomplete answers cannot receive a score", () => {
  assert.equal(checkIntroduction({}), null);
  for (const q of questions) {
    const partial = { ...perfect };
    delete partial[q.id];
    assert.equal(checkIntroduction(partial), null);
  }
});
test("invalid indices and inherited answers are rejected", () => {
  for (const invalid of [-1, 3, NaN, Infinity, .5, "1", undefined]) {
    assert.equal(checkIntroduction({ ...perfect, name: invalid } as PracticeAnswers), null);
  }
  assert.equal(checkIntroduction(Object.create(perfect)), null);
});
for (const q of questions) for (let selected = 0; selected < q.options.length; selected++) {
  test(`${q.id}: option ${selected} has the correct feedback and score`, () => {
    const checked = checkIntroduction({ ...perfect, [q.id]: selected });
    assert.ok(checked);
    assert.equal(checked.total, 7);
    assert.equal(checked.score, selected === q.correct ? 7 : 6);
    assert.equal(checked.results.find(r => r.id === q.id)?.correct, selected === q.correct);
  });
}
test("all 2187 combinations score consistently without mutating answers", () => {
  for (let combination = 0; combination < 3 ** questions.length; combination++) {
    let remaining = combination;
    const answers: PracticeAnswers = {};
    for (const q of questions) { answers[q.id] = remaining % 3; remaining = Math.floor(remaining / 3); }
    Object.freeze(answers);
    assert.equal(checkIntroduction(answers)?.score, questions.filter(q => answers[q.id] === q.correct).length);
  }
});
test("the new exercise has no service, storage, microphone or account dependencies", () => {
  const component = readFileSync("components/learn/a1-introduction-practice.tsx", "utf8");
  assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage|supabase|firebase|useAuth|mediaDevices|sendBeacon/);
  assert.match(component, /disabled=\{!ready\}/);
  assert.match(component, /event.preventDefault\(\)/);
  assert.match(component, /<noscript>/);
  assert.match(component, /<details/);
  assert.match(component, /setResult\(null\)/);
});
test("integration stays scoped to the existing A1 article", () => {
  const page = readFileSync("app/[locale]/magazine/[slug]/page.tsx", "utf8");
  assert.match(page, /slug === "german-a1-exam-guide" &&/);
  assert.match(page, /<A1IntroductionPractice key=\{locale\} locale=\{de \? "de" : "en"\}/);
});
