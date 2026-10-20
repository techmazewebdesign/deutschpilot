import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { auth } from "@/lib/auth";
import { isPlaceholderLocale } from "@/i18n";
import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { Navigation } from "@/components/navigation";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Footer } from "@/components/footer";
import { hasLevelAccess } from "@/lib/entitlements";
import { UpgradeWall } from "@/components/learn/upgrade-wall";
import { BookOpen, CheckCircle2, ChevronRight, ArrowLeft, Award, Play } from "lucide-react";

export const dynamic = "force-dynamic";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
};

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  order_index: number;
};

type ProgressRow = {
  lesson_id: string;
  completed: boolean;
};

type QuizLessonRow = {
  id: string;
  title: string;
};

export default async function RoomDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const supabase = await legacyLearningClient(session.user.id);
  const de = locale === "de";

  const { data: courseData } = requireQuery(
    await supabase
      .from("courses")
      .select("id, slug, title, description, level")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
  );

  if (!courseData) notFound();
  const course = courseData as CourseRow;

  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";

  const entitled = await hasLevelAccess(session.user.id, course.level, session.user.role);
  if (!entitled) {
    return (
      <AppLayout locale={locale} userName={userName}>
        <UpgradeWall
          locale={locale}
          level={course.level as "A2" | "B1" | "B2" | "C1"}
          backHref={`/${locale}/rooms?level=${course.level}`}
        />
      </AppLayout>
    );
  }

  const { data: lessonsData } = requireQuery(
    await supabase
      .from("lessons")
      .select("id, slug, title, order_index")
      .eq("course_id", course.id)
      .lt("order_index", 99)
      .order("order_index")
  );

  const lessons: LessonRow[] = (lessonsData ?? []) as LessonRow[];

  const { data: quizLessonData } = requireQuery(
    await supabase
      .from("lessons")
      .select("id, title")
      .eq("course_id", course.id)
      .eq("order_index", 99)
      .maybeSingle()
  );

  const quizLesson = quizLessonData as QuizLessonRow | null;

  const { data: progressData } = requireQuery(
    await supabase
      .from("student_progress")
      .select("lesson_id, completed")
      .eq("user_id", session.user.id)
      .eq("course_id", course.id)
  );

  const completedIds = new Set(
    ((progressData ?? []) as ProgressRow[]).filter((p) => p.completed).map((p) => p.lesson_id)
  );

  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const roomNumMatch = course.title.match(/Room\s*(\d+)/i);
  const roomNum = roomNumMatch?.[1] ?? "";
  const roomLabel = roomNum ? `${course.level} · ${de ? "Raum" : "Room"} ${roomNum}` : course.level;

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="mx-auto w-full max-w-3xl px-5 py-6 lg:px-8 lg:py-8">
        <Link
          href={`/${locale}/rooms`}
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-white/35 transition-colors hover:text-[#E0B873]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {de ? "Zurück zu den Räumen" : "Back to Rooms"}
        </Link>

        <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,184,115,0.1)_0%,_transparent_60%)]" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <span className="bg-[#E0B873]/8 rounded border border-[#E0B873]/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#E0B873]/70">
                {roomLabel}
              </span>
            </div>
            <h1 className="mb-2 font-serif text-2xl font-bold text-white lg:text-3xl">
              {course.title}
            </h1>
            {course.description && (
              <p className="mb-5 max-w-xl text-sm text-white/45">{course.description}</p>
            )}
            <div className="flex items-center gap-3">
              <div className="bg-white/8 h-1.5 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-semibold tabular-nums text-[#E0B873]">
                {completedCount} / {lessons.length}
              </span>
            </div>
          </div>
        </div>

        <div className="border-white/8 mb-4 overflow-hidden rounded-2xl border bg-[#0A1E35]/70 backdrop-blur-sm">
          <div className="border-white/6 flex items-center gap-2 border-b px-5 py-3.5">
            <BookOpen className="h-3.5 w-3.5 text-[#E0B873]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
              {de ? "Lektionen" : "Lessons"}
            </span>
            <span className="ml-auto text-[10px] text-white/30">
              {lessons.length} {de ? "gesamt" : "total"}
            </span>
          </div>

          <ul>
            {lessons.map((lesson, i) => {
              const done = completedIds.has(lesson.id);
              const isFirst = i === 0;
              return (
                <li key={lesson.id} className="border-b border-white/5 last:border-0">
                  <Link
                    href={`/${locale}/lessons/${lesson.slug}`}
                    className="hover:bg-white/3 group flex items-center gap-4 px-5 py-4 transition-colors"
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                        done
                          ? "border-[#E0B873]/50 bg-[#E0B873]/15 text-[#E0B873]"
                          : isFirst
                            ? "border-[#E0B873]/30 bg-[#E0B873]/5 text-[#E0B873]/70"
                            : "border-white/12 bg-white/3 text-white/30"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium transition-colors ${
                          done
                            ? "text-white/40 line-through"
                            : "text-white group-hover:text-[#E0B873]"
                        }`}
                      >
                        {lesson.title}
                      </p>
                    </div>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#E0B873]/40" />
                    ) : (
                      <Play className="h-3.5 w-3.5 flex-shrink-0 text-white/20 transition-colors group-hover:text-[#E0B873]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {quizLesson && (
          <div className="rounded-2xl border border-[#E0B873]/15 bg-[#0A1E35]/70 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="bg-[#E0B873]/12 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#E0B873]/25">
                <Award className="h-5 w-5 text-[#E0B873]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#E0B873]/70">
                  {de ? "Checkpoint" : "Checkpoint"}
                </p>
                <p className="text-sm font-semibold text-white">
                  {de
                    ? `${course.level} Raum ${roomNum || "01"} – Abschlussquiz`
                    : `${course.level} Room ${roomNum || "01"} – Checkpoint Quiz`}
                </p>
                <p className="mt-0.5 text-xs text-white/35">
                  {de ? "10 Fragen · 70% zum Bestehen" : "10 questions · 70% to pass"}
                </p>
              </div>
              <Link
                href={`/${locale}/rooms/${slug}/quiz`}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-[#E0B873]/25 bg-[#E0B873]/10 px-4 py-2 text-xs font-semibold text-[#E0B873] transition-colors hover:bg-[#E0B873]/20"
              >
                {de ? "Quiz starten" : "Start Quiz"} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
