import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/components/app/app-layout";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { findProfile } from "@/lib/profileHelper";
import { MotionCard, FadeIn, StaggerParent, StaggerChild } from "@/components/app/motion-card";
import {
  Video,
  Users,
  Plus,
  CalendarDays,
  Edit2,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

type LiveClass = {
  id: string;
  title: string;
  level: string;
  teacher_id: string;
  start_time: string;
  meet_url: string | null;
  status: string;
  max_students: number;
  description: string | null;
};

const statusColor = (s: string) =>
  ({
    draft: "bg-white/10 text-white/50",
    active: "bg-emerald-500/15 text-emerald-300",
    completed: "bg-blue-500/15 text-blue-300",
    cancelled: "bg-red-500/15 text-red-300",
  })[s] ?? "bg-white/10 text-white/50";

export default async function TeacherDashboardPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/signin`);
  if (session.user.role === "student") redirect(`/${locale}/student/dashboard`);
  if (session.user.role === "admin") redirect(`/${locale}/admin`);

  const profile = await findProfile(session.user.id);
  if (!profile) throw new Error("Teacher profile is unavailable. Contact school support.");
  const supabase = createAdminSupabaseClient();
  const teacherId = profile.id;
  const teacherName = session.user.name || session.user.email?.split("@")[0] || "Teacher";

  const { data: classes, error: classesError } = await supabase
    .from("live_classes")
    .select("id, title, level, teacher_id, start_time, meet_url, status, max_students, description")
    .eq("teacher_id", teacherId)
    .order("start_time", { ascending: false });

  if (classesError) throw new Error("Your classes could not be loaded. Please retry.");
  const myClasses = (classes ?? []) as LiveClass[];
  const classIds = myClasses.map((c) => c.id);

  let enrollmentCounts: Record<string, number> = {};
  if (classIds.length > 0) {
    const { data: enrolData, error: enrollmentError } = await supabase
      .from("class_enrollments")
      .select("class_id")
      .in("class_id", classIds)
      .eq("status", "enrolled");
    if (enrollmentError) throw new Error("Class enrolments could not be loaded. Please retry.");
    (enrolData ?? []).forEach((row: { class_id: string }) => {
      enrollmentCounts[row.class_id] = (enrollmentCounts[row.class_id] ?? 0) + 1;
    });
  }

  const now = new Date();
  const upcoming = myClasses.filter(
    (c) => new Date(c.start_time) > now && c.status !== "cancelled"
  );
  const active = myClasses.filter((c) => c.status === "active");
  const completed = myClasses.filter((c) => c.status === "completed");
  const nextClass =
    [...upcoming].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )[0] ?? null;
  const totalStudents = Object.values(enrollmentCounts).reduce((s, n) => s + n, 0);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <AppLayout locale={locale} userName={teacherName}>
      <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Welcome */}
        <FadeIn>
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0D2040] to-[#081628] p-6 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#E0B873]/60">
                Teacher Dashboard
              </p>
              <h1 className="font-serif text-2xl font-bold text-white lg:text-3xl">
                Welcome, {teacherName.split(" ")[0]} 👋
              </h1>
              <p className="mt-1 text-sm text-white/45">Manage your live classes and students.</p>
            </div>
            <Link
              href={`/${locale}/teacher/classes/new`}
              className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#E0B873] px-5 py-2.5 text-sm font-semibold text-[#071424] transition-colors hover:bg-[#C99B50]"
            >
              <Plus className="h-4 w-4" /> Create Class
            </Link>
          </div>
        </FadeIn>

        {/* Stats */}
        <StaggerParent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Active Classes",
              value: active.length,
              Icon: Video,
              color: "text-emerald-300 bg-emerald-500/15",
            },
            {
              label: "Upcoming",
              value: upcoming.length,
              Icon: CalendarDays,
              color: "text-blue-300 bg-blue-500/15",
            },
            {
              label: "Total Students",
              value: totalStudents,
              Icon: Users,
              color: "text-violet-300 bg-violet-500/15",
            },
            {
              label: "Completed",
              value: completed.length,
              Icon: CheckCircle2,
              color: "text-amber-300 bg-amber-500/15",
            },
          ].map((stat) => (
            <StaggerChild key={stat.label}>
              <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-4">
                <div
                  className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.Icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-xs text-white/40">{stat.label}</p>
              </div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {/* Next Upcoming Class */}
        {nextClass && (
          <MotionCard
            delay={0.2}
            hover={false}
            className="rounded-2xl border border-[#E0B873]/20 bg-[#0A1E35]/70 p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#E0B873]" />
              <span className="text-sm font-semibold text-white">Next Upcoming Class</span>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-[#E0B873]/10 px-2 py-0.5 text-xs font-bold text-[#E0B873]">
                    {nextClass.level}
                  </span>
                </div>
                <p className="text-base font-semibold text-white">{nextClass.title}</p>
                <p className="mt-0.5 text-xs text-white/40">
                  {fmtDate(nextClass.start_time)} at {fmtTime(nextClass.start_time)}
                </p>
                {nextClass.meet_url ? (
                  <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Google Meet link is set
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-amber-400/70">
                    No Meet link yet — add one via Edit Class
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {nextClass.meet_url && (
                  <a
                    href={nextClass.meet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
                  >
                    <ExternalLink className="h-3 w-3" /> Open Meet
                  </a>
                )}
                <Link
                  href={`/${locale}/teacher/classes/${nextClass.id}/students`}
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Users className="h-3 w-3" /> Students
                </Link>
                <Link
                  href={`/${locale}/teacher/classes/${nextClass.id}/edit`}
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </Link>
              </div>
            </div>
          </MotionCard>
        )}

        {/* My Classes */}
        <MotionCard
          delay={0.25}
          hover={false}
          className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-[#E0B873]" />
              <h2 className="text-sm font-semibold text-white">My Classes</h2>
            </div>
            <Link
              href={`/${locale}/teacher/classes/new`}
              className="flex items-center gap-1 text-xs text-[#E0B873]/70 transition-colors hover:text-[#E0B873]"
            >
              <Plus className="h-3.5 w-3.5" /> New Class
            </Link>
          </div>

          {myClasses.length === 0 ? (
            <div className="py-12 text-center">
              <Video className="mx-auto mb-3 h-10 w-10 text-white/15" />
              <p className="mb-1 text-sm text-white/40">You have no classes yet.</p>
              <p className="mb-4 text-xs text-white/25">
                Create your first class and share the link with students.
              </p>
              <Link
                href={`/${locale}/teacher/classes/new`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E0B873] px-5 py-2 text-sm font-semibold text-[#071424] transition-colors hover:bg-[#C99B50]"
              >
                <Plus className="h-4 w-4" /> Create Your First Class
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myClasses.map((cls) => {
                const enrollCount = enrollmentCounts[cls.id] ?? 0;
                return (
                  <div
                    key={cls.id}
                    className="bg-white/3 border-white/6 flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:border-white/10 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#E0B873]/10 px-2 py-0.5 text-[10px] font-bold text-[#E0B873]">
                          {cls.level}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColor(cls.status)}`}
                        >
                          {cls.status}
                        </span>
                        <span className="text-[10px] text-white/30">
                          {enrollCount}/{cls.max_students} students
                        </span>
                        {cls.meet_url && (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Meet
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm font-semibold text-white">{cls.title}</p>
                      <p className="text-xs text-white/40">
                        {fmtDate(cls.start_time)} at {fmtTime(cls.start_time)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/${locale}/teacher/classes/${cls.id}/edit`}
                        className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/30 hover:text-white"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </Link>
                      <Link
                        href={`/${locale}/teacher/classes/${cls.id}/students`}
                        className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/30 hover:text-white"
                      >
                        <Users className="h-3 w-3" /> Students
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </MotionCard>
      </div>
    </AppLayout>
  );
}
