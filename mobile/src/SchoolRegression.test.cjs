const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, mocks = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(`${__dirname}/${file}`, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (n) => {
      assert.ok(n in mocks, n);
      return mocks[n];
    },
    Date,
    JSON,
    Number,
    Error,
    Set,
    Map,
    setTimeout,
    clearTimeout,
    AbortController,
    FormData,
    Blob,
    ...globals,
  });
  return exports;
}
function ph(ids = ["local", "remote", "a", "b", "account-a"]) {
  const data = new Map();
  const storage = {
    getItem: async (k) => data.get(k),
    setItem: async (k, v) => data.set(k, v),
    removeItem: async (k) => data.delete(k),
  };
  const base = load("progress.ts", { "@react-native-async-storage/async-storage": storage });
  return {
    base,
    mod: load("SchoolProgress.ts", {
      "@react-native-async-storage/async-storage": storage,
      "./progress": base,
      "./content": {
        lessons: ids.map((id) => ({ id })),
      },
    }),
  };
}
test("guest and two accounts never implicitly import or erase one another", async () => {
  const { mod, base } = ph();
  for (const [uid, id] of [
    [null, "guest"],
    ["a", "a"],
    ["b", "b"],
  ])
    await mod.saveAccountProgress(uid, { ...base.emptyProgress, completed: [id] });
  assert.deepEqual(Array.from((await mod.loadAccountProgress("a")).completed), ["a"]);
  await mod.clearAccountProgress("a");
  assert.deepEqual(Array.from((await mod.loadAccountProgress("b")).completed), ["b"]);
  assert.deepEqual(Array.from((await mod.loadAccountProgress(null)).completed), ["guest"]);
  assert.equal((await mod.loadAccountProgress("new")).completed.length, 0);
});
test("merge filters other students, preserves reviews, never fabricates scores", () => {
  const { mod, base } = ph();
  const merged = mod.mergeSchoolProgress(
    {
      ...base.emptyProgress,
      completed: ["local"],
      reviews: { word: { due: 100, interval: 2, correct: 1 } },
    },
    {
      actor: { id: "a" },
      progress: [
        { studentId: "a", lessonId: "remote", completed: true },
        { studentId: "b", lessonId: "private", completed: true },
      ],
    },
    "a"
  );
  assert.deepEqual(Array.from(merged.completed), ["local", "remote"]);
  assert.equal(merged.reviews.word.due, 100);
  assert.equal(merged.xp, 40);
  assert.equal(mod.progressItems(merged)[0].score, 0);
});
function ch(fetch) {
  const auth = { currentUser: { uid: "a", getIdToken: async () => "synthetic-token" } };
  return {
    auth,
    mod: load(
      "SchoolClient.ts",
      {
        "./firebase": {
          getFirebaseRuntime: async () => ({ auth, apiBaseUrl: "https://synthetic.invalid" }),
        },
      },
      { fetch }
    ),
  };
}
test("school command carries bearer and returns persisted server snapshot", async () => {
  let seen;
  const { mod } = ch(async (url, init) => {
    seen = { url, init };
    return { ok: true, json: async () => ({ snapshot: { version: 7, actor: { id: "a" } } }) };
  });
  const result = await mod.schoolCommand("a", {
    action: "absence.report",
    from: "2026-10-20",
    to: "2026-10-20",
    reason: "illness",
  });
  assert.equal(seen.url, "https://synthetic.invalid/api/school");
  assert.equal(seen.init.headers.Authorization, "Bearer synthetic-token");
  assert.equal(JSON.parse(seen.init.body).action, "absence.report");
  assert.equal(result.snapshot.version, 7);
});
test("offline, forbidden, and changed account never return success", async () => {
  let { mod } = ch(async () => {
    throw Error("offline");
  });
  await assert.rejects(mod.loadSchool("a"), /Keine bestätigte Verbindung/);
  ({ mod } = ch(async () => ({
    ok: false,
    json: async () => ({ error: "Denied", code: "FORBIDDEN" }),
  })));
  await assert.rejects(mod.loadSchool("a"), /Denied/);
  const h = ch(async () => {
    h.auth.currentUser = { uid: "b" };
    return { ok: true, json: async () => ({ private: true }) };
  });
  await assert.rejects(h.mod.loadSchool("a"), /Konto wurde gewechselt/);
});
test("invalid files rejected before transmitting bytes", async () => {
  let calls = 0;
  const { mod } = ch(async () => {
    calls++;
  });
  await assert.rejects(
    mod.uploadSchoolDocument(
      "a",
      { uri: "file://test", name: "unsafe.exe", mimeType: "application/octet-stream", size: 10 },
      { title: "Test", category: "general" }
    ),
    /PDF/
  );
  await assert.rejects(
    mod.uploadSchoolDocument(
      "a",
      {
        uri: "file://test",
        name: "large.pdf",
        mimeType: "application/pdf",
        size: 11 * 1024 * 1024,
      },
      { title: "Test", category: "general" }
    ),
    /10 MB/
  );
  assert.equal(calls, 0);
});

