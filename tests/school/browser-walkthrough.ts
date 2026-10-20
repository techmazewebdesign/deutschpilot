/** Synthetic browser walkthrough: production UI + domain engine; transport only is intercepted.
 * Does NOT prove real authentication, database persistence, storage, scanner or push delivery.
 */
import { strict as assert } from "node:assert";
import { mkdir, writeFile } from "node:fs/promises";
import {
  chromium,
  type Page,
  type Locator,
} from "/Users/rooz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js";
import { emptyState, apply, snapshot, SchoolError, type Identity } from "../../lib/school/engine";
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
  const state = emptyState("synthetic-browser-school");
  const owner = id("owner", true);
  apply(state, owner, { action: "bootstrap", name: "Synthetic language school" }, owner.id);
  for (const [uid, role] of [
    ["office", "office"],
    ["teacher", "teacher"],
    ["teacher2", "teacher"],
    ["otherTeacher", "teacher"],
    ["student", "student"],
    ["otherStudent", "student"],
  ] as const) {
    const result = apply(state, owner, {
      action: "invite.create",
      email: id(uid).email,
      name: uid,
      role,
    });
    apply(state, id(uid), { action: "invite.accept", code: result.inviteCode });
  }
  apply(state, owner, {
    action: "class.save",
    name: "A1 shared",
    teacherIds: ["teacher", "teacher2"],
    studentIds: ["student"],
    schedule: "Monday 10:00",
  });
  apply(state, owner, {
    action: "class.save",
    name: "B1 private",
    teacherIds: ["otherTeacher"],
    studentIds: ["otherStudent"],
    schedule: "Tuesday 10:00",
  });
  const classId = state.classes[0].id;
  const privateId = state.classes[1].id;
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
    const req = route.request();
    const url = new URL(req.url());
    try {
      if (url.pathname === "/api/school/documents") {
        if (req.method() === "GET") {
          const d = authorizeDownload(state, current, url.searchParams.get("id")!);
          return await route.fulfill({ status: 200, contentType: d.mime, body: files.get(d.id)! });
        }
        const body = await new Response(Uint8Array.from(req.postDataBuffer()!), {
          headers: { "content-type": req.headers()["content-type"] },
        }).formData();
        const file = body.get("file") as File;
        const bytes = Buffer.from(await file.arrayBuffer());
        const d = registerDocument(state, current, {
          title: String(body.get("title")),
          category: String(body.get("category")),
          fileName: file.name,
          bytes,
          ...Object.fromEntries(
            ["absenceId", "requestId", "letterId"].flatMap((key) =>
              body.get(key) ? [[key, String(body.get(key))]] : []
            )
          ),
        });
        files.set(d.id, bytes);
        state.version++;
        return await route.fulfill({
          json: { document: snapshot(state, current).documents.find((x) => x.id === d.id) },
        });
      }
      if (req.method() === "GET") return await route.fulfill({ json: snapshot(state, current) });
      const action = req.postDataJSON();
      const result = apply(state, current, action, owner.id);
      state.version++;
      return await route.fulfill({ json: { ...result, snapshot: snapshot(state, current) } });
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
    const path = `${evidence}browser-${String(results.length + 1).padStart(2, "0")}-${label}.png`;
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
    await role("owner");
    await pass("Owner workspace loads authenticated synthetic membership", "owner-overview");
    await tab("People & access");
    let form = page.getByRole("form", { name: "Invite a school member" });
    await form.getByLabel("Full name").fill("Invited teacher");
    await form.getByLabel("E-Mail").fill("invited@school.example");
    await form.getByLabel("School role").selectOption("teacher");
    await send(form, "invite.create");
    assert.equal(state.invites.length, 1);
    assert.ok(await page.getByText("Private invitation code", { exact: true }).isVisible());
    await pass("Owner creates email-bound private invitation and sees code");
    await tab("Classes");
    form = page.getByRole("form", { name: "Create class", exact: true });
    await form.getByLabel("Class name").fill("A2 browser-created");
    await form.getByLabel("Schedule / room").fill("Wednesday 11:00 / 2");
    await form.getByLabel("Assigned teachers").selectOption(["teacher", "teacher2"]);
    await form.getByLabel("Enrolled students").selectOption(["student"]);
    await send(form, "class.save");
    assert.deepEqual(state.classes.find((c) => c.name === "A2 browser-created")?.teacherIds, [
      "teacher",
      "teacher2",
    ]);
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
    form = page.getByRole("form", { name: "Write to your class" });
    await form.getByLabel("Message", { exact: false }).fill("Shared teacher class message");
    await send(form, "chat.send");
    assert.equal(state.chatMessages[0].body, "Shared teacher class message");
    await pass("First assigned teacher sends class message");
    for (let n = 0; n < 104; n++)
      apply(state, id("student"), {
        action: "chat.send",
        classId,
        body: `Earlier classroom item ${n}`,
      });
    await role("teacher2");
    await tab("Class chats");
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
    assert.ok(state.chatMessages[0].deletedAt);
    await pass("Assigned teacher moderates existing class message");
    apply(state, id("teacher"), {
      action: "chat.moderate",
      classId,
      messageId: state.chatMessages[1].id,
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
    assert.equal((await uploaded).status(), 200);
    await page.getByRole("cell", { name: /Synthetic doctor certificate/ }).waitFor();
    assert.equal(state.documents[0].scanStatus, "quarantined");
    assert.equal(
      await page.getByRole("button", { name: "Download", exact: true }).isDisabled(),
      true
    );
    await pass(
      "Student uploads PDF tied to absence/request; quarantine blocks download",
      "student-private-upload"
    );
    const doc = state.documents[0];
    applyScanResult(state, doc.id, doc.sha256!, "clean");
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
    assert.equal((await signedResponse).status(), 200);
    const signed = state.documents.find((d) => d.category === "signed_letter")!;
    assert.ok(signed);
    assert.equal(state.letters[0].returnedDocuments.student, undefined);
    applyScanResult(state, signed.id, signed.sha256!, "clean");
    await pass("Student uploads signed letter; return remains pending until trusted scan");
    await tab("Notifications");
    await page.getByRole("button", { name: "Mark notification as read" }).first().click();
    assert.ok(state.notifications.some((n) => n.userId === "student" && n.readAt));
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
    await page.getByText("Manage retention hold", { exact: true }).first().click();
    form = page.getByRole("form", { name: "Retention hold: Synthetic doctor certificate" });
    await form.getByLabel("Documented reason").fill("Synthetic legal obligation review");
    await form.getByLabel("Hold status").selectOption("true");
    await send(form, "document.hold");
    assert.equal(doc.legalHold, true);
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
      `${evidence}browser-results.json`,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          scope:
            "Actual browser UI with synthetic in-process engine and intercepted transport. No live auth, database, scanner, storage or push verification.",
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
