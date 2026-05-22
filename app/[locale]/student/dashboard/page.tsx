import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/components/app/app-layout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { MotionCard, FadeIn, StaggerParent, StaggerChild } from "@/components/app/motion-card";
import { AnimatedProgress } from "@/components/app/animated-progress";
import {
  BookOpen, MessageSquare, Video, ChevronRight,
  GraduationCap, Users, Flame, CalendarDays, ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

function calcStreak(rows: { updated_at: string; completed: boolean }[]): number {
  const days = new Set(rows.filter((r) => r.completed && r.updated_at).map((r) => r.updated_at.slice(0, 10)));
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
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/signin`);
  if (session.user.role === "teacher") redirect(`/${locale}/teacher/dashboard`);
  if (session.user.role === "admin") redirect(`/${locale}/admin`);

  const supabase = createServerSupabaseClient();
  const userId = session.user.id;
  const userName = session.user.name || session.user.email?.split("@")[0] || "Student";

  const [progressRes, enrollmentsRes, placementRes] = await Promise.all([
    supabase.from("student_progress").select("course_id, lesson_id, completed, updated_at").eq("user_id", userId).order("updated_at", { ascending: false }),
    supabase.from("class_enrollments").select("id, status, class_id, live_classes(id, title, level, teacher_name, start_time, meet_url, status)").eq("student_id", userId).eq("status", "enrolled"),
    supabase.from("placement_tests").select("level").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single(),
  ]);

  const progress = progressRes.data ?? [];
  type EnrolledClass = { id: string; title: string; level: string; teacher_name: string; start_time: string; meet_url: string | null; status: string };
  const enrollments = ((enrollmentsRes.data ?? []) as Array<{ id: string; status: string; class_id: string; live_classes: EnrolledClass | null }>);
  const germanLevel = placementRes.data?.level ?? "A1";
  const streak = calcStreak(progress);
  const completedCount = progress.filter((r) => r.completed).length;
  const totalCount = progress.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Latest course
  const latestCourseId = progress[0]?.course_id ?? null;
  let latestCourse: { title: string; slug: string; level: string } | null = null;
  if (latestCourseId) {
    const { data } = await supabase.from("courses").select("title, slug, level").eq("id", latestCourseId).single();
    latestCourse = data;
  }

  const upcomingClasses = enrollments.map((e) => e.live_classes).filter(Boolean).filter((c) => c!.status !== "completed" && c!.status !== "cancelled").sort((a, b) => new Date(a!.start_time).getTime() - new Date(b!.start_time).getTime()) as EnrolledClass[];

  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) => new Date(iso).toLocaleDateString("en-GB", opts);

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl w-full mx-auto space-y-5">

        {/* Welcome */}
        <FadeIn>
          <div className="rounded-2xl bg-gradient-to-br from-[#0D2040] to-[#081628] border border-[#E0B873]/20 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-[#E0B873]/60 uppercase tracking-[0.25em] mb-1">Student Dashboard</p>
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                  Welcome back, {userName.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-white/45 mt-1">Continue learning German step by step.</p>
              </div>
              <div className="flex gap-3">
                <div className="text-center bg-[#E0B873]/10 border border-[#E0B873]/20 rounded-xl px-4 py-3 min-w-[72px]">
                  <p className="text-[10px] text-[#E0B873]/60 mb-0.5 uppercase tracking-wider">Level</p>
                  <p className="text-xl font-bold text-[#E0B873]">{germanLevel}</p>
                </div>
                {streak > 0 && (
                  <div className="text-center bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 min-w-[72px]">
                    <p className="text-[10px] text-orange-400/70 mb-0.5 flex items-center justify-center gap-0.5"><Flame className="h-3 w-3" /> Streak</p>
                    <p className="text-xl font-bold text-orange-400">{streak}d</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Top action cards */}
        <StaggerParent className="grid sm:grid-cols-2 gap-4">
          {/* Continue Learning */}
          <StaggerChild>
            <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5 flex flex-col gap-4 h-full hover:border-[#E0B873]/25 transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#E0B873]/15 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-[#E0B873]" />
                </div>
                <span className="text-sm font-semibold text-white">Continue Learning</span>
              </div>
              {latestCourse ? (
                <>
                  <div className="flex-1">
                    <p className="text-xs text-white/35 mb-1">Current Course</p>
                    <p className="text-base font-semibold text-white leading-snug">{latestCourse.title}</p>
                    <div className="mt-3">
                      <AnimatedProgress value={pct} label={`${completedCount} exercises done`} />
                    </div>
                  </div>
                  <Link href={`/${locale}/courses/${latestCourse.slug}`} className="flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#C99B50] transition-colors">
                    Continue Learning <ChevronRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-white/40 flex-1">Pick a course and start your first lesson.</p>
                  <Link href={`/${locale}/rooms`} className="flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#C99B50] transition-colors">
                    Browse Rooms <ChevronRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </StaggerChild>

          {/* AI Trainer */}
          <StaggerChild>
            <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5 flex flex-col gap-4 h-full hover:border-violet-500/25 transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-violet-300" />
                </div>
                <span className="text-sm font-semibold text-white">AI Trainer</span>
              </div>
              <p className="text-sm text-white/45 leading-relaxed flex-1">
                Practice German with AI. Ask questions, correct mistakes, and do exercises — any time, for free.
              </p>
              <Link href={`/${locale}/ai-trainer`} className="flex items-center justify-center gap-2 border border-violet-500/30 text-violet-300 font-semibold text-sm py-2.5 rounded-xl hover:bg-violet-500/10 transition-colors">
                Open AI Trainer <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </StaggerChild>
        </StaggerParent>

        {/* My Live Classes */}
        <MotionCard delay={0.2} hover={false} className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-[#E0B873]" />
              <h2 className="text-sm font-semibold text-white">My Live Classes</h2>
            </div>
            <Link href={`/${locale}/student/classes`} className="text-xs text-[#E0B873]/60 hover:text-[#E0B873] transition-colors flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="text-center py-10">
              <CalendarDays className="h-10 w-10 mx-auto text-white/15 mb-3" />
              <p className="text-sm text-white/40 mb-4">You have not joined any live class yet.</p>
              <Link href={`/${locale}/classes`} className="inline-flex items-center gap-1.5 bg-[#E0B873] text-[#071424] font-semibold text-sm px-5 py-2 rounded-xl hover:bg-[#C99B50] transition-colors">
                Browse Live Classes
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.slice(0, 3).map((cls) => (
                <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/3 border border-white/6 hover:border-white/10 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[10px] font-bold text-[#E0B873] bg-[#E0B873]/10 px-2 py-0.5 rounded-full">{cls.level}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${cls.status === "active" ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/50"}`}>{cls.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{cls.title}</p>
                    <p className="text-xs text-white/40">{cls.teacher_name} · {fmt(cls.start_time, { weekday: "short", day: "numeric", month: "short" })} at {new Date(cls.start_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  {cls.meet_url ? (
                    <a href={cls.meet_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors">
                      <ExternalLink className="h-3 w-3" /> Join Class
                    </a>
                  ) : (
                    <span className="flex-shrink-0 text-xs text-white/25 italic max-w-[160px] text-right">
                      Meet link coming before class
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </MotionCard>

        {/* Bottom cards */}
        <StaggerParent className="grid sm:grid-cols-3 gap-4">
          {[
            { href: `/${locale}/teachers`, icon: Users, color: "bg-blue-500/15 text-blue-300", title: "Browse Teachers", sub: "Find your ideal German teacher.", cta: "View Teachers" },
            { href: `/${locale}/classes`, icon: Video, color: "bg-emerald-500/15 text-emerald-300", title: "Live Classes", sub: "Join a live class with a real teacher.", cta: "View Classes" },
            { href: `/${locale}/placement-test`, icon: GraduationCap, color: "bg-amber-500/15 text-amber-300", title: "My Level", sub: `Current: ${germanLevel}`, cta: "Retake Test" },
          ].map((card) => (
            <StaggerChild key={card.href}>
              <Link href={card.href} className="group block rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/25 p-5 flex flex-col gap-3 h-full transition-colors">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{card.sub}</p>
                </div>
                <span className="text-xs text-[#E0B873] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
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
