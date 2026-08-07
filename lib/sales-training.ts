import { getAdminDb } from "@/lib/firebase-admin";
import type { SessionUser } from "@/lib/session";

export type SalesTrainingChapter = {
  id: string;
  titleDe: string;
  titleEn: string;
  startSeconds: number;
};

export type SalesTrainingVideo = {
  id: string;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  videoUrl: string;
  posterUrl: string;
  powerpointUrl?: string;
  durationSeconds: number;
  required: boolean;
  autoOpen: boolean;
  chapters: SalesTrainingChapter[];
};

export type SalesTrainingProgress = {
  videoId: string;
  positionSeconds: number;
  percent: number;
  status: "assigned" | "in_progress" | "completed";
  openedAt: string | null;
  lastViewedAt: string | null;
  completedAt: string | null;
  dismissedAt: string | null;
};

export const SALES_TRAINING_VIDEOS: SalesTrainingVideo[] = [
  {
    id: "deutschpilot-sales-playbook-v1",
    titleDe: "DeutschPilot verkaufen – Sales Playbook",
    titleEn: "How to sell DeutschPilot – Sales Playbook",
    descriptionDe: "Rolle, Prioritäten, Discovery, Demo, Einwände, Follow-up und Wochenziele für das DeutschPilot Sales Team.",
    descriptionEn: "Role, priorities, discovery, demo, objections, follow-up, and weekly targets for the DeutschPilot sales team.",
    videoUrl: "/training/deutschpilot-sales/annekatrin-sales-playbook-de.mp4",
    posterUrl: "/training/deutschpilot-sales/annekatrin-sales-playbook-poster.png",
    powerpointUrl: "/training/deutschpilot-sales/deutschpilot-sales-playbook.pptx",
    durationSeconds: 419,
    required: true,
    autoOpen: true,
    chapters: [
      { id: "website", titleDe: "Das ist DeutschPilot", titleEn: "This is DeutschPilot", startSeconds: 0 },
      { id: "auftrag", titleDe: "Dein Verkaufsauftrag", titleEn: "Your sales mission", startSeconds: 16.419 },
      { id: "materialien", titleDe: "Materialien im Dashboard", titleEn: "Dashboard materials", startSeconds: 35.286 },
      { id: "kontakte", titleDe: "Priorisierte Kontaktliste", titleEn: "Prioritized prospect list", startSeconds: 74.892 },
      { id: "idealkunden", titleDe: "Ideale Kunden erkennen", titleEn: "Recognize ideal customers", startSeconds: 102.112 },
      { id: "probleme", titleDe: "Vier Kundenprobleme", titleEn: "Four customer problems", startSeconds: 133.149 },
      { id: "produkt", titleDe: "Problem mit Produktansicht verbinden", titleEn: "Connect the problem to the product", startSeconds: 164.042 },
      { id: "pitch", titleDe: "Gesprächseinstieg", titleEn: "Conversation opener", startSeconds: 196.519 },
      { id: "discovery", titleDe: "Discovery-Fragen", titleEn: "Discovery questions", startSeconds: 220.178 },
      { id: "demo", titleDe: "Die 20-Minuten-Demo", titleEn: "The 20-minute demo", startSeconds: 249.56 },
      { id: "einwaende", titleDe: "Einwände behandeln", titleEn: "Handle objections", startSeconds: 278.384 },
      { id: "followup", titleDe: "Follow-up und Dokumentation", titleEn: "Follow-up and documentation", startSeconds: 308.115 },
      { id: "pipeline", titleDe: "Qualifizieren oder parken", titleEn: "Qualify or park", startSeconds: 341.126 },
      { id: "scorecard", titleDe: "Wochen-Scorecard", titleEn: "Weekly scorecard", startSeconds: 362.692 },
      { id: "start", titleDe: "Jetzt im Dashboard starten", titleEn: "Start in the dashboard", startSeconds: 387.118 },
    ],
  },
];

const BOOTSTRAP_SALES_EMAILS = new Set(["annek.scholz@googlemail.com"]);

function configuredSalesEmails(): Set<string> {
  const values = (process.env.SALES_TEAM_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return new Set(Array.from(BOOTSTRAP_SALES_EMAILS).concat(values));
}

export function isConfiguredSalesEmail(email: string): boolean {
  return configuredSalesEmails().has(email.trim().toLowerCase());
}

export async function isSalesTeamMember(user: SessionUser): Promise<boolean> {
  if (isConfiguredSalesEmail(user.email)) return true;
  const userDoc = await getAdminDb().doc(`users/${user.id}`).get();
  return userDoc.exists && userDoc.data()?.salesTeam === true;
}

export async function getSalesTrainingProgress(userId: string): Promise<Record<string, SalesTrainingProgress>> {
  const snapshot = await getAdminDb().collection("salesTrainingProgress").where("userId", "==", userId).get();
  const progress: Record<string, SalesTrainingProgress> = {};
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const iso = (value: unknown) => {
      if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
        return value.toDate().toISOString();
      }
      return null;
    };
    progress[data.videoId] = {
      videoId: data.videoId,
      positionSeconds: Number(data.positionSeconds ?? 0),
      percent: Number(data.percent ?? 0),
      status: data.status === "completed" ? "completed" : data.status === "in_progress" ? "in_progress" : "assigned",
      openedAt: iso(data.openedAt),
      lastViewedAt: iso(data.lastViewedAt),
      completedAt: iso(data.completedAt),
      dismissedAt: iso(data.dismissedAt),
    };
  }
  return progress;
}

export function salesTrainingVideoById(videoId: string): SalesTrainingVideo | undefined {
  return SALES_TRAINING_VIDEOS.find((video) => video.id === videoId);
}
