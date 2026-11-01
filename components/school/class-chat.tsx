"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SchoolAction, SchoolChatMessage, SchoolSnapshot } from "@/lib/school/contract";
import { SchoolForm } from "./school-form";

export function ClassChat({
  snapshot,
  locale,
  command,
  onAccessDenied,
}: {
  snapshot: SchoolSnapshot;
  locale: string;
  command: (action: SchoolAction) => Promise<void>;
  onAccessDenied: () => void;
}) {
  const de = locale === "de";
  const t = useCallback((en: string, german: string) => (de ? german : en), [de]);
  const [classId, setClassId] = useState(snapshot.classes[0]?.id || "");
  const [history, setHistory] = useState<SchoolChatMessage[]>([]);
  const historyRef = useRef<SchoolChatMessage[]>([]);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);
  const [loading, setLoading] = useState(false);
  const [older, setOlder] = useState(true);
  const [error, setError] = useState("");
  const allowed = snapshot.classes.some((c) => c.id === classId);
  const role = snapshot.actor.role;
  const moderate = role === "teacher" || role === "owner" || role === "office";
  const fetchHistory = useCallback(
    async (before?: string) => {
      if (!classId || !allowed) return;
      setLoading(true);
      setError("");
      try {
        const fetchPage = async (cursor?: string): Promise<SchoolChatMessage[]> => {
          const response = await fetch("/api/school", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "chat.history",
              classId,
              ...(cursor ? { before: cursor } : {}),
            }),
          });
          const data = await response.json();
          if (response.status === 401 || response.status === 403) {
            historyRef.current = [];
            setHistory([]);
            onAccessDenied();
          }
          if (!response.ok)
            throw new Error(
              data.error || t("Could not load chat", "Chat konnte nicht geladen werden")
            );
          return data.messages ?? [];
        };
        let page = await fetchPage(before);
        let messages = [...page];
        // Refresh every already-open page so older moderated messages cannot remain cached.
        const loadedCount = historyRef.current.filter(
          (message) => message.classId === classId
        ).length;
        while (!before && messages.length < loadedCount && page.length === 100) {
          page = await fetchPage(messages[0].id);
          messages = [...page, ...messages];
        }
        setHistory((current) => {
          const map = new Map(current.map((m) => [m.id, m]));
          messages.forEach((m) => map.set(m.id, m));
          return Array.from(map.values()).sort(
            (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)
          );
        });
        setOlder(page.length === 100);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        setLoading(false);
      }
    },
    [classId, allowed, t, onAccessDenied]
  );
  useEffect(() => {
    historyRef.current = [];
    setHistory([]);
    setOlder(true);
    void fetchHistory();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void fetchHistory();
    }, 15000);
    return () => window.clearInterval(timer);
  }, [fetchHistory]);
  useEffect(() => {
    setHistory((current) => {
      const map = new Map(current.map((m) => [m.id, m]));
      snapshot.chatMessages.filter((m) => m.classId === classId).forEach((m) => map.set(m.id, m));
      return Array.from(map.values()).sort(
        (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)
      );
    });
  }, [snapshot.chatMessages, classId]);
  const messages = allowed ? history.filter((m) => m.classId === classId) : [];
  const readAt =
    snapshot.chatReads.find((r) => r.classId === classId && r.userId === snapshot.actor.id)
      ?.readAt || "";
  const unread = messages.filter(
    (m) => m.authorId !== snapshot.actor.id && m.createdAt > readAt
  ).length;
  return (
    <div className="school-stack">
      <section className="school-panel">
        <div className="school-row">
          <div>
            <h2>{t("Your class conversation", "Ihr Klassenchat")}</h2>
            <p className="school-muted">
              {t(
                "All assigned teachers share the class history. Access follows current class membership. Refreshes every 15 seconds while open.",
                "Alle zugewiesenen Lehrkräfte teilen den Klassenverlauf. Der Zugriff folgt der aktuellen Klassenzugehörigkeit. Bei geöffnetem Chat alle 15 Sekunden aktualisiert."
              )}
            </p>
          </div>
        </div>
        <label className="school-field school-filter">
          {t("Chat class", "Chat-Klasse")}
          <select value={classId} onChange={(e) => setClassId(e.target.value)}>
            {!snapshot.classes.length && <option value=""> bis </option>}
            {snapshot.classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="school-notice">
          {t(
            "Class members can read this conversation. Share organisational messages only. Send medical certificates and personal documents through the private document centre, never in chat.",
            "Klassenmitglieder können diese Unterhaltung lesen. Teilen Sie nur organisatorische Nachrichten. Ärztliche Bescheinigungen und persönliche Dokumente gehören ausschließlich ins private Dokumentencenter."
          )}
        </div>
        {error && (
          <p className="school-error" role="alert">
            {error}
          </p>
        )}
        {allowed ? (
          <>
            <div className="school-actions">
              <button
                className="school-button secondary"
                disabled={loading}
                onClick={() => void fetchHistory()}
              >
                {t("Refresh chat", "Chat aktualisieren")}
              </button>
              <button
                className="school-button secondary"
                disabled={loading}
                onClick={async () => {
                  try {
                    await command({ action: "chat.read", classId });
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Error");
                  }
                }}
              >
                {t("Mark chat as read", "Chat als gelesen markieren")}{" "}
                {unread > 0 ? `(${unread})` : ""}
              </button>
              {older && messages[0] && (
                <button
                  className="school-button secondary"
                  disabled={loading}
                  onClick={() => void fetchHistory(messages[0].id)}
                >
                  {t("Load earlier messages", "Ältere Nachrichten laden")}
                </button>
              )}
            </div>
            <div
              aria-label={t("Class message history", "Klassen-Nachrichtenverlauf")}
              aria-live="polite"
              aria-relevant="additions text"
              style={{ maxHeight: 520, overflowY: "auto", marginTop: 20 }}
            >
              {messages.length ? (
                messages.map((m) => (
                  <article className="school-record" key={m.id}>
                    <div className="school-row">
                      <strong>{m.authorName}</strong>
                      <time className="school-muted" dateTime={m.createdAt}>
                        {new Date(m.createdAt).toLocaleString(de ? "de-DE" : "en-GB")}
                      </time>
                    </div>
                    <p style={m.deletedAt ? { color: "#a9bbcf", fontStyle: "italic" } : undefined}>
                      {m.deletedAt
                        ? t(
                            "Message removed by school moderation.",
                            "Nachricht durch Schulmoderation entfernt."
                          )
                        : m.body}
                    </p>
                    {moderate && !m.deletedAt && (
                      <button
                        className="school-button secondary"
                        disabled={loading}
                        onClick={async () => {
                          if (
                            !window.confirm(
                              t(
                                "Remove this message from the class conversation?",
                                "Diese Nachricht aus dem Klassenchat entfernen?"
                              )
                            )
                          )
                            return;
                          try {
                            await command({ action: "chat.moderate", classId, messageId: m.id });
                            setHistory((current) =>
                              current.map((message) =>
                                message.id === m.id
                                  ? {
                                      ...message,
                                      body: "",
                                      deletedAt: new Date().toISOString(),
                                      deletedBy: snapshot.actor.id,
                                    }
                                  : message
                              )
                            );
                            await fetchHistory();
                          } catch (e) {
                            setError(e instanceof Error ? e.message : "Error");
                          }
                        }}
                      >
                        {t("Remove message", "Nachricht entfernen")}
                      </button>
                    )}
                  </article>
                ))
              ) : (
                <p className="school-empty">
                  {loading
                    ? t("Loading conversation…", "Unterhaltung wird geladen…")
                    : t(
                        "Start your class conversation.",
                        "Starten Sie die Unterhaltung Ihrer Klasse."
                      )}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="school-empty">
            {t(
              "No class chat assigned yet. Ask the school office to enrol you in a class.",
              "Noch kein Klassenchat zugewiesen. Bitten Sie das Sekretariat um eine Klassenzuweisung."
            )}
          </p>
        )}
      </section>
      {allowed && (
        <SchoolForm
          title={t("Write to your class", "An Ihre Klasse schreiben")}
          fields={[
            { name: "body", label: t("Message", "Nachricht"), type: "textarea", required: true },
          ]}
          submit={t("Send message", "Nachricht senden")}
          action={async (d) => {
            await command({ action: "chat.send", classId, body: d.body });
            await fetchHistory();
          }}
        />
      )}
    </div>
  );
}
