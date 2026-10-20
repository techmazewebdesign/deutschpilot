import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { auth } from "@/lib/auth";
import {
  legacyLearningClient,
  requireQuery,
  publicLegacyClasses,
} from "@/lib/legacyLearningAccess";
import { EnrollButton } from "@/components/app/enroll-button";
import { StaggerParent, StaggerChild, FadeIn } from "@/components/app/motion-card";
import { Video, CalendarDays, Clock, Users } from "lucide-react";
import { pageAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "classes" });
  return {
    alternates: pageAlternates(params.locale, "/classes"),
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

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
  const t = await getTranslations({ locale, namespace: "classes" });

  const { classes, counts: countMap } = await publicLegacyClasses();
  let enrolledIds = new Set<string>();
  if (session?.user.role === "student") {
    const db = await legacyLearningClient(session.user.id);
    const profile = requireQuery(
      await db.from("profiles").select("id").eq("firebase_uid", session.user.id).maybeSingle()
    );
    if (profile.data) {
      const result = requireQuery(
        await db
          .from("class_enrollments")
          .select("class_id")
          .eq("student_id", profile.data.id)
          .eq("status", "enrolled")
      );
      enrolledIds = new Set((result.data || []).map((r) => r.class_id));
    }
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12 text-center">
              <div className="bg-[#E0B873]/8 mb-4 inline-flex items-center gap-2 rounded-full border border-[#E0B873]/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#E0B873]">
                <Video className="h-3 w-3" /> {t("badge")}
              </div>
              <h1 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
                {t("heading")}
              </h1>
              <p className="mx-auto max-w-xl text-sm text-[#C9D2DE]">{t("subheading")}</p>
            </div>
          </FadeIn>

          {session?.user?.role === "teacher" && (
            <FadeIn delay={0.1}>
              <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-center text-sm text-amber-300">
                {t("teacherCannotEnroll")}{" "}
                <Link href={`/${locale}/teacher/dashboard`} className="underline">
                  {t("goToDashboard")} →
                </Link>
              </div>
            </FadeIn>
          )}

          {!classes || classes.length === 0 ? (
            <FadeIn delay={0.1}>
              <div className="py-20 text-center">
                <Video className="mx-auto mb-4 h-12 w-12 text-white/15" />
                <p className="text-lg text-white/40">{t("emptyTitle")}</p>
                <p className="mt-1 text-sm text-white/25">{t("emptySubtitle")}</p>
                <Link
                  href={`/${locale}/teachers`}
                  className="mt-6 inline-block rounded-xl border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:border-white/40 hover:text-white"
                >
                  {t("browseTeachers")}
                </Link>
              </div>
            </FadeIn>
          ) : (
            <StaggerParent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => {
                const enrolled = countMap[cls.id] ?? 0;
                const spotsLeft = cls.max_students - enrolled;
                return (
                  <StaggerChild key={cls.id}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A1E35]/70 transition-all hover:border-[#E0B873]/30 hover:bg-[#0A1E35]">
                      <div className="h-1 w-full bg-gradient-to-r from-[#E0B873] to-[#C99B50]" />
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${levelColors[cls.level] ?? levelColors.A1}`}
                          >
                            {cls.level}
                          </span>
                          <span
                            className={`text-xs font-medium ${spotsLeft <= 2 ? "text-red-400" : "text-white/40"}`}
                          >
                            {spotsLeft <= 0 ? t("full") : t("spotsLeft", { count: spotsLeft })}
                          </span>
                        </div>
                        <h2 className="font-serif text-base font-bold leading-snug text-white transition-colors group-hover:text-[#E0B873]">
                          {cls.title}
                        </h2>
                        {cls.description && (
                          <p className="line-clamp-2 text-xs leading-relaxed text-white/40">
                            {cls.description}
                          </p>
                        )}
                        <div className="space-y-1.5 text-xs text-white/50">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            <span>
                              {t("teacherLabel")}{" "}
                              <span className="text-white/70">{cls.teacher_name}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>{fmtDate(cls.start_time)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {fmtTime(cls.start_time)} · {cls.duration_minutes} min
                            </span>
                          </div>
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
