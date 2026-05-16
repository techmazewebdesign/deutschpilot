import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MarkCompleteButton } from "@/components/learn/mark-complete-button";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { PLACEHOLDER_LOCALES } from "@/i18n";
import { ArrowLeft, Video } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;

  if (PLACEHOLDER_LOCALES.includes(locale as any)) notFound();

  const supabase = createServerSupabaseClient();

  // Auth guard (middleware handles redirect, this is double-check)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect(`/${locale}/login`);

  // Fetch lesson + parent course
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, courses(*)")
    .eq("slug", slug)
    .single();

  if (!lesson) notFound();

  const course: any = lesson.courses;

  // Fetch all lessons in the course to find prev/next
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, slug, title, order_index")
    .eq("course_id", lesson.course_id)
    .order("order_index");

  const idx = allLessons?.findIndex((l: any) => l.id === lesson.id) ?? -1;
  const nextLesson = idx >= 0 ? allLessons?.[idx + 1] : null;

  // Existing progress
  const { data: progress } = await supabase
    .from("student_progress")
    .select("completed")
    .eq("user_id", session.user.id)
    .eq("lesson_id", lesson.id)
    .single();

  // Exercise count for this lesson
  const { count: exerciseCount } = await supabase
    .from("exercises")
    .select("id", { count: "exact", head: true })
    .eq("lesson_id", lesson.id);

  const tLearn = await getTranslations({ locale, namespace: "learn" });

  return (
    <div className="flex min-h-screen bg-[#05101E]">
      <DashboardSidebar locale={locale} />

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 bg-[#071424]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 lg:hidden">
          <span className="text-sm font-bold tracking-wider text-white uppercase">DeutschPilot</span>
        </header>

        <main className="flex-1 px-6 lg:px-10 py-8 max-w-3xl w-full mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href={`/${locale}/courses` as any} className="hover:text-[#E0B873] transition-colors">
              {tLearn("lessons")}
            </Link>
            <span>/</span>
            {course && (
              <>
                <Link href={`/${locale}/courses/${course.slug}` as any} className="hover:text-[#E0B873] transition-colors">
                  {course.title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-white/60 truncate">{lesson.title}</span>
          </div>

          {/* Lesson header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[#E0B873] uppercase tracking-widest">
                {tLearn("lesson")} {(idx >= 0 ? idx + 1 : 1)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">{lesson.title}</h1>
          </div>

          {/* Video embed (if available) */}
          {lesson.video_url && (
            <div className="mb-8 rounded-xl overflow-hidden border border-white/10 bg-black aspect-video">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white/40">
                  <Video className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-sm">{tLearn("videoLesson")}</p>
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[#E0B873] text-sm hover:underline"
                  >
                    {locale === "de" ? "Video öffnen" : "Open video"}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Lesson content */}
          <div className="bg-[#0A2A50]/40 border border-white/8 rounded-xl p-6 sm:p-8 mb-8 prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-headings:font-serif
            prose-p:text-white/70 prose-p:leading-relaxed
            prose-li:text-white/70
            prose-strong:text-white
            prose-a:text-[#E0B873]
            prose-table:text-white/70
            prose-td:border-white/10 prose-th:border-white/10">
            <div dangerouslySetInnerHTML={{ __html: lesson.content ?? "" }} />
          </div>

          {/* Actions */}
          <div className="bg-[#0A2A50]/40 border border-white/8 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">
              {locale === "de" ? "Lektion abschließen" : "Complete this lesson"}
            </h2>
            <MarkCompleteButton
              userId={session.user.id}
              lessonId={lesson.id}
              courseId={lesson.course_id}
              nextLessonSlug={nextLesson?.slug ?? null}
              exerciseCount={exerciseCount ?? 0}
              locale={locale}
              initialCompleted={progress?.completed ?? false}
            />
          </div>

          {/* Back link */}
          {course && (
            <div className="mt-6">
              <Link
                href={`/${locale}/courses/${course.slug}` as any}
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-[#E0B873] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {tLearn("backToCourse")}
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
