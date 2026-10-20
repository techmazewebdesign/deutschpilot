import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { AppLayout } from "@/components/app/app-layout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { auth } from "@/lib/auth";
import { BookOpen, ChevronRight, Lock } from "lucide-react";
import { SITE_URL, pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "courses" });
  return {
    alternates: pageAlternates(params.locale, "/courses"),
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  A2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  B1: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  B2: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  C1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default async function CoursesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { level?: string };
}) {
  const { locale } = params;
  const levelFilter = searchParams?.level ?? "";

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const [t, tLearn, session] = await Promise.all([
    getTranslations({ locale, namespace: "courses" }),
    getTranslations({ locale, namespace: "learn" }),
    auth(),
  ]);

  const supabase = createServerSupabaseClient();

  let query = supabase
    .from("courses")
    .select("id, slug, title, description, level")
    .eq("is_published", true);
  if (levelFilter && (LEVELS as readonly string[]).includes(levelFilter)) {
    query = query.eq("level", levelFilter);
  }
  const { data: courses } = requireQuery(await query.order("level").order("title"));

  // If logged in, also fetch their progress to show on course cards
  let userProgress: { course_id: string; completed: boolean }[] = [];
  let userName = "";
  if (session?.user) {
    const privateDb = await legacyLearningClient(session.user.id);
    const progressRes = await privateDb
      .from("student_progress")
      .select("course_id, completed")
      .eq("user_id", session.user.id);
    requireQuery(progressRes);
    userProgress = progressRes.data ?? [];
    userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";
  }

  const completedByCourse = new Map<string, number>();
  for (const p of userProgress) {
    completedByCourse.set(
      p.course_id,
      (completedByCourse.get(p.course_id) ?? 0) + (p.completed ? 1 : 0)
    );
  }

  const courseList = (courses ?? []) as {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    level: string;
    lesson_count?: number;
  }[];

  const filterBar = (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href={`/${locale}/courses`}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
          !levelFilter
            ? "border-[#E0B873] bg-[#E0B873] text-[#05101E]"
            : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
        }`}
      >
        {tLearn("allLevels")}
      </Link>
      {LEVELS.map((lvl) => (
        <Link
          key={lvl}
          href={`/${locale}/courses?level=${lvl}`}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            levelFilter === lvl
              ? "border-[#E0B873] bg-[#E0B873] text-[#05101E]"
              : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
          }`}
        >
          {lvl}
        </Link>
      ))}
    </div>
  );

  const courseGrid = (
    <>
      {!courseList.length ? (
        <div className="py-16 text-center text-white/40">
          <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p>{tLearn("noCourses")}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courseList.map((course) => {
            const done = completedByCourse.get(course.id) ?? 0;
            const isStarted = done > 0;
            return (
              <Link
                key={course.id}
                href={`/${locale}/courses/${course.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A1E35]/70 transition-all hover:border-[#E0B873]/30 hover:bg-[#0A1E35]"
              >
                <div className="h-1 w-full bg-gradient-to-r from-[#E0B873] to-[#C99B50]" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${levelColors[course.level] ?? levelColors.A1}`}
                    >
                      {course.level}
                    </span>
                    {isStarted && session?.user && (
                      <span className="text-[10px] font-medium text-[#E0B873]/70">
                        {done} {t("doneShort")}
                      </span>
                    )}
                  </div>
                  <h2 className="mb-1.5 font-serif text-base font-bold leading-snug text-white transition-colors group-hover:text-[#E0B873]">
                    {course.title}
                  </h2>
                  <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-white/45">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E0B873]">
                    {session?.user
                      ? isStarted
                        ? tLearn("continueCourse")
                        : t("start")
                      : tLearn("startCourse")}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );

  // Logged-in: show inside AppLayout with sidebar
  if (session?.user) {
    return (
      <AppLayout locale={locale} userName={userName}>
        <div className="mx-auto w-full max-w-5xl px-5 py-6 lg:px-8 lg:py-8">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#E0B873]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E0B873]/70">
                {t("sectionLabel")}
              </span>
            </div>
            <h1 className="mb-2 font-serif text-3xl font-bold text-white">{t("title")}</h1>
            <p className="max-w-xl text-sm text-white/45">{t("introLoggedIn")}</p>
          </div>
          {filterBar}
          {courseGrid}
          <div className="bg-white/3 border-white/6 mt-8 flex items-start gap-3 rounded-2xl border p-4">
            <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/30" />
            <p className="text-xs text-white/35">{t("orderNote")}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Logged-out: public marketing page
  const coursesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courseList.slice(0, 30).map((course, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: course.title,
        description: course.description ?? undefined,
        url: `${SITE_URL}/${locale}/courses/${course.slug}`,
        provider: { "@type": "Organization", name: "DeutschPilot", url: SITE_URL },
      },
    })),
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#072143]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }}
        />
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#E0B873]">
              {t("subtitle")}
            </p>
            <h1 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-xl text-[#C9D2DE]">{t("introPublic")}</p>
          </div>
          {filterBar}
          {courseGrid}
          <div className="mt-14 text-center">
            <Link
              href={`/${locale}/signup`}
              className="inline-block rounded-xl bg-[#E0B873] px-8 py-3 font-semibold text-[#072143] transition-colors hover:bg-[#C99B50]"
            >
              {t("ctaStart")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
