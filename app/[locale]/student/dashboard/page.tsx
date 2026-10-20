import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/components/app/app-layout";
import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { MotionCard, FadeIn, StaggerParent, StaggerChild } from "@/components/app/motion-card";
import { AnimatedProgress } from "@/components/app/animated-progress";
import {
  BookOpen,
  MessageSquare,
  Video,
  ChevronRight,
  GraduationCap,
  Users,
  Flame,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

function calcStreak(rows: { updated_at: string; completed: boolean }[]): number {
  const days = new Set(
    rows.filter((r) => r.completed && r.updated_at).map((r) => r.updated_at.slice(0, 10))
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toISOString().slice(0, 10))) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export default async function StudentDashboardPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "studentDashboard" });
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/signin`);
  if (session.user.role === "teacher") redirect(`/${locale}/teacher/dashboard`);

  const supabase = await legacyLearningClient(session.user.id);
  const profileResult = requireQuery(
    await supabase.from("profiles").select("id").eq("firebase_uid", session.user.id).maybeSingle()
  );
  const profileId = profileResult.data?.id;
  if (!profileId)
    throw new Error(
      "Your school profile must be linked by a verified administrator before using classes."
    );
  const userId = session.user.id;
  const userName = session.user.name || session.user.email?.split("@")[0] || t("studentFallback");

  const [progressRes, enrollmentsRes, placementRes] = await Promise.all([
    supabase
      .from("student_progress")
      .select("course_id, lesson_id, completed, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("class_enrollments")
      .select(
        "id, status, class_id, live_classes(id, title, level, teacher_name, start_time, meet_url, status)"
      )
      .eq("student_id", profileId)
      .eq("status", "enrolled"),
    supabase
      .from("placement_tests")
      .select("level_result")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  [progressRes, enrollmentsRes, placementRes].forEach(requireQuery);
  const progress = progressRes.data ?? [];
  type EnrolledClass = {
    id: string;
    title: string;
    level: string;
    teacher_name: string;
    start_time: string;
    meet_url: string | null;
    status: string;
  };
  const enrollments = (enrollmentsRes.data ?? []) as unknown as Array<{
    id: string;
    status: string;
    class_id: string;
    live_classes: EnrolledClass | null;
  }>;
  const germanLevel = placementRes.data?.level_result ?? "A1";
  const streak = calcStreak(progress);
  const completedCount = progress.filter((r) => r.completed).length;
  const totalCount = progress.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Latest course
  const latestCourseId = progress[0]?.course_id ?? null;
  let latestCourse: { title: string; slug: string; level: string } | null = null;
  if (latestCourseId) {
    const { data } = requireQuery(
      await supabase
        .from("courses")
        .select("title, slug, level")
        .eq("id", latestCourseId)
        .maybeSingle()
    );
    latestCourse = data;
  }

  const upcomingClasses = enrollments
    .map((e) => e.live_classes)
    .filter(Boolean)
    .filter((c) => c!.status !== "completed" && c!.status !== "cancelled")
    .sort(
      (a, b) => new Date(a!.start_time).getTime() - new Date(b!.start_time).getTime()
    ) as EnrolledClass[];

  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(iso).toLocaleDateString("en-GB", opts);

  return (
    <AppLayout
      locale={locale}
      userName={userName}
      userLevel={session.user.role === "admin" ? "admin" : undefined}
    >
      <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Welcome */}
        <FadeIn>
          <div className="rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0D2040] to-[#081628] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#E0B873]/60">
                  {t("eyebrow")}
                </p>
                <h1 className="font-serif text-2xl font-bold text-white lg:text-3xl">
                  {t("welcomeBack", { name: userName.split(" ")[0] })}
                </h1>
                <p className="mt-1 text-sm text-white/45">{t("subtitle")}</p>
              </div>
              <div className="flex gap-3">
                <div className="min-w-[72px] rounded-xl border border-[#E0B873]/20 bg-[#E0B873]/10 px-4 py-3 text-center">
                  <p className="mb-0.5 text-[10px] uppercase tracking-wider text-[#E0B873]/60">
                    {t("levelLabel")}
                  </p>
                  <p className="text-xl font-bold text-[#E0B873]">{germanLevel}</p>
                </div>
                {streak > 0 && (
                  <div className="min-w-[72px] rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-center">
                    <p className="mb-0.5 flex items-center justify-center gap-0.5 text-[10px] text-orange-400/70">
                      <Flame className="h-3 w-3" /> {t("streakLabel")}
                    </p>
                    <p className="text-xl font-bold text-orange-400">{streak}d</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Top action cards */}
        <StaggerParent className="grid gap-4 sm:grid-cols-2">
          {/* Continue Learning */}
          <StaggerChild>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5 transition-colors hover:border-[#E0B873]/25">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#E0B873]/15">
                  <BookOpen className="h-4 w-4 text-[#E0B873]" />
                </div>
                <span className="text-sm font-semibold text-white">{t("continueLearning")}</span>
              </div>
              {latestCourse ? (
                <>
                  <div className="flex-1">
                    <p className="mb-1 text-xs text-white/35">{t("currentCourseLabel")}</p>
                    <p className="text-base font-semibold leading-snug text-white">
                      {latestCourse.title}
                    </p>
                    <div className="mt-3">
                      <AnimatedProgress
                        value={pct}
                        label={t("exercisesDone", { count: completedCount })}
                      />
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/courses/${latestCourse.slug}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#E0B873] py-2.5 text-sm font-semibold text-[#071424] transition-colors hover:bg-[#C99B50]"
                  >
                    {t("continueLearning")} <ChevronRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm text-white/40">{t("noCourseText")}</p>
                  <Link
                    href={`/${locale}/rooms`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#E0B873] py-2.5 text-sm font-semibold text-[#071424] transition-colors hover:bg-[#C99B50]"
                  >
                    {t("browseRooms")} <ChevronRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </StaggerChild>

          {/* AI Trainer */}
          <StaggerChild>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5 transition-colors hover:border-violet-500/25">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                  <MessageSquare className="h-4 w-4 text-violet-300" />
                </div>
                <span className="text-sm font-semibold text-white">{t("aiTrainerTitle")}</span>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-white/45">{t("aiTrainerDesc")}</p>
              <Link
                href={`/${locale}/ai-trainer`}
                className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 py-2.5 text-sm font-semibold text-violet-300 transition-colors hover:bg-violet-500/10"
              >
                {t("openAiTrainer")} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </StaggerChild>
        </StaggerParent>

        {/* My Live Classes */}
        <MotionCard
          delay={0.2}
          hover={false}
          className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-[#E0B873]" />
              <h2 className="text-sm font-semibold text-white">{t("myLiveClasses")}</h2>
            </div>
            <Link
              href={`/${locale}/student/classes`}
              className="flex items-center gap-0.5 text-xs text-[#E0B873]/60 transition-colors hover:text-[#E0B873]"
            >
              {t("viewAll")} <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="py-10 text-center">
              <CalendarDays className="mx-auto mb-3 h-10 w-10 text-white/15" />
              <p className="mb-4 text-sm text-white/40">{t("noClassesText")}</p>
              <Link
                href={`/${locale}/classes`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E0B873] px-5 py-2 text-sm font-semibold text-[#071424] transition-colors hover:bg-[#C99B50]"
              >
                {t("browseLiveClasses")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.slice(0, 3).map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white/3 border-white/6 flex flex-col justify-between gap-3 rounded-xl border p-3 transition-colors hover:border-white/10 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#E0B873]/10 px-2 py-0.5 text-[10px] font-bold text-[#E0B873]">
                        {cls.level}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${cls.status === "active" ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/50"}`}
                      >
                        {cls.status}
                      </span>
                    </div>
                    <p className="truncate text-sm font-semibold text-white">{cls.title}</p>
                    <p className="text-xs text-white/40">
                      {cls.teacher_name} ·{" "}
                      {fmt(cls.start_time, { weekday: "short", day: "numeric", month: "short" })}{" "}
                      {t("at")}{" "}
                      {new Date(cls.start_time).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {cls.meet_url ? (
                    <a
                      href={cls.meet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
                    >
                      <ExternalLink className="h-3 w-3" /> {t("joinClass")}
                    </a>
                  ) : (
                    <span className="max-w-[160px] flex-shrink-0 text-right text-xs italic text-white/25">
                      {t("meetLinkComingSoon")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </MotionCard>

        {/* Bottom cards */}
        <StaggerParent className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: `/${locale}/teachers`,
              icon: Users,
              color: "bg-blue-500/15 text-blue-300",
              title: t("browseTeachersTitle"),
              sub: t("browseTeachersSub"),
              cta: t("viewTeachers"),
            },
            {
              href: `/${locale}/classes`,
              icon: Video,
              color: "bg-emerald-500/15 text-emerald-300",
              title: t("liveClassesTitle"),
              sub: t("liveClassesSub"),
              cta: t("viewClasses"),
            },
            {
              href: `/${locale}/placement-test`,
              icon: GraduationCap,
              color: "bg-amber-500/15 text-amber-300",
              title: t("myLevelTitle"),
              sub: t("myLevelSub", { level: germanLevel }),
              cta: t("retakeTest"),
            },
          ].map((card) => (
            <StaggerChild key={card.href}>
              <Link
                href={card.href}
                className="group block flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5 transition-colors hover:border-[#E0B873]/25"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.color}`}
                >
                  <card.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-0.5 text-xs text-white/40">{card.sub}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#E0B873] transition-all group-hover:gap-2">
                  {card.cta} <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>
    </AppLayout>
  );
}