test("push fails closed when provider unavailable without requesting permissions", async () => {
  let requested = 0;
  const push = load(
    "SchoolPush.ts",
    {
      "react-native": { Platform: { OS: "ios" } },
      "@react-native-async-storage/async-storage": {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
      },
      "expo-constants": { easConfig: { projectId: "00000000-0000-0000-0000-000000000000" } },
      "expo-notifications": {
        requestPermissionsAsync: async () => {
          requested++;
        },
      },
      "./SchoolClient": {
        loadSchool: async () => ({ capabilities: { push: false } }),
        schoolCommand: async () => {
          throw Error("Must not register");
        },
      },
      "./firebase": {},
    },
    { process: { env: {} } }
  );
  await assert.rejects(push.enableSchoolPush("a"), /Push-Dienst/);
  assert.equal(requested, 0);
});
test("offline logout queues remote token removal and retries only for owning account", async () => {
  let registration = JSON.stringify({ uid: "a", token: "ExpoPushToken[synthetic]" });
  let online = false;
  let calls = 0;
  const push = load(
    "SchoolPush.ts",
    {
      "react-native": { Platform: { OS: "ios" } },
      "@react-native-async-storage/async-storage": {
        getItem: async () => registration,
        setItem: async (_k, v) => {
          registration = v;
        },
        removeItem: async () => {
          registration = null;
        },
      },
      "expo-constants": {},
      "expo-notifications": {},
      "./SchoolClient": {
        schoolCommand: async () => {
          calls++;
          if (!online) throw Error("offline");
        },
      },
      "./firebase": { getFirebaseRuntime: async () => ({ auth: { currentUser: { uid: "a" } } }) },
    },
    { process: { env: {} } }
  );
  assert.equal(await push.prepareSchoolSignOut(), true);
  assert.equal(JSON.parse(registration).pendingRemoval, true);
  await push.retrySchoolPushCleanup("b");
  assert.equal(calls, 1);
  online = true;
  await push.retrySchoolPushCleanup("a");
  assert.equal(calls, 2);
  assert.equal(registration, null);
});

test("account switching during token refresh stops mutation before network call", async () => {
  let calls = 0;
  const h = ch(async () => {
    calls++;
    return { ok: true };
  });
  h.auth.currentUser.getIdToken = async () => {
    h.auth.currentUser = { uid: "b" };
    return "old-token";
  };
  await assert.rejects(
    h.mod.schoolCommand("a", {
      action: "absence.report",
      from: "2026-10-20",
      to: "2026-10-20",
      reason: "illness",
    }),
    /Konto wurde gewechselt/
  );
  assert.equal(calls, 0);
});

