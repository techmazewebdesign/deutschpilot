import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/components/app/app-layout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { MotionCard, FadeIn, StaggerParent, StaggerChild } from "@/components/app/motion-card";
import {
  Video, Users, Plus, CalendarDays,
  Edit2, ExternalLink, CheckCircle2, Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

type LiveClass = {
  id: string; title: string; level: string; teacher_id: string;
  start_time: string; meet_url: string | null; status: string;
  max_students: number; description: string | null;
};

const statusColor = (s: string) =>
  ({ draft: "bg-white/10 text-white/50", active: "bg-emerald-500/15 text-emerald-300", completed: "bg-blue-500/15 text-blue-300", cancelled: "bg-red-500/15 text-red-300" }[s] ?? "bg-white/10 text-white/50");

export default async function TeacherDashboardPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/signin`);
  if (session.user.role === "student") redirect(`/${locale}/student/dashboard`);
  if (session.user.role === "admin") redirect(`/${locale}/admin`);

  const supabase = createServerSupabaseClient();
  const teacherId = session.user.id;
  const teacherName = session.user.name || session.user.email?.split("@")[0] || "Teacher";

  const { data: classes } = await supabase
    .from("live_classes")
    .select("id, title, level, teacher_id, start_time, meet_url, status, max_students, description")
    .eq("teacher_id", teacherId)
    .order("start_time", { ascending: false });

  const myClasses = (classes ?? []) as LiveClass[];
  const classIds = myClasses.map((c) => c.id);

  let enrollmentCounts: Record<string, number> = {};
  if (classIds.length > 0) {
    const { data: enrolData } = await supabase.from("class_enrollments").select("class_id").in("class_id", classIds).eq("status", "enrolled");
    (enrolData ?? []).forEach((row: { class_id: string }) => {
      enrollmentCounts[row.class_id] = (enrollmentCounts[row.class_id] ?? 0) + 1;
    });
  }

  const now = new Date();
  const upcoming = myClasses.filter((c) => new Date(c.start_time) > now && c.status !== "cancelled");
  const active = myClasses.filter((c) => c.status === "active");
  const completed = myClasses.filter((c) => c.status === "completed");
  const nextClass = [...upcoming].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0] ?? null;
  const totalStudents = Object.values(enrollmentCounts).reduce((s, n) => s + n, 0);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <AppLayout locale={locale} userName={teacherName}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl w-full mx-auto space-y-5">

        {/* Welcome */}
        <FadeIn>
          <div className="rounded-2xl bg-gradient-to-br from-[#0D2040] to-[#081628] border border-[#E0B873]/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-[#E0B873]/60 uppercase tracking-[0.25em] mb-1">Teacher Dashboard</p>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Welcome, {teacherName.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-white/45 mt-1">Manage your live classes and students.</p>
            </div>
            <Link href={`/${locale}/teacher/classes/new`} className="flex-shrink-0 flex items-center gap-2 bg-[#E0B873] text-[#071424] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#C99B50] transition-colors">
              <Plus className="h-4 w-4" /> Create Class
            </Link>
          </div>
        </FadeIn>

        {/* Stats */}
        <StaggerParent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Active Classes", value: active.length, Icon: Video, color: "text-emerald-300 bg-emerald-500/15" },
            { label: "Upcoming", value: upcoming.length, Icon: CalendarDays, color: "text-blue-300 bg-blue-500/15" },
            { label: "Total Students", value: totalStudents, Icon: Users, color: "text-violet-300 bg-violet-500/15" },
            { label: "Completed", value: completed.length, Icon: CheckCircle2, color: "text-amber-300 bg-amber-500/15" },
          ].map((stat) => (
            <StaggerChild key={stat.label}>
              <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-4">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.Icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              </div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {/* Next Upcoming Class */}
        {nextClass && (
          <MotionCard delay={0.2} hover={false} className="rounded-2xl border border-[#E0B873]/20 bg-[#0A1E35]/70 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-[#E0B873]" />
              <span className="text-sm font-semibold text-white">Next Upcoming Class</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#E0B873] bg-[#E0B873]/10 px-2 py-0.5 rounded-full">{nextClass.level}</span>
                </div>
                <p className="text-base font-semibold text-white">{nextClass.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{fmtDate(nextClass.start_time)} at {fmtTime(nextClass.start_time)}</p>
                {nextClass.meet_url
                  ? <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Google Meet link is set</p>
                  : <p className="text-xs text-amber-400/70 mt-1">No Meet link yet — add one via Edit Class</p>
                }
              </div>
              <div className="flex flex-wrap gap-2">
                {nextClass.meet_url && (
                  <a href={nextClass.meet_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs bg-emerald-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-emerald-500 transition-colors">
                    <ExternalLink className="h-3 w-3" /> Open Meet
                  </a>
                )}
                <Link href={`/${locale}/teacher/classes/${nextClass.id}/students`} className="flex items-center gap-1.5 text-xs border border-white/20 text-white/70 font-semibold px-3 py-2 rounded-lg hover:text-white hover:border-white/40 transition-colors">
                  <Users className="h-3 w-3" /> Students
                </Link>
                <Link href={`/${locale}/teacher/classes/${nextClass.id}/edit`} className="flex items-center gap-1.5 text-xs border border-white/20 text-white/70 font-semibold px-3 py-2 rounded-lg hover:text-white hover:border-white/40 transition-colors">
                  <Edit2 className="h-3 w-3" /> Edit
                </Link>
              </div>
            </div>
          </MotionCard>
        )}

        {/* My Classes */}
        <MotionCard delay={0.25} hover={false} className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-[#E0B873]" />
              <h2 className="text-sm font-semibold text-white">My Classes</h2>
            </div>
            <Link href={`/${locale}/teacher/classes/new`} className="flex items-center gap-1 text-xs text-[#E0B873]/70 hover:text-[#E0B873] transition-colors">
              <Plus className="h-3.5 w-3.5" /> New Class
            </Link>
          </div>

          {myClasses.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-10 w-10 mx-auto text-white/15 mb-3" />
              <p className="text-sm text-white/40 mb-1">You have no classes yet.</p>
              <p className="text-xs text-white/25 mb-4">Create your first class and share the link with students.</p>
              <Link href={`/${locale}/teacher/classes/new`} className="inline-flex items-center gap-1.5 bg-[#E0B873] text-[#071424] font-semibold text-sm px-5 py-2 rounded-xl hover:bg-[#C99B50] transition-colors">
                <Plus className="h-4 w-4" /> Create Your First Class
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myClasses.map((cls) => {
                const enrollCount = enrollmentCounts[cls.id] ?? 0;
                return (
                  <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/6 hover:border-white/10 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold text-[#E0B873] bg-[#E0B873]/10 px-2 py-0.5 rounded-full">{cls.level}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(cls.status)}`}>{cls.status}</span>
                        <span className="text-[10px] text-white/30">{enrollCount}/{cls.max_students} students</span>
                        {cls.meet_url && <span className="text-[10px] text-emerald-400 flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> Meet</span>}
                      </div>
                      <p className="text-sm font-semibold text-white truncate">{cls.title}</p>
                      <p className="text-xs text-white/40">{fmtDate(cls.start_time)} at {fmtTime(cls.start_time)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/${locale}/teacher/classes/${cls.id}/edit`} className="flex items-center gap-1 text-xs border border-white/15 text-white/60 px-3 py-1.5 rounded-lg hover:text-white hover:border-white/30 transition-colors">
                        <Edit2 className="h-3 w-3" /> Edit
                      </Link>
                      <Link href={`/${locale}/teacher/classes/${cls.id}/students`} className="flex items-center gap-1 text-xs border border-white/15 text-white/60 px-3 py-1.5 rounded-lg hover:text-white hover:border-white/30 transition-colors">
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
