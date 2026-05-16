import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { PLACEHOLDER_LOCALES } from "@/i18n";
import {
  BookOpen, Clock, Trophy, Play, CalendarDays,
  MessageSquare, ChevronRight, BarChart2, FlaskConical,
  Flame,
} from "lucide-react";

const cardClass = "bg-[#0A2A50]/60 border border-white/8 rounded-xl p-6 hover:border-[#E0B873]/20 transition-colors";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (PLACEHOLDER_LOCALES.includes(locale as any)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect(`/${locale}/login`);

  // ── Parallel data fetching ─────────────────────────────────
  const [profileRes, progressRes, placementRes] = await Promise.all([
    supabase.from("profiles").select("full_name, german_level, learning_goal").eq("id", session.user.id).single(),
    supabase.from("student_progress").select("lesson_id, course_id, completed, updated_at").eq("user_id", session.user.id).order("updated_at", { ascending: false }),
    supabase.from("placement_tests").select("level_result, score, created_at").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(1),
  ]);

  const profile = profileRes.data;
  const progressRows = progressRes.data ?? [];
  const latestPlacement = placementRes.data?.[0] ?? null;

  // Derived stats
  const completedLessons = progressRows.filter((p) => p.completed).length;
  const displayLevel = latestPlacement?.level_result || profile?.german_level || "A1";
  const userName = profile?.full_name || session.user.email?.split("@")[0] || "Student";

  // Current course: most recently active
  const latestProgress = progressRows[0];
  let currentCourse: { id: string; title: string; slug: string } | null = null;
  let nextLesson: { title: string; slug: string } | null = null;
  let courseProgress = 0;
  let totalLessonsInCourse = 0;
  let completedInCourse = 0;

  if (latestProgress?.course_id) {
    const [courseRes, allLessonsRes] = await Promise.all([
      supabase.from("courses").select("id, title, slug").eq("id", latestProgress.course_id).single(),
      supabase.from("lessons").select("id, title, slug, order_index").eq("course_id", latestProgress.course_id).order("order_index"),
    ]);
    currentCourse = courseRes.data;
    const allLessons = allLessonsRes.data ?? [];
    totalLessonsInCourse = allLessons.length;
    const completedIds = new Set(progressRows.filter((p) => p.course_id === latestProgress.course_id && p.completed).map((p) => p.lesson_id));
    completedInCourse = completedIds.size;
    courseProgress = totalLessonsInCourse > 0 ? Math.round((completedInCourse / totalLessonsInCourse) * 100) : 0;
    nextLesson = allLessons.find((l: any) => !completedIds.has(l.id)) ?? null;
  }

  // Recommended course if no active course
  let recommendedCourse: { title: string; slug: string } | null = null;
  if (!currentCourse) {
    const { data: rec } = await supabase.from("courses").select("title, slug").eq("is_published", true).eq("level", displayLevel).limit(1).single();
    recommendedCourse = rec ?? null;
  }

  const t = await getTranslations({ locale, namespace: "dashboard" });
  const de = locale === "de";

  return (
    <div className="flex min-h-screen bg-[#05101E]">
      <DashboardSidebar locale={locale} />

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 bg-[#071424]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between lg:hidden">
          <Link href={`/${locale}` as any} className="text-sm font-bold tracking-wider text-white uppercase">DeutschPilot</Link>
          <Link href={`/${locale}/profile` as any} className="h-8 w-8 rounded-full bg-[#E0B873]/20 border border-[#E0B873]/30 flex items-center justify-center">
            <span className="text-sm font-bold text-[#E0B873]">{userName.charAt(0).toUpperCase()}</span>
          </Link>
        </header>

        <main className="flex-1 px-6 lg:px-8 py-8 space-y-6 max-w-6xl w-full mx-auto">

          {/* ── Welcome ── */}
          <div className="bg-gradient-to-r from-[#0A2A50] to-[#072143] border border-[#E0B873]/15 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium text-[#E0B873] uppercase tracking-widest mb-1">
                {new Date().toLocaleDateString(de ? "de-DE" : "en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <h1 className="text-2xl font-serif font-bold text-white">
                {de ? `Willkommen zurück, ${userName.split(" ")[0]} 👋` : `Welcome back, ${userName.split(" ")[0]} 👋`}
              </h1>
              <p className="text-sm text-white/50 mt-1">
                {de ? "Weiter so – jede Lektion bringt dich näher ans Ziel!" : "Keep it up – every lesson brings you closer to your goal!"}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#E0B873]/10 border border-[#E0B873]/20 rounded-lg px-4 py-3">
              <Flame className="h-5 w-5 text-[#E0B873]" />
              <div>
                <p className="text-lg font-bold text-[#E0B873] leading-none">{completedLessons}</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">{t("lessonsCompleted")}</p>
              </div>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Clock, value: "–", label: t("hoursLearned") },
              { icon: BookOpen, value: completedLessons, label: t("lessonsCompleted") },
              { icon: Trophy, value: displayLevel, label: de ? "Aktuelles Niveau" : "Current Level" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-[#0A2A50]/60 border border-white/8 rounded-xl p-4 text-center">
                <Icon className="h-5 w-5 text-[#E0B873] mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/40 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* ── My Level ── */}
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">{t("myLevel")}</h2>
                <span className="text-xs text-[#E0B873] bg-[#E0B873]/10 px-2 py-0.5 rounded-full border border-[#E0B873]/20">
                  {displayLevel}
                </span>
              </div>
              {latestPlacement ? (
                <>
                  <p className="text-xs text-white/40 mb-2">
                    {de ? "Letzter Einstufungstest:" : "Last placement test:"} {latestPlacement.score}/10
                  </p>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] rounded-full"
                      style={{ width: `${Math.round(((latestPlacement.score ?? 0) / 10) * 100)}%` }} />
                  </div>
                  <Link href={`/${locale}/placement-test` as any} className="text-xs text-[#E0B873] hover:underline mt-3 inline-block">
                    {de ? "Test wiederholen →" : "Retake test →"}
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-xs text-white/40 mb-4">{de ? "Noch kein Einstufungstest absolviert." : "No placement test taken yet."}</p>
                  <Link href={`/${locale}/placement-test` as any} className="inline-flex items-center gap-1.5 text-sm text-[#E0B873] border border-[#E0B873]/30 px-4 py-2 rounded-md hover:bg-[#E0B873]/10 transition-colors">
                    <FlaskConical className="h-4 w-4" />
                    {de ? "Einstufungstest starten" : "Take placement test"}
                  </Link>
                </>
              )}
            </div>

            {/* ── Current Course ── */}
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">{t("currentCourse")}</h2>
                <Link href={`/${locale}/courses` as any} className="text-xs text-[#E0B873] hover:underline flex items-center gap-1">
                  {t("viewAll")} <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {currentCourse ? (
                <>
                  <p className="text-base font-semibold text-white mb-1">{currentCourse.title}</p>
                  <p className="text-xs text-white/40 mb-3">
                    {completedInCourse}/{totalLessonsInCourse} {de ? "Lektionen abgeschlossen" : "lessons completed"}
                  </p>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] rounded-full" style={{ width: `${courseProgress}%` }} />
                  </div>
                  <Link href={`/${locale}/courses/${currentCourse.slug}` as any}
                    className="w-full py-2 rounded-md bg-[#E0B873]/10 border border-[#E0B873]/20 text-[#E0B873] text-sm font-medium hover:bg-[#E0B873]/20 transition-colors flex items-center justify-center gap-2">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {t("continueLearning")}
                  </Link>
                </>
              ) : recommendedCourse ? (
                <>
                  <p className="text-xs text-white/40 mb-2">{de ? "Empfohlen für dein Niveau:" : "Recommended for your level:"}</p>
                  <p className="text-base font-semibold text-white mb-4">{recommendedCourse.title}</p>
                  <Link href={`/${locale}/courses/${recommendedCourse.slug}` as any}
                    className="w-full py-2 rounded-md bg-[#E0B873] text-[#05101E] text-sm font-semibold hover:bg-[#C99B50] transition-colors flex items-center justify-center gap-2">
                    {de ? "Kurs starten" : "Start course"}
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-xs text-white/40 mb-4">{de ? "Noch kein Kurs gestartet." : "No course started yet."}</p>
                  <Link href={`/${locale}/courses` as any}
                    className="w-full py-2 rounded-md bg-[#E0B873]/10 border border-[#E0B873]/20 text-[#E0B873] text-sm font-medium hover:bg-[#E0B873]/20 transition-colors flex items-center justify-center gap-2">
                    {de ? "Kurse durchsuchen" : "Browse courses"}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* ── Next Lesson ── */}
            <div className={cardClass}>
              <h2 className="text-sm font-semibold text-white mb-4">{t("nextLesson")}</h2>
              {nextLesson ? (
                <>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-white/4 border border-white/6">
                    <div className="h-10 w-10 rounded-lg bg-[#E0B873]/15 border border-[#E0B873]/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-[#E0B873]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{nextLesson.title}</p>
                    </div>
                  </div>
                  <Link href={`/${locale}/lessons/${nextLesson.slug}` as any}
                    className="w-full mt-4 py-2.5 rounded-md bg-[#E0B873] text-[#05101E] text-sm font-semibold hover:bg-[#C99B50] transition-colors flex items-center justify-center">
                    {t("startLesson")}
                  </Link>
                </>
              ) : (
                <p className="text-sm text-white/40">
                  {currentCourse
                    ? (de ? "Alle Lektionen abgeschlossen! 🎉" : "All lessons completed! 🎉")
                    : (de ? "Starte einen Kurs, um Lektionen zu sehen." : "Start a course to see lessons here.")
                  }
                </p>
              )}
            </div>

            {/* ── Placement Test ── */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="h-4 w-4 text-[#E0B873]" />
                <h2 className="text-sm font-semibold text-white">{t("placementResult")}</h2>
              </div>
              {latestPlacement ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/4 border border-white/6">
                    <div>
                      <p className="text-2xl font-bold text-[#E0B873]">{latestPlacement.score}/10</p>
                      <p className="text-xs text-white/40">{de ? "Punkte" : "Score"}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div>
                      <p className="text-2xl font-bold text-white">{latestPlacement.level_result}</p>
                      <p className="text-xs text-white/40">{de ? "Dein Niveau" : "Your level"}</p>
                    </div>
                  </div>
                  <Link href={`/${locale}/placement-test` as any}
                    className="text-xs text-[#E0B873] hover:underline">
                    {de ? "Test wiederholen →" : "Retake test →"}
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-xs text-white/40 mb-4">{de ? "Noch nicht gemacht." : "Not taken yet."}</p>
                  <Link href={`/${locale}/placement-test` as any}
                    className="w-full py-2.5 rounded-md bg-[#E0B873]/10 border border-[#E0B873]/20 text-[#E0B873] text-sm font-medium hover:bg-[#E0B873]/20 transition-colors flex items-center justify-center">
                    {de ? "Jetzt starten" : "Start now"}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ── Sessions + Messages row ── */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-4 w-4 text-[#E0B873]" />
                <h2 className="text-sm font-semibold text-white">{t("bookSession")}</h2>
              </div>
              <p className="text-xs text-white/40 mb-4">{de ? "Live-Sessions kommen bald." : "Live sessions coming soon."}</p>
              <span className="inline-block text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-md">{t("comingSoon")}</span>
            </div>
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#E0B873]" />
                  <h2 className="text-sm font-semibold text-white">{t("messages")}</h2>
                </div>
              </div>
              <p className="text-xs text-white/40">{t("noMessages")}</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
