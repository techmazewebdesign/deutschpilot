import AsyncStorage from "@react-native-async-storage/async-storage";
import { lessons } from "./content";
const nativeLessonIds = new Set(lessons.map((lesson) => lesson.id));
import { normalizeProgress } from "./progress";
import type { LocalProgress } from "./models";
import type { SchoolSnapshot } from "./SchoolClient";
export const progressKey = (uid: string | null) =>
  uid ? `deutschpilot:account-progress:v1:${encodeURIComponent(uid)}` : "deutschpilot:progress:v1";
export async function loadAccountProgress(uid: string | null) {
  const raw = await AsyncStorage.getItem(progressKey(uid));
  try {
    return normalizeProgress(raw ? JSON.parse(raw) : null);
  } catch {
    return normalizeProgress(null);
  }
}
export async function saveAccountProgress(uid: string | null, value: LocalProgress) {
  await AsyncStorage.setItem(progressKey(uid), JSON.stringify(value));
}
export async function clearAccountProgress(uid: string | null) {
  await AsyncStorage.removeItem(progressKey(uid));
}
export function mergeSchoolProgress(
  local: LocalProgress,
  snapshot: SchoolSnapshot,
  expectedUid: string
): LocalProgress {
  if (snapshot.actor.id !== expectedUid)
    throw new Error("Account changed; progress was not merged.");
  const completed = [
    ...new Set([
      ...local.completed,
      ...snapshot.progress
        .filter(
          (p) => p.studentId === snapshot.actor.id && p.completed && nativeLessonIds.has(p.lessonId)
        )
        .map((p) => p.lessonId),
    ]),
  ];
  return normalizeProgress({ ...local, completed, xp: Math.max(local.xp, completed.length * 20) });
}
export function progressItems(progress: LocalProgress) {
  return progress.completed
    .filter((lessonId) => nativeLessonIds.has(lessonId))
    .map((lessonId) => ({ lessonId, completed: true, score: 0 }));
}
