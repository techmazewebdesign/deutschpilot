import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { Navigation } from "@/components/navigation";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Footer } from "@/components/footer";
import { MockExamClient, type MockExamData } from "@/components/mock-exam/mock-exam-client";

export const dynamic = "force-dynamic";

const MOCK_EXAM_LEVELS = ["B1", "B2"] as const;
type MockExamLevel = (typeof MOCK_EXAM_LEVELS)[number];

const READING_COUNT = 6;
const LISTENING_COUNT = 6;

type ExerciseRow = {
  id: string;
  lesson_id: string;
  question: string;
  type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
};

type LessonRow = {
  id: string;
  title: string;
  content: string;
  video_url: string | null;
};

export default async function MockExamPage({
  params,
}: {
  params: { locale: string; level: string };
}) {
  const { locale, level: levelParam } = params;

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const level = levelParam.toUpperCase();
  if (!MOCK_EXAM_LEVELS.includes(level as MockExamLevel)) notFound();

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const supabase = createServerSupabaseClient();
  const slugPrefix = level.toLowerCase();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug")
    .in("slug", [
      `${slugPrefix}-reading-practice`,
      `${slugPrefix}-listening-practice`,
      `${slugPrefix}-writing-practice`,
      `${slugPrefix}-speaking-practice`,
    ]);

  const courseBySlug = new Map((courses ?? []).map((c) => [c.slug as string, c.id as string]));
  const readingCourseId = courseBySlug.get(`${slugPrefix}-reading-practice`);
  const listeningCourseId = courseBySlug.get(`${slugPrefix}-listening-practice`);
  const writingCourseId = courseBySlug.get(`${slugPrefix}-writing-practice`);
  const speakingCourseId = courseBySlug.get(`${slugPrefix}-speaking-practice`);

  async function lessonsWithExercises(courseId: string | undefined) {
    if (!courseId) return [] as { lesson: LessonRow; exercises: ExerciseRow[] }[];
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, title, content, video_url")
      .eq("course_id", courseId)
      .order("order_index");
    const lessonRows = (lessons ?? []) as LessonRow[];
    if (lessonRows.length === 0) return [];

    const { data: exercises } = await supabase
      .from("exercises")
      .select("id, lesson_id, question, type, options, correct_answer, explanation")
      .in("lesson_id", lessonRows.map((l) => l.id));

    const exByLesson = new Map<string, ExerciseRow[]>();
    for (const ex of (exercises ?? []) as ExerciseRow[]) {
      const arr = exByLesson.get(ex.lesson_id) ?? [];
      arr.push(ex);
      exByLesson.set(ex.lesson_id, arr);
    }
    return lessonRows.map((lesson) => ({ lesson, exercises: exByLesson.get(lesson.id) ?? [] }));
  }

  const [readingLessons, listeningLessons, writingLessons, speakingLessons] = await Promise.all([
    lessonsWithExercises(readingCourseId),
    lessonsWithExercises(listeningCourseId),
    lessonsWithExercises(writingCourseId),
    lessonsWithExercises(speakingCourseId),
  ]);

  // Flatten to individual questions, capped, one passage/lesson per question where possible.
  const reading = readingLessons
    .flatMap(({ lesson, exercises }) =>
      exercises
        .filter((e) => e.type === "multiple_choice")
        .map((e) => ({ passageTitle: lesson.title, passageText: lesson.content, exercise: e }))
    )
    .slice(0, READING_COUNT);

  const listening = listeningLessons
    .flatMap(({ lesson, exercises }) =>
      exercises
        .filter((e) => e.type === "multiple_choice")
        .map((e) => ({ audioUrl: lesson.video_url, audioTitle: lesson.title, exercise: e }))
    )
    .filter((item) => !!item.audioUrl)
    .slice(0, LISTENING_COUNT);

  const writingExercise = writingLessons
    .flatMap(({ exercises }) => exercises.filter((e) => e.type === "writing_prompt"))[0] ?? null;

  const speakingExercise = speakingLessons
    .flatMap(({ exercises }) => exercises.filter((e) => e.type === "speaking_prompt"))[0] ?? null;

  const examData: MockExamData = {
    level,
    locale,
    reading: reading.map((r) => ({
      passageTitle: r.passageTitle,
      passageText: r.passageText,
      question: r.exercise.question,
      options: r.exercise.options ?? [],
      correctAnswer: r.exercise.correct_answer,
    })),
    listening: listening.map((l) => ({
      audioUrl: l.audioUrl as string,
      audioTitle: l.audioTitle,
      question: l.exercise.question,
      options: l.exercise.options ?? [],
      correctAnswer: l.exercise.correct_answer,
    })),
    writing: writingExercise
      ? { prompt: writingExercise.question, tip: writingExercise.explanation }
      : null,
    speaking: speakingExercise
      ? { prompt: speakingExercise.question, tip: speakingExercise.explanation }
      : null,
  };

  return (
    <>
      <Navigation />
      <MockExamClient data={examData} />
      <Footer />
    </>
  );
}
