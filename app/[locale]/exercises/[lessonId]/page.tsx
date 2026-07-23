import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { Quiz } from "@/components/learn/quiz";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { ArrowLeft, FlaskConical, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExercisesPage({
  params,
}: {
  params: { locale: string; lessonId: string };
}) {
  const { locale, lessonId } = params;

  if (isPlaceholderLocale(locale)) notFound();

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const supabase = createServerSupabaseClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title, slug, course_id, courses(title, slug, level)")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const course = ((lesson.courses as Array<{ title: string; slug: string; level: string }> | null) ?? [])[0] ?? null;

  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, question, type, options, correct_answer, explanation")
    .eq("lesson_id", lessonId)
    .order("created_at");

  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const de = locale === "de";
  const exerciseList = (exercises ?? []) as {
    id: string; question: string; type: string;
    options: string[] | null; correct_answer: string; explanation: string | null;
  }[];

  return (
    <AppLayout locale={locale} userName={session.user.name ?? session.user.email?.split("@")[0] ?? "Student"}>
      <div className="px-5 lg:px-10 py-6 lg:py-8 max-w-3xl w-full mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-white/35 mb-6 flex-wrap">
          {course && (
            <>
              <Link href={`/${locale}/rooms/${course.slug}`} className="hover:text-[#E0B873] transition-colors truncate max-w-[100px]">
                {course.title}
              </Link>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <Link href={`/${locale}/lessons/${lesson.slug}`} className="hover:text-[#E0B873] transition-colors truncate max-w-[120px]">
                {lesson.title}
              </Link>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
            </>
          )}
          <span className="text-white/55">{tLearn("goToExercises")}</span>
        </div>

        {/* Quiz header card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-6 mb-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(224,184,115,0.08)_0%,_transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-md bg-[#E0B873]/15 flex items-center justify-center">
                <FlaskConical className="h-3.5 w-3.5 text-[#E0B873]" />
              </div>
              <span className="text-[10px] font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">
                {de ? "Quiz" : "Quiz"} · {exerciseList.length} {de ? "Fragen" : "questions"}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-1">{lesson.title}</h1>
            <p className="text-sm text-white/40">
              {de ? "Wähle die richtige Antwort für jede Frage." : "Select the correct answer for each question."}
            </p>
          </div>
        </div>

        {/* Quiz component */}
        <Quiz
          exercises={exerciseList}
          lessonId={lessonId}
          courseId={lesson.course_id}
          userId={session.user.id}
          locale={locale}
          lessonSlug={lesson.slug}
          courseLevel={course?.level ?? "A1"}
        />

        <div className="mt-8">
          <Link href={`/${locale}/lessons/${lesson.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-[#E0B873] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {tLearn("backToLesson")}
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
