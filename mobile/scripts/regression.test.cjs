const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function load(file, mocks = {}) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(js, { exports, require: name => { if (!(name in mocks)) throw new Error(`Unexpected dependency: ${name}`); return mocks[name]; }, Date, JSON, Number, Error, setTimeout, clearTimeout, AbortController, process: { env: {} } });
  return exports;
}
test('email validation accepts ordinary and tagged addresses, rejects malformed inputs', () => {
  const { validEmail } = load('src/validation.ts');
  for (const email of ['test@example.com', ' test+qa@example.com ', 'sophie@example.de']) assert.equal(validEmail(email), true);
  for (const email of ['', 'a@', 'a b@example.com', 'a@@example.com', 'a@example']) assert.equal(validEmail(email), false);
});
test('every shipped lesson has a unique id, correct answer and usable content', () => {
  const { lessons, vocabulary } = load('src/content.ts', { './data/web-vocabulary.json': require('../src/data/web-vocabulary.json'), './data/web-lessons.json': require('../src/data/web-lessons.json') });
  assert.equal(new Set(lessons.map(x => x.id)).size, lessons.length);
  for (const lesson of lessons) { assert.ok(lesson.title && lesson.note && (lesson.phrases.length || lesson.sections?.length)); assert.ok(lesson.options[lesson.answer]); assert.ok(lesson.minutes > 0); }
  for (const level of ['A1','A2','B1','B2','C1']) assert.ok(vocabulary.some(x => x.level === level));
  for (const word of vocabulary) assert.ok(word.de && word.en && word.example);
});
test('offline progress: clean start, completion, no duplicate XP, persistence, reset', async () => {
  const data = new Map(); const storage = { getItem: async k => data.get(k), setItem: async (k,v) => data.set(k,v), removeItem: async k => data.delete(k) };
  const p = load('src/progress.ts', { '@react-native-async-storage/async-storage': storage });
  let progress = await p.loadProgress(); assert.equal(progress.xp, 0);
  progress = await p.completeLesson(progress, 'a1-greetings'); assert.equal(progress.xp, 20); assert.equal(progress.streak, 1);
  progress = await p.completeLesson(progress, 'a1-greetings'); assert.equal(progress.xp, 20);
  progress = await p.completeLesson(progress, 'a1-cafe'); assert.equal(progress.xp, 40); assert.equal(progress.streak, 1);
  assert.equal((await p.loadProgress()).completed.length, 2);
  await p.clearProgress(); assert.equal((await p.loadProgress()).xp, 0);
  data.set('deutschpilot:progress:v1', 'invalid json'); assert.equal((await p.loadProgress()).xp, 0);
});
function authHarness(sendFails = false) {
  const calls = []; const user = { emailVerified: true, reload: async () => {}, getIdToken: async () => 'test-token' }; const auth = { currentUser: user };
  const api = {
    createUserWithEmailAndPassword: async (...args) => { calls.push(['create', ...args]); return { user }; },
    updateProfile: async (...args) => calls.push(['profile', ...args]),
    sendEmailVerification: async (...args) => { calls.push(['verify', ...args]); if (sendFails) throw new Error('network failed'); },
    signInWithEmailAndPassword: async (...args) => { calls.push(['login', ...args]); return { user }; },
    sendPasswordResetEmail: async (...args) => calls.push(['reset', ...args]),
    signOut: async () => calls.push(['logout']), onAuthStateChanged: (_auth, listener) => { listener(user); return () => {}; },
  };
  return { calls, user, auth, api, mod: load('src/auth.ts', { 'firebase/auth': api, './firebase': { getFirebaseRuntime: async () => ({ auth, apiBaseUrl: 'https://www.deutschpilot.de' }) } }) };
}
test('signup sends verification to the canonical login continuation', async () => {
  const h = authHarness(); const result = await h.mod.register(' TEST@EXAMPLE.COM ', 'test-password', ' Test ');
  assert.equal(result.verificationSent, true); assert.equal(h.calls[0][2], 'test@example.com');
  assert.equal(h.calls.find(c => c[0] === 'verify')[2].url, 'https://www.deutschpilot.de/de/signin?verified=1');
  assert.equal(h.auth.languageCode, 'de');
});
test('signup does not claim email was sent when delivery request failed', async () => {
  const h = authHarness(true); assert.equal((await h.mod.register('test@example.com', 'password', 'Test')).verificationSent, false);
});
test('existing short passwords are passed unchanged to Firebase', async () => {
  const h = authHarness(); await h.mod.login(' TEST@EXAMPLE.COM ', '123456');
  assert.equal(h.calls[0][2], 'test@example.com'); assert.equal(h.calls[0][3], '123456');
});
test('password reset uses the same canonical continuation', async () => {
  const h = authHarness(); await h.mod.resetPassword(' TEST@EXAMPLE.COM ');
  assert.equal(h.calls[0][2], 'test@example.com'); assert.equal(h.calls[0][3].url, h.mod.verificationSettings.url);
});
test('resend reloads state and avoids a new email for a verified account', async () => {
  const h = authHarness(); h.user.emailVerified = true; assert.equal(await h.mod.resendVerification(), true); assert.equal(h.calls.length, 0);
  h.user.emailVerified = false; assert.equal(await h.mod.resendVerification(), false); assert.equal(h.calls[0][0], 'verify');
});
test('auth errors are translated without exposing credentials', async () => {
  const h = authHarness(); h.api.signInWithEmailAndPassword = async () => { throw { code: 'auth/invalid-credential' }; };
  await assert.rejects(h.mod.login('test@example.com', 'wrong'), /registriertes Konto/);
});
test('bundled branding is byte-identical to the original website assets', () => {
  for (const [app, web] of [['logo.png','Deurschpilot_logo.png'],['hero.jpg','hero_image.jpg']]) assert.ok(fs.readFileSync(path.join(root,'assets',app)).equals(fs.readFileSync(path.join(root,'../public/Images',web))));
});
test('authentication boots without the missing website configuration route and retries a failed initialization', async () => {
  let attempts = 0;
  const auth = {};
  const runtime = load('src/firebase.ts', {
    '@react-native-async-storage/async-storage': {},
    'firebase/app': { getApps: () => [], getApp: () => ({}), initializeApp: () => { if (++attempts === 1) throw new Error('temporary initialization failure'); return {}; } },
    'firebase/auth': { getReactNativePersistence: () => ({}), initializeAuth: () => auth, getAuth: () => auth },
    './firebase-config.json': { apiKey: 'public-test-config', authDomain: 'test.firebaseapp.com', projectId: 'test', appId: 'test' },
  });
  await assert.rejects(runtime.getFirebaseRuntime(), /temporary initialization/);
  assert.equal((await runtime.getFirebaseRuntime()).auth, auth);
  assert.equal(attempts, 2);
  assert.equal((await runtime.getFirebaseRuntime()).auth, auth);
  assert.equal(attempts, 2);
});

