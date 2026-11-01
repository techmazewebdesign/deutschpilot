import { displayText } from "@/lib/displayText";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { auth } from "@/lib/auth";
import { isPlaceholderLocale } from "@/i18n";
import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { Navigation } from "@/components/navigation";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Footer } from "@/components/footer";
import { RoomCheckpointQuiz } from "@/components/learn/room-quiz";
import { hasLevelAccess } from "@/lib/entitlements";
import { UpgradeWall } from "@/components/learn/upgrade-wall";
import { ArrowLeft, Award } from "lucide-react";

export const dynamic = "force-dynamic";

type CourseRow = {
  id: string;
  title: string;
  level: string;
};

type QuizLessonRow = {
  id: string;
  title: string;
};

type ExerciseRow = {
  id: string;
  question: string;
  type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
};

export default async function RoomQuizPage({
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
      .select("id, title, level")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
  );

  if (!courseData) notFound();
  const course = courseData as CourseRow;

  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";

  if (!(await hasLevelAccess(session.user.id, course.level, session.user.role))) {
    return (
      <AppLayout locale={locale} userName={userName}>
        <UpgradeWall
          locale={locale}
          level={course.level as "A2" | "B1" | "B2" | "C1"}
          backHref={`/${locale}/rooms/${slug}`}
        />
      </AppLayout>
    );
  }

  const { data: quizLessonData } = requireQuery(
    await supabase
      .from("lessons")
      .select("id, title")
      .eq("course_id", course.id)
      .eq("order_index", 99)
      .maybeSingle()
  );

  if (!quizLessonData) notFound();
  const quizLesson = quizLessonData as QuizLessonRow;

  const { data: exercisesData } = requireQuery(
    await supabase
      .from("exercises")
      .select("id, question, type, options, correct_answer, explanation")
      .eq("lesson_id", quizLesson.id)
      .order("created_at")
  );

  const exercises: ExerciseRow[] = ((exercisesData ?? []) as ExerciseRow[]).map((e) => ({
    id: e.id,
    question: e.question,
    type: e.type,
    options: Array.isArray(e.options) ? (e.options as string[]) : null,
    correct_answer: e.correct_answer,
    explanation: typeof e.explanation === "string" ? e.explanation : null,
  }));

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="mx-auto w-full max-w-3xl px-5 py-6 lg:px-8 lg:py-8">
        <Link
          href={`/${locale}/rooms/${slug}`}
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-white/35 transition-colors hover:text-[#E0B873]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {de ? "Zurück zum Raum" : "Back to Room"}
        </Link>

        <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(224,184,115,0.08)_0%,_transparent_60%)]" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E0B873]/25 bg-[#E0B873]/15">
                <Award className="h-4 w-4 text-[#E0B873]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E0B873]/70">
                {de ? "Checkpoint Quiz" : "Checkpoint Quiz"}
              </span>
            </div>
            <h1 className="mb-1 font-serif text-2xl font-bold text-white lg:text-3xl">
              {displayText(course.title)}
            </h1>
            <p className="text-sm text-white/45">
              {de
                ? `${exercises.length} Fragen · Bestehe mit 70% oder mehr`
                : `${exercises.length} questions · Pass with 70% or more`}
            </p>
          </div>
        </div>

        <RoomCheckpointQuiz
          exercises={exercises}
          courseId={course.id}
          quizLessonId={quizLesson.id}
          userId={session.user.id}
          locale={locale}
          roomSlug={slug}
        />
      </div>
    </AppLayout>
  );
}
