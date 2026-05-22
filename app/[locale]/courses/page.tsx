import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { AppLayout } from "@/components/app/app-layout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { auth } from "@/lib/auth";
import { BookOpen, ChevronRight, Lock } from "lucide-react";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  A2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  B1: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  B2: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  C1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default async function CoursesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { level?: string };
}) {
  const { locale } = params;
  const levelFilter = searchParams?.level ?? "";

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const [t, tLearn, session] = await Promise.all([
    getTranslations({ locale, namespace: "courses" }),
    getTranslations({ locale, namespace: "learn" }),
    auth(),
  ]);

  const de = locale === "de";
  const supabase = createServerSupabaseClient();

  let query = supabase.from("courses").select("*").eq("is_published", true);
  if (levelFilter && (LEVELS as readonly string[]).includes(levelFilter)) {
    query = query.eq("level", levelFilter);
  }
  const { data: courses } = await query.order("level").order("title");

  // If logged in, also fetch their progress to show on course cards
  let userProgress: { course_id: string; completed: boolean }[] = [];
  let userName = "";
  if (session?.user) {
    const progressRes = await supabase
      .from("student_progress")
      .select("course_id, completed")
      .eq("user_id", session.user.id);
    userProgress = progressRes.data ?? [];
    userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";
  }

  const completedByCourse = new Map<string, number>();
  for (const p of userProgress) {
    completedByCourse.set(
      p.course_id,
      (completedByCourse.get(p.course_id) ?? 0) + (p.completed ? 1 : 0)
    );
  }

  const courseList = (courses ?? []) as {
    id: string; slug: string; title: string;
    description: string | null; level: string;
    lesson_count?: number;
  }[];

  const filterBar = (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href={`/${locale}/courses`}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          !levelFilter
            ? "bg-[#E0B873] text-[#05101E] border-[#E0B873]"
            : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
        }`}
      >
        {tLearn("allLevels")}
      </Link>
      {LEVELS.map((lvl) => (
        <Link
          key={lvl}
          href={`/${locale}/courses?level=${lvl}`}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            levelFilter === lvl
              ? "bg-[#E0B873] text-[#05101E] border-[#E0B873]"
              : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
          }`}
        >
          {lvl}
        </Link>
      ))}
    </div>
  );

  const courseGrid = (
    <>
      {!courseList.length ? (
        <div className="text-center py-16 text-white/40">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>{tLearn("noCourses")}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courseList.map((course) => {
            const done = completedByCourse.get(course.id) ?? 0;
            const isStarted = done > 0;
            return (
              <Link
                key={course.id}
                href={`/${locale}/courses/${course.slug}`}
                className="group relative rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/30 hover:bg-[#0A1E35] transition-all overflow-hidden flex flex-col"
              >
                <div className="h-1 w-full bg-gradient-to-r from-[#E0B873] to-[#C99B50]" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${levelColors[course.level] ?? levelColors.A1}`}>
                      {course.level}
                    </span>
                    {isStarted && session?.user && (
                      <span className="text-[10px] text-[#E0B873]/70 font-medium">
                        {done} {de ? "abgeschl." : "done"}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-serif font-bold text-white mb-1.5 group-hover:text-[#E0B873] transition-colors leading-snug">
                    {course.title}
                  </h2>
                  <p className="text-xs text-white/45 leading-relaxed flex-1 line-clamp-3 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[#E0B873] text-xs font-semibold">
                    {session?.user
                      ? (isStarted ? (de ? "Weiter" : "Continue") : (de ? "Starten" : "Start"))
                      : tLearn("startCourse")}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );

  // Logged-in: show inside AppLayout with sidebar
  if (session?.user) {
    return (
      <AppLayout locale={locale} userName={userName}>
        <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-5xl w-full mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-[#E0B873]" />
              <span className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">
                {de ? "Kurse" : "Courses"}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">{t("title")}</h1>
            <p className="text-sm text-white/45 max-w-xl">
              {de
                ? "Wähle einen Kurs und lerne Deutsch Schritt für Schritt."
                : "Pick a course and learn German step by step."}
            </p>
          </div>
          {filterBar}
          {courseGrid}
          <div className="mt-8 p-4 rounded-2xl bg-white/3 border border-white/6 flex items-start gap-3">
            <Lock className="h-4 w-4 text-white/30 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/35">
              {de
                ? "Kurse sind nach Niveau geordnet. Starte mit A1, wenn du neu anfängst."
                : "Courses are ordered by level. Start with A1 if you're just beginning."}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Logged-out: public marketing page
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#072143]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#E0B873] uppercase mb-3">{t("subtitle")}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">{t("title")}</h1>
            <p className="text-[#C9D2DE] max-w-xl mx-auto">
              {de
                ? "Wähle das richtige Niveau für deine Sprachziele und starte deinen Weg zum Erfolg."
                : "Choose the right level for your language goals and start your path to success."}
            </p>
          </div>
          {filterBar}
          {courseGrid}
          <div className="text-center mt-14">
            <Link
              href={`/${locale}/signup`}
              className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
            >
              {de ? "Jetzt kostenlos starten" : "Start for free"}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