test('migrates old progress without erasing achievements and sanitizes malformed storage', () => {
  const p = load('src/progress.ts', { '@react-native-async-storage/async-storage': {} });
  const old = p.normalizeProgress({ completed: ['a', 'a', null, 2], xp: 40, streak: 3, lastStudyDay: '2026-10-18' });
  assert.equal(old.completed.length, 1); assert.equal(old.xp, 40); assert.equal(old.selectedLevel, 'A1'); assert.equal(old.dailyGoal, 5);
  const bad = p.normalizeProgress({ xp: -20, streak: Infinity, reviews: { bad: { due: -1 } }, selectedLevel: 'C9', dailyGoal: 800 });
  assert.equal(bad.xp, 0); assert.equal(bad.streak, 0); assert.equal(Object.keys(bad.reviews).length, 0); assert.equal(bad.dailyGoal, 5);
});
test('local calendar streaks survive midnight and DST; replay maintains activity without duplicate XP', () => {
  const p = load('src/progress.ts', { '@react-native-async-storage/async-storage': {} });
  let state = p.applyStudyAction(p.emptyProgress, { type: 'lesson', id: 'a' }, new Date(2026, 9, 24, 23, 55));
  state = p.applyStudyAction(state, { type: 'lesson', id: 'a' }, new Date(2026, 9, 25, 0, 5));
  assert.equal(state.xp, 20); assert.equal(state.streak, 2); assert.equal(state.dailyCount, 1);
  state = p.applyStudyAction(state, { type: 'practice' }, new Date(2026, 9, 25, 23, 55));
  assert.equal(state.streak, 2); assert.equal(state.dailyCount, 2);
  assert.equal(p.currentStreak(state, new Date(2026, 9, 28)), 0);
  assert.equal(p.dailyCount(state, new Date(2026, 9, 26)), 0);
});
test('review schedules wrong answers sooner, grows correct intervals, and prioritizes due words', () => {
  const p = load('src/progress.ts', { '@react-native-async-storage/async-storage': {} });
  const now = new Date(2026, 9, 18, 12);
  let state = p.applyStudyAction(p.emptyProgress, { type: 'word', id: 'a', remembered: false }, now);
  assert.equal(state.reviews.a.due - now.getTime(), 600000);
  const words = [{ id: 'b' }, { id: 'a' }];
  assert.equal(p.reviewQueue(words, state, now.getTime())[0].id, 'b');
  assert.equal(p.reviewQueue(words, state, now.getTime() + 600001)[0].id, 'a');
  state = p.applyStudyAction(state, { type: 'word', id: 'a', remembered: true }, now);
  assert.equal(state.reviews.a.interval, 1);
  state = p.applyStudyAction(state, { type: 'word', id: 'a', remembered: true }, now);
  assert.equal(state.reviews.a.interval, 3); assert.equal(state.xp, 0);
});
test('failed device writes are surfaced instead of reporting a saved completion', async () => {
  const p = load('src/progress.ts', { '@react-native-async-storage/async-storage': { setItem: async () => { throw new Error('disk full'); } } });
  await assert.rejects(p.completeLesson(p.emptyProgress, 'a'), /disk full/);
  assert.equal(p.emptyProgress.xp, 0);
});
test('imported lesson sections render as text and all self-test answers belong to their choices', () => {
  const imported = require('../src/data/web-lessons.json');
  assert.ok(imported.length > 90);
  for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) assert.ok(imported.some(l => l.level === level));
  for (const lesson of imported) {
    assert.ok(lesson.sections.length && lesson.exercises.length);
    for (const block of lesson.sections) assert.ok(block.text && !/<\/?(?:h[1-6]|table|td|p|strong)\b/i.test(block.text));
    for (const item of lesson.exercises) assert.ok(item.options[item.answer] && item.question.length < 500);
  }
  const vocab = require('../src/data/web-vocabulary.json'); assert.ok(vocab.length > 600);
  assert.equal(new Set(vocab.map(w => w.id)).size, vocab.length);
});
