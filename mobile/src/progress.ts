import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Level, LocalProgress, Vocab, WordReview } from "./models";

const KEY = "deutschpilot:progress:v1";
export const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];
export const emptyProgress: LocalProgress = { completed: [], xp: 0, streak: 0, lastStudyDay: null, selectedLevel: "A1", dailyGoal: 5, dailyCount: 0, reviews: {} };
const integer = (value: unknown, fallback = 0) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : fallback;
// Local calendar dates, including DST transitions. UTC midnight is not the learner's day.
export function studyDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function currentStreak(progress: LocalProgress, now = new Date()) {
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  return progress.lastStudyDay === studyDay(now) || progress.lastStudyDay === studyDay(yesterday) ? progress.streak : 0;
}
export function dailyCount(progress: LocalProgress, now = new Date()) { return progress.lastStudyDay === studyDay(now) ? progress.dailyCount : 0; }
export function normalizeProgress(value: unknown): LocalProgress {
  if (!value || typeof value !== "object") return { ...emptyProgress, completed: [], reviews: {} };
  const p = value as Partial<LocalProgress>;
  const reviews: Record<string, WordReview> = {};
  if (p.reviews && typeof p.reviews === "object" && !Array.isArray(p.reviews)) {
    for (const [id, review] of Object.entries(p.reviews)) {
      if (id === "__proto__" || !review || !Number.isFinite(review.due) || review.due < 0) continue;
      reviews[id] = { due: review.due, interval: Math.min(integer(review.interval), 30), correct: integer(review.correct) };
    }
  }
  return {
    completed: Array.isArray(p.completed) ? [...new Set(p.completed.filter((id): id is string => typeof id === "string"))] : [],
    xp: integer(p.xp), streak: integer(p.streak),
    lastStudyDay: typeof p.lastStudyDay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.lastStudyDay) ? p.lastStudyDay : null,
    selectedLevel: levels.includes(p.selectedLevel as Level) ? p.selectedLevel as Level : "A1",
    dailyGoal: [5, 10, 15].includes(p.dailyGoal ?? 0) ? p.dailyGoal! : 5,
    dailyCount: integer(p.dailyCount), reviews,
  };
}
export type StudyAction = { type: "lesson"; id: string } | { type: "word"; id: string; remembered: boolean } | { type: "practice" } | { type: "preferences"; level?: Level; goal?: number };
export function applyStudyAction(progress: LocalProgress, action: StudyAction, now = new Date()): LocalProgress {
  if (action.type === "preferences") return normalizeProgress({ ...progress, selectedLevel: action.level ?? progress.selectedLevel, dailyGoal: action.goal ?? progress.dailyGoal });
  const today = studyDay(now);
  const next = { ...progress, streak: progress.lastStudyDay === today ? progress.streak : currentStreak(progress, now) + 1, lastStudyDay: today, dailyCount: dailyCount(progress, now) + 1 };
  if (action.type === "lesson" && !progress.completed.includes(action.id)) {
    next.completed = [...progress.completed, action.id]; next.xp += 20;
  }
  if (action.type === "word") {
    const old = progress.reviews[action.id];
    const interval = action.remembered ? Math.min(old?.interval ? old.interval * 2 + 1 : 1, 30) : 0;
    next.reviews = { ...progress.reviews, [action.id]: { due: now.getTime() + (interval ? interval * 86400000 : 600000), interval, correct: action.remembered ? (old?.correct ?? 0) + 1 : 0 } };
  }
  return next;
}
export function reviewQueue(words: Vocab[], progress: LocalProgress, now = Date.now()): Vocab[] {
  const due = words.filter(word => progress.reviews[word.id] && progress.reviews[word.id].due <= now).sort((a, b) => progress.reviews[a.id].due - progress.reviews[b.id].due);
  const unseen = words.filter(word => !progress.reviews[word.id]);
  return [...due, ...unseen].slice(0, 10);
}
export async function loadProgress(): Promise<LocalProgress> {
  const stored = await AsyncStorage.getItem(KEY);
  try { return normalizeProgress(stored ? JSON.parse(stored) : null); } catch { return normalizeProgress(null); }
}
export async function saveProgress(progress: LocalProgress) { await AsyncStorage.setItem(KEY, JSON.stringify(progress)); }
export async function completeLesson(progress: LocalProgress, lessonId: string): Promise<LocalProgress> {
  const next = applyStudyAction(progress, { type: "lesson", id: lessonId }); await saveProgress(next); return next;
}
export async function clearProgress() { await AsyncStorage.removeItem(KEY); }
