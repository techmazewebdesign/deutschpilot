import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { FadeIn, StaggerParent, StaggerChild } from "@/components/app/motion-card";
import { Users, GraduationCap, Video } from "lucide-react";

export const dynamic = "force-dynamic";

type TeacherProfile = {
  user_id: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  teaches_levels: string[] | null;
  experience_years: number | null;
};

export default async function TeachersPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const supabase = createServerSupabaseClient();

  // Fetch teacher profiles
  const { data: teachers } = await supabase
    .from("teacher_profiles")
    .select("user_id, full_name, bio, avatar_url, teaches_levels, experience_years")
    .order("full_name");

  const teacherList = (teachers ?? []) as TeacherProfile[];

  // Get active class counts per teacher
  const teacherIds = teacherList.map((t) => t.user_id);
  const classCounts: Record<string, number> = {};
  if (teacherIds.length > 0) {
    const { data: cls } = await supabase
      .from("live_classes")
      .select("teacher_id")
      .in("teacher_id", teacherIds)
      .eq("status", "active");
    (cls ?? []).forEach((r: { teacher_id: string }) => {
      classCounts[r.teacher_id] = (classCounts[r.teacher_id] ?? 0) + 1;
    });
  }

  const levelColors: Record<string, string> = {
    A1: "bg-emerald-500/15 text-emerald-300",
    A2: "bg-blue-500/15 text-blue-300",
    B1: "bg-violet-500/15 text-violet-300",
    B2: "bg-amber-500/15 text-amber-300",
    C1: "bg-rose-500/15 text-rose-300",
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E0B873]/30 bg-[#E0B873]/8 px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-[#E0B873] uppercase mb-4">
                <Users className="h-3 w-3" /> Our Teachers
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">Learn with Real Teachers</h1>
              <p className="text-[#C9D2DE] max-w-xl mx-auto text-sm">
                Our qualified German teachers offer live classes via Google Meet. Choose a teacher and book your session.
              </p>
            </div>
          </FadeIn>

          {teacherList.length === 0 ? (
            <FadeIn delay={0.1}>
              <div className="text-center py-20">
                <GraduationCap className="h-12 w-12 mx-auto text-white/15 mb-4" />
                <p className="text-white/40 text-lg">Our teacher list will be available soon.</p>
                <p className="text-white/25 text-sm mt-1">Check back shortly — we are onboarding teachers right now.</p>
              </div>
            </FadeIn>
          ) : (
            <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teacherList.map((teacher) => {
                const levels = teacher.teaches_levels ?? ["A1", "A2"];
                const activeClasses = classCounts[teacher.user_id] ?? 0;
                const initials = teacher.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <StaggerChild key={teacher.user_id}>
                    <div className="group rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/30 hover:bg-[#0A1E35] transition-all overflow-hidden flex flex-col h-full">
                      <div className="h-1 w-full bg-gradient-to-r from-[#E0B873] to-[#C99B50]" />
                      <div className="p-5 flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          {teacher.avatar_url ? (
                            <img src={teacher.avatar_url} alt={teacher.full_name} className="h-12 w-12 rounded-full object-cover border border-white/10" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-[#E0B873]/20 border border-[#E0B873]/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-[#E0B873]">{initials}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white group-hover:text-[#E0B873] transition-colors">{teacher.full_name}</p>
                            {teacher.experience_years && teacher.experience_years > 0 && (
                              <p className="text-xs text-white/40">{teacher.experience_years}y experience</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {levels.map((lvl) => (
                            <span key={lvl} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColors[lvl] ?? "bg-white/10 text-white/50"}`}>{lvl}</span>
                          ))}
                        </div>

                        <p className="text-xs text-white/45 leading-relaxed flex-1 line-clamp-3">
                          {teacher.bio ?? "Experienced German teacher offering live online classes for beginners and intermediate learners."}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs text-white/35">
                            <Video className="h-3 w-3" />
                            {activeClasses} active class{activeClasses !== 1 ? "es" : ""}
                          </span>
                          <Link
                            href={`/${locale}/classes`}
                            className="flex items-center gap-1 text-xs font-semibold text-[#E0B873] hover:text-[#C99B50] transition-colors"
                          >
                            View Classes →
                          </Link>
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