test("late school response from another account cannot be merged into current progress", () => {
  const { mod, base } = ph();
  const local = { ...base.emptyProgress, completed: ["account-a"] };
  assert.throws(
    () =>
      mod.mergeSchoolProgress(
        local,
        {
          actor: { id: "b" },
          progress: [{ studentId: "b", lessonId: "account-b", completed: true }],
        },
        "a"
      ),
    /not merged/
  );
  assert.deepEqual(local.completed, ["account-a"]);
});

test("printable school letter escapes untrusted body and identity HTML", () => {
  const mod = load("SchoolLetter.ts");
  const html = mod.letterPrintHtml(
    { id: "letter", title: "<script>x</script>", body: '<img onerror="x">', dueDate: "2026-10-20" },
    { actor: { name: "<Student>" }, settings: { name: "School & Co", operator: "Operator" } }
  );
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;Student&gt;"));
  assert.ok(html.includes("keine qualifizierte"));
});

test("web and task progress stays server-only and never creates ghost native lessons or XP", () => {
  const { mod, base } = ph();
  const result = mod.mergeSchoolProgress(
    { ...base.emptyProgress, completed: [] },
    {
      actor: { id: "a" },
      progress: [
        { studentId: "a", lessonId: "web:legacy-id", completed: true },
        { studentId: "a", lessonId: "room-task:task-id", completed: true },
        { studentId: "a", lessonId: "unknown", completed: true },
        { studentId: "a", lessonId: "remote", completed: true },
      ],
    },
    "a"
  );
  assert.deepEqual(Array.from(result.completed), ["remote"]);
  assert.equal(result.xp, 20);
});

test("permission denial clears school state whereas temporary network error is distinguished", async () => {
  const denied = ch(async () => ({
    ok: false,
    status: 403,
    json: async () => ({ error: "Membership revoked", code: "NOT_MEMBER" }),
  }));
  try {
    await denied.mod.loadSchool("a");
    assert.fail("must deny");
  } catch (error) {
    assert.equal(denied.mod.isSchoolAccessDenial(error), true);
  }
  const network = ch(async () => {
    throw Error("offline");
  });
  try {
    await network.mod.loadSchool("a");
    assert.fail("must fail");
  } catch (error) {
    assert.equal(network.mod.isSchoolAccessDenial(error), false);
  }
});
test("teacher absence register exposes dates/status only and drops private reason/files", () => {
  const mod = load("SchoolAbsence.ts");
  const rows = mod.teacherAbsenceRows({
    actor: { role: "teacher" },
    absenceSummaries: [
      {
        id: "absence",
        studentId: "student",
        from: "2026-10-20",
        to: "2026-10-21",
        status: "approved",
        reason: "private",
        documents: [{ fileName: "medical.pdf" }],
      },
    ],
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].status, "approved");
  assert.equal(rows[0].reason, undefined);
  assert.equal(rows[0].documents, undefined);
  assert.equal(
    mod.teacherAbsenceRows({ actor: { role: "student" }, absenceSummaries: rows }).length,
    0
  );
});

