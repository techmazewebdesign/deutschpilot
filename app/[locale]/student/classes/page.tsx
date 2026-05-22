import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/components/app/app-layout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { FadeIn, StaggerParent, StaggerChild } from "@/components/app/motion-card";
import { Video, CalendarDays, Clock, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  A2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  B1: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  B2: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  C1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

type EnrolledClass = {
  id: string; title: string; level: string; teacher_name: string;
  start_time: string; duration_minutes: number; meet_url: string | null; status: string;
};

export default async function StudentClassesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/signin`);
  if (session.user.role !== "student") redirect(`/${locale}/teacher/dashboard`);

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("class_enrollments")
    .select("id, status, class_id, live_classes(id, title, level, teacher_name, start_time, duration_minutes, meet_url, status)")
    .eq("student_id", session.user.id)
    .order("created_at", { ascending: false });

  const enrollments = (data ?? []) as Array<{ id: string; status: string; class_id: string; live_classes: EnrolledClass | null }>;
  const classes = enrollments.map((e) => ({ enrollment_status: e.status, cls: e.live_classes })).filter((e) => e.cls !== null) as Array<{ enrollment_status: string; cls: EnrolledClass }>;

  const userName = session.user.name || session.user.email?.split("@")[0] || "Student";
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const isPast = (iso: string) => new Date(iso) < new Date();

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-3xl w-full mx-auto">
        <FadeIn>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Video className="h-4 w-4 text-[#E0B873]" />
              <span className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">My Classes</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Your Live Classes</h1>
          </div>
        </FadeIn>

        {classes.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="text-center py-16 rounded-2xl border border-white/8 bg-[#0A1E35]/50">
              <Video className="h-12 w-12 mx-auto text-white/15 mb-4" />
              <p className="text-white/50 font-medium">You have not joined any live class yet.</p>
              <p className="text-white/30 text-sm mt-1 mb-6">Browse available classes and enroll to join live sessions.</p>
              <Link href={`/${locale}/classes`} className="inline-flex items-center gap-2 bg-[#E0B873] text-[#071424] font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#C99B50] transition-colors">
                Browse Live Classes
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerParent className="space-y-4">
            {classes.map(({ enrollment_status, cls }) => {
              const past = isPast(cls.start_time);
              return (
                <StaggerChild key={cls.id}>
                  <div className={`rounded-2xl border bg-[#0A1E35]/70 p-5 transition-colors ${past ? "border-white/6 opacity-70" : "border-white/10 hover:border-[#E0B873]/20"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${levelColors[cls.level] ?? levelColors.A1}`}>{cls.level}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${cls.status === "active" ? "bg-emerald-500/15 text-emerald-300" : cls.status === "completed" ? "bg-blue-500/15 text-blue-300" : "bg-white/10 text-white/50"}`}>{cls.status}</span>
                          {past && <span className="text-[10px] text-white/30">Past</span>}
                        </div>
                        <h3 className="text-base font-serif font-bold text-white">{cls.title}</h3>
                        <p className="text-xs text-white/50 mt-1">Teacher: {cls.teacher_name}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/40">
                          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{fmtDate(cls.start_time)}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtTime(cls.start_time)} · {cls.duration_minutes} min</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {cls.meet_url && !past ? (
                          <a href={cls.meet_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-500 transition-colors whitespace-nowrap">
                            <ExternalLink className="h-3.5 w-3.5" /> Join Class
                          </a>
                        ) : !past ? (
                          <div className="text-center p-3 rounded-xl bg-white/3 border border-white/8 max-w-[160px]">
                            <p className="text-[10px] text-white/35 leading-snug">Your teacher will add the Google Meet link before the class starts.</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </StaggerChild>
              );
            })}
          </StaggerParent>
        )}

        {classes.length > 0 && (
          <FadeIn delay={0.3}>
            <div className="mt-8 text-center">
              <Link href={`/${locale}/classes`} className="text-sm text-[#E0B873]/70 hover:text-[#E0B873] transition-colors">
                Browse more live classes →
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </AppLayout>
  );
}
