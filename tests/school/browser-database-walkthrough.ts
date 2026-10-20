/** Real browser walkthrough backed by local normalized PostgreSQL persistence and transactions.
 * HTTP identity is an explicit synthetic test fixture; file storage and scanner verdicts are fixtures.
 * Does not prove live Firebase authentication, remote provider storage/scanning or push delivery.
 */
import { strict as assert } from "node:assert";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { hydrate, changesBetween, databaseError } from "../../lib/school/repository";
import {
  chromium,
  type Page,
  type Locator,
} from "/Users/rooz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js";
import {
  apply,
  snapshot,
  SchoolError,
  type Identity,
  type SchoolState,
} from "../../lib/school/engine";
import { registerDocument, applyScanResult, authorizeDownload } from "../../lib/school/documents";

async function main() {
  const evidence = `${process.cwd()}/docs/verification-school-2026-10-20/`;
  const base = process.env.SCHOOL_TEST_URL || "http://localhost:3017";
  const id = (value: string, admin = false): Identity => ({
    id: value,
    email: `${value}@school.example`,
    name: value,
    verified: true,
    admin,
  });
  const container =
    process.env.SCHOOL_TEST_POSTGRES_CONTAINER || "deutschpilot-school-test-20261020";
  const school = `browser-db-${randomUUID()}`;
  const owner = id("owner", true);
  const str = (value: string) => `'${value.replace(/'/g, "''")}'`;
  const q = (value: unknown) => `${str(JSON.stringify(value))}::jsonb`;
  function sql(query: string) {
    try {
      return execFileSync(
        "/usr/local/bin/docker",
        ["exec", "-i", container, "psql", "-U", "postgres", "-Atq", "-v", "ON_ERROR_STOP=1"],
        { input: query, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
      ).trim();
    } catch (e) {
      const error = e as { stderr?: Buffer };
      console.error("SYNTHETIC_POSTGRES_ERROR", String(error.stderr || e));
      databaseError({ message: String(error.stderr || e) });
    }
  }
  function rpc(name: string, ...args: string[]): any {
    const raw = sql(`set role service_role; select to_jsonb(public.${name}(${args.join(",")}));`);
    return raw ? JSON.parse(raw) : null;
  }
  function load(user: Identity, action: Record<string, unknown> = {}) {
    const data = rpc("school_repository_read", str(school), q(user), q(action));
    return hydrate(school, data.records, data.pagination);
  }
  function commit(
    user: Identity,
    action: Record<string, unknown>,
    fn?: (state: SchoolState) => unknown
  ) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const loaded = load(user, action);
      const state = structuredClone(loaded.state);
      const result = fn ? fn(state) : apply(state, user, action, owner.id);
      try {
        rpc(
          "school_repository_commit",
          str(school),
          q(user),
          q(action),
          q(changesBetween(loaded, state)),
          str(owner.id)
        );
        return result as ReturnType<typeof apply>;
      } catch (e) {
        if (!(e instanceof SchoolError && e.code === "CONFLICT") || attempt === 3) throw e;
      }
    }
    throw new Error("Transaction retries exhausted");
  }

  function command(user: Identity, action: Record<string, unknown>) {
    return commit(user, action);
  }
  function view(user: Identity) {
    const loaded = load(user);
    const result = snapshot(loaded.state, user);
    result.pagination = loaded.pagination;
    result.pageCursors = Object.fromEntries(
      Object.entries(loaded.records).map(([kind, rows]) => [
        kind,
        loaded.pagination[kind] ? rows[rows.length - 1]?.id || null : null,
      ])
    );
    return result;
  }
  const state = new Proxy({} as SchoolState, {
    get(_target, key) {
      return load(owner).state[key as keyof SchoolState];
    },
  });
  let classId = "";
  let privateId = "";
  let current = owner;
  const files = new Map<string, Buffer>();
  const results: { step: string; status: string; screenshot?: string }[] = [];
  const browserErrors: string[] = [];
  const pdf = Buffer.from("%PDF-1.7\n Harmless synthetic school test document\n%%EOF");
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    acceptDownloads: true,
  });
  await context.route("**/api/school**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    try {
      if (url.pathname === "/api/school/documents") {
        if (request.method() === "GET") {
          const documentId = url.searchParams.get("id")!;
          let document: any;
          commit(current, { action: "document.download", documentId }, (state) => {
            document = authorizeDownload(state, current, documentId);
          });
          return await route.fulfill({
            status: 200,
            contentType: document.mime,
            body: files.get(document.id)!,
          });
        }
        const form = await new Response(Uint8Array.from(request.postDataBuffer()!), {
          headers: { "content-type": request.headers()["content-type"] },
        }).formData();
        const file = form.get("file") as File;
        const bytes = Buffer.from(await file.arrayBuffer());
        const documentId = randomUUID();
        let document: any;
        const input = {
          title: String(form.get("title")),
          category: String(form.get("category")),
          fileName: file.name,
          bytes,
          ...Object.fromEntries(
            ["absenceId", "letterId", "requestId"].flatMap((key) =>
              form.get(key) ? [[key, String(form.get(key))]] : []
            )
          ),
        };
        commit(
          current,
          {
            action: "document.upload",
            documentId,
            ...Object.fromEntries(
              ["absenceId", "letterId", "requestId"].flatMap((key) =>
                form.get(key) ? [[key, String(form.get(key))]] : []
              )
            ),
          },
          (state) => {
            document = registerDocument(state, current, input, documentId);
          }
        );
        const reservation = rpc("school_upload_begin", str(school), q(current), str(document.id));
        assert.equal(reservation.path, document.storagePath);
        assert.ok(reservation.lease);
        // Synthetic provider write is permitted only after the real database acquired the lease.
        files.set(document.id, bytes);
        const stored = rpc(
          "school_upload_finish",
          str(school),
          q(current),
          str(document.id),
          str(reservation.lease),
          str("stored")
        );
        assert.equal(stored.continue, true);
        assert.equal(stored.state, "stored");
        // Explicit provider fixture: upload is persisted, scanner is pending. Actual production API also returns a scan-pending failure.
        return await route.fulfill({
          status: 503,
          json: {
            error: "File quarantined; synthetic scanner has not completed",
            code: "SCAN_PENDING",
          },
        });
      }
      if (request.method() === "GET") return await route.fulfill({ json: view(current) });
      const action = request.postDataJSON();
      if (action.action === "chat.history" || action.action === "audit.list") {
        const entries = rpc(
          "school_repository_history",
          str(school),
          q(current),
          str(action.action === "chat.history" ? "chatMessages" : "audit"),
          action.classId ? str(action.classId) : "null",
          action.before ? str(action.before) : "null"
        );
        return await route.fulfill({
          json: {
            snapshot: view(current),
            ...(action.action === "chat.history"
              ? { messages: entries }
              : { auditEntries: entries }),
          },
        });
      }
      if (action.action === "section.page") {
        const page = rpc(
          "school_repository_page",
          str(school),
          q(current),
          str(action.section),
          action.before ? str(action.before) : "null"
        );
        const currentView = view(current);
        const office = ["owner", "office"].includes(currentView.actor.role);
        const items = page.items.map((row: any) => {
          if (action.section === "documents") {
            const { storagePath, sha256, ...safe } = row;
            return safe;
          }
          if (action.section === "members")
            return { ...row, email: office || row.id === current.id ? row.email : "" };
          if (action.section === "letters" && !office && row.createdBy !== current.id) {
            const map = (key: string) => ({ [current.id]: row[key]?.[current.id] });
            return {
              ...row,
              studentIds: [current.id],
              readBy: map("readBy"),
              acknowledgements: map("acknowledgements"),
              returnedDocuments: map("returnedDocuments"),
            };
          }
          return row;
        });
        return await route.fulfill({
          json: {
            snapshot: currentView,
            section: action.section,
            items,
            nextCursor: page.nextCursor,
          },
        });
      }
      if (action.action === "data.export")
        return await route.fulfill({
          json: {
            export: rpc(
              "school_repository_export",
              str(school),
              q(current),
              action.cursor ? str(action.cursor) : "null"
            ),
          },
        });
      const result = command(current, action);
      return await route.fulfill({ json: { ...result, snapshot: view(current) } });
    } catch (e) {
      const error = e as SchoolError;
      await route.fulfill({
        status: error.status || 500,
        json: { error: error.message, code: error.code || "TEST_ERROR" },
      });
    }
  });
  const trackerRequests: string[] = [];
  context.on("request", (request) => {
    if (
      /googletagmanager|google-analytics|\/_vercel\/insights|vitals\.vercel-insights/.test(
        request.url()
      )
    )
      trackerRequests.push(request.url());
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await mkdir(evidence, { recursive: true });
  async function screenshot(label: string) {
    const path = `${evidence}browser-db-${String(results.length + 1).padStart(2, "0")}-${label}.png`;
    await page.screenshot({ path, fullPage: true });
    return path;
  }
  async function pass(step: string, shot?: string) {
    results.push({ step, status: "PASS", ...(shot ? { screenshot: await screenshot(shot) } : {}) });
    console.log(`PASS ${step}`);
  }
  async function role(uid: string) {
    current = id(uid, uid === "owner");
    await page.goto(`${base}/en/school`);
    await page.getByRole("heading", { name: `Welcome, ${uid}`, exact: true }).waitFor();
  }
  async function tab(name: string) {
    await page.getByRole("tab", { name: new RegExp(`^${name}(?: •)?$`) }).click();
  }
  async function send(form: Locator, action: string) {
    const response = page.waitForResponse((r) => {
      try {
        return (
          new URL(r.url()).pathname === "/api/school" &&
          r.request().method() === "POST" &&
          r.request().postDataJSON().action === action
        );
      } catch {
        return false;
      }
    });
    await form.getByRole("button", { name: /./ }).last().click();
    const r = await response;
    assert.equal(r.status(), 200, await r.text());
    await page.waitForTimeout(60);
  }
  async function button(label: string, action: string) {
    const response = page.waitForResponse((r) => {
      try {
        return r.request().postDataJSON()?.action === action;
      } catch {
        return false;
      }
    });
    await page.getByRole("button", { name: label, exact: true }).click();
    assert.equal((await response).status(), 200);
    await page.waitForTimeout(60);
  }
  try {
    await page.goto(`${base}/en/school`);
    const bootstrap = page.getByRole("form", { name: "Set up a school" });
    await bootstrap.getByLabel("School name").fill("PostgreSQL browser school");
    await send(bootstrap, "bootstrap");
    await page.getByRole("heading", { name: "Welcome, owner", exact: true }).waitFor();
    await pass("Owner bootstraps unique school through UI into real PostgreSQL", "bootstrap");
    for (const [uid, role] of [
      ["office", "office"],
      ["teacher", "teacher"],
      ["teacher2", "teacher"],
      ["otherTeacher", "teacher"],
      ["student", "student"],
      ["otherStudent", "student"],
    ] as const) {
      const result = command(owner, {
        action: "invite.create",
        email: id(uid).email,
        name: uid,
        role,
      });
      command(id(uid), { action: "invite.accept", code: result.inviteCode });
    }
    command(owner, {
      action: "class.save",
      name: "A1 shared",
      teacherIds: ["teacher", "teacher2"],
      studentIds: ["student"],
      schedule: "Monday 10:00",
    });
    command(owner, {
      action: "class.save",
      name: "B1 private",
      teacherIds: ["otherTeacher"],
      studentIds: ["otherStudent"],
      schedule: "Tuesday 10:00",
    });
    classId = state.classes.find((c) => c.name === "A1 shared")!.id;
    privateId = state.classes.find((c) => c.name === "B1 private")!.id;
    await role("owner");
    await pass("Owner workspace loads authenticated synthetic membership", "owner-overview");
    await tab("People & access");
    let form = page.getByRole("form", { name: "Invite a school member" });
    await form.getByLabel("Full name").fill("Invited teacher");
    await form.getByLabel("E-Mail").fill("invited@school.example");
    await form.getByLabel("School role").selectOption("teacher");
    await send(form, "invite.create");
    assert.equal(
      Number(sql(`select count(*) from school_invites where school_id=${str(school)};`)),
      1
    );
    assert.ok(await page.getByText("Private invitation code", { exact: true }).isVisible());
    await pass("Owner creates email-bound private invitation and sees code");
    await tab("Classes");
    form = page.getByRole("form", { name: "Create class", exact: true });
    await form.getByLabel("Class name").fill("A2 browser-created");
    await form.getByLabel("Schedule / room").fill("Wednesday 11:00 / 2");
    await form.getByLabel("Assigned teachers").selectOption(["teacher", "teacher2"]);
    await form.getByLabel("Enrolled students").selectOption(["student"]);
    await send(form, "class.save");
    assert.deepEqual(
      state.classes.find((c) => c.name === "A2 browser-created")?.teacherIds.sort(),
      ["teacher", "teacher2"]
    );
    await pass("Owner creates class with two teachers and student assignment", "owner-classes");
    await tab("School settings");
    form = page.getByRole("form", { name: "School identity & privacy settings" });
    for (const [label, value] of [
      ["School display name", "Browser school"],
      ["Data controller / operator", "Synthetic controller"],
      ["Privacy contact", "privacy@school.example"],
      ["Documented legal basis", "Synthetic documented school basis"],
      ["Additional basis for health data", "Synthetic controller-approved health basis"],
    ])
      await form.getByLabel(label, { exact: false }).fill(value);
    assert.equal(await form.getByLabel("Attendance records (days)").inputValue(), "");
    assert.equal(
      await page.getByRole("button", { name: "Run configured cleanup", exact: true }).isDisabled(),
      true
    );
    for (const label of [
      "General documents (days)",
      "Jobcenter documents (days)",
      "Signed letters (days)",
      "Chat retention (days)",
      "Attendance records (days)",
    ])
      await form.getByLabel(label).fill("30");
    await form.getByLabel("Medical documents (days)").fill("14");
    await form.getByRole("button", { name: "Save settings", exact: true }).click();
    await page
      .getByText(
        "Complete all six record retention periods, or leave all six blank. Your entries have not been discarded.",
        { exact: true }
      )
      .waitFor();
    assert.equal(await form.getByLabel("Attendance records (days)").inputValue(), "30");
    assert.equal(await form.getByLabel("Absence records (days)").inputValue(), "");
    assert.equal(state.settings.sensitiveUploadsEnabled, false);
    await pass(
      "Record policy starts unconfigured; partial entries are preserved and cleanup remains disabled"
    );
    // Synthetic policy values exercise validation only; these are not German legal recommendations.
    for (const label of [
      "General documents (days)",
      "Jobcenter documents (days)",
      "Signed letters (days)",
      "Chat retention (days)",
      "Attendance records (days)",
      "Absence records (days)",
      "School letters (days)",
      "Notification records (days)",
      "Learning records (days)",
      "Audit records (days)",
    ])
      await form.getByLabel(label).fill("30");
    await form
      .getByLabel("Documented retention policy and basis")
      .fill(
        "Synthetic fixture only: controller test policy, not a legal retention recommendation."
      );
    await form.getByLabel("Medical documents (days)").fill("14");
    await form.getByLabel("Sensitive document workflow").selectOption("true");
    await send(form, "settings.update");
    assert.equal(state.settings.sensitiveUploadsEnabled, true);
    assert.equal(state.settings.retentionByCategory?.medical, 14);
    assert.equal(Object.keys(state.settings.recordRetentionDays || {}).length, 6);
    assert.ok(state.settings.retentionPolicyNote?.startsWith("Synthetic fixture only:"));
    assert.equal(
      await page.getByRole("button", { name: "Run configured cleanup", exact: true }).isEnabled(),
      true
    );
    await pass(
      "Owner saves identity, privacy configuration and category retention",
      "owner-settings"
    );
    await tab("School letters");
    form = page.getByRole("form", { name: "Send school letter" });
    await form.getByLabel("Subject").fill("Trip permission");
    await form.getByLabel("Recipients").selectOption(["student"]);
    await form
      .getByLabel("Letter content")
      .fill("Please sign and return the school trip permission.");
    await form.getByLabel("Reply deadline").fill("2026-12-01");
    await send(form, "letter.send");
    assert.equal(state.letters.length, 1);
    await pass("Owner sends school letter with reply deadline");
    await tab("Activity log");
    await page.getByText("School activity log", { exact: true }).waitFor();
    await page.getByRole("cell", { name: "letter.send", exact: true }).first().waitFor();
    await pass("Owner inspects actual role-restricted school audit trail", "owner-audit");
    await tab("Documents");
    form = page.getByRole("form", { name: "Request a document" });
    await form.getByLabel("Student").selectOption("student");
    await form.getByLabel("Request title").fill("Absence evidence");
    await form.getByLabel("Category").selectOption("medical");
    await form.getByLabel("Due date").fill("2026-12-01");
    await send(form, "document.request");
    assert.equal(state.documentRequests.length, 1);
    await pass("Office workflow requests private medical evidence");
    await role("teacher");
    assert.equal(await page.getByRole("tab", { name: "People & access" }).count(), 0);
    await tab("Attendance");
    form = page.getByRole("form", { name: "Record attendance" });
    assert.equal(
      await form.getByLabel("Status", { exact: false }).locator('option[value="excused"]').count(),
      0
    );
    await form.getByLabel("Class", { exact: false }).selectOption(classId);
    await form.getByLabel("Student").selectOption("student");
    await form.getByLabel("Date", { exact: false }).fill("2026-10-20");
    await form.getByLabel("Status", { exact: false }).selectOption("absent");
    await send(form, "attendance.set");
    assert.equal(state.attendance[0].status, "absent");
    await pass(
      "Teacher records attendance; office-only excused status unavailable",
      "teacher-attendance"
    );
    await tab("Class chats");
    await page.getByLabel("Chat class").selectOption(classId);
    form = page.getByRole("form", { name: "Write to your class" });
    await form.getByLabel("Message", { exact: false }).fill("Shared teacher class message");
    await send(form, "chat.send");
    assert.equal(state.chatMessages[0].body, "Shared teacher class message");
    await pass("First assigned teacher sends class message");
    const originalMessageId = state.chatMessages[0].id;
    for (let n = 0; n < 104; n++)
      command(id("student"), {
        action: "chat.send",
        classId,
        body: `Earlier classroom item ${n}`,
      });
    await role("teacher2");
    await tab("Class chats");
    await page.getByLabel("Chat class").selectOption(classId);
    await page.getByText("Earlier classroom item 103", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Load earlier messages" }).click();
    await page.getByText("Shared teacher class message", { exact: true }).waitFor();
    await pass(
      "Second assigned teacher accesses complete paged class history",
      "teacher2-full-chat"
    );
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .locator("article")
      .filter({ hasText: "Shared teacher class message" })
      .getByRole("button", { name: "Remove message" })
      .click();
    await page.getByText("Message removed by school moderation.").first().waitFor();
    assert.ok(
      JSON.parse(
        sql(
          `select payload from school_chat_messages where school_id=${str(school)} and id=${str(originalMessageId)};`
        )
      ).deletedAt
    );
    await pass("Assigned teacher moderates existing class message");
    command(id("teacher"), {
      action: "chat.moderate",
      classId,
      messageId: JSON.parse(
        sql(
          `select payload from school_chat_messages where school_id=${str(school)} and payload->>'body'='Earlier classroom item 0';`
        )
      ).id,
    });
    await page.getByRole("button", { name: "Refresh chat", exact: true }).click();
    await page.getByText("Earlier classroom item 0", { exact: true }).waitFor({ state: "hidden" });
    assert.equal(
      await page.getByText("Message removed by school moderation.", { exact: true }).count(),
      2
    );
    await pass("Refresh updates older loaded pages after another teacher moderates");
    await role("student");
    assert.equal(await page.getByRole("tab", { name: "School settings" }).count(), 0);
    await tab("Absences");
    form = page.getByRole("form", { name: "Report your absence" });
    await form.getByLabel("From").fill("2026-10-20");
    await form.getByLabel("Until").fill("2026-10-20");
    await form.getByLabel("Reason").selectOption("illness");
    await send(form, "absence.report");
    assert.equal(state.absences[0].studentId, "student");
    await pass("Student submits own illness absence after policy configuration", "student-absence");
    await tab("School letters");
    await button("Confirm receipt", "letter.acknowledge");
    assert.ok(state.letters[0].acknowledgements.student);
    await page.getByText("Receipt confirmed", { exact: false }).first().waitFor();
    await pass("Student reads and acknowledges school letter");
    await tab("Documents");
    form = page.getByRole("form", { name: "Upload a private document" });
    await form.getByLabel("Document title").fill("Synthetic doctor certificate");
    await form.getByLabel("Category").selectOption("medical");
    await form.getByLabel("File", { exact: false }).setInputFiles({
      name: "synthetic-certificate.pdf",
      mimeType: "application/pdf",
      buffer: pdf,
    });
    await form.getByLabel("Related absence").selectOption(state.absences[0].id);
    await form.getByLabel("Related request").selectOption(state.documentRequests[0].id);
    const uploaded = page.waitForResponse(
      (r) =>
        new URL(r.url()).pathname === "/api/school/documents" && r.request().method() === "POST"
    );
    await form.getByRole("button", { name: "Upload securely" }).click();
    assert.equal((await uploaded).status(), 503);
    await page.getByRole("button", { name: "Refresh", exact: true }).click();
    await page.getByRole("cell", { name: /Synthetic doctor certificate/ }).waitFor();
    assert.equal(state.documents[0].scanStatus, "quarantined");
    assert.equal(
      await page.getByRole("button", { name: "Download", exact: true }).isDisabled(),
      true
    );
    await pass(
      "Student upload acquires and finishes real SQL reservation; quarantine blocks download",
      "student-private-upload"
    );
    const doc = state.documents[0];
    commit(id("student"), { action: "document.scan", documentId: doc.id }, (state) =>
      applyScanResult(state, doc.id, doc.sha256!, "clean")
    );
    await page.getByRole("button", { name: "Refresh", exact: true }).click();
    await page.getByText("Available", { exact: true }).waitFor();
    assert.equal(state.documentRequests[0].fulfilledBy, doc.id);
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download", exact: true }).click();
    assert.equal((await downloadEvent).suggestedFilename(), "synthetic-certificate.pdf");
    await pass("Declared synthetic clean scan fulfils request and authorises own PDF download");
    await tab("School letters");
    await page.getByText("Return a signed copy", { exact: true }).click();
    form = page.getByRole("form", { name: "Return signed letter" });
    await form
      .getByLabel("Signed file")
      .setInputFiles({ name: "synthetic-signed.pdf", mimeType: "application/pdf", buffer: pdf });
    const signedResponse = page.waitForResponse(
      (r) =>
        new URL(r.url()).pathname === "/api/school/documents" && r.request().method() === "POST"
    );
    await form.getByRole("button", { name: "Upload signed copy" }).click();
    assert.equal((await signedResponse).status(), 503);
    const signed = state.documents.find((d) => d.category === "signed_letter")!;
    assert.ok(signed);
    assert.equal(state.letters[0].returnedDocuments.student, undefined);
    commit(id("student"), { action: "document.scan", documentId: signed.id }, (state) =>
      applyScanResult(state, signed.id, signed.sha256!, "clean")
    );
    await pass("Student uploads signed letter; return remains pending until trusted scan");
    await tab("Notifications");
    await page.getByRole("button", { name: "Mark notification as read" }).first().click();
    assert.ok(
      load(id("student")).state.notifications.some((n) => n.userId === "student" && n.readAt)
    );
    await pass("Student marks own notification as read");
    await role("office");
    await tab("Absences");
    await button("Approve", "absence.review");
    assert.equal(state.absences[0].status, "approved");
    assert.equal(state.attendance[0].status, "excused");
    await pass(
      "Office approves absence and existing attendance becomes excused",
      "office-absence-review"
    );
    await tab("Documents");
    await page
      .getByRole("row")
      .filter({ hasText: "Synthetic doctor certificate" })
      .getByText("Manage retention hold", { exact: true })
      .click();
    form = page.getByRole("form", { name: "Retention hold: Synthetic doctor certificate" });
    await form.getByLabel("Documented reason").fill("Synthetic legal obligation review");
    await form.getByLabel("Hold status").selectOption("true");
    await send(form, "document.hold");
    assert.equal(state.documents.find((d) => d.id === doc.id)?.legalHold, true);
    await pass("Office records document-specific retention hold");
    await role("teacher");
    await tab("Documents");
    assert.equal(await page.getByRole("cell", { name: /Synthetic doctor certificate/ }).count(), 0);
    assert.equal(await page.getByRole("form", { name: "Upload a private document" }).count(), 0);
    const deniedDocument = await page.evaluate(async (documentId) => {
      const response = await fetch(`/api/school/documents?id=${documentId}`);
      return response.status;
    }, doc.id);
    assert.equal(deniedDocument, 403);
    await pass("Teacher cannot see or fetch medical document", "teacher-private-view");
    await tab("Absences");
    await page.getByText("Approved", { exact: true }).waitFor();
    assert.equal(view(id("teacher")).absences.length, 0);
    assert.equal(view(id("teacher")).absenceSummaries?.[0].status, "approved");
    assert.ok(!JSON.stringify(view(id("teacher")).absenceSummaries).includes("illness"));
    await pass("Teacher sees approved absence summary without health reason or files");
    await role("otherTeacher");
    await tab("Class chats");
    assert.equal(
      await page.getByLabel("Chat class").locator(`option[value="${classId}"]`).count(),
      0
    );
    const denied = await page.evaluate(async (classId) => {
      const response = await fetch("/api/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat.history", classId }),
      });
      return response.status;
    }, classId);
    assert.equal(denied, 403);
    assert.equal(await page.getByLabel("Chat class").inputValue(), privateId);
    await pass("Unassigned teacher cannot see or fetch other class history", "unassigned-teacher");
    await role("otherStudent");
    await tab("School letters");
    assert.equal(await page.getByText("Trip permission", { exact: true }).count(), 0);
    await tab("Documents");
    assert.equal(await page.getByRole("cell", { name: /Synthetic doctor certificate/ }).count(), 0);
    const deniedOther = await page.evaluate(async (documentId) => {
      const response = await fetch(`/api/school/documents?id=${documentId}`);
      return response.status;
    }, doc.id);
    assert.equal(deniedOther, 403);
    await pass("Other student cannot see letter or private certificate");
    await role("owner");
    await tab("People & access");
    const teacher2Card = page.locator("article").filter({ hasText: "teacher2@school.example" });
    await teacher2Card.getByText("Manage access", { exact: true }).click();
    form = page.getByRole("form", { name: "Access for teacher2" });
    await form.getByLabel("Status").selectOption("false");
    await send(form, "member.update");
    current = id("teacher2");
    await page.goto(`${base}/en/school`);
    await page.locator('.school-error[role="alert"]').waitFor();
    const revoked = await page.evaluate(
      async (classId) =>
        (
          await fetch("/api/school", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "chat.history", classId }),
          })
        ).status,
      classId
    );
    assert.equal(revoked, 403);
    await pass("Owner revokes teacher access; both UI and history query deny revoked member");
    sql(
      `insert into school_progress(school_id,id,payload,created_at) select ${str(school)},'student:db-progress-'||lpad(i::text,5,'0'),jsonb_build_object('id','student:db-progress-'||lpad(i::text,5,'0'),'studentId','student','lessonId','web:synthetic-'||i,'completed',true,'score',85,'updatedAt',now()),now()+i*interval'1 second' from generate_series(1,1005)i;`
    );
    await role("student");
    await tab("Learning progress");
    assert.equal(await page.locator(".school-table tbody tr").count(), 1000);
    const archiveResponse = page.waitForResponse((response) => {
      try {
        return response.request().postDataJSON()?.action === "section.page";
      } catch {
        return false;
      }
    });
    await page.getByRole("button", { name: "Load more: progress", exact: true }).click();
    assert.equal((await archiveResponse).status(), 200);
    await page.waitForFunction(
      () => document.querySelectorAll(".school-table tbody tr").length === 1005
    );
    assert.equal(
      await page.getByRole("button", { name: "Load more: progress", exact: true }).count(),
      0
    );
    await pass("Progress archive loads all 1005 real PostgreSQL records beyond initial1000 cap");
    const exportDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export my school data", exact: true }).click();
    const exportedFile = await exportDownload;
    const exportedPath = await exportedFile.path();
    const exported = JSON.parse(await readFile(exportedPath!, "utf8"));
    assert.equal(exported.complete, true);
    assert.equal(exported.records.filter((record: any) => record.kind === "progress").length, 1005);
    assert.ok(
      exported.records.every(
        (record: any) => record.kind !== "members" || record.payload.id === "student"
      )
    );
    await pass("Own-data export follows real database pages and includes every practice record");
    command(owner, {
      action: "member.update",
      memberId: "student",
      role: "student",
      active: false,
    });
    await page.getByRole("button", { name: "Refresh", exact: true }).click();
    await page.locator('.school-error[role="alert"]').waitFor();
    assert.equal(await page.getByRole("tab").count(), 0);
    assert.equal(await page.locator(".school-table tbody tr").count(), 0);
    assert.equal(
      await page.getByRole("heading", { name: "Welcome, student", exact: true }).count(),
      0
    );
    await pass(
      "Active-session membership revocation clears previously loaded private UI on refresh"
    );
    command(owner, { action: "member.update", memberId: "student", role: "student", active: true });
    const restoredClass = state.classes.find((c) => c.id === classId)!;
    command(owner, { action: "class.save", ...restoredClass, studentIds: ["student"] });
    await role("student");
    await page.getByRole("button", { name: "Request deletion review", exact: true }).click();
    await page
      .getByText("Your deletion request is awaiting the school controller’s retention review.", {
        exact: true,
      })
      .waitFor();
    assert.equal(rpc("school_privacy_prepare", str(school), q(id("student"))).blocked, true);
    await pass("UI deletion review request persists; recorded legal hold blocks erasure");
    await role("office");
    await tab("Documents");
    await page
      .getByRole("row")
      .filter({ hasText: "Synthetic doctor certificate" })
      .getByText("Manage retention hold", { exact: true })
      .click();
    form = page.getByRole("form", { name: "Retention hold: Synthetic doctor certificate" });
    await form.getByLabel("Documented reason").fill("Synthetic obligation completed");
    await form.getByLabel("Hold status").selectOption("false");
    await send(form, "document.hold");
    const prepared = rpc("school_privacy_prepare", str(school), q(id("student")));
    assert.equal(prepared.blocked, false);
    const cleanup = rpc("school_privacy_cleanup_batch", str(school), str("student"));
    assert.equal(cleanup.length, 2);
    files.clear();
    rpc("school_cleanup_ack", str(school), q(cleanup));
    rpc("school_privacy_finalize", str(school), q(id("student")));
    assert.equal(
      Number(
        sql(`select count(*) from school_members where school_id=${str(school)} and id='student';`)
      ),
      0
    );
    assert.equal(
      Number(
        sql(
          `select count(*) from school_progress where school_id=${str(school)} and student_id='student';`
        )
      ),
      0
    );
    assert.equal(
      Number(
        sql(
          `select count(*) from school_documents where school_id=${str(school)} and student_id='student';`
        )
      ),
      0
    );
    await pass(
      "Office releases hold through UI; real SQL privacy cleanup removes own records after synthetic file cleanup"
    );
    current = id("outsider");
    await page.goto(`${base}/en/school`);
    await page.locator('.school-error[role="alert"]').waitFor();
    assert.equal(await page.getByRole("tab").count(), 0);
    await pass("Non-member receives access denial with no school records", "outsider-denied");
    await role("owner");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/de/school`);
    await page.getByRole("heading", { name: "Willkommen, owner" }).waitFor();
    await page.getByRole("tab", { name: "Klassen", exact: true }).click();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
      false
    );
    await pass(
      "German mobile-width class portal renders without horizontal page overflow",
      "german-mobile"
    );
    current = owner;
    await page.goto(`${base}/en/privacy`);
    await page.getByRole("link", { name: "Open school workspace", exact: true }).click();
    await page.getByRole("heading", { name: "Welcome, owner", exact: true }).waitFor();
    const html = await (await page.request.get(`${base}/en/school`)).text();
    assert.ok(!/googletagmanager|google-analytics|_vercel\/insights/.test(html));
    assert.deepEqual(trackerRequests, []);
    await pass(
      "No marketing trackers in school HTML or public-to-school SPA navigation",
      "school-tracker-free"
    );
    await page.goto(`${base}/en/signup?role=teacher`);
    await page
      .getByText(
        "Create a personal account. Teacher and school staff access is assigned only through your school’s invitation after email verification.",
        { exact: true }
      )
      .waitFor();
    assert.equal(await page.getByRole("button", { name: "Teacher", exact: true }).count(), 0);
    await page.locator("#signup-name").fill("Synthetic staff applicant");
    await page.locator("#signup-email").fill("synthetic-applicant@school.example");
    await page.locator("#signup-password").fill("Synthetic-only-12345");
    await page.locator("#signup-confirm").fill("Synthetic-only-12345");
    assert.equal(
      await page
        .locator("#signup-name")
        .evaluate((input) => (input.closest("form") as HTMLFormElement).checkValidity()),
      true
    );
    await pass(
      "Student signup form validates; teacher query cannot grant staff access (no account created)",
      "signup-invitation-boundary"
    );
    assert.deepEqual(browserErrors, []);
    await pass("No uncaught browser runtime errors across walkthrough");
  } catch (e) {
    results.push({
      step: e instanceof Error ? e.stack || e.message : String(e),
      status: "FAIL",
      screenshot: await screenshot("failure").catch(() => undefined),
    });
    console.error(e);
    process.exitCode = 1;
  } finally {
    await writeFile(
      `${evidence}browser-db-results.json`,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          school,
          container,
          scope:
            "Actual browser UI plus real normalized PostgreSQL repository reads/transactions/paging and upload reservation/begin/finish handshake. Explicit synthetic identities and intercepted HTTP transport; synthetic file bytes and scanner verdicts only. No live Firebase authentication, provider storage, remote scanner or push verification.",
          base,
          results,
          browserErrors,
          counts: {
            passed: results.filter((r) => r.status === "PASS").length,
            failed: results.filter((r) => r.status === "FAIL").length,
          },
        },
        null,
        2
      )
    );
    await browser.close();
  }
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
