import { test, before } from "node:test";
import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { apply, parseAction, snapshot, type Identity } from "../../lib/school/engine";
import { hydrate, changesBetween } from "../../lib/school/repository";
import { registerDocument, applyScanResult, authorizeDownload } from "../../lib/school/documents";
const container = process.env.SCHOOL_TEST_POSTGRES_CONTAINER;
const school = "normalized-test-" + randomUUID().slice(0, 8);
const q = (v: unknown) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
const str = (v: string) => `'${v.replace(/'/g, "''")}'`;
function sql(command: string) {
  return execFileSync(
    "/usr/local/bin/docker",
    ["exec", "-i", container!, "psql", "-U", "postgres", "-Atq", "-v", "ON_ERROR_STOP=1"],
    { input: command, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
  ).trim();
}
function rpc(name: string, ...args: string[]) {
  const raw = sql(`set role service_role;select to_jsonb(public.${name}(${args.join(",")}));`);
  return raw ? JSON.parse(raw) : null;
}
const user = (id: string, admin = false): Identity => ({
  id,
  email: `${id}@synthetic.example`,
  name: id,
  verified: true,
  admin,
});
function load(u: Identity, action: Record<string, unknown> = {}) {
  const data = rpc("school_repository_read", str(school), q(u), q(action));
  return hydrate(school, data.records, data.pagination);
}
function commit(
  u: Identity,
  action: Record<string, unknown>,
  loaded: ReturnType<typeof load>,
  fn?: (s: ReturnType<typeof load>["state"]) => unknown
) {
  const state = structuredClone(loaded.state);
  const result = fn ? fn(state) : apply(state, u, action, "owner");
  rpc(
    "school_repository_commit",
    str(school),
    q(u),
    q(action),
    q(changesBetween(loaded, state)),
    str("owner")
  );
  return result as ReturnType<typeof apply>;
}
function command(u: Identity, action: Record<string, unknown>) {
  return commit(u, action, load(u, action));
}
let classId: string;
let otherClass: string;
const owner = user("owner", true),
  student = user("student"),
  teacher = user("teacher"),
  office = user("office");
before(() => {
  if (!container) return;
  command(owner, { action: "bootstrap", name: "Normalized synthetic school" });
  for (const [id, role] of [
    ["office", "office"],
    ["teacher", "teacher"],
    ["teacher2", "teacher"],
    ["otherTeacher", "teacher"],
    ["student", "student"],
    ["otherStudent", "student"],
  ] as const) {
    const { inviteCode } = command(owner, {
      action: "invite.create",
      email: `${id}@synthetic.example`,
      name: id,
      role,
    });
    command(user(id), { action: "invite.accept", code: inviteCode });
  }
  command(owner, {
    action: "class.save",
    name: "A1",
    teacherIds: ["teacher", "teacher2"],
    studentIds: ["student"],
    schedule: "Mon",
  });
  command(owner, {
    action: "class.save",
    name: "B1",
    teacherIds: ["otherTeacher"],
    studentIds: ["otherStudent"],
    schedule: "Tue",
  });
  const classes = load(owner).state.classes;
  classId = classes.find((c) => c.name === "A1")!.id;
  otherClass = classes.find((c) => c.name === "B1")!.id;
});
test(
  "normalized realPG bootstrap, hashed invitation and class assignments persisted without aggregate",
  { skip: !container },
  () => {
    assert.equal(load(student).state.members.find((m) => m.id === student.id)?.role, "student");
    assert.equal(
      Number(
        sql(
          `select count(*)from public.school_assignments where school_id=${str(school)} and class_id=${str(classId)};`
        )
      ),
      3
    );
    assert.throws(() =>
      command(user("outsider", true), { action: "chat.send", classId, body: "no" })
    );
    assert.throws(() =>
      command(student, {
        action: "member.update",
        memberId: "student",
        role: "owner",
        active: true,
      })
    );
    assert.throws(() =>
      command(owner, { action: "member.update", memberId: "owner", role: "student", active: true })
    );
  }
);
test(
  "normalized realPG attendance atomic audit, office excuse, native/web monotonic progress",
  { skip: !container },
  () => {
    command(teacher, {
      action: "attendance.set",
      classId,
      studentId: "student",
      date: "2026-10-20",
      status: "absent",
    });
    assert.throws(() =>
      command(user("otherTeacher"), {
        action: "attendance.set",
        classId,
        studentId: "student",
        date: "2026-10-20",
        status: "present",
      })
    );
    command(student, {
      action: "absence.report",
      from: "2026-10-20",
      to: "2026-10-20",
      reason: "personal",
    });
    const absence = load(office).state.absences[0];
    command(office, { action: "absence.review", absenceId: absence.id, status: "approved" });
    assert.equal(load(student).state.attendance[0].status, "excused");
    command(student, {
      action: "progress.sync",
      items: [{ lessonId: "l1", completed: true, score: 90 }],
    });
    command(student, {
      action: "progress.sync",
      items: [{ lessonId: "l1", completed: false, score: 10 }],
    });
    assert.equal(load(teacher).state.progress[0].score, 90);
    assert.equal(load(user("otherTeacher")).state.progress.length, 0);
    assert.ok(
      Number(
        sql(
          `select count(*)from school_audit where school_id=${str(school)} and payload->>'action'='attendance.set';`
        )
      ) > 0
    );
  }
);
test(
  "normalized realPG letter/private file scan workflow and role denial",
  { skip: !container },
  () => {
    command(owner, {
      action: "settings.update",
      settings: {
        name: "School",
        operator: "Synthetic controller",
        privacyContact: "privacy@synthetic.example",
        legalBasis: "Synthetic documented Article6",
        healthLegalBasis: "Synthetic documented Article9",
        retentionDays: 30,
        sensitiveUploadsEnabled: true,
        retentionPolicyNote:
          "Synthetic controller test policies; not a German legal recommendation",
        recordRetentionDays: {
          attendance: 30,
          absences: 30,
          letters: 30,
          notifications: 30,
          progress: 30,
          audit: 30,
        },
        retentionByCategory: { general: 30, medical: 30, jobcenter: 30, signed_letter: 30 },
        chatRetentionDays: 30,
      },
    });
    command(owner, {
      action: "letter.send",
      title: "Agreement",
      body: "Return copy",
      studentIds: ["student", "otherStudent"],
      dueDate: "2026-10-30",
    });
    const l = load(student).state.letters[0];
    command(student, { action: "letter.acknowledge", letterId: l.id });
    assert.deepEqual(snapshot(load(student).state, student).letters[0].studentIds, ["student"]);
    command(office, {
      action: "document.request",
      studentId: "student",
      title: "Signed copy",
      category: "signed_letter",
      dueDate: "2026-10-30",
    });
    const request = load(student).state.documentRequests[0];
    const id = randomUUID();
    let d: any;
    const action = {
      action: "document.upload",
      documentId: id,
      letterId: l.id,
      requestId: request.id,
    };
    commit(student, action, load(student, action), (s) => {
      d = registerDocument(
        s,
        student,
        {
          title: "Returned",
          category: "signed_letter",
          fileName: "safe.pdf",
          bytes: Buffer.from("%PDF-1.7\n Harmless"),
          letterId: l.id,
          requestId: request.id,
        },
        id
      );
    });
    assert.equal(load(student).state.documentRequests[0].fulfilledBy, undefined);
    assert.throws(() =>
      authorizeDownload(
        load(teacher, { action: "document.download", documentId: id }).state,
        teacher,
        id
      )
    );
    // Synthetic bytes are known stored in this domain/SQL fixture. Real POST/storage is
    // separately interleaved in upload-deletion-handshake.test.ts.
    const reservation = rpc("school_upload_begin", str(school), q(student), str(id));
    assert.equal(
      rpc(
        "school_upload_finish",
        str(school),
        q(student),
        str(id),
        str(reservation.lease),
        str("stored")
      ).continue,
      true
    );
    const scan = { action: "document.scan", documentId: id };
    commit(student, scan, load(student, scan), (s) => applyScanResult(s, id, d.sha256, "clean"));
    assert.equal(load(student).state.documentRequests[0].fulfilledBy, id);
    const download = { action: "document.download", documentId: id };
    commit(student, download, load(student, download), (s) => authorizeDownload(s, student, id));
    assert.equal(snapshot(load(teacher).state, teacher).documents.length, 0);
  }
);
test(
  "normalized realPG group chat idempotence, multiple teachers, moderation and revocation",
  { skip: !container },
  () => {
    command(student, { action: "chat.send", classId, body: "hello", clientMessageId: "first" });
    command(student, { action: "chat.send", classId, body: "hello", clientMessageId: "first" });
    let history = rpc(
      "school_repository_history",
      str(school),
      q(user("teacher2")),
      str("chatMessages"),
      str(classId),
      "null"
    );
    assert.equal(history.length, 1);
    assert.ok(load(teacher).state.notifications.some((n) => n.title === "New class message"));
    assert.throws(() =>
      rpc(
        "school_repository_history",
        str(school),
        q(user("otherTeacher")),
        str("chatMessages"),
        str(classId),
        "null"
      )
    );
    command(teacher, { action: "chat.moderate", classId, messageId: history[0].id });
    history = rpc(
      "school_repository_history",
      str(school),
      q(student),
      str("chatMessages"),
      str(classId),
      "null"
    );
    assert.equal(history[0].body, "");
    command(owner, {
      action: "member.update",
      memberId: "teacher2",
      role: "teacher",
      active: false,
    });
    assert.throws(() =>
      rpc(
        "school_repository_history",
        str(school),
        q(user("teacher2")),
        str("chatMessages"),
        str(classId),
        "null"
      )
    );
  }
);
test(
  "normalized realPG read receipts, devices, outbox leases and generic daily idempotent reminders",
  { skip: !container },
  () => {
    command(student, { action: "device.register", token: "ExpoPushToken[realpgsynthetic]" });
    command(owner, {
      action: "letter.send",
      title: "Sensitive-title-not-in-push",
      body: "Private body never sent",
      studentIds: ["student"],
      dueDate: new Date().toISOString().slice(0, 10),
    });
    const own = load(student).state;
    const notice = own.notifications[0];
    const outboxBefore = Number(
      sql(`select count(*)from school_outbox where school_id=${str(school)};`)
    );
    command(student, { action: "notification.read", notificationId: notice.id });
    assert.ok(
      load(student, {
        action: "notification.read",
        notificationId: notice.id,
      }).state.notifications.find((n) => n.id === notice.id)?.readAt
    );
    assert.throws(() =>
      command(user("otherStudent"), { action: "notification.read", notificationId: notice.id })
    );
    assert.equal(
      Number(sql(`select count(*)from school_outbox where school_id=${str(school)};`)),
      outboxBefore
    );
    command(owner, {
      action: "letter.send",
      title: "Another letter",
      body: "Private",
      studentIds: ["student"],
      dueDate: new Date().toISOString().slice(0, 10),
    });
    const claimed = rpc("school_push_claim", str(school));
    assert.ok(claimed.length > 0);
    assert.equal(rpc("school_push_claim", str(school)).length, 0);
    const delivery = claimed[0];
    assert.equal(rpc("school_push_authorized", str(school), str(delivery.id)), true);
    command(user("otherStudent"), {
      action: "device.register",
      token: "ExpoPushToken[realpgsynthetic]",
    });
    assert.equal(rpc("school_push_authorized", str(school), str(delivery.id)), false);
    rpc(
      "school_push_finish",
      str(school),
      str(delivery.id),
      str(delivery.lease),
      q({ status: "unknown" })
    );
    assert.equal(rpc("school_push_claim", str(school)).length, 0);
    const first = rpc("school_reminders", str(school));
    const repeat = rpc("school_reminders", str(school));
    assert.ok(first > 0);
    assert.equal(repeat, 0);
    command(user("otherStudent"), {
      action: "device.unregister",
      token: "ExpoPushToken[realpgsynthetic]",
    });
  }
);
test(
  "normalized realPG retention cleanup retries, health/legal holds and privacy erase",
  { skip: !container },
  () => {
    command(student, {
      action: "absence.report",
      from: "2026-10-21",
      to: "2026-10-21",
      reason: "illness",
    });
    const d = load(student).state.documents[0];
    command(owner, {
      action: "document.hold",
      documentId: d.id,
      hold: true,
      reason: "Synthetic hold",
    });
    const held = rpc("school_privacy_prepare", str(school), q(student));
    assert.equal(held.blocked, true);
    assert.equal(
      load(office).state.deletionRequests?.find((r) => r.userId === student.id)?.status,
      "pending_review"
    );
    command(owner, { action: "document.hold", documentId: d.id, hold: false, reason: "Released" });
    const prepared = rpc("school_privacy_prepare", str(school), q(student));
    assert.equal(prepared.blocked, false);
    assert.throws(() =>
      command(owner, {
        action: "document.hold",
        documentId: d.id,
        hold: true,
        reason: "Race late hold",
      })
    );
    const paths = rpc("school_privacy_cleanup_batch", str(school), str(student.id));
    assert.equal(paths.length, 1);
    assert.throws(() => rpc("school_privacy_finalize", str(school), q(student)));
    rpc("school_cleanup_ack", str(school), q(paths));
    rpc("school_privacy_finalize", str(school), q(student));
    assert.equal(
      Number(
        sql(`select count(*)from school_members where school_id=${str(school)}and id='student';`)
      ),
      0
    );
    assert.equal(
      Number(
        sql(
          `select count(*)from school_progress where school_id=${str(school)}and student_id='student';`
        )
      ),
      0
    );
    assert.equal(
      Number(
        sql(
          `select count(*)from school_chat_messages where school_id=${str(school)}and actor_id='student';`
        )
      ),
      0
    );
    assert.equal(rpc("school_privacy_prepare", str(school), q(owner)).blocked, true);
  }
);
import { spawn } from "node:child_process";
function sqlAsync(command: string) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn("/usr/local/bin/docker", [
      "exec",
      "-i",
      container!,
      "psql",
      "-U",
      "postgres",
      "-Atq",
      "-v",
      "ON_ERROR_STOP=1",
    ]);
    let out = "",
      err = "";
    child.stdout.on("data", (b) => (out += b));
    child.stderr.on("data", (b) => (err += b));
    child.on("exit", (code) => (code === 0 ? resolve(out.trim()) : reject(new Error(err))));
    child.stdin.end(command);
  });
}
function pendingCommand(u: Identity, action: Record<string, unknown>) {
  const loaded = load(u, action);
  const state = structuredClone(loaded.state);
  apply(state, u, action, "owner");
  return `set role service_role;select school_repository_commit(${str(school)},${q(u)},${q(action)},${q(changesBetween(loaded, state))},'owner');`;
}
test(
  "normalized realPG parallel students avoid school-wide conflict and progress merges in SQL",
  { skip: !container },
  async () => {
    const invited = command(owner, {
      action: "invite.create",
      email: "parallel@synthetic.example",
      name: "parallel",
      role: "student",
    });
    command(user("parallel"), { action: "invite.accept", code: invited.inviteCode });
    command(owner, {
      action: "class.save",
      id: otherClass,
      name: "B1",
      teacherIds: ["otherTeacher"],
      studentIds: ["otherStudent", "parallel"],
      schedule: "Tue",
    });
    const a = pendingCommand(user("otherTeacher"), {
      action: "attendance.set",
      classId: otherClass,
      studentId: "otherStudent",
      date: "2026-10-22",
      status: "present",
    });
    const b = pendingCommand(user("otherTeacher"), {
      action: "attendance.set",
      classId: otherClass,
      studentId: "parallel",
      date: "2026-10-22",
      status: "late",
    });
    await Promise.all([sqlAsync(a), sqlAsync(b)]);
    assert.equal(
      Number(
        sql(
          `select count(*)from school_attendance where school_id=${str(school)}and payload->>'date'='2026-10-22';`
        )
      ),
      2
    );
    const high = pendingCommand(user("otherStudent"), {
      action: "progress.sync",
      items: [{ lessonId: "parallel-lesson", completed: true, score: 95 }],
    });
    const low = pendingCommand(user("otherStudent"), {
      action: "progress.sync",
      items: [{ lessonId: "parallel-lesson", completed: false, score: 5 }],
    });
    await Promise.all([sqlAsync(high), sqlAsync(low)]);
    const progress = load(user("otherStudent"), {
      action: "progress.sync",
      items: [{ lessonId: "parallel-lesson" }],
    }).state.progress[0];
    assert.equal(progress.score, 95);
    assert.equal(progress.completed, true);
  }
);
test(
  "normalized realPG concurrent retry dedupes chat and stale revoked actor cannot commit",
  { skip: !container },
  async () => {
    const action = {
      action: "chat.send",
      classId: otherClass,
      body: "Exactly once",
      clientMessageId: "concurrent-chat",
    };
    const one = pendingCommand(user("otherStudent"), action);
    const two = pendingCommand(user("otherStudent"), action);
    const results = await Promise.allSettled([sqlAsync(one), sqlAsync(two)]);
    assert.equal(results.filter((x) => x.status === "fulfilled").length, 1);
    command(user("otherStudent"), action);
    assert.equal(
      Number(
        sql(
          `select count(*)from school_chat_messages where school_id=${str(school)}and payload->>'clientMessageId'='concurrent-chat';`
        )
      ),
      1
    );
    const stale = pendingCommand(user("otherTeacher"), {
      action: "chat.send",
      classId: otherClass,
      body: "Should not persist",
    });
    command(owner, {
      action: "member.update",
      memberId: "otherTeacher",
      role: "teacher",
      active: false,
    });
    await assert.rejects(sqlAsync(stale));
    command(owner, {
      action: "member.update",
      memberId: "otherTeacher",
      role: "teacher",
      active: true,
    });
    command(owner, {
      action: "class.save",
      id: otherClass,
      name: "B1",
      teacherIds: ["otherTeacher"],
      studentIds: ["otherStudent", "parallel"],
      schedule: "Tue",
    });
  }
);
test(
  "normalized realPG 100k history uses bounded keyset index beyond old aggregate limit",
  { skip: !container },
  () => {
    sql(
      `insert into school_chat_messages(school_id,id,payload,created_at) select ${str(school)},'capacity-'||lpad(i::text,8,'0'),jsonb_build_object('id','capacity-'||lpad(i::text,8,'0'),'classId',${str(otherClass)},'authorId','otherStudent','authorName','Synthetic','body',repeat('x',160),'createdAt',timestamp'2026-01-01'+i*interval'1 second'),timestamp'2026-01-01'+i*interval'1 second'from generate_series(1,100000)i;analyze school_chat_messages;`
    );
    const page = rpc(
      "school_repository_history",
      str(school),
      q(user("otherTeacher")),
      str("chatMessages"),
      str(otherClass),
      "null"
    );
    assert.equal(page.length, 100);
    const next = rpc(
      "school_repository_history",
      str(school),
      q(user("otherTeacher")),
      str("chatMessages"),
      str(otherClass),
      str(page[0].id)
    );
    assert.equal(next.length, 100);
    assert.equal(new Set([...page, ...next].map((x) => x.id)).size, 200);
    const loaded = load(user("otherTeacher"));
    assert.equal(loaded.state.chatMessages.length, 100);
    assert.equal(loaded.pagination.chatMessages, true);
    assert.ok(JSON.stringify(loaded.state).length < 200000);
    const plan = sql(
      `explain(analyze,buffers)select payload from school_chat_messages where school_id=${str(school)}and class_id=${str(otherClass)}order by created_at desc,id desc limit 100;`
    );
    assert.match(plan, /Index Scan using school_chat_history_idx/);
    assert.ok(
      Number(
        sql(
          `select sum(pg_column_size(payload))from school_chat_messages where school_id=${str(school)};`
        )
      ) >
        8 * 1024 * 1024
    );
    process.stdout.write(`CAPACITY PLAN\n${plan}\n`);
    const pagination = rpc(
      "school_repository_page",
      str(school),
      q(user("otherTeacher")),
      str("progress"),
      "null"
    );
    assert.ok(Array.isArray(pagination.items));
    const exported = rpc("school_repository_export", str(school), q(user("otherStudent")), "null");
    assert.equal(exported.records.length, 1000);
    assert.ok(exported.nextCursor);
    const second = rpc(
      "school_repository_export",
      str(school),
      q(user("otherStudent")),
      str(exported.nextCursor)
    );
    assert.equal(second.records.length, 1000);
    assert.equal(
      new Set([...exported.records, ...second.records].map((x) => x.kind + ":" + x.payload.id))
        .size,
      2000
    );
  }
);
test(
  "normalized realPG absence approval before rollcall, reversal and overlap preserve manual/present records",
  { skip: !container },
  () => {
    const pupil = user("otherStudent"),
      instructor = user("otherTeacher");
    command(pupil, {
      action: "absence.report",
      from: "2026-10-23",
      to: "2026-10-25",
      reason: "illness",
    });
    const first = load(office).state.absences.find(
      (a) => a.studentId === pupil.id && a.from === "2026-10-23"
    )!;
    const before = load(instructor).state.absenceSummaries!.find((a) => a.id === first.id)!;
    assert.equal(before.status, "pending");
    assert.deepEqual(Object.keys(before).sort(), ["from", "id", "status", "studentId", "to"]);
    assert.equal(load(instructor).state.absences.length, 0);
    command(office, { action: "absence.review", absenceId: first.id, status: "approved" });
    command(instructor, {
      action: "attendance.set",
      classId: otherClass,
      studentId: pupil.id,
      date: "2026-10-23",
      status: "absent",
    });
    let at = load(pupil).state.attendance.find((a) => a.date === "2026-10-23")!;
    assert.equal(at.status, "excused");
    assert.equal(at.excusedByAbsenceId, first.id);
    command(pupil, {
      action: "absence.report",
      from: "2026-10-23",
      to: "2026-10-23",
      reason: "personal",
    });
    const overlap = load(office).state.absences.find(
      (a) => a.studentId === pupil.id && a.to === "2026-10-23" && a.id !== first.id
    )!;
    command(office, { action: "absence.review", absenceId: overlap.id, status: "approved" });
    command(office, { action: "absence.review", absenceId: first.id, status: "rejected" });
    at = load(pupil).state.attendance.find((a) => a.date === "2026-10-23")!;
    assert.equal(at.status, "excused");
    assert.equal(at.excusedByAbsenceId, overlap.id);
    command(office, { action: "absence.review", absenceId: overlap.id, status: "rejected" });
    at = load(pupil).state.attendance.find((a) => a.date === "2026-10-23")!;
    assert.equal(at.status, "absent");
    assert.equal(at.excusedByAbsenceId, undefined);
    command(office, {
      action: "attendance.set",
      classId: otherClass,
      studentId: pupil.id,
      date: "2026-10-24",
      status: "excused",
    });
    command(instructor, {
      action: "attendance.set",
      classId: otherClass,
      studentId: pupil.id,
      date: "2026-10-25",
      status: "present",
    });
    command(office, { action: "absence.review", absenceId: first.id, status: "approved" });
    command(office, { action: "absence.review", absenceId: first.id, status: "rejected" });
    const after = load(pupil).state.attendance;
    assert.equal(after.find((a) => a.date === "2026-10-24")?.status, "excused");
    assert.equal(after.find((a) => a.date === "2026-10-25")?.status, "present");
  }
);
test(
  "normalized realPG transaction permissions independently reject forged workflow patches and direct client access",
  { skip: !container },
  () => {
    for (const [u, action] of [
      [user("otherTeacher"), { action: "settings.update" }],
      [
        user("parallel"),
        { action: "member.update", memberId: "parallel", role: "owner", active: true },
      ],
      [user("parallel"), { action: "chat.send", classId }],
      [user("otherTeacher"), { action: "audit.list" }],
    ] as const)
      assert.throws(() =>
        rpc("school_repository_commit", str(school), q(u), q(action), q([]), str("owner"))
      );
    assert.throws(() => sql(`set role anon;select *from school_members;`));
    assert.throws(() =>
      sql(`set role authenticated;select school_repository_read(${str(school)},${q(owner)},'{}');`)
    );
    assert.throws(() =>
      sql(`set role anon;select school_import_aggregate('x','{}','IMPORT SCHOOL BACKUP');`)
    );
  }
);
test(
  "normalized realPG explicit record retention hides expired illness and preserves held linked records",
  { skip: !container },
  () => {
    const expired = randomUUID(),
      held = randomUUID(),
      expiredLetter = randomUUID(),
      heldLetter = randomUUID(),
      heldFile = randomUUID(),
      oldNotification = randomUUID();
    const old = "2000-01-01T00:00:00Z";
    const absence = (id: string) => ({
      id,
      studentId: "otherStudent",
      from: "2000-01-01",
      to: "2000-01-01",
      reason: "illness",
      status: "approved",
      createdAt: old,
    });
    for (const id of [expired, held])
      sql(
        `insert into school_absences(school_id,id,payload,created_at,retention_at)values(${str(school)},${str(id)},${q(absence(id))},${str(old)},${str(old)});`
      );
    for (const id of [expiredLetter, heldLetter]) {
      const letter = {
        id,
        title: "Old school letter",
        body: "School text",
        studentIds: ["otherStudent"],
        dueDate: "2000-01-01",
        createdBy: "owner",
        createdAt: old,
      };
      sql(
        `insert into school_letters(school_id,id,payload,created_at,retention_at)values(${str(school)},${str(id)},${q(letter)},${str(old)},${str(old)});insert into school_letter_recipients(school_id,id,payload)values(${str(school)},${str(id + ":otherStudent")},${q({ letterId: id, studentId: "otherStudent" })});`
      );
    }
    const doc = {
      id: heldFile,
      studentId: "otherStudent",
      uploadedBy: "otherStudent",
      title: "Held certificate",
      category: "medical",
      fileName: "held.pdf",
      mime: "application/pdf",
      size: 10,
      scanStatus: "quarantined",
      createdAt: old,
      expiresAt: "2000-02-01T00:00:00Z",
      absenceId: held,
      letterId: heldLetter,
      storagePath: "synthetic/held",
      legalHold: true,
      holdReason: "Synthetic explicit legal hold",
    };
    sql(
      `insert into school_documents(school_id,id,payload)values(${str(school)},${str(heldFile)},${q(doc)});insert into school_notifications(school_id,id,payload,created_at,retention_at)values(${str(school)},${str(oldNotification)},${q({ id: oldNotification, userId: "otherStudent", title: "Old notice", body: "Generic", createdAt: old, readAt: null, delivery: "in_app" })},${str(old)},${str(old)});insert into school_outbox(school_id,id,payload)values(${str(school)},'expired-notification-outbox',${q({ id: "expired-notification-outbox", userId: "otherStudent", notificationId: oldNotification, token: "ExpoPushToken[unused]", status: "pending" })});`
    );
    const studentView = snapshot(load(user("otherStudent")).state, user("otherStudent"));
    assert.ok(!studentView.absences.some((a) => a.id === expired));
    assert.ok(studentView.absences.some((a) => a.id === held));
    assert.ok(!studentView.notifications.some((n) => n.id === oldNotification));
    assert.ok(!load(user("otherTeacher")).state.absenceSummaries!.some((a) => a.id === expired));
    const dry = rpc("school_repository_record_retention", str(school), q(owner), "true");
    assert.ok(dry.eligibleBatch.absences >= 1);
    assert.ok(dry.eligibleBatch.letters >= 1);
    assert.equal(
      Number(
        sql(
          `select count(*)from school_absences where school_id=${str(school)}and id=${str(expired)};`
        )
      ),
      1
    );
    const removed = rpc("school_repository_record_retention", str(school), q(owner), "false");
    assert.ok(removed.eligibleBatch.absences >= 1);
    assert.equal(
      Number(
        sql(
          `select count(*)from school_absences where school_id=${str(school)}and id=${str(expired)};`
        )
      ),
      0
    );
    assert.equal(
      Number(
        sql(
          `select count(*)from school_absences where school_id=${str(school)}and id=${str(held)};`
        )
      ),
      1
    );
    assert.equal(
      Number(
        sql(
          `select count(*)from school_letters where school_id=${str(school)}and id=${str(heldLetter)};`
        )
      ),
      1
    );
    assert.equal(
      Number(
        sql(
          `select count(*)from school_letter_recipients where school_id=${str(school)}and payload->>'letterId'=${str(expiredLetter)};`
        )
      ),
      0
    );
    assert.equal(
      Number(
        sql(
          `select count(*)from school_outbox where school_id=${str(school)}and id='expired-notification-outbox';`
        )
      ),
      0
    );
    rpc("school_repository_record_retention", str(school), q(owner), "false");
    assert.equal(
      Number(
        sql(
          `select count(*)from school_documents where school_id=${str(school)}and id=${str(heldFile)};`
        )
      ),
      1
    );
  }
);
