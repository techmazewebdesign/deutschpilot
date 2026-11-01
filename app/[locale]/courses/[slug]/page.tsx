import { displayText } from "@/lib/displayText";
import { auth } from "@/lib/auth";
import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { BookOpen, ChevronRight, CheckCircle2, ArrowLeft, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;

  if (isPlaceholderLocale(locale)) {
    notFound();
  }

  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const t = await getTranslations({ locale, namespace: "courses" });

  const supabase = createServerSupabaseClient();

  // Load course + lessons in one query
  const { data: course } = requireQuery(
    await supabase
      .from("courses")
      .select("id, slug, title, description, level, lessons(id, slug, title, order_index)")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
  );

  if (!course) notFound();

  type LessonItem = { id: string; slug: string; title: string; order_index: number };
  const lessons: LessonItem[] = ((course.lessons ?? []) as LessonItem[])
    .filter((l) => l.order_index < 99)
    .sort((a, b) => a.order_index - b.order_index);

  // Check if user is logged in to show progress
  const session = await auth();
  let completedLessonIds = new Set<string>();

  if (session?.user) {
    const privateDb = await legacyLearningClient(session.user.id);
    const { data: progress, error: progressError } = await privateDb
      .from("student_progress")
      .select("lesson_id")
      .eq("user_id", session.user.id)
      .eq("course_id", course.id)
      .eq("completed", true);
    requireQuery({ error: progressError });
    completedLessonIds = new Set(progress?.map((p: { lesson_id: string }) => p.lesson_id) ?? []);
  }

  const firstLesson = lessons[0];
  const completedCount = completedLessonIds.size;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const levelColors: Record<string, string> = {
    A1: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
    A2: "text-blue-300 bg-blue-500/15 border-blue-500/30",
    B1: "text-violet-300 bg-violet-500/15 border-violet-500/30",
    B2: "text-amber-300 bg-amber-500/15 border-amber-500/30",
    C1: "text-rose-300 bg-rose-500/15 border-rose-500/30",
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#072143]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href={`/${locale}/courses`}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-[#E0B873]"
          >
            <ArrowLeft className="h-4 w-4" />
            {tLearn("backToCourses")}
          </Link>

          {/* Course header */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-[#0A2A50]/60 p-8">
            <span
              className={`mb-4 inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${levelColors[course.level] ?? levelColors.A1}`}
            >
              {course.level}
            </span>
            <h1 className="mb-3 font-serif text-3xl font-bold text-white sm:text-4xl">
              {displayText(course.title)}
            </h1>
            <p className="mb-6 leading-relaxed text-[#C9D2DE]">{displayText(course.description)}</p>

            <div className="mb-6 flex items-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {lessons.length} {tLearn("lessons")}
              </span>
              {session && completedCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#E0B873]" />
                  {completedCount}/{lessons.length} {tLearn("alreadyCompleted")}
                </span>
              )}
            </div>

            {/* Progress bar (logged in only) */}
            {session && lessons.length > 0 && (
              <div className="mb-6">
                <div className="mb-1.5 flex justify-between text-xs text-white/40">
                  <span>{tLearn("courseProgress")}</span>
                  <span className="text-[#E0B873]">{progressPct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {firstLesson && (
              <Link
                href={`/${locale}/lessons/${firstLesson.slug}`}
                className="inline-flex items-center gap-2 rounded-md bg-[#E0B873] px-6 py-3 font-semibold text-[#05101E] transition-colors hover:bg-[#C99B50]"
              >
                {tLearn("startFirstLesson")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}

            {!session && (
              <Link
                href={`/${locale}/signup`}
                className="ml-4 inline-flex items-center gap-2 rounded-md border border-[#E0B873]/30 px-6 py-3 font-medium text-[#E0B873] transition-colors hover:bg-[#E0B873]/10"
              >
                {t("signUpFree")}
              </Link>
            )}
          </div>

          {/* Lessons list */}
          <div className="border-white/8 overflow-hidden rounded-2xl border bg-[#0A2A50]/40">
            <div className="border-white/8 border-b px-6 py-4">
              <h2 className="text-base font-semibold text-white">{tLearn("lessons")}</h2>
            </div>

            {lessons.length === 0 ? (
              <p className="px-6 py-8 text-sm text-white/40">{tLearn("noCourses")}</p>
            ) : (
              <ul>
                {lessons.map((lesson, idx) => {
                  const isDone = completedLessonIds.has(lesson.id);
                  return (
                    <li key={lesson.id} className="border-b border-white/5 last:border-0">
                      <Link
                        href={`/${locale}/lessons/${lesson.slug}`}
                        className="hover:bg-white/4 group flex items-center gap-4 px-6 py-4 transition-colors"
                      >
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold
                          ${
                            isDone
                              ? "border-[#E0B873]/40 bg-[#E0B873]/20 text-[#E0B873]"
                              : "border-white/15 bg-white/5 text-white/40"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm font-medium ${isDone ? "text-white/50 line-through" : "text-white"}`}
                          >
                            {displayText(lesson.title)}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/20 transition-colors group-hover:text-[#E0B873]" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
