import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { EnrollButton } from "@/components/app/enroll-button";
import { StaggerParent, StaggerChild, FadeIn } from "@/components/app/motion-card";
import { Video, CalendarDays, Clock, Users } from "lucide-react";

export const dynamic = "force-dynamic";

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  A2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  B1: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  B2: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  C1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default async function ClassesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const session = await auth();

  const supabase = createServerSupabaseClient();
  const { data: classes } = await supabase
    .from("live_classes")
    .select("id, title, description, level, teacher_name, start_time, duration_minutes, max_students, status")
    .eq("status", "active")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  let enrolledIds = new Set<string>();
  if (session?.user?.role === "student") {
    const { data } = await supabase.from("class_enrollments").select("class_id").eq("student_id", session.user.id).eq("status", "enrolled");
    enrolledIds = new Set((data ?? []).map((e: { class_id: string }) => e.class_id));
  }

  const classIds = (classes ?? []).map((c) => c.id);
  const countMap: Record<string, number> = {};
  if (classIds.length > 0) {
    const { data: cnts } = await supabase.from("class_enrollments").select("class_id").in("class_id", classIds).eq("status", "enrolled");
    (cnts ?? []).forEach((r: { class_id: string }) => { countMap[r.class_id] = (countMap[r.class_id] ?? 0) + 1; });
  }

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E0B873]/30 bg-[#E0B873]/8 px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-[#E0B873] uppercase mb-4">
                <Video className="h-3 w-3" /> Live Classes
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">Join a Live German Class</h1>
              <p className="text-[#C9D2DE] max-w-xl mx-auto text-sm">
                Book a live session with a real teacher via Google Meet. Learn German step by step with personal guidance.
              </p>
            </div>
          </FadeIn>

          {session?.user?.role === "teacher" && (
            <FadeIn delay={0.1}>
              <div className="mb-8 text-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                Teachers cannot enroll in student classes.{" "}
                <Link href={`/${locale}/teacher/dashboard`} className="underline">Go to your dashboard →</Link>
              </div>
            </FadeIn>
          )}

          {(!classes || classes.length === 0) ? (
            <FadeIn delay={0.1}>
              <div className="text-center py-20">
                <Video className="h-12 w-12 mx-auto text-white/15 mb-4" />
                <p className="text-white/40 text-lg">Live classes will appear here soon.</p>
                <p className="text-white/25 text-sm mt-1">Check back later or browse our teachers below.</p>
                <Link href={`/${locale}/teachers`} className="inline-block mt-6 border border-white/20 text-white/60 font-semibold px-6 py-2.5 rounded-xl hover:border-white/40 hover:text-white transition-colors text-sm">
                  Browse Teachers
                </Link>
              </div>
            </FadeIn>
          ) : (
            <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map((cls) => {
                const enrolled = countMap[cls.id] ?? 0;
                const spotsLeft = cls.max_students - enrolled;
                return (
                  <StaggerChild key={cls.id}>
                    <div className="group rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/30 hover:bg-[#0A1E35] transition-all overflow-hidden flex flex-col h-full">
                      <div className="h-1 w-full bg-gradient-to-r from-[#E0B873] to-[#C99B50]" />
                      <div className="p-5 flex-1 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${levelColors[cls.level] ?? levelColors.A1}`}>{cls.level}</span>
                          <span className={`text-xs font-medium ${spotsLeft <= 2 ? "text-red-400" : "text-white/40"}`}>
                            {spotsLeft <= 0 ? "Full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                          </span>
                        </div>
                        <h2 className="text-base font-serif font-bold text-white leading-snug group-hover:text-[#E0B873] transition-colors">{cls.title}</h2>
                        {cls.description && <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{cls.description}</p>}
                        <div className="space-y-1.5 text-xs text-white/50">
                          <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /><span>Teacher: <span className="text-white/70">{cls.teacher_name}</span></span></div>
                          <div className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /><span>{fmtDate(cls.start_time)}</span></div>
                          <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /><span>{fmtTime(cls.start_time)} · {cls.duration_minutes} min</span></div>
                        </div>
                        <div className="mt-auto pt-2">
                          <EnrollButton
                            classId={cls.id}
                            locale={locale}
                            isLoggedIn={!!session?.user}
                            isTeacher={session?.user?.role === "teacher"}
                            isEnrolled={enrolledIds.has(cls.id)}
                            isFull={spotsLeft <= 0}
                          />
                        </div>
                      </div>
                    </div>
                  </StaggerChild>
                );
              })}
            </StaggerParent>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
