import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Quiz } from "@/components/learn/quiz";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { PLACEHOLDER_LOCALES } from "@/i18n";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExercisesPage({
  params,
}: {
  params: { locale: string; lessonId: string };
}) {
  const { locale, lessonId } = params;

  if (PLACEHOLDER_LOCALES.includes(locale as any)) notFound();

  const supabase = createServerSupabaseClient();

  // Auth guard
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect(`/${locale}/login`);

  // Fetch lesson (to get title, course_id and slug)
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title, slug, course_id, courses(title, slug)")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const course: any = lesson.courses;

  // Fetch exercises for this lesson
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, question, type, options, correct_answer, explanation")
    .eq("lesson_id", lessonId)
    .order("created_at");

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
            {course && (
              <>
                <Link href={`/${locale}/courses/${course.slug}` as any} className="hover:text-[#E0B873] transition-colors">
                  {course.title}
                </Link>
                <span>/</span>
                <Link href={`/${locale}/lessons/${lesson.slug}` as any} className="hover:text-[#E0B873] transition-colors">
                  {lesson.title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-white/60">{tLearn("goToExercises")}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-medium text-[#E0B873] uppercase tracking-widest mb-1">
              {tLearn("goToExercises")}
            </p>
            <h1 className="text-2xl font-serif font-bold text-white">{lesson.title}</h1>
            <p className="text-sm text-white/40 mt-1">
              {(exercises ?? []).length} {tLearn("correct")} · {locale === "de" ? "Wähle die richtige Antwort." : "Select the correct answer."}
            </p>
          </div>

          {/* Quiz */}
          <Quiz
            exercises={(exercises ?? []) as any}
            lessonId={lessonId}
            courseId={lesson.course_id}
            userId={session.user.id}
            locale={locale}
            lessonSlug={lesson.slug}
          />

          {/* Back link */}
          <div className="mt-8">
            <Link
              href={`/${locale}/lessons/${lesson.slug}` as any}
              className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-[#E0B873] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {tLearn("backToLesson")}
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