function pager() {
  const client = ch(async () => {}).mod;
  return load(
    "SchoolPagination.ts",
    {
      "./SchoolClient": {
        schoolCommand: async () => {
          throw Error("Inject page");
        },
        SchoolError: client.SchoolError,
      },
    },
    { process: { env: {} } }
  );
}
test("all progress pages load 1000 web rows and 105 known native lessons beyond first page", async () => {
  const paging = pager();
  const ids = Array.from({ length: 105 }, (_, i) => "native-" + i);
  const { mod, base } = ph(ids);
  const rows = [
    ...Array.from({ length: 1000 }, (_, i) => ({
      id: "web-row-" + i,
      studentId: "a",
      lessonId: "web:" + i,
      completed: true,
      score: 10,
    })),
    ...ids.map((id, i) => ({
      id: "native-row-" + i,
      studentId: "a",
      lessonId: id,
      completed: true,
      score: 0,
    })),
  ];
  const initial = {
    schoolId: "school",
    version: 1,
    actor: { id: "a", role: "student" },
    progress: rows.slice(0, 100),
    pagination: { progress: true },
    pageCursors: { progress: "100" },
  };
  const result = await paging.completeSchoolProgress("a", initial, {
    page: async (before) => {
      const n = Number(before),
        items = rows.slice(n, n + 100);
      return {
        snapshot: initial,
        section: "progress",
        items,
        nextCursor: n + 100 < rows.length ? String(n + 100) : null,
      };
    },
  });
  assert.equal(result.complete, true);
  assert.equal(result.snapshot.progress.length, 1105);
  const merged = mod.mergeSchoolProgress(base.emptyProgress, result.snapshot, "a");
  assert.equal(merged.completed.length, 105);
  assert.equal(merged.xp, 2100);
  const partial = await paging.completeSchoolProgress("a", initial, {
    maxPages: 2,
    page: async (before) => {
      const n = Number(before);
      return {
        snapshot: initial,
        section: "progress",
        items: rows.slice(n, n + 100),
        nextCursor: String(n + 100),
      };
    },
  });
  assert.equal(partial.complete, false);
  assert.equal(partial.pagesRead, 2);
  assert.equal(partial.snapshot.pagination.progress, true);
});
test("paged sections append and dedupe, preserve other sections, and reject changed actor or repeated cursors", async () => {
  const paging = pager();
  const current = {
    schoolId: "s",
    version: 1,
    actor: { id: "a", role: "student" },
    classes: [{ id: "class-1" }],
    documents: [{ id: "doc-1" }],
    pagination: { classes: true },
    pageCursors: { classes: "cursor" },
  };
  const merged = paging.mergeSchoolPage(
    current,
    {
      snapshot: current,
      section: "classes",
      items: [{ id: "class-1" }, { id: "class-2" }],
      nextCursor: null,
    },
    "classes",
    "a"
  );
  assert.equal(merged.classes.length, 2);
  assert.equal(merged.documents[0].id, "doc-1");
  assert.equal(merged.pagination.classes, false);
  assert.throws(
    () =>
      paging.mergeSchoolPage(
        current,
        {
          snapshot: { ...current, actor: { id: "b", role: "student" } },
          section: "classes",
          items: [],
          nextCursor: null,
        },
        "classes",
        "a"
      ),
    /gewechselt/
  );
  const progress = {
    ...current,
    progress: [],
    pagination: { progress: true },
    pageCursors: { progress: "same" },
  };
  await assert.rejects(
    paging.completeSchoolProgress("a", progress, {
      page: async () => ({
        snapshot: progress,
        section: "progress",
        items: [],
        nextCursor: "same",
      }),
    }),
    /vollständig/
  );
});


test("Android push without Firebase configuration never asks permission or registers", async () => {
  let notificationCalls = 0;
  const push = load("SchoolPush.ts", {
    "react-native": { Platform: { OS: "android" } },
    "@react-native-async-storage/async-storage": {},
    "expo-constants": { expoConfig: { android: {} }, easConfig: { projectId: "00000000-0000-0000-0000-000000000000" } },
    "expo-notifications": {
      setNotificationChannelAsync: async () => { notificationCalls++; },
      getPermissionsAsync: async () => { notificationCalls++; return { status: "undetermined" }; },
      requestPermissionsAsync: async () => { notificationCalls++; return { status: "denied" }; },
      getExpoPushTokenAsync: async () => { notificationCalls++; throw Error("Must not request native push"); },
    },
    "./SchoolClient": { loadSchool: async () => ({ capabilities: { push: true } }), schoolCommand: async () => { throw Error("Must not register"); } },
    "./firebase": {},
  }, { process: { env: {} } });
  await assert.rejects(push.enableSchoolPush("a"), /Android-Push/);
  assert.equal(notificationCalls, 0);
});
