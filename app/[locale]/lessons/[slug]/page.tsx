import { displayText, displayHtml } from "@/lib/displayText";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { MarkCompleteButton } from "@/components/learn/mark-complete-button";
import { auth } from "@/lib/auth";
import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { isPlaceholderLocale } from "@/i18n";
import { hasLevelAccess } from "@/lib/entitlements";
import { UpgradeWall } from "@/components/learn/upgrade-wall";
import { ArrowLeft, BookOpen, Video, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;

  if (isPlaceholderLocale(locale)) notFound();

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const supabase = await legacyLearningClient(session.user.id);

  const { data: lesson } = requireQuery(
    await supabase
      .from("lessons")
      .select("*, courses!inner(id, title, slug, level, is_published)")
      .eq("slug", slug)
      .eq("courses.is_published", true)
      .maybeSingle()
  );

  if (!lesson) notFound();

  const course = lesson.courses as {
    id: string;
    title: string;
    slug: string;
    level: string;
  } | null;
  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";

  if (course && !(await hasLevelAccess(session.user.id, course.level, session.user.role))) {
    return (
      <AppLayout locale={locale} userName={userName}>
        <UpgradeWall
          locale={locale}
          level={course.level as "A2" | "B1" | "B2" | "C1"}
          backHref={`/${locale}/rooms/${course.slug}`}
        />
      </AppLayout>
    );
  }

  const { data: allLessons } = requireQuery(
    await supabase
      .from("lessons")
      .select("id, slug, title, order_index")
      .eq("course_id", lesson.course_id)
      .lt("order_index", 99)
      .order("order_index")
  );

  const idx = allLessons?.findIndex((l: { id: string }) => l.id === lesson.id) ?? -1;
  const nextLesson = idx >= 0 ? (allLessons?.[idx + 1] ?? null) : null;
  const totalLessons = allLessons?.length ?? 0;

  const { data: progress } = requireQuery(
    await supabase
      .from("student_progress")
      .select("completed")
      .eq("user_id", session.user.id)
      .eq("lesson_id", lesson.id)
      .maybeSingle()
  );

  const { count: exerciseCount } = requireQuery(
    await supabase
      .from("exercises")
      .select("id", { count: "exact", head: true })
      .eq("lesson_id", lesson.id)
  );

  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const de = locale === "de";
  const lessonNumber = idx >= 0 ? idx + 1 : 1;

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="mx-auto w-full max-w-3xl px-5 py-6 lg:px-10 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-white/35">
          <Link href={`/${locale}/rooms`} className="transition-colors hover:text-[#E0B873]">
            {de ? "Räume" : "Rooms"}
          </Link>
          {course && (
            <>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <Link
                href={`/${locale}/rooms/${course.slug}`}
                className="max-w-[120px] truncate transition-colors hover:text-[#E0B873]"
              >
                {displayText(course.title)}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="max-w-[140px] truncate text-white/55">{displayText(lesson.title)}</span>
        </div>

        {/* Lesson header card */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(224,184,115,0.08)_0%,_transparent_60%)]" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E0B873]/15">
                <BookOpen className="h-3.5 w-3.5 text-[#E0B873]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E0B873]/70">
                {tLearn("lesson")} {lessonNumber} {de ? "von" : "of"} {totalLessons}
              </span>
            </div>
            <h1 className="mb-2 font-serif text-2xl font-bold text-white lg:text-3xl">
              {displayText(lesson.title)}
            </h1>
            {course && <p className="text-sm text-white/45">{displayText(course.title)}</p>}
            {/* Progress stepper */}
            {totalLessons > 0 && (
              <div className="mt-4 flex items-center gap-1">
                {allLessons
                  ?.slice(0, Math.min(totalLessons, 12))
                  .map((l: { id: string }, i: number) => (
                    <div
                      key={l.id}
                      className={`h-1 flex-1 rounded-full ${i < lessonNumber ? "bg-[#E0B873]" : "bg-white/10"}`}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Audio (if available) */}
        {lesson.video_url && /\.(mp3|wav|m4a|ogg)(\?|$)/i.test(lesson.video_url) && (
          <div className="border-white/8 mb-6 rounded-2xl border bg-[#0A1E35]/70 p-5">
            <p className="mb-3 text-xs text-white/40">
              {de
                ? "Höre dir den Text an, bevor du die Fragen beantwortest."
                : "Listen to the audio before answering the questions."}
            </p>
            <audio
              controls
              src={lesson.video_url}
              className="w-full"
              style={{ filter: "invert(0.85)" }}
            />
          </div>
        )}

        {/* Video (if available) */}
        {lesson.video_url && !/\.(mp3|wav|m4a|ogg)(\?|$)/i.test(lesson.video_url) && (
          <div className="border-white/8 mb-6 flex aspect-video items-center justify-center overflow-hidden rounded-2xl border bg-black/40">
            <div className="text-center text-white/40">
              <Video className="mx-auto mb-2 h-10 w-10" />
              <p className="text-sm">{tLearn("videoLesson")}</p>
              <a
                href={lesson.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-[#E0B873] hover:underline"
              >
                {de ? "Video öffnen" : "Open video"}
              </a>
            </div>
          </div>
        )}

        {/* Lesson content */}
        <div
          className="border-white/8 prose prose-invert prose-sm prose-headings:text-white prose-headings:font-serif prose-p:text-white/70 prose-p:leading-relaxed
          prose-li:text-white/65 prose-strong:text-white prose-a:text-[#E0B873] prose-a:no-underline
          hover:prose-a:underline prose-table:text-white/70
          prose-td:border-white/10 prose-th:border-white/10
          prose-code:text-[#E0B873]
          prose-code:bg-[#E0B873]/10
          prose-code:rounded prose-code:px-1 mb-6
          max-w-none
          rounded-2xl border
          bg-[#0A1E35]/70 p-6 backdrop-blur-sm lg:p-8"
        >
          <div dangerouslySetInnerHTML={{ __html: displayHtml(lesson.content) }} />
        </div>

        {/* Complete / actions */}
        <div className="border-white/8 rounded-2xl border bg-[#0A1E35]/70 p-6 backdrop-blur-sm">
          <h2 className="mb-1 text-sm font-semibold text-white">
            {de ? "Lektion abschließen" : "Complete this lesson"}
          </h2>
          <p className="mb-4 text-xs text-white/35">
            {de
              ? "Markiere die Lektion als abgeschlossen und gehe weiter."
              : "Mark the lesson complete and move on."}
          </p>
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
            <Link
              href={`/${locale}/rooms/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-white/35 transition-colors hover:text-[#E0B873]"
            >
              <ArrowLeft className="h-4 w-4" />
              {tLearn("backToCourse")}
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
