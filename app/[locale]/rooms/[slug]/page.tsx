import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { auth } from "@/lib/auth";
import { isPlaceholderLocale } from "@/i18n";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Navigation } from "@/components/navigation";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Footer } from "@/components/footer";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Award,
  Play,
} from "lucide-react";

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

  const supabase = createServerSupabaseClient();
  const de = locale === "de";

  const { data: courseData } = await supabase
    .from("courses")
    .select("id, slug, title, description, level")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!courseData) notFound();
  const course = courseData as CourseRow;

  const { data: lessonsData } = await supabase
    .from("lessons")
    .select("id, slug, title, order_index")
    .eq("course_id", course.id)
    .lt("order_index", 99)
    .order("order_index");

  const lessons: LessonRow[] = (lessonsData ?? []) as LessonRow[];

  const { data: quizLessonData } = await supabase
    .from("lessons")
    .select("id, title")
    .eq("course_id", course.id)
    .eq("order_index", 99)
    .single();

  const quizLesson = quizLessonData as QuizLessonRow | null;

  const { data: progressData } = await supabase
    .from("student_progress")
    .select("lesson_id, completed")
    .eq("user_id", session.user.id)
    .eq("course_id", course.id);

  const completedIds = new Set(
    ((progressData ?? []) as ProgressRow[])
      .filter((p) => p.completed)
      .map((p) => p.lesson_id)
  );

  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length;
  const progressPct =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  const userName =
    session.user.name ?? session.user.email?.split("@")[0] ?? "Student";

  const roomNumMatch = course.title.match(/Room\s*(\d+)/i);
  const roomNum = roomNumMatch?.[1] ?? "";
  const roomLabel = roomNum
    ? `${course.level} · ${de ? "Raum" : "Room"} ${roomNum}`
    : course.level;

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-3xl w-full mx-auto">
        <Link
          href={`/${locale}/rooms`}
          className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-[#E0B873] transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {de ? "Zurück zu den Räumen" : "Back to Rooms"}
        </Link>

        <div className="relative overflow-hidden rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-6 mb-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,184,115,0.1)_0%,_transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#E0B873]/70 border border-[#E0B873]/25 px-2 py-0.5 rounded bg-[#E0B873]/8">
                {roomLabel}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-sm text-white/45 mb-5 max-w-xl">
                {course.description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[#E0B873] tabular-nums">
                {completedCount} / {lessons.length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#0A1E35]/70 backdrop-blur-sm border border-white/8 rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-3.5 border-b border-white/6 flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-[#E0B873]" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
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
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors group"
                  >
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        done
                          ? "border-[#E0B873]/50 bg-[#E0B873]/15 text-[#E0B873]"
                          : isFirst
                          ? "border-[#E0B873]/30 bg-[#E0B873]/5 text-[#E0B873]/70"
                          : "border-white/12 bg-white/3 text-white/30"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate transition-colors ${
                          done
                            ? "text-white/40 line-through"
                            : "text-white group-hover:text-[#E0B873]"
                        }`}
                      >
                        {lesson.title}
                      </p>
                    </div>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-[#E0B873]/40 flex-shrink-0" />
                    ) : (
                      <Play className="h-3.5 w-3.5 text-white/20 group-hover:text-[#E0B873] flex-shrink-0 transition-colors" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {quizLesson && (
          <div className="bg-[#0A1E35]/70 backdrop-blur-sm border border-[#E0B873]/15 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[#E0B873]/12 border border-[#E0B873]/25 flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-[#E0B873]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-[#E0B873]/70 uppercase tracking-[0.15em] mb-0.5">
                  {de ? "Checkpoint" : "Checkpoint"}
                </p>
                <p className="text-sm font-semibold text-white">
                  {de
                    ? `${course.level} Raum ${roomNum || "01"} – Abschlussquiz`
                    : `${course.level} Room ${roomNum || "01"} – Checkpoint Quiz`}
                </p>
                <p className="text-xs text-white/35 mt-0.5">
                  {de
                    ? "10 Fragen · 70% zum Bestehen"
                    : "10 questions · 70% to pass"}
                </p>
              </div>
              <Link
                href={`/${locale}/rooms/${slug}/quiz`}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E0B873]/10 border border-[#E0B873]/25 text-[#E0B873] text-xs font-semibold hover:bg-[#E0B873]/20 transition-colors"
              >
                {de ? "Quiz starten" : "Start Quiz"}{" "}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
