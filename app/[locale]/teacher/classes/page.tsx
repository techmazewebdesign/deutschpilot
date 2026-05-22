import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/components/app/app-layout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { FadeIn, StaggerParent, StaggerChild } from "@/components/app/motion-card";
import { Video, CalendarDays, Clock, Plus, Users, Edit2 } from "lucide-react";

export const dynamic = "force-dynamic";

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  A2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  B1: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  B2: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  C1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

type LiveClass = {
  id: string; title: string; level: string; start_time: string;
  duration_minutes: number; status: string; max_students: number;
};

export default async function TeacherClassesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/signin`);
  if (session.user.role !== "teacher") redirect(`/${locale}/student/dashboard`);

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("live_classes")
    .select("id, title, level, start_time, duration_minutes, status, max_students")
    .eq("teacher_id", session.user.id)
    .order("start_time", { ascending: false });

  const classes = (data ?? []) as LiveClass[];
  const userName = session.user.name || session.user.email?.split("@")[0] || "Teacher";

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  // Get enrollment counts
  const classIds = classes.map((c) => c.id);
  const enrollmentCounts: Record<string, number> = {};
  if (classIds.length > 0) {
    const { data: enrollments } = await supabase
      .from("class_enrollments")
      .select("class_id")
      .in("class_id", classIds)
      .eq("status", "enrolled");
    (enrollments ?? []).forEach((e: { class_id: string }) => {
      enrollmentCounts[e.class_id] = (enrollmentCounts[e.class_id] ?? 0) + 1;
    });
  }

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-4xl w-full mx-auto">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Video className="h-4 w-4 text-[#E0B873]" />
                <span className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">My Classes</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-white">All Classes</h1>
            </div>
            <Link
              href={`/${locale}/teacher/classes/new`}
              className="flex items-center gap-2 bg-[#E0B873] text-[#071424] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#C99B50] transition-colors"
            >
              <Plus className="h-4 w-4" /> New Class
            </Link>
          </div>
        </FadeIn>

        {classes.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="text-center py-16 rounded-2xl border border-white/8 bg-[#0A1E35]/50">
              <Video className="h-12 w-12 mx-auto text-white/15 mb-4" />
              <p className="text-white/50 font-medium">No classes yet.</p>
              <p className="text-white/30 text-sm mt-1 mb-6">Create your first live class and start enrolling students.</p>
              <Link
                href={`/${locale}/teacher/classes/new`}
                className="inline-flex items-center gap-2 bg-[#E0B873] text-[#071424] font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#C99B50] transition-colors"
              >
                <Plus className="h-4 w-4" /> Create Class
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerParent className="space-y-4">
            {classes.map((cls) => {
              const enrolled = enrollmentCounts[cls.id] ?? 0;
              return (
                <StaggerChild key={cls.id}>
                  <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/20 transition-colors p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${levelColors[cls.level] ?? levelColors.A1}`}>{cls.level}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                            cls.status === "active" ? "bg-emerald-500/15 text-emerald-300" :
                            cls.status === "draft" ? "bg-white/10 text-white/50" :
                            cls.status === "completed" ? "bg-blue-500/15 text-blue-300" :
                            "bg-red-500/15 text-red-300"
                          }`}>{cls.status}</span>
                        </div>
                        <h3 className="text-base font-serif font-bold text-white">{cls.title}</h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/40">
                          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{fmtDate(cls.start_time)}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtTime(cls.start_time)} · {cls.duration_minutes} min</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{enrolled}/{cls.max_students} students</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link
                          href={`/${locale}/teacher/classes/${cls.id}/students`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white border border-white/15 hover:border-white/30 px-3 py-2 rounded-lg transition-colors"
                        >
                          <Users className="h-3.5 w-3.5" /> Students
                        </Link>
                        <Link
                          href={`/${locale}/teacher/classes/${cls.id}/edit`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#E0B873] hover:text-[#C99B50] border border-[#E0B873]/30 hover:border-[#E0B873]/50 px-3 py-2 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerChild>
              );
            })}
          </StaggerParent>
        )}
      </div>
    </AppLayout>
  );
}
