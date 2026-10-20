import { lessons as nativeLessons } from "../../mobile/src/content";
import { createAdminSupabaseClient } from "../supabaseAdmin";
import type { SchoolProgress } from "./contract";
const native = new Map(
  nativeLessons.map((l) => [
    l.id,
    { lessonTitle: l.title, level: l.level, source: "mobile" as const },
  ])
);
/** Labels come from the shipped native catalog or canonical web lesson/course rows, never client strings. */
export async function decorateSchoolProgress(items: SchoolProgress[]) {
  const output = items.map((p) => ({
    ...p,
    ...native.get(p.lessonId),
    source: native.has(p.lessonId) ? ("mobile" as const) : ("unknown" as const),
  }));
  const ids = items
    .map((p) => p.lessonId)
    .filter((id) => /^web:[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id))
    .map((id) => id.slice(4));
  if (!ids.length) return { items: output, pending: false };
  try {
    const db = createAdminSupabaseClient();
    const { data: lessons, error } = await db
      .from("lessons")
      .select("id,title,course_id")
      .in("id", ids);
    if (error) throw new Error("Metadata unavailable");
    const courseIds = Array.from(new Set((lessons || []).map((l) => String(l.course_id))));
    const { data: courses, error: courseError } = await db
      .from("courses")
      .select("id,level")
      .in("id", courseIds);
    if (courseError) throw new Error("Metadata unavailable");
    const levels = new Map((courses || []).map((c) => [String(c.id), String(c.level)]));
    const web = new Map(
      (lessons || []).map((l) => [
        "web:" + l.id,
        {
          lessonTitle: String(l.title),
          level: levels.get(String(l.course_id)),
          source: "web" as const,
        },
      ])
    );
    return { items: output.map((p) => ({ ...p, ...web.get(p.lessonId) })), pending: false };
  } catch {
    return { items: output, pending: true };
  }
}
