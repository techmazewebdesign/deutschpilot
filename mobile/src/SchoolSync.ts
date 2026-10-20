import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import type { User } from "firebase/auth";
import type { LocalProgress } from "./models";
import { loadSchool, schoolCommand } from "./SchoolClient";
import { completeSchoolProgress } from "./SchoolPagination";
import { mergeSchoolProgress, progressItems } from "./SchoolProgress";
export function useSchoolProgressSync(
  user: User | null,
  progress: LocalProgress,
  ready: boolean,
  merge: (value: LocalProgress, uid: string) => Promise<void>
) {
  const [status, setStatus] = useState("Gastfortschritt bleibt auf diesem Gerät.");
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(progress);
  latest.current = progress;
  const synced = useRef("");
  useEffect(() => {
    synced.current = "";
    setStatus(
      user ? "Kontofortschritt wird verbunden …" : "Gastfortschritt bleibt auf diesem Gerät."
    );
  }, [user?.uid]);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setAttempt((a) => a + 1);
    });
    const timer = setInterval(() => setAttempt((a) => a + 1), 60000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, []);
  const signature = JSON.stringify([...progress.completed].sort());
  useEffect(() => {
    if (!user || !ready) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const initial = await loadSchool(user.uid);
        if (initial.actor.role !== "student") {
          setStatus("Lernfortschritt bleibt für dieses Mitarbeiterkonto lokal.");
          return;
        }
        const downloaded = await completeSchoolProgress(user.uid, initial, {
          cancelled: () => cancelled,
        });
        const data = downloaded.snapshot;
        if (cancelled) return;
        if (data.actor.role !== "student") {
          setStatus("Lernfortschritt bleibt für dieses Mitarbeiterkonto lokal.");
          return;
        }
        const local = latest.current;
        const combined = mergeSchoolProgress(local, data, user.uid);
        const combinedSignature = JSON.stringify([...combined.completed].sort());
        if (combinedSignature !== JSON.stringify([...local.completed].sort()))
          await merge(combined, user.uid);
        if (cancelled) return;
        if (!downloaded.complete) {
          setStatus(
            "Lernfortschritt teilweise geladen. Weitere Schul-Fortschrittsseiten stehen aus; die Synchronisierung ist noch nicht vollständig bestätigt."
          );
          return;
        }
        if (synced.current !== combinedSignature && combined.completed.length) {
          await schoolCommand(user.uid, {
            action: "progress.sync",
            items: progressItems(combined),
          });
          if (cancelled) return;
        }
        synced.current = combinedSignature;
        setStatus(
          "Lektionsabschlüsse mit deiner Schule synchronisiert. Wortwiederholungen bleiben lokal."
        );
      } catch {
        if (!cancelled)
          setStatus(
            "Lernfortschritt lokal gesichert. Schul-Synchronisierung ausstehend: Mitgliedschaft und Verbindung prüfen. Erneuter Versuch automatisch oder im Schulportal."
          );
      }
    }, 1200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [user?.uid, signature, ready, attempt]);
  return status;
}
