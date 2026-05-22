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

  const supabase = createServerSupabaseClient();

  // Load course + lessons in one query
  const { data: course } = await supabase
    .from("courses")
    .select("*, lessons(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!course) notFound();

  type LessonItem = { id: string; slug: string; title: string; order_index: number };
  const lessons: LessonItem[] = ((course.lessons ?? []) as LessonItem[])
    .filter((l) => l.order_index < 99)
    .sort((a, b) => a.order_index - b.order_index);

  // Check if user is logged in to show progress
  const { data: { session } } = await supabase.auth.getSession();
  let completedLessonIds = new Set<string>();

  if (session) {
    const { data: progress } = await supabase
      .from("student_progress")
      .select("lesson_id")
      .eq("user_id", session.user.id)
      .eq("course_id", course.id)
      .eq("completed", true);
    completedLessonIds = new Set(progress?.map((p: { lesson_id: string }) => p.lesson_id) ?? []);
  }

  const firstLesson = lessons[0];
  const completedCount = completedLessonIds.size;
  const progressPct = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Back link */}
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-[#E0B873] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {tLearn("backToCourses")}
          </Link>

          {/* Course header */}
          <div className="bg-[#0A2A50]/60 border border-white/10 rounded-2xl p-8 mb-8">
            <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border mb-4 ${levelColors[course.level] ?? levelColors.A1}`}>
              {course.level}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">{course.title}</h1>
            <p className="text-[#C9D2DE] leading-relaxed mb-6">{course.description}</p>

            <div className="flex items-center gap-6 text-sm text-white/50 mb-6">
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
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>{tLearn("courseProgress")}</span>
                  <span className="text-[#E0B873]">{progressPct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {firstLesson && (
              <Link
                href={`/${locale}/lessons/${firstLesson.slug}`}
                className="inline-flex items-center gap-2 bg-[#E0B873] text-[#05101E] font-semibold px-6 py-3 rounded-md hover:bg-[#C99B50] transition-colors"
              >
                {tLearn("startFirstLesson")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}

            {!session && (
              <Link
                href={`/${locale}/signup`}
                className="ml-4 inline-flex items-center gap-2 border border-[#E0B873]/30 text-[#E0B873] font-medium px-6 py-3 rounded-md hover:bg-[#E0B873]/10 transition-colors"
              >
                {locale === "de" ? "Kostenlos registrieren" : "Sign up for free"}
              </Link>
            )}
          </div>

          {/* Lessons list */}
          <div className="bg-[#0A2A50]/40 border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/8">
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
                        className="flex items-center gap-4 px-6 py-4 hover:bg-white/4 transition-colors group"
                      >
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold
                          ${isDone
                            ? "bg-[#E0B873]/20 border-[#E0B873]/40 text-[#E0B873]"
                            : "bg-white/5 border-white/15 text-white/40"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isDone ? "text-white/50 line-through" : "text-white"}`}>
                            {lesson.title}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-[#E0B873] transition-colors flex-shrink-0" />
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
