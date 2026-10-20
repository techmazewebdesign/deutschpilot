"use client";

import { useCallback, useEffect, useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  GraduationCap,
  Bell,
  Download,
  Check,
  FileText,
} from "lucide-react";
import type {
  SchoolAction,
  SchoolSnapshot,
  SchoolRole,
  SchoolSettings,
  Attendance,
  Absence,
  SchoolDocument,
} from "@/lib/school/contract";
import { SchoolForm, type Field } from "./school-form";
import { ClassChat } from "./class-chat";
import { SchoolAudit } from "./school-audit";
import { SchoolArchive, type SchoolRecordSection } from "./school-archive";
import "./school.css";

type Section =
  | "audit"
  | "chat"
  | "overview"
  | "classes"
  | "attendance"
  | "absences"
  | "documents"
  | "letters"
  | "inbox"
  | "progress"
  | "team"
  | "settings";
const split = (text: string) => text.split(",").filter(Boolean);
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const roleOrder: SchoolRole[] = ["owner", "office", "teacher", "student"];
const recordPolicyKeys = [
  "attendance",
  "absences",
  "letters",
  "notifications",
  "progress",
  "audit",
] as const;
const categoryList: SchoolDocument["category"][] = [
  "general",
  "medical",
  "jobcenter",
  "signed_letter",
];

