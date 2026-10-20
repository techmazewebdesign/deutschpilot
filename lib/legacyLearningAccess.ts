import "server-only";
import { getServerSession } from "./session";
import { createAdminSupabaseClient } from "./supabaseAdmin";
import { createHash } from "node:crypto";
export async function legacyLearningClient(expectedUid: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.id !== expectedUid)
    throw new Error("Authenticated account required for private learning data.");
  return createAdminSupabaseClient();
}
export async function legacyAdminClient() {
  const session = await getServerSession();
  if (session?.user.role !== "admin") throw new Error("Administrator access required.");
  return createAdminSupabaseClient();
}
export function requireQuery<T>(result: T, dependency?: string | number): T {
  const error = (result as { error?: { code?: unknown } | null }).error;
  if (error) {
    const code =
      typeof error.code === "string" && /^[A-Z0-9_]{1,20}$/i.test(error.code)
        ? error.code
        : "UNAVAILABLE";
    const operation = typeof dependency === "string" ? dependency : "learning";
    throw new Error(`Learning data could not be loaded [${operation}; ${code}]. Please retry.`);
  }
  return result;
}

export function publicDirectoryId(uid: string) {
  return createHash("sha256").update(`deutschpilot-directory:${uid}`).digest("hex").slice(0, 24);
}
export async function publicLegacyTeachers(limit = 20) {
  const db = createAdminSupabaseClient();
  const result = requireQuery(
    await db
      .from("teacher_profiles")
      .select("user_id, full_name, bio, avatar_url, teaches_levels, experience_years")
      .eq("public_directory_enabled", true)
      .order("full_name")
      .limit(Math.max(1, Math.min(limit, 100)))
  );
  const teachers = (result.data || []) as {
    user_id: string;
    full_name: string;
    bio: string | null;
    avatar_url: string | null;
    teaches_levels: string[] | null;
    experience_years: number | null;
  }[];
  const uids = teachers.map((t) => t.user_id);
  const counts: Record<string, number> = {};
  if (uids.length) {
    const profiles = requireQuery(
      await db.from("profiles").select("id, firebase_uid").in("firebase_uid", uids)
    );
    const byProfile = new Map((profiles.data || []).map((p) => [p.id, p.firebase_uid]));
    const ids = Array.from(byProfile.keys());
    if (ids.length) {
      const classes = requireQuery(
        await db
          .from("live_classes")
          .select("teacher_id")
          .in("teacher_id", ids)
          .eq("status", "active")
      );
      for (const c of classes.data || []) {
        const uid = byProfile.get(c.teacher_id);
        if (uid) counts[uid] = (counts[uid] || 0) + 1;
      }
    }
  }
  return teachers.map((t) => ({
    user_id: publicDirectoryId(t.user_id),
    full_name: t.full_name,
    bio: t.bio,
    avatar_url: t.avatar_url,
    teaches_levels: t.teaches_levels,
    experience_years: t.experience_years,
    activeClasses: counts[t.user_id] || 0,
  }));
}
export async function publicLegacyClasses(limit = 100) {
  const db = createAdminSupabaseClient();
  const result = requireQuery(
    await db
      .from("live_classes")
      .select(
        "id, title, description, level, teacher_name, start_time, duration_minutes, max_students, status"
      )
      .eq("status", "active")
      .gte("start_time", new Date().toISOString())
      .order("start_time")
      .limit(Math.max(1, Math.min(limit, 100)))
  );
  const classes = result.data || [];
  const counts: Record<string, number> = {};
  if (classes.length) {
    const enrollments = requireQuery(
      await db
        .from("class_enrollments")
        .select("class_id")
        .in(
          "class_id",
          classes.map((c) => c.id)
        )
        .eq("status", "enrolled")
    );
    for (const row of enrollments.data || [])
      counts[row.class_id] = (counts[row.class_id] || 0) + 1;
  }

  return { classes, counts };
}

const placementCorrect = [
  "Good morning",
  "Ich bin",
  "das",
  "bin",
  "klein",
  "macht",
  "hätte",
  "nevertheless",
  "darauf",
  "Er hätte früher kommen sollen.",
];
/** Informal placement exercise, not a certified language examination. Score computed here. */
export function gradeLegacyPlacement(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid answers");
  const answers = value as Record<string, unknown>;
  if (
    Object.keys(answers).length !== placementCorrect.length ||
    Object.keys(answers).some((key) => !/^(?:[1-9]|10)$/.test(key))
  )
    throw new Error("Answer every question");
  let score = 0;
  const clean: Record<string, string> = {};
  for (let i = 0; i < placementCorrect.length; i++) {
    const answer = answers[String(i + 1)];
    if (typeof answer !== "string" || answer.length > 200) throw new Error("Invalid answer");
    clean[String(i + 1)] = answer;
    if (answer === placementCorrect[i]) score++;
  }
  return {
    score,
    level: score <= 2 ? "A1" : score <= 5 ? "A2" : score <= 8 ? "B1" : "B2",
    answers: clean,
  };
}
