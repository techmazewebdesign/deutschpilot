import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { AppLayout } from "@/components/app/app-layout";
import { BarChart2, CheckCircle2, BookOpen } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "progressOverview" });
  return { title: t("metaTitle") };
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

export default async function ProgressOverviewPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "progressOverview" });

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const supabase = await legacyLearningClient(session.user.id);
  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";

  const [coursesRes, progressRes] = await Promise.all([
    supabase.from("courses").select("id, title, level").eq("is_published", true),
    supabase
      .from("student_progress")
      .select("course_id, lesson_id, completed")
      .eq("user_id", session.user.id),
  ]);

  [coursesRes, progressRes].forEach(requireQuery);
  const courses = (coursesRes.data ?? []) as { id: string; title: string; level: string }[];
  const progress = (progressRes.data ?? []) as {
    course_id: string;
    lesson_id: string;
    completed: boolean;
  }[];

  const courseIds = courses.map((c) => c.id);
  const { data: lessonsData } = courseIds.length
    ? requireQuery(
        await supabase.from("lessons").select("id, course_id").in("course_id", courseIds)
      )
    : { data: [] };
  const lessons = (lessonsData ?? []) as { id: string; course_id: string }[];

  const completedLessonIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));

  const lessonsByLevel: Record<string, number> = {};
  const completedByLevel: Record<string, number> = {};
  for (const level of LEVELS) {
    lessonsByLevel[level] = 0;
    completedByLevel[level] = 0;
  }

  const courseById = new Map(courses.map((c) => [c.id, c]));
  for (const lesson of lessons) {
    const course = courseById.get(lesson.course_id);
    if (!course || !LEVELS.includes(course.level as (typeof LEVELS)[number])) continue;
    lessonsByLevel[course.level] += 1;
    if (completedLessonIds.has(lesson.id)) completedByLevel[course.level] += 1;
  }

  const totalLessons = Object.values(lessonsByLevel).reduce((a, b) => a + b, 0);
  const totalCompleted = Object.values(completedByLevel).reduce((a, b) => a + b, 0);
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const levelColors: Record<string, string> = {
    A1: "#22c55e",
    A2: "#84cc16",
    B1: "#E0B873",
    B2: "#f97316",
    C1: "#a855f7",
  };

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="mx-auto w-full max-w-3xl px-5 py-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-[#E0B873]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E0B873]/70">
              {t("eyebrow")}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">{t("title")}</h1>
        </div>

        {/* Overall */}
        <div className="mb-6 rounded-2xl border border-[#E0B873]/20 bg-[#E0B873]/5 p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">{t("overallProgress")}</span>
            <span className="text-lg font-bold tabular-nums text-[#E0B873]">{overallPct}%</span>
          </div>
          <div className="bg-white/8 mb-2 h-2.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="text-xs text-white/40">
            {t("lessonsCompletedOf", { completed: totalCompleted, total: totalLessons })}
          </p>
        </div>

        {/* Per-level breakdown */}
        <div className="space-y-3">
          {LEVELS.map((level) => {
            const total = lessonsByLevel[level];
            const done = completedByLevel[level];
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={level} className="border-white/8 rounded-xl border bg-[#0A1E35]/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-widest"
                      style={{
                        color: levelColors[level],
                        borderColor: `${levelColors[level]}50`,
                        background: `${levelColors[level]}15`,
                      }}
                    >
                      {level}
                    </span>
                    {total > 0 && pct === 100 && (
                      <CheckCircle2 className="h-4 w-4" style={{ color: levelColors[level] }} />
                    )}
                  </div>
                  <span className="text-xs tabular-nums text-white/40">
                    {done}/{total}
                  </span>
                </div>
                {total > 0 ? (
                  <div className="bg-white/8 h-1.5 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: levelColors[level] }}
                    />
                  </div>
                ) : (
                  <p className="flex items-center gap-1.5 text-xs text-white/25">
                    <BookOpen className="h-3 w-3" /> {t("notStartedYet")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