export function SchoolPortal({ locale }: { locale: string }) {
  const de = locale === "de";
  const t = useCallback((en: string, german: string) => (de ? german : en), [de]);
  const [snapshot, setSnapshot] = useState<SchoolSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [exportCursor, setExportCursor] = useState<string | null>(null);
  const [viewEpoch, setViewEpoch] = useState(0);
  const [section, setSection] = useState<Section>("overview");
  const [classFilter, setClassFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(today);

  const actorId = useRef<string | null>(null);
  const clearScope = useCallback(() => {
    actorId.current = null;
    setSnapshot(null);
    setInviteCode("");
    setExportCursor(null);
    setSection("overview");
    setClassFilter("");
    setNotice("");
    setViewEpoch((epoch) => epoch + 1);
  }, []);
  const acceptSnapshot = useCallback((next: SchoolSnapshot) => {
    if (actorId.current && actorId.current !== next.actor.id) {
      setInviteCode("");
      setExportCursor(null);
      setSection("overview");
      setClassFilter("");
      setNotice("");
    }
    actorId.current = next.actor.id;
    setSnapshot(next);
    setViewEpoch((epoch) => epoch + 1);
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/school", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) clearScope();
        setErrorCode(response.status === 401 ? "401" : (data.code ?? String(response.status)));
        throw new Error(
          data.error ||
            t("Unable to load school workspace", "Schulbereich konnte nicht geladen werden")
        );
      }
      acceptSnapshot(data);
      setErrorCode("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("Connection failed", "Verbindung fehlgeschlagen")
      );
    } finally {
      setLoading(false);
    }
  }, [t, clearScope, acceptSnapshot]);
  useEffect(() => {
    void load();
  }, [load]);

  async function command(action: SchoolAction) {
    const response = await fetch("/api/school", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) clearScope();
      throw new Error(data.error || t("Could not save", "Speichern fehlgeschlagen"));
    }
    if (data.snapshot) {
      acceptSnapshot(data.snapshot);
      setError("");
      setErrorCode("");
    }
    if (data.inviteCode) setInviteCode(data.inviteCode);
    if (data.export) {
      let exported = data.export;
      if (Array.isArray(exported.records)) {
        const records = [...exported.records];
        let cursor = exported.nextCursor;
        let bytes = JSON.stringify(records).length;
        for (let page = 1; cursor && page < 100 && bytes < 8 * 1024 * 1024; page++) {
          setNotice(
            t(
              `Preparing data export: ${records.length} records…`,
              `Datenexport wird vorbereitet: ${records.length} Einträge…`
            )
          );
          const next = await fetch("/api/school", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "data.export", cursor }),
          });
          const body = await next.json();
          if (next.status === 401 || next.status === 403) clearScope();
          if (!next.ok || !Array.isArray(body.export?.records))
            throw new Error(
              body.error ||
                t(
                  "Export interrupted. Please retry.",
                  "Export unterbrochen. Bitte erneut versuchen."
                )
            );
          records.push(...body.export.records);
          bytes += JSON.stringify(body.export.records).length;
          cursor = body.export.nextCursor;
        }
        exported = {
          records,
          complete: !cursor,
          nextCursor: cursor || null,
          exportedAt: new Date().toISOString(),
        };
        setExportCursor(cursor || null);
      }
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" })
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `deutschpilot-data-${today()}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setNotice(
        exported.complete === false
          ? t(
              "Partial export downloaded. Use Continue data export to download the remaining pages.",
              "Teilexport heruntergeladen. Laden Sie die restlichen Seiten über Datenexport fortsetzen herunter."
            )
          : t("Your data export has been downloaded.", "Ihr Datenexport wurde heruntergeladen.")
      );
      return;
    }
    setNotice(
      t("Saved. Your workspace is up to date.", "Gespeichert. Ihr Schulbereich ist aktuell.")
    );
  }
  async function run(action: SchoolAction) {
    setBusy(true);
    setNotice("");
    try {
      await command(action);
    } catch (e) {
      setNotice("");
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }
  function appendPage(key: SchoolRecordSection, items: unknown[], more: boolean) {
    setSnapshot((current) => {
      if (!current) return current;
      const previous = current[key] as { id: string }[];
      const map = new Map(previous.map((item) => [item.id, item]));
      for (const item of items as { id: string }[]) map.set(item.id, item);
      return {
        ...current,
        [key]: Array.from(map.values()),
        pagination: { ...current.pagination, [key]: more },
      };
    });
  }
  async function upload(values: Record<string, string>, form: HTMLFormElement) {
    const input = form.elements.namedItem("file") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) throw new Error(t("Choose a file.", "Bitte eine Datei auswählen."));
    if (file.size > 10 * 1024 * 1024)
      throw new Error(t("Maximum file size: 10 MB.", "Maximale Dateigröße: 10 MB."));
    const body = new FormData();
    body.set("file", file);
    for (const [key, value] of Object.entries(values))
      if (key !== "file" && value) body.set(key, value);
    const response = await fetch("/api/school/documents", {
      method: "POST",
      credentials: "same-origin",
      body,
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) clearScope();
      throw new Error(data.error || t("Upload failed", "Upload fehlgeschlagen"));
    }
    await load();
    setNotice(
      t(
        "Uploaded privately. The file remains unavailable until security scanning is complete.",
        "Privat hochgeladen. Die Datei bleibt bis zum Abschluss der Sicherheitsprüfung gesperrt."
      )
    );
  }
  async function download(id: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/school/documents?id=${encodeURIComponent(id)}`, {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) clearScope();
        const data = await response.json();
        throw new Error(data.error);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = snapshot?.documents.find((d) => d.id === id)?.fileName || "document";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setBusy(false);
    }
  }

  const role = snapshot?.actor.role;
  const manager = role === "owner" || role === "office";
  const teacher = role === "teacher";
  const student = role === "student";
  const configuredRecordPolicy =
    !!snapshot?.settings.retentionPolicyNote?.trim() &&
    recordPolicyKeys.every((key) => Number(snapshot?.settings.recordRetentionDays?.[key]) > 0);
  const visibleAbsences = teacher ? snapshot?.absenceSummaries || [] : snapshot?.absences || [];
  const memberName = (id: string) =>
    snapshot?.members.find((m) => m.id === id)?.name ||
    (id === snapshot?.actor.id ? snapshot.actor.name : t("Member", "Mitglied"));
  const className = (id: string) =>
    snapshot?.classes.find((c) => c.id === id)?.name || t("Class", "Klasse");
  const roleLabel = (r: string) =>
    ({
      owner: t("School manager", "Schulleitung"),
      office: t("School office", "Sekretariat"),
      teacher: t("Teacher", "Lehrkraft"),
      student: t("Student", "Lernende"),
    })[r] || r;
  const catLabel = (c: string) =>
    ({
      general: t("General", "Allgemein"),
      medical: t("Medical certificate", "Ärztliche Bescheinigung"),
      jobcenter: "Jobcenter",
      signed_letter: t("Signed letter", "Unterschriebenes Schreiben"),
    })[c] || c;
  const statusLabel = (s: string) =>
    ({
      present: t("Present", "Anwesend"),
      late: t("Late", "Verspätet"),
      absent: t("Absent", "Abwesend"),
      excused: t("Excused", "Entschuldigt"),
      pending: t("Pending", "Offen"),
      approved: t("Approved", "Genehmigt"),
      rejected: t("Rejected", "Abgelehnt"),
      quarantined: t("Security scan pending", "Sicherheitsprüfung ausstehend"),
      clean: t("Available", "Verfügbar"),
    })[s] || s;
  const personOptions =
    snapshot?.members
      .filter((m) => m.active && m.role === "student")
      .map((m) => ({ value: m.id, label: m.name })) ?? [];
  const teacherOptions =
    snapshot?.members
      .filter((m) => m.active && m.role === "teacher")
      .map((m) => ({ value: m.id, label: m.name })) ?? [];
  const classesOptions = snapshot?.classes.map((c) => ({ value: c.id, label: c.name })) ?? [];
  const categories = categoryList
    .filter((c) => c !== "medical" || snapshot?.capabilities.sensitiveUploads)
    .map((c) => ({ value: c, label: catLabel(c) }));
  const date = (v: string) =>
    v
      ? new Date(v.length === 10 ? `${v}T12:00:00` : v).toLocaleDateString(de ? "de-DE" : "en-GB")
      : "—";
  const empty = (
    <div className="school-empty">
      {t(
        "No records yet. New activity will appear here.",
        "Noch keine Einträge. Neue Vorgänge erscheinen hier."
      )}
    </div>
  );
  const badge = (status: string) => (
    <span
      className={`school-badge ${["clean", "approved", "present", "excused"].includes(status) ? "good" : "warn"}`}
    >
      {statusLabel(status)}
    </span>
  );
  function lessonLabel(progress: SchoolSnapshot["progress"][number]) {
    const meta = progress as typeof progress & {
      lessonTitle?: string;
      level?: string;
      source?: string;
    };
    const source =
      meta.source === "web" || progress.lessonId.startsWith("web:")
        ? t("Web app", "Web-App")
        : meta.source === "mobile"
          ? t("Mobile app", "Mobile App")
          : t("Practice", "Übung");
    return (
      <div>
        <strong>{meta.lessonTitle || t("Lesson practice", "Lektionsübung")}</strong>
        <small className="school-muted" style={{ display: "block" }}>
          {[meta.level, source].filter(Boolean).join(" · ")}
        </small>
        <details>
          <summary>{t("Lesson identifier", "Lektionskennung")}</summary>
          <code style={{ fontSize: 11, overflowWrap: "anywhere" }}>{progress.lessonId}</code>
        </details>
      </div>
    );
  }
  const panel = (title: string, children: ReactNode, hint?: string) => (
    <section className="school-panel">
      <h2>{title}</h2>
      {hint && <p className="school-muted">{hint}</p>}
      {children}
    </section>
  );
  const actionButton = (label: string, action: SchoolAction, secondary = true) => (
    <button
      type="button"
      disabled={busy}
      className={`school-button ${secondary ? "secondary" : ""}`}
      onClick={() => void run(action)}
    >
      {label}
    </button>
  );
  const tabs: { id: Section; label: string }[] = [
    { id: "chat", label: t("Class chats", "Klassenchats") },
    { id: "overview", label: t("Overview", "Übersicht") },
    { id: "classes", label: t("Classes", "Klassen") },
    { id: "attendance", label: t("Attendance", "Anwesenheit") },
    { id: "absences", label: t("Absences", "Abwesenheiten") },
    { id: "documents", label: t("Documents", "Dokumente") },
    { id: "letters", label: t("School letters", "Schreiben") },
    { id: "inbox", label: t("Notifications", "Mitteilungen") },
    { id: "progress", label: t("Learning progress", "Lernfortschritt") },
    ...(manager
      ? [{ id: "team" as const, label: t("People & access", "Personen & Zugriff") }]
      : []),
    ...(role === "owner"
      ? [
          { id: "settings" as const, label: t("School settings", "Schuleinstellungen") },
          { id: "audit" as const, label: t("Activity log", "Aktivitätsprotokoll") },
        ]
      : []),
  ];

  const classFields = (schoolClass?: NonNullable<typeof snapshot>["classes"][number]): Field[] => [
    {
      name: "name",
      label: t("Class name", "Klassenname"),
      required: true,
      value: schoolClass?.name,
    },
    {
      name: "schedule",
      label: t("Schedule / room", "Unterrichtszeiten / Raum"),
      value: schoolClass?.schedule,
    },
    {
      name: "teacherIds",
      label: t("Assigned teachers", "Zugewiesene Lehrkräfte"),
      options: teacherOptions,
      multiple: true,
      value: schoolClass?.teacherIds.join(","),
      hint: t("Select multiple with Ctrl / Cmd.", "Mehrfachauswahl mit Strg / Cmd."),
    },
    {
      name: "studentIds",
      label: t("Enrolled students", "Eingeschriebene Lernende"),
      options: personOptions,
      multiple: true,
      value: schoolClass?.studentIds.join(","),
    },
  ];

  return (
    <div className="school-root">
      <a href="#school-content" className="school-skip">
        {t("Skip to content", "Zum Inhalt")}
      </a>
      <header className="school-top">
        <div className="school-brand">
          <span className="school-brandmark" aria-hidden="true">
            <GraduationCap size={25} />
          </span>
          <div>
            <strong>DeutschPilot</strong>
            <small>{snapshot?.settings.name || t("School workspace", "Schulbereich")}</small>
          </div>
        </div>
        <Link href={`/${locale}/dashboard`} className="school-button secondary">
          <ArrowLeft size={15} />
          {t("Learning", "Lernen")}
        </Link>
      </header>
      <main className="school-shell" id="school-content">
        <div className="school-hero">
          <div>
            <span className="school-eyebrow">
              {t("Learn · Organise · Connect", "Lernen · Organisieren · Verbinden")}
            </span>
            <h1>
              {snapshot
                ? t(`Welcome, ${snapshot.actor.name}`, `Willkommen, ${snapshot.actor.name}`)
                : t("Your school, connected", "Ihre Schule, verbunden")}
            </h1>
            <p className="school-muted">
              {snapshot
                ? `${roleLabel(snapshot.actor.role)} · ${snapshot.actor.email}`
                : t(
                    "One private workspace for students, teachers and the school office.",
                    "Ein privater Bereich für Lernende, Lehrkräfte und das Sekretariat."
                  )}
            </p>
          </div>
          <button
            className="school-button secondary"
            disabled={loading || busy}
            onClick={() => void load()}
          >
            <RefreshCw size={16} />
            {t("Refresh", "Aktualisieren")}
          </button>
        </div>
        {notice && (
          <div className="school-notice success" role="status">
            {notice}
          </div>
        )}
        {error && (
          <div className="school-error" role="alert">
            {error}
            {errorCode && <small> ({errorCode})</small>}
            {errorCode === "401" && (
              <p>
                <Link href={`/${locale}/signin`}>{t("Sign in", "Anmelden")}</Link>
              </p>
            )}
          </div>
        )}
        {loading && !snapshot ? (
          <div
            className="school-stats"
            aria-label={t("Loading workspace", "Schulbereich wird geladen")}
            aria-busy="true"
          >
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="school-skeleton" />
            ))}
          </div>
        ) : !snapshot ? (
          <div className="school-grid">
            <SchoolForm
              title={t("Join your school", "Ihrer Schule beitreten")}
              description={t(
                "Use the private invitation code supplied by your school. Sign in using the invited email address first.",
                "Verwenden Sie den privaten Einladungscode Ihrer Schule. Melden Sie sich zuerst mit der eingeladenen E-Mail-Adresse an."
              )}
              fields={[
                { name: "code", label: t("Invitation code", "Einladungscode"), required: true },
              ]}
              submit={t("Join school", "Schule beitreten")}
              action={async (d) => command({ action: "invite.accept", code: d.code })}
            />
            <SchoolForm
              title={t("Set up a school", "Schule einrichten")}
              description={t(
                "Only the explicitly configured, verified school owner can initialise the workspace. Missing server configuration cannot be bypassed here.",
                "Nur die ausdrücklich konfigurierte und verifizierte Schulleitung kann den Bereich initialisieren. Eine fehlende Serverkonfiguration kann hier nicht umgangen werden."
              )}
              fields={[{ name: "name", label: t("School name", "Schulname"), required: true }]}
              submit={t("Create workspace", "Schulbereich erstellen")}
              action={async (d) => command({ action: "bootstrap", name: d.name })}
            />
          </div>
        ) : (
          <>
            <nav
              className="school-tabs"
              role="tablist"
              aria-label={t("School sections", "Schulbereiche")}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={section === tab.id}
                  aria-controls="school-section"
                  onClick={() => {
                    setSection(tab.id);
                    setError("");
                  }}
                >
                  {tab.label}
                  {tab.id === "inbox" && snapshot.notifications.some((n) => !n.readAt) ? " •" : ""}
                </button>
              ))}
            </nav>
            {Object.values(snapshot.pagination || {}).some(Boolean) && (
              <div className="school-notice" role="status">
                {t(
                  "This view contains a limited page of school records. Counts describe loaded records, not school-wide totals. Use Load more to include older records. Refresh starts a new current view.",
                  "Diese Ansicht enthält eine begrenzte Seite von Schuldaten. Zahlen beziehen sich auf geladene Einträge, nicht auf schulweite Gesamtzahlen. Weitere laden ergänzt ältere Einträge. Aktualisieren startet eine neue aktuelle Ansicht."
                )}
              </div>
            )}
            <div className="school-actions" style={{ marginBottom: 18 }}>
              {(section === "classes"
                ? ["classes", ...(manager ? ["members"] : [])]
                : section === "team"
                  ? ["members"]
                  : section === "attendance"
                    ? ["attendance"]
                    : section === "absences"
                      ? ["absences"]
                      : section === "documents"
                        ? ["documents", "documentRequests"]
                        : section === "letters"
                          ? ["letters"]
                          : section === "inbox"
                            ? ["notifications"]
                            : section === "progress"
                              ? ["progress"]
                              : []
              ).map((key) => (
                <SchoolArchive
                  key={`${key}-${viewEpoch}`}
                  snapshot={snapshot}
                  section={key as SchoolRecordSection}
                  locale={locale}
                  label={
                    (
                      {
                        members: t("people", "Personen"),
                        classes: t("classes", "Klassen"),
                        attendance: t("attendance", "Anwesenheit"),
                        absences: t("absences", "Abwesenheiten"),
                        documents: t("documents", "Dokumente"),
                        documentRequests: t("requests", "Anfragen"),
                        letters: t("letters", "Schreiben"),
                        notifications: t("notifications", "Mitteilungen"),
                        progress: t("progress", "Lernfortschritte"),
                      } as Record<string, string>
                    )[key]
                  }
                  onPage={appendPage}
                  onAccessDenied={clearScope}
                />
              ))}
            </div>
            <div
              id="school-section"
              role="tabpanel"
              aria-labelledby={`tab-${section}`}
              tabIndex={0}
              className="school-stack"
            >
              {section === "audit" && role === "owner" && (
                <SchoolAudit locale={locale} onAccessDenied={clearScope} />
              )}
              {section === "chat" && (
                <ClassChat
                  key={snapshot.actor.id}
                  snapshot={snapshot}
                  locale={locale}
                  command={command}
                  onAccessDenied={clearScope}
                />
              )}
              {section === "overview" && (
                <>
                  <div className="school-stats">
                    {[
                      {
                        label: t("Loaded classes", "Geladene Klassen"),
                        count: snapshot.classes.length,
                      },
                      {
                        label: t("Loaded unread notifications", "Geladene ungelesene Mitteilungen"),
                        count: snapshot.notifications.filter((n) => !n.readAt).length,
                      },
                      {
                        label: t("Loaded pending absences", "Geladene offene Abwesenheiten"),
                        count: visibleAbsences.filter((a) => a.status === "pending").length,
                      },
                      {
                        label: t("Loaded document requests", "Geladene Dokumentanfragen"),
                        count: snapshot.documentRequests.filter((r) => !r.fulfilledBy).length,
                      },
                    ].map((stat) => (
                      <div className="school-stat" key={stat.label}>
                        <strong>{stat.count}</strong>
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="school-grid">
                    {panel(
                      t("Your next steps", "Ihre nächsten Schritte"),
                      <>
                        <ul className="school-help">
                          <li>
                            {student
                              ? t(
                                  "Report an absence and securely upload requested evidence.",
                                  "Melden Sie Abwesenheiten und laden Sie angeforderte Nachweise sicher hoch."
                                )
                              : t(
                                  "Check attendance and review pending school correspondence.",
                                  "Prüfen Sie Anwesenheit und offene Schulkorrespondenz."
                                )}
                          </li>
                          <li>
                            {t(
                              "Read school letters and confirm receipt before their deadline.",
                              "Lesen Sie Schreiben der Schule und bestätigen Sie den Empfang vor Ablauf der Frist."
                            )}
                          </li>
                          <li>
                            {t(
                              "Learning progress is visible only to authorised school members.",
                              "Lernfortschritte sind nur für berechtigte Schulmitglieder sichtbar."
                            )}
                          </li>
                        </ul>
                        <div className="school-actions">
                          <button className="school-button" onClick={() => setSection("letters")}>
                            <FileText size={16} />
                            {t("Open school letters", "Schreiben öffnen")}
                          </button>
                          <button
                            className="school-button secondary"
                            onClick={() => setSection("inbox")}
                          >
                            <Bell size={16} />
                            {t("View notifications", "Mitteilungen ansehen")}
                          </button>
                        </div>
                      </>
                    )}
                    {panel(
                      t("Private by design", "Vertraulich organisiert"),
                      <>
                        <ShieldCheck color="#e2ba77" size={28} />
                        <p className="school-muted">
                          {t(
                            "Your role and class assignments determine what you can see. Medical documents are restricted to the student and authorised office staff. Do not include diagnoses in free text.",
                            "Ihre Rolle und Klassenzuweisung bestimmen Ihren Zugriff. Medizinische Dokumente sind auf Lernende und berechtigte Verwaltungsmitglieder beschränkt. Bitte keine Diagnosen in Freitext eingeben."
                          )}
                        </p>
                        <Link href={`/${locale}/privacy`}>
                          {t("Read privacy information", "Datenschutzinformationen lesen")}
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
              {section === "classes" && (
                <>
                  {panel(
                    t("Classes & rosters", "Klassen & Listen"),
                    snapshot.classes.length
                      ? snapshot.classes.map((c) => (
                          <article className="school-record" key={c.id}>
                            <div className="school-row">
                              <h3>{c.name}</h3>
                              <span className="school-badge">
                                {c.studentIds.length} {t("students", "Lernende")}
                              </span>
                            </div>
                            <p className="school-muted">
                              {c.schedule || t("Schedule not set", "Zeiten noch nicht festgelegt")}{" "}
                              ·{" "}
                              {c.teacherIds.map(memberName).join(", ") ||
                                t("Teacher not assigned", "Noch keine Lehrkraft")}
                            </p>
                            <p>
                              {c.studentIds.map(memberName).join(" · ") ||
                                t("No students enrolled.", "Noch keine Lernenden eingeschrieben.")}
                            </p>
                            {manager && (
                              <details>
                                <summary>
                                  {t(
                                    "Edit class and assignments",
                                    "Klasse und Zuweisungen bearbeiten"
                                  )}
                                </summary>
                                <SchoolForm
                                  title={t("Update class", "Klasse aktualisieren")}
                                  fields={classFields(c)}
                                  submit={t("Save class", "Klasse speichern")}
                                  action={async (d) =>
                                    command({
                                      action: "class.save",
                                      id: c.id,
                                      name: d.name,
                                      schedule: d.schedule,
                                      teacherIds: split(d.teacherIds),
                                      studentIds: split(d.studentIds),
                                    })
                                  }
                                />
                              </details>
                            )}
                          </article>
                        ))
                      : empty
                  )}
                  {manager && (
                    <SchoolForm
                      title={t("Create class", "Klasse erstellen")}
                      fields={classFields()}
                      submit={t("Create class", "Klasse erstellen")}
                      action={async (d) =>
                        command({
                          action: "class.save",
                          name: d.name,
                          schedule: d.schedule,
                          teacherIds: split(d.teacherIds),
                          studentIds: split(d.studentIds),
                        })
                      }
                    />
                  )}
                </>
              )}
              {section === "attendance" && (
                <>
                  {(manager || teacher) && (
                    <SchoolForm
                      title={t("Record attendance", "Anwesenheit erfassen")}
                      description={t(
                        "You can record attendance only for classes and students you are authorised to manage.",
                        "Sie können Anwesenheit nur für Klassen und Lernende in Ihrem Zuständigkeitsbereich erfassen."
                      )}
                      fields={[
                        {
                          name: "classId",
                          label: t("Class", "Klasse"),
                          required: true,
                          options: classesOptions,
                        },
                        {
                          name: "studentId",
                          label: t("Student", "Lernende Person"),
                          required: true,
                          options: personOptions,
                        },
                        {
                          name: "date",
                          label: t("Date", "Datum"),
                          type: "date",
                          required: true,
                          value: today(),
                        },
                        {
                          name: "status",
                          label: "Status",
                          required: true,
                          options: [
                            "present",
                            "late",
                            "absent",
                            ...(manager ? ["excused"] : []),
                          ].map((s) => ({ value: s, label: statusLabel(s) })),
                        },
                      ]}
                      submit={t("Save attendance", "Anwesenheit speichern")}
                      action={async (d) =>
                        command({
                          action: "attendance.set",
                          classId: d.classId,
                          studentId: d.studentId,
                          date: d.date,
                          status: d.status as Attendance["status"],
                        })
                      }
                    />
                  )}
                  {panel(
                    t("Attendance register", "Anwesenheitsliste"),
                    <>
                      <div className="school-grid">
                        <label className="school-field">
                          {t("Filter class", "Klasse filtern")}
                          <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                          >
                            <option value="">
                              {t("All accessible classes", "Alle zugänglichen Klassen")}
                            </option>
                            {classesOptions.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="school-field">
                          {t("Date", "Datum")}
                          <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                          />
                        </label>
                      </div>
                      <RecordTable
                        headings={[
                          t("Student", "Lernende"),
                          t("Class", "Klasse"),
                          t("Date", "Datum"),
                          "Status",
                        ]}
                        rows={snapshot.attendance
                          .filter(
                            (a) =>
                              (!classFilter || a.classId === classFilter) &&
                              (!dateFilter || a.date === dateFilter)
                          )
                          .map((a) => [
                            memberName(a.studentId),
                            className(a.classId),
                            date(a.date),
                            badge(a.status),
                          ])}
                        empty={empty}
                      />
                    </>
                  )}
                </>
              )}
              {section === "absences" && (
                <>
                  {student && (
                    <SchoolForm
                      title={t("Report your absence", "Abwesenheit melden")}
                      description={t(
                        "Choose a general reason only. Please do not provide a diagnosis. Supporting documents can be uploaded separately under Documents.",
                        "Wählen Sie nur einen allgemeinen Grund. Bitte keine Diagnose angeben. Nachweise können separat unter Dokumente hochgeladen werden."
                      )}
                      fields={[
                        {
                          name: "from",
                          label: t("From", "Von"),
                          type: "date",
                          required: true,
                          value: today(),
                        },
                        {
                          name: "to",
                          label: t("Until", "Bis"),
                          type: "date",
                          required: true,
                          value: today(),
                        },
                        {
                          name: "reason",
                          label: t("Reason", "Grund"),
                          required: true,
                          options: [
                            { value: "illness", label: t("Illness", "Krankheit") },
                            { value: "personal", label: t("Personal", "Persönlich") },
                            { value: "other", label: t("Other", "Sonstiges") },
                          ],
                        },
                      ]}
                      submit={t("Notify school", "Schule informieren")}
                      action={async (d) => {
                        if (d.to < d.from)
                          throw new Error(
                            t(
                              "End date must not precede start date.",
                              "Das Enddatum darf nicht vor dem Anfangsdatum liegen."
                            )
                          );
                        await command({
                          action: "absence.report",
                          from: d.from,
                          to: d.to,
                          reason: d.reason as Absence["reason"],
                        });
                      }}
                    />
                  )}
                  {panel(
                    t("Absence reports", "Abwesenheitsmeldungen"),
                    visibleAbsences.length
                      ? visibleAbsences.map((a) => (
                          <article className="school-record" key={a.id}>
                            <div className="school-row">
                              <strong>{memberName(a.studentId)}</strong>
                              {badge(a.status)}
                            </div>
                            <p>
                              {date(a.from)} – {date(a.to)}
                            </p>
                            {manager && a.status === "pending" && (
                              <div className="school-actions">
                                {actionButton(
                                  t("Approve", "Genehmigen"),
                                  { action: "absence.review", absenceId: a.id, status: "approved" },
                                  false
                                )}
                                {actionButton(t("Reject", "Ablehnen"), {
                                  action: "absence.review",
                                  absenceId: a.id,
                                  status: "rejected",
                                })}
                              </div>
                            )}
                          </article>
                        ))
                      : empty
                  )}
                </>
              )}
              {section === "documents" && (
                <>
                  <div className="school-notice">
                    <ShieldCheck size={18} style={{ display: "inline", marginInlineEnd: 8 }} />
                    {t(
                      "PDF, JPG and PNG only, maximum 10 MB. Uploads are quarantined until scanned. Medical uploads require the school’s documented configuration. Jobcenter documents are stored privately; this does not send them to Jobcenter.",
                      "Nur PDF, JPG und PNG, maximal 10 MB. Uploads bleiben bis zur Sicherheitsprüfung in Quarantäne. Medizinische Uploads benötigen eine dokumentierte Freigabe der Schule. Jobcenter-Dokumente werden privat gespeichert; sie werden nicht an das Jobcenter gesendet."
                    )}
                  </div>
                  <div className="school-grid">
                    {student && (
                      <SchoolForm
                        title={t("Upload a private document", "Privates Dokument hochladen")}
                        fields={[
                          {
                            name: "title",
                            label: t("Document title", "Dokumenttitel"),
                            required: true,
                          },
                          {
                            name: "category",
                            label: t("Category", "Kategorie"),
                            options: categories,
                            required: true,
                          },
                          { name: "file", label: t("File", "Datei"), type: "file", required: true },
                          {
                            name: "absenceId",
                            label: t(
                              "Related absence (optional)",
                              "Zugehörige Abwesenheit (optional)"
                            ),
                            options: snapshot.absences.map((a) => ({
                              value: a.id,
                              label: `${date(a.from)} – ${date(a.to)}`,
                            })),
                          },
                          {
                            name: "requestId",
                            label: t("Related request (optional)", "Zugehörige Anfrage (optional)"),
                            options: snapshot.documentRequests
                              .filter((r) => !r.fulfilledBy)
                              .map((r) => ({ value: r.id, label: r.title })),
                          },
                          {
                            name: "letterId",
                            label: t(
                              "Signed reply to letter (optional)",
                              "Unterschriebene Antwort auf Schreiben (optional)"
                            ),
                            options: snapshot.letters.map((l) => ({ value: l.id, label: l.title })),
                          },
                        ]}
                        submit={t("Upload securely", "Sicher hochladen")}
                        action={upload}
                      />
                    )}
                    {manager && (
                      <SchoolForm
                        title={t("Request a document", "Dokument anfordern")}
                        fields={[
                          {
                            name: "studentId",
                            label: t("Student", "Lernende Person"),
                            options: personOptions,
                            required: true,
                          },
                          {
                            name: "title",
                            label: t("Request title", "Titel der Anfrage"),
                            required: true,
                          },
                          {
                            name: "category",
                            label: t("Category", "Kategorie"),
                            options: categories,
                            required: true,
                          },
                          {
                            name: "dueDate",
                            label: t("Due date", "Frist"),
                            type: "date",
                            required: true,
                          },
                        ]}
                        submit={t("Send request", "Anfrage senden")}
                        action={async (d) =>
                          command({
                            action: "document.request",
                            studentId: d.studentId,
                            title: d.title,
                            category: d.category as SchoolDocument["category"],
                            dueDate: d.dueDate,
                          })
                        }
                      />
                    )}
                    {panel(
                      t("Document requests", "Dokumentanfragen"),
                      snapshot.documentRequests.length
                        ? snapshot.documentRequests.map((r) => (
                            <article className="school-record" key={r.id}>
                              <div className="school-row">
                                <strong>{r.title}</strong>
                                <span className={`school-badge ${r.fulfilledBy ? "good" : "warn"}`}>
                                  {r.fulfilledBy
                                    ? t("Uploaded", "Hochgeladen")
                                    : t("Awaiting upload", "Upload ausstehend")}
                                </span>
                              </div>
                              <p className="school-muted">
                                {memberName(r.studentId)} · {catLabel(r.category)} ·{" "}
                                {date(r.dueDate)}
                              </p>
                            </article>
                          ))
                        : empty
                    )}
                  </div>
                  {panel(
                    t("Private document centre", "Privates Dokumentencenter"),
                    <RecordTable
                      headings={[
                        t("Document", "Dokument"),
                        t("Student", "Lernende"),
                        t("Category", "Kategorie"),
                        "Status",
                        t("Retention until", "Aufbewahrung bis"),
                        t("Action", "Aktion"),
                      ]}
                      rows={snapshot.documents.map((d) => [
                        <span key={d.id}>
                          {d.title}
                          <br />
                          <small className="school-muted">
                            {d.fileName} · {Math.ceil(d.size / 1024)} KB
                          </small>
                        </span>,
                        memberName(d.studentId),
                        catLabel(d.category),
                        badge(d.scanStatus),
                        date(d.expiresAt),
                        <div key="document-actions">
                          <button
                            className="school-button secondary"
                            disabled={d.scanStatus !== "clean" || busy}
                            onClick={() => void download(d.id)}
                          >
                            <Download size={14} />
                            {t("Download", "Herunterladen")}
                          </button>
                          {d.legalHold && (
                            <p className="school-badge warn">
                              {t("Retention hold", "Aufbewahrungssperre")}
                            </p>
                          )}
                          {manager && (
                            <details>
                              <summary>
                                {t("Manage retention hold", "Aufbewahrungssperre verwalten")}
                              </summary>
                              <SchoolForm
                                title={t(
                                  `Retention hold: ${d.title}`,
                                  `Aufbewahrungssperre: ${d.title}`
                                )}
                                fields={[
                                  {
                                    name: "reason",
                                    label: t("Documented reason", "Dokumentierter Grund"),
                                    required: true,
                                  },
                                  {
                                    name: "hold",
                                    label: t("Hold status", "Sperrstatus"),
                                    options: [
                                      {
                                        value: "true",
                                        label: t("Preserve document", "Dokument aufbewahren"),
                                      },
                                      {
                                        value: "false",
                                        label: t("Release hold", "Sperre aufheben"),
                                      },
                                    ],
                                    value: String(!!d.legalHold),
                                    required: true,
                                  },
                                ]}
                                submit={t("Save retention hold", "Aufbewahrungssperre speichern")}
                                action={async (values) =>
                                  command({
                                    action: "document.hold",
                                    documentId: d.id,
                                    hold: values.hold === "true",
                                    reason: values.reason,
                                  })
                                }
                              />
                            </details>
                          )}
                        </div>,
                      ])}
                      empty={empty}
                    />
                  )}
                </>
              )}
              {section === "letters" && (
                <>
                  {(manager || teacher) && (
                    <SchoolForm
                      title={t("Send school letter", "Schreiben versenden")}
                      description={t(
                        "Receipt acknowledgement is recorded separately from the returned signed copy. This is not a qualified electronic signature.",
                        "Eine Empfangsbestätigung wird getrennt von der zurückgesendeten unterschriebenen Kopie erfasst. Dies ist keine qualifizierte elektronische Signatur."
                      )}
                      fields={[
                        { name: "title", label: t("Subject", "Betreff"), required: true },
                        {
                          name: "studentIds",
                          label: t("Recipients", "Empfänger"),
                          options: personOptions,
                          multiple: true,
                          required: true,
                        },
                        {
                          name: "body",
                          label: t("Letter content", "Inhalt des Schreibens"),
                          type: "textarea",
                          required: true,
                        },
                        {
                          name: "dueDate",
                          label: t("Reply deadline", "Antwortfrist"),
                          type: "date",
                          required: true,
                        },
                      ]}
                      submit={t("Send letter", "Schreiben versenden")}
                      action={async (d) =>
                        command({
                          action: "letter.send",
                          title: d.title,
                          body: d.body,
                          studentIds: split(d.studentIds),
                          dueDate: d.dueDate,
                        })
                      }
                    />
                  )}
                  {panel(
                    t("School correspondence", "Schulkorrespondenz"),
                    snapshot.letters.length
                      ? snapshot.letters.map((letter) => (
                          <article className="school-record" key={letter.id}>
                            <div className="school-row">
                              <h3>{letter.title}</h3>
                              <span className="school-badge">{date(letter.dueDate)}</span>
                            </div>
                            <p>{letter.body}</p>
                            {student ? (
                              <>
                                <div className="school-actions">
                                  {!letter.readBy[snapshot.actor.id] &&
                                    actionButton(t("Mark as read", "Als gelesen markieren"), {
                                      action: "letter.read",
                                      letterId: letter.id,
                                    })}
                                  {!letter.acknowledgements[snapshot.actor.id] ? (
                                    actionButton(
                                      t("Confirm receipt", "Empfang bestätigen"),
                                      { action: "letter.acknowledge", letterId: letter.id },
                                      false
                                    )
                                  ) : (
                                    <span className="school-badge good">
                                      <Check size={13} />
                                      {t("Receipt confirmed", "Empfang bestätigt")}{" "}
                                      {date(letter.acknowledgements[snapshot.actor.id])}
                                    </span>
                                  )}
                                </div>
                                {letter.returnedDocuments[snapshot.actor.id] ? (
                                  <p className="school-muted">
                                    {t(
                                      "A signed copy has been uploaded. Its security status is shown in Documents.",
                                      "Eine unterschriebene Kopie wurde hochgeladen. Der Sicherheitsstatus steht unter Dokumente."
                                    )}
                                  </p>
                                ) : (
                                  <details>
                                    <summary>
                                      {t(
                                        "Return a signed copy",
                                        "Unterschriebene Kopie zurücksenden"
                                      )}
                                    </summary>
                                    <SchoolForm
                                      title={t(
                                        "Return signed letter",
                                        "Unterschriebenes Schreiben zurücksenden"
                                      )}
                                      fields={[
                                        {
                                          name: "title",
                                          label: t("Document title", "Dokumenttitel"),
                                          value: letter.title,
                                          required: true,
                                        },
                                        {
                                          name: "category",
                                          label: t("Category", "Kategorie"),
                                          value: "signed_letter",
                                          options: [
                                            {
                                              value: "signed_letter",
                                              label: catLabel("signed_letter"),
                                            },
                                          ],
                                          required: true,
                                        },
                                        {
                                          name: "file",
                                          label: t("Signed file", "Unterschriebene Datei"),
                                          type: "file",
                                          required: true,
                                        },
                                      ]}
                                      submit={t(
                                        "Upload signed copy",
                                        "Unterschriebene Kopie hochladen"
                                      )}
                                      action={async (d, form) =>
                                        upload({ ...d, letterId: letter.id }, form)
                                      }
                                    />
                                  </details>
                                )}
                              </>
                            ) : (
                              <RecordTable
                                headings={[
                                  t("Recipient", "Empfänger"),
                                  t("Read", "Gelesen"),
                                  t("Receipt confirmed", "Empfang bestätigt"),
                                  t("Signed copy", "Unterschriebene Kopie"),
                                ]}
                                rows={letter.studentIds.map((id) => [
                                  memberName(id),
                                  letter.readBy[id] ? date(letter.readBy[id]) : "—",
                                  letter.acknowledgements[id]
                                    ? date(letter.acknowledgements[id])
                                    : "—",
                                  letter.returnedDocuments[id] ? t("Uploaded", "Hochgeladen") : "—",
                                ])}
                                empty={empty}
                              />
                            )}
                          </article>
                        ))
                      : empty
                  )}
                </>
              )}
              {section === "inbox" &&
                panel(
                  t("Your notification inbox", "Ihre Mitteilungen"),
                  snapshot.notifications.length
                    ? snapshot.notifications.map((n) => (
                        <article key={n.id} className="school-record">
                          <div className="school-row">
                            <h3>{n.title}</h3>
                            <span className={`school-badge ${n.readAt ? "" : "warn"}`}>
                              {n.readAt ? t("Read", "Gelesen") : t("Unread", "Ungelesen")}
                            </span>
                          </div>
                          <p>{n.body}</p>
                          <p className="school-muted">{date(n.createdAt)}</p>
                          {!n.readAt &&
                            actionButton(
                              t("Mark notification as read", "Mitteilung als gelesen markieren"),
                              { action: "notification.read", notificationId: n.id }
                            )}
                        </article>
                      ))
                    : empty,
                  snapshot.capabilities.push
                    ? t(
                        "Notifications appear inside this workspace. Device alerts require permission and registration in the mobile app.",
                        "Mitteilungen erscheinen in diesem Schulbereich. Gerätebenachrichtigungen benötigen Freigabe und Registrierung in der mobilen App."
                      )
                    : t(
                        "Notifications appear inside this workspace. Device push delivery is not enabled.",
                        "Mitteilungen erscheinen in diesem Schulbereich. Push-Zustellung auf das Gerät ist nicht aktiviert."
                      )
                )}
              {section === "progress" &&
                panel(
                  t("Learning progress", "Lernfortschritt"),
                  <RecordTable
                    headings={[
                      t("Student", "Lernende"),
                      t("Lesson", "Lektion"),
                      "Status",
                      t("Score", "Ergebnis"),
                      t("Updated", "Aktualisiert"),
                    ]}
                    rows={snapshot.progress.map((p) => [
                      memberName(p.studentId),
                      lessonLabel(p),
                      p.completed
                        ? t("Completed", "Abgeschlossen")
                        : t("In progress", "In Bearbeitung"),
                      <span key="score">
                        <progress max={100} value={p.score} aria-label={`${p.score}%`} />
                        {p.score}%
                      </span>,
                      date(p.updatedAt),
                    ])}
                    empty={empty}
                  />,
                  t(
                    "Only school-synchronised practice results appear here. Scores are self-reported and are not examination certificates. Unsynchronised local history is not included.",
                    "Hier erscheinen nur mit der Schule synchronisierte Übungsergebnisse. Ergebnisse sind selbst gemeldet und keine Prüfungsnachweise. Nicht synchronisierte lokale Verläufe sind nicht enthalten."
                  )
                )}
              {section === "team" && manager && (
                <>
                  {role === "owner" && (
                    <SchoolForm
                      title={t("Invite a school member", "Schulmitglied einladen")}
                      description={t(
                        "A private code will be generated. Share it securely with the named person. No invitation email is sent automatically.",
                        "Es wird ein privater Code erzeugt. Teilen Sie ihn sicher mit der genannten Person. Eine Einladungs-E-Mail wird nicht automatisch versendet."
                      )}
                      fields={[
                        {
                          name: "name",
                          label: t("Full name", "Vollständiger Name"),
                          required: true,
                        },
                        { name: "email", label: "E-Mail", type: "email", required: true },
                        {
                          name: "role",
                          label: t("School role", "Schulrolle"),
                          options: roleOrder
                            .filter((r) => r !== "owner" && (role === "owner" || r === "student"))
                            .map((r) => ({ value: r, label: roleLabel(r) })),
                          required: true,
                        },
                      ]}
                      submit={t("Create private invitation", "Private Einladung erstellen")}
                      action={async (d) =>
                        command({
                          action: "invite.create",
                          name: d.name,
                          email: d.email,
                          role: d.role as SchoolRole,
                        })
                      }
                    />
                  )}
                  {inviteCode && (
                    <div className="school-notice" role="status">
                      <strong>{t("Private invitation code", "Privater Einladungscode")}</strong>
                      <p
                        style={{
                          fontFamily: "monospace",
                          overflowWrap: "anywhere",
                          margin: "10px 0",
                        }}
                      >
                        {inviteCode}
                      </p>
                      <button
                        className="school-button secondary"
                        onClick={() => {
                          setInviteCode("");
                        }}
                      >
                        {t("Hide code", "Code ausblenden")}
                      </button>
                    </div>
                  )}
                  {panel(
                    t("People & permissions", "Personen & Berechtigungen"),
                    snapshot.members.map((m) => (
                      <article key={m.id} className="school-record">
                        <div className="school-row">
                          <div>
                            <strong>{m.name}</strong>
                            <p className="school-muted">{m.email}</p>
                          </div>
                          <span className="school-badge">
                            {roleLabel(m.role)} ·{" "}
                            {m.active ? t("Active", "Aktiv") : t("Inactive", "Inaktiv")}
                          </span>
                        </div>
                        {role === "owner" && m.id !== snapshot.actor.id && m.role !== "owner" && (
                          <details>
                            <summary>{t("Manage access", "Zugriff verwalten")}</summary>
                            <SchoolForm
                              title={t(`Access for ${m.name}`, `Zugriff für ${m.name}`)}
                              fields={[
                                {
                                  name: "role",
                                  label: t("Role", "Rolle"),
                                  value: m.role,
                                  options: roleOrder.map((r) => ({
                                    value: r,
                                    label: roleLabel(r),
                                  })),
                                  required: true,
                                },
                                {
                                  name: "active",
                                  label: "Status",
                                  value: String(m.active),
                                  options: [
                                    { value: "true", label: t("Active", "Aktiv") },
                                    {
                                      value: "false",
                                      label: t("Deactivate access", "Zugriff deaktivieren"),
                                    },
                                  ],
                                  required: true,
                                },
                              ]}
                              submit={t("Update access", "Zugriff aktualisieren")}
                              action={async (d) => {
                                if (
                                  d.role === "owner" &&
                                  !window.confirm(
                                    t(
                                      "Give this member full school-owner access, including private documents and settings?",
                                      "Diesem Mitglied vollständigen Schulleitungszugriff einschließlich privater Dokumente und Einstellungen erteilen?"
                                    )
                                  )
                                )
                                  return;
                                await command({
                                  action: "member.update",
                                  memberId: m.id,
                                  role: d.role as SchoolRole,
                                  active: d.active === "true",
                                });
                              }}
                            />
                          </details>
                        )}
                      </article>
                    ))
                  )}
                </>
              )}
              {section === "settings" && role === "owner" && (
                <>
                  <div className="school-notice">
                    {t(
                      "The school must verify its controller identity, legal bases and retention rules before activation. Saving text here does not constitute legal approval. Sensitive uploads remain disabled unless the server and the school’s documented settings both permit them.",
                      "Die Schule muss Verantwortliche, Rechtsgrundlagen und Aufbewahrungsregeln vor Aktivierung prüfen. Das Speichern von Text stellt keine rechtliche Freigabe dar. Sensible Uploads bleiben deaktiviert, sofern Server und dokumentierte Schuleinstellungen sie nicht gemeinsam erlauben."
                    )}
                  </div>
                  <SchoolForm
                    key={`settings-${snapshot.version}`}
                    title={t(
                      "School identity & privacy settings",
                      "Schulidentität & Datenschutzeinstellungen"
                    )}
                    fields={[
                      {
                        name: "name",
                        label: t("School display name", "Anzeigename der Schule"),
                        value: snapshot.settings.name,
                        required: true,
                      },
                      {
                        name: "operator",
                        label: t("Data controller / operator", "Verantwortlicher / Betreiber"),
                        value: snapshot.settings.operator,
                        required: true,
                      },
                      {
                        name: "privacyContact",
                        label: t("Privacy contact", "Datenschutzkontakt"),
                        value: snapshot.settings.privacyContact,
                        required: true,
                      },
                      {
                        name: "retentionDays",
                        label: t("Document retention (days)", "Dokumentaufbewahrung (Tage)"),
                        type: "number",
                        min: "1",
                        max: "3650",
                        value: String(snapshot.settings.retentionDays),
                        required: true,
                      },
                      {
                        name: "retentionGeneral",
                        label: t("General documents (days)", "Allgemeine Dokumente (Tage)"),
                        type: "number",
                        min: "1",
                        max: "3650",
                        value: snapshot.settings.retentionByCategory?.general
                          ? String(snapshot.settings.retentionByCategory.general)
                          : "",
                        required: true,
                      },
                      {
                        name: "retentionMedical",
                        label: t("Medical documents (days)", "Medizinische Dokumente (Tage)"),
                        type: "number",
                        min: "1",
                        max: "3650",
                        value: snapshot.settings.retentionByCategory?.medical
                          ? String(snapshot.settings.retentionByCategory.medical)
                          : "",
                        required: true,
                      },
                      {
                        name: "retentionJobcenter",
                        label: t("Jobcenter documents (days)", "Jobcenter-Dokumente (Tage)"),
                        type: "number",
                        min: "1",
                        max: "3650",
                        value: snapshot.settings.retentionByCategory?.jobcenter
                          ? String(snapshot.settings.retentionByCategory.jobcenter)
                          : "",
                        required: true,
                      },
                      {
                        name: "retentionSigned",
                        label: t("Signed letters (days)", "Unterschriebene Schreiben (Tage)"),
                        type: "number",
                        min: "1",
                        max: "3650",
                        value: snapshot.settings.retentionByCategory?.signed_letter
                          ? String(snapshot.settings.retentionByCategory.signed_letter)
                          : "",
                        required: true,
                      },
                      {
                        name: "chatRetentionDays",
                        label: t("Chat retention (days)", "Chat-Aufbewahrung (Tage)"),
                        type: "number",
                        min: "1",
                        max: "3650",
                        value: snapshot.settings.chatRetentionDays
                          ? String(snapshot.settings.chatRetentionDays)
                          : "",
                        required: true,
                      },
                      ...recordPolicyKeys.map((key) => ({
                        name: `recordRetention_${key}`,
                        label: {
                          attendance: t("Attendance records (days)", "Anwesenheitsdaten (Tage)"),
                          absences: t("Absence records (days)", "Abwesenheitsdaten (Tage)"),
                          letters: t("School letters (days)", "Schulschreiben (Tage)"),
                          notifications: t("Notification records (days)", "Mitteilungen (Tage)"),
                          progress: t("Learning records (days)", "Lerndaten (Tage)"),
                          audit: t("Audit records (days)", "Protokolldaten (Tage)"),
                        }[key],
                        type: "number",
                        min: "1",
                        max: "36500",
                        value: snapshot.settings.recordRetentionDays?.[key]
                          ? String(snapshot.settings.recordRetentionDays[key])
                          : "",
                        hint: t(
                          "Blank means not configured. Choose the controller-approved period for this record type.",
                          "Leer bedeutet nicht konfiguriert. Tragen Sie die von der verantwortlichen Schule festgelegte Frist ein."
                        ),
                      })),
                      {
                        name: "retentionPolicyNote",
                        maxLength: 2000,
                        label: t(
                          "Documented retention policy and basis",
                          "Dokumentierte Aufbewahrungsregel und Grundlage"
                        ),
                        type: "textarea",
                        value: snapshot.settings.retentionPolicyNote || "",
                        hint: t(
                          "Document the applicable school/state rules, purpose, period and review basis. Technical limits are not legal retention periods.",
                          "Dokumentieren Sie geltende Schul-/Landesregeln, Zweck, Fristen und Prüfgrundlage. Technische Grenzen sind keine gesetzlichen Aufbewahrungsfristen."
                        ),
                      },
                      {
                        name: "legalBasis",
                        maxLength: 2000,
                        label: t("Documented legal basis", "Dokumentierte Rechtsgrundlage"),
                        type: "textarea",
                        value: snapshot.settings.legalBasis,
                        required: true,
                      },
                      {
                        name: "healthLegalBasis",
                        maxLength: 2000,
                        label: t(
                          "Additional basis for health data",
                          "Zusätzliche Rechtsgrundlage für Gesundheitsdaten"
                        ),
                        type: "textarea",
                        value: snapshot.settings.healthLegalBasis,
                      },
                      {
                        name: "sensitiveUploadsEnabled",
                        label: t("Sensitive document workflow", "Workflow für sensible Dokumente"),
                        value: String(snapshot.settings.sensitiveUploadsEnabled),
                        required: true,
                        options: [
                          { value: "false", label: t("Disabled", "Deaktiviert") },
                          {
                            value: "true",
                            label: t(
                              "Enable subject to server safeguards",
                              "Unter Server-Schutzmaßnahmen aktivieren"
                            ),
                          },
                        ],
                      },
                    ]}
                    submit={t("Save settings", "Einstellungen speichern")}
                    action={async (d) => {
                      const provided = recordPolicyKeys.filter(
                        (key) => d[`recordRetention_${key}`]
                      );
                      if (provided.length && provided.length !== recordPolicyKeys.length)
                        throw new Error(
                          t(
                            "Complete all six record retention periods, or leave all six blank. Your entries have not been discarded.",
                            "Tragen Sie alle sechs Aufbewahrungsfristen ein oder lassen Sie alle sechs leer. Ihre Eingaben bleiben erhalten."
                          )
                        );
                      if (
                        d.sensitiveUploadsEnabled === "true" &&
                        (provided.length !== 6 ||
                          !d.retentionPolicyNote.trim() ||
                          !d.healthLegalBasis.trim())
                      )
                        throw new Error(
                          t(
                            "Sensitive workflows require the complete documented record policy and health-data basis.",
                            "Sensible Abläufe benötigen die vollständige dokumentierte Aufbewahrungsregel und Grundlage für Gesundheitsdaten."
                          )
                        );
                      await command({
                        action: "settings.update",
                        settings: {
                          name: d.name,
                          operator: d.operator,
                          privacyContact: d.privacyContact,
                          legalBasis: d.legalBasis,
                          healthLegalBasis: d.healthLegalBasis,
                          retentionDays: Number(d.retentionDays),
                          retentionByCategory: {
                            general: Number(d.retentionGeneral),
                            medical: Number(d.retentionMedical),
                            jobcenter: Number(d.retentionJobcenter),
                            signed_letter: Number(d.retentionSigned),
                          },
                          chatRetentionDays: Number(d.chatRetentionDays),
                          retentionPolicyNote: d.retentionPolicyNote.trim() || undefined,
                          recordRetentionDays: provided.length
                            ? Object.fromEntries(
                                recordPolicyKeys.map((key) => [
                                  key,
                                  Number(d[`recordRetention_${key}`]),
                                ])
                              )
                            : undefined,
                          sensitiveUploadsEnabled: d.sensitiveUploadsEnabled === "true",
                        } as SchoolSettings,
                      });
                    }}
                  />
                  {panel(
                    t("Retention management", "Aufbewahrungsverwaltung"),
                    <>
                      <p className="school-muted">
                        {t(
                          "Run the configured retention policy for files, chats and school records. Only explicitly configured, expired records are eligible. Recorded holds and records linked to unexpired or held files are preserved. Verify the controller’s documented policy before running.",
                          "Führen Sie die konfigurierte Aufbewahrungsregel für Dateien, Chats und Schuldaten aus. Nur ausdrücklich konfigurierte, abgelaufene Einträge kommen infrage. Gesetzte Sperren und mit nicht abgelaufenen oder gesperrten Dateien verknüpfte Einträge bleiben erhalten. Prüfen Sie zuvor die dokumentierte Regel der verantwortlichen Schule."
                        )}
                      </p>
                      {!configuredRecordPolicy && (
                        <p className="school-error">
                          {t(
                            "Cleanup is unavailable until the complete controller-approved record policy and its basis are configured.",
                            "Bereinigung ist erst verfügbar, wenn die vollständige Aufbewahrungsregel der verantwortlichen Schule und ihre Grundlage konfiguriert sind."
                          )}
                        </p>
                      )}
                      <button
                        disabled={busy || !configuredRecordPolicy}
                        className="school-button danger"
                        onClick={() => {
                          if (
                            window.confirm(
                              t(
                                "Permanently remove records and files eligible under the configured retention policy? Holds and protected linked records remain.",
                                "Alle nach der konfigurierten Aufbewahrungsregel löschbaren Einträge und Dateien dauerhaft entfernen? Sperren und geschützte verknüpfte Einträge bleiben bestehen."
                              )
                            )
                          )
                            void run({ action: "retention.run" });
                        }}
                      >
                        {t("Run configured cleanup", "Konfigurierte Bereinigung ausführen")}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            <footer className="school-footer">
              <div className="school-row">
                <p>
                  {snapshot.settings.operator ||
                    t(
                      "School operator not configured",
                      "Schulbetreiber noch nicht konfiguriert"
                    )}{" "}
                  ·{" "}
                  {snapshot.settings.privacyContact ||
                    t(
                      "Privacy contact not configured",
                      "Datenschutzkontakt noch nicht konfiguriert"
                    )}
                </p>
                {actionButton(t("Export my school data", "Meine Schuldaten exportieren"), {
                  action: "data.export",
                })}
              </div>
              <div className="school-actions">
                {exportCursor &&
                  actionButton(t("Continue data export", "Datenexport fortsetzen"), {
                    action: "data.export",
                    cursor: exportCursor,
                  })}
                {actionButton(t("Request deletion review", "Löschprüfung beantragen"), {
                  action: "privacy.deletion.request",
                })}
              </div>
              {snapshot.deletionRequests?.some((r) => r.userId === snapshot.actor.id) && (
                <p role="status">
                  {t(
                    "Your deletion request is awaiting the school controller’s retention review.",
                    "Ihr Löschantrag wartet auf die Aufbewahrungsprüfung durch die verantwortliche Schule."
                  )}
                </p>
              )}
              <p>
                {t(
                  "Access is checked by the server for every request. Acknowledgements and uploaded signatures do not provide a qualified electronic signature.",
                  "Der Server prüft den Zugriff bei jeder Anfrage. Empfangsbestätigungen und hochgeladene Unterschriften stellen keine qualifizierte elektronische Signatur dar."
                )}
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

function RecordTable({
  headings,
  rows,
  empty,
}: {
  headings: string[];
  rows: ReactNode[][];
  empty: ReactNode;
}) {
  if (!rows.length) return <>{empty}</>;
  return (
    <div className="school-table-wrap">
      <table className="school-table">
        <thead>
          <tr>
            {headings.map((h) => (
              <th scope="col" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
