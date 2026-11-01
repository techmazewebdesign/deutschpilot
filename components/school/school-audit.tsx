"use client";
import { useCallback, useEffect, useState } from "react";
import type { SchoolAuditEntry } from "@/lib/school/contract";

export function SchoolAudit({
  locale,
  onAccessDenied,
}: {
  locale: string;
  onAccessDenied: () => void;
}) {
  const de = locale === "de";
  const [entries, setEntries] = useState<SchoolAuditEntry[]>([]);
  const [pending, setPending] = useState(false);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(
    async (before?: string) => {
      setPending(true);
      setError("");
      try {
        const response = await fetch("/api/school", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "audit.list", ...(before ? { before } : {}) }),
        });
        const data = await response.json();
        if (response.status === 401 || response.status === 403) {
          setEntries([]);
          onAccessDenied();
        }
        if (!response.ok) throw new Error(data.error);
        const next: SchoolAuditEntry[] = data.auditEntries || [];
        setEntries((current) =>
          before
            ? [...next, ...current.filter((entry) => !next.some((e) => e.id === entry.id))]
            : next
        );
        setMore(next.length === 100);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        setPending(false);
      }
    },
    [onAccessDenied]
  );
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <section className="school-panel">
      <div className="school-row">
        <h2>{de ? "Aktivitätsprotokoll" : "School activity log"}</h2>
        <button className="school-button secondary" disabled={pending} onClick={() => void load()}>
          {de ? "Protokoll aktualisieren" : "Refresh activity log"}
        </button>
      </div>
      <p className="school-muted">
        {de
          ? "Nur die Schulleitung hat Zugriff. Das Protokoll zeigt Kontokennungen, Aktionen, Ziele und Zeitpunkte ohne Dokumentinhalte oder Einladungscodes."
          : "School owner access only. The log records account IDs, actions, targets and timestamps without document contents or invitation codes."}
      </p>
      {error && (
        <p className="school-error" role="alert">
          {error}
        </p>
      )}
      {entries.length ? (
        <div className="school-table-wrap">
          <table className="school-table">
            <thead>
              <tr>
                {(de
                  ? ["Zeitpunkt", "Konto", "Aktion", "Ziel"]
                  : ["Time", "Account", "Action", "Target"]
                ).map((label) => (
                  <th key={label} scope="col">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...entries].reverse().map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.at).toLocaleString(de ? "de-DE" : "en-GB")}</td>
                  <td>{e.actorId}</td>
                  <td>{e.action}</td>
                  <td style={{ overflowWrap: "anywhere" }}>{e.target || "…"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="school-empty">
          {pending
            ? de
              ? "Wird geladen…"
              : "Loading…"
            : de
              ? "Noch keine protokollierten Aktivitäten."
              : "No logged activity yet."}
        </p>
      )}
      {more && entries[0] && (
        <button
          className="school-button secondary"
          disabled={pending}
          onClick={() => void load(entries[0].id)}
        >
          {de ? "Ältere Aktivitäten laden" : "Load earlier activity"}
        </button>
      )}
    </section>
  );
}
