import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { MarkCompleteButton } from "@/components/learn/mark-complete-button";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { ArrowLeft, BookOpen, Video, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;

  if (isPlaceholderLocale(locale)) notFound();

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const supabase = createServerSupabaseClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, courses(*)")
    .eq("slug", slug)
    .single();

  if (!lesson) notFound();

  const course = lesson.courses as { id: string; title: string; slug: string } | null;

  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, slug, title, order_index")
    .eq("course_id", lesson.course_id)
    .lt("order_index", 99)
    .order("order_index");

  const idx = allLessons?.findIndex((l: { id: string }) => l.id === lesson.id) ?? -1;
  const nextLesson = idx >= 0 ? (allLessons?.[idx + 1] ?? null) : null;
  const totalLessons = allLessons?.length ?? 0;

  const { data: progress } = await supabase
    .from("student_progress")
    .select("completed")
    .eq("user_id", session.user.id)
    .eq("lesson_id", lesson.id)
    .single();

  const { count: exerciseCount } = await supabase
    .from("exercises")
    .select("id", { count: "exact", head: true })
    .eq("lesson_id", lesson.id);

  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const de = locale === "de";
  const lessonNumber = idx >= 0 ? idx + 1 : 1;

  return (
    <AppLayout locale={locale} userName={session.user.name ?? session.user.email?.split("@")[0] ?? "Student"}>
      <div className="px-5 lg:px-10 py-6 lg:py-8 max-w-3xl w-full mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-white/35 mb-6 flex-wrap">
          <Link href={`/${locale}/rooms`} className="hover:text-[#E0B873] transition-colors">
            {de ? "Räume" : "Rooms"}
          </Link>
          {course && (
            <>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <Link href={`/${locale}/rooms/${course.slug}`} className="hover:text-[#E0B873] transition-colors truncate max-w-[120px]">
                {course.title}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-white/55 truncate max-w-[140px]">{lesson.title}</span>
        </div>

        {/* Lesson header card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-6 mb-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(224,184,115,0.08)_0%,_transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-md bg-[#E0B873]/15 flex items-center justify-center">
                <BookOpen className="h-3.5 w-3.5 text-[#E0B873]" />
              </div>
              <span className="text-[10px] font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">
                {tLearn("lesson")} {lessonNumber} {de ? "von" : "of"} {totalLessons}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">{lesson.title}</h1>
            {course && (
              <p className="text-sm text-white/45">{course.title}</p>
            )}
            {/* Progress stepper */}
            {totalLessons > 0 && (
              <div className="mt-4 flex items-center gap-1">
                {allLessons?.slice(0, Math.min(totalLessons, 12)).map((l: { id: string }, i: number) => (
                  <div key={l.id} className={`h-1 rounded-full flex-1 ${i < lessonNumber ? "bg-[#E0B873]" : "bg-white/10"}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video (if available) */}
        {lesson.video_url && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/8 bg-black/40 aspect-video flex items-center justify-center">
            <div className="text-center text-white/40">
              <Video className="h-10 w-10 mx-auto mb-2" />
              <p className="text-sm">{tLearn("videoLesson")}</p>
              <a href={lesson.video_url} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-block text-[#E0B873] text-sm hover:underline">
                {de ? "Video öffnen" : "Open video"}
              </a>
            </div>
          </div>
        )}

        {/* Lesson content */}
        <div className="bg-[#0A1E35]/70 backdrop-blur-sm border border-white/8 rounded-2xl p-6 lg:p-8 mb-6
          prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-serif
          prose-p:text-white/70 prose-p:leading-relaxed
          prose-li:text-white/65
          prose-strong:text-white
          prose-a:text-[#E0B873] prose-a:no-underline hover:prose-a:underline
          prose-table:text-white/70
          prose-td:border-white/10 prose-th:border-white/10
          prose-code:text-[#E0B873] prose-code:bg-[#E0B873]/10 prose-code:rounded prose-code:px-1">
          <div dangerouslySetInnerHTML={{ __html: lesson.content ?? "" }} />
        </div>

        {/* Complete / actions */}
        <div className="bg-[#0A1E35]/70 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">{de ? "Lektion abschließen" : "Complete this lesson"}</h2>
          <p className="text-xs text-white/35 mb-4">{de ? "Markiere die Lektion als abgeschlossen und gehe weiter." : "Mark the lesson complete and move on."}</p>
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

        {course && (
          <div className="mt-6">
            <Link href={`/${locale}/rooms/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-[#E0B873] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {tLearn("backToCourse")}
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
