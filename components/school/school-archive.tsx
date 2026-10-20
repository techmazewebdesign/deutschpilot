"use client";
import { useEffect, useState } from "react";
import type { SchoolSnapshot } from "@/lib/school/contract";
export type SchoolRecordSection =
  | "members"
  | "classes"
  | "attendance"
  | "absences"
  | "documents"
  | "documentRequests"
  | "letters"
  | "notifications"
  | "progress";
export function SchoolArchive({
  snapshot,
  section,
  locale,
  label,
  onPage,
  onAccessDenied,
}: {
  snapshot: SchoolSnapshot;
  section: SchoolRecordSection;
  locale: string;
  label: string;
  onAccessDenied: () => void;
  onPage: (section: SchoolRecordSection, items: unknown[], more: boolean) => void;
}) {
  const de = locale === "de";
  const [cursor, setCursor] = useState<string | null | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const initialCursor = (
    snapshot as SchoolSnapshot & { pageCursors?: Record<string, string | null> }
  ).pageCursors?.[section];
  useEffect(() => {
    setCursor(initialCursor);
  }, [initialCursor]);
  if (!snapshot.pagination?.[section]) return null;
  async function load() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/school", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "section.page",
          section,
          ...(cursor ? { before: cursor } : {}),
        }),
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) onAccessDenied();
      if (!response.ok) throw new Error(data.error);
      if (!Array.isArray(data.items) || data.section !== section)
        throw new Error(de ? "Ungültige Archivantwort" : "Invalid archive response");
      setCursor(data.nextCursor);
      onPage(section, data.items, !!data.nextCursor);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setPending(false);
    }
  }
  return (
    <div>
      <button className="school-button secondary" disabled={pending} onClick={() => void load()}>
        {pending
          ? de
            ? "Wird geladen…"
            : "Loading…"
          : `${de ? "Weitere laden" : "Load more"}: ${label}`}
      </button>
      {error && (
        <p className="school-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
