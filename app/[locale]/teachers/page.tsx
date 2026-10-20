import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { publicLegacyTeachers } from "@/lib/legacyLearningAccess";
import { FadeIn, StaggerParent, StaggerChild } from "@/components/app/motion-card";
import { Users, GraduationCap, Video } from "lucide-react";
import { pageAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "teachers" });
  return {
    alternates: pageAlternates(params.locale, "/teachers"),
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

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
  const t = await getTranslations({ locale, namespace: "teachers" });
  const teacherList = await publicLegacyTeachers();
  const classCounts = Object.fromEntries(teacherList.map((t) => [t.user_id, t.activeClasses]));

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
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12 text-center">
              <div className="bg-[#E0B873]/8 mb-4 inline-flex items-center gap-2 rounded-full border border-[#E0B873]/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#E0B873]">
                <Users className="h-3 w-3" /> {t("badge")}
              </div>
              <h1 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
                {t("heading")}
              </h1>
              <p className="mx-auto max-w-xl text-sm text-[#C9D2DE]">{t("subheading")}</p>
            </div>
          </FadeIn>

          {teacherList.length === 0 ? (
            <FadeIn delay={0.1}>
              <div className="py-20 text-center">
                <GraduationCap className="mx-auto mb-4 h-12 w-12 text-white/15" />
                <p className="text-lg text-white/40">{t("emptyTitle")}</p>
                <p className="mt-1 text-sm text-white/25">{t("emptySubtitle")}</p>
              </div>
            </FadeIn>
          ) : (
            <StaggerParent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teacherList.map((teacher) => {
                const levels = teacher.teaches_levels ?? ["A1", "A2"];
                const activeClasses = classCounts[teacher.user_id] ?? 0;
                const initials = teacher.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <StaggerChild key={teacher.user_id}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A1E35]/70 transition-all hover:border-[#E0B873]/30 hover:bg-[#0A1E35]">
                      <div className="h-1 w-full bg-gradient-to-r from-[#E0B873] to-[#C99B50]" />
                      <div className="flex flex-1 flex-col gap-4 p-5">
                        <div className="flex items-center gap-3">
                          {teacher.avatar_url ? (
                            <img
                              src={teacher.avatar_url}
                              alt={teacher.full_name}
                              className="h-12 w-12 rounded-full border border-white/10 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#E0B873]/30 bg-[#E0B873]/20">
                              <span className="text-sm font-bold text-[#E0B873]">{initials}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white transition-colors group-hover:text-[#E0B873]">
                              {teacher.full_name}
                            </p>
                            {teacher.experience_years && teacher.experience_years > 0 && (
                              <p className="text-xs text-white/40">
                                {t("experienceYears", { years: teacher.experience_years })}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {levels.map((lvl) => (
                            <span
                              key={lvl}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${levelColors[lvl] ?? "bg-white/10 text-white/50"}`}
                            >
                              {lvl}
                            </span>
                          ))}
                        </div>

                        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-white/45">
                          {teacher.bio ?? t("defaultBio")}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs text-white/35">
                            <Video className="h-3 w-3" />
                            {t("activeClasses", { count: activeClasses })}
                          </span>
                          <Link
                            href={`/${locale}/classes`}
                            className="flex items-center gap-1 text-xs font-semibold text-[#E0B873] transition-colors hover:text-[#C99B50]"
                          >
                            {t("viewClasses")} →
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
