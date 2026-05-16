import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { PLACEHOLDER_LOCALES } from "@/i18n";
import { BookOpen, ChevronRight } from "lucide-react";

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

  if (PLACEHOLDER_LOCALES.includes(locale as any)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const [t, tLearn] = await Promise.all([
    getTranslations({ locale, namespace: "courses" }),
    getTranslations({ locale, namespace: "learn" }),
  ]);

  const supabase = createServerSupabaseClient();
  let query = supabase.from("courses").select("*").eq("is_published", true);
  if (levelFilter && LEVELS.includes(levelFilter as any)) {
    query = query.eq("level", levelFilter);
  }
  const { data: courses } = await query.order("level");

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#072143]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#E0B873] uppercase mb-3">{t("subtitle")}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">{t("title")}</h1>
            <p className="text-[#C9D2DE] max-w-xl mx-auto">
              {locale === "de"
                ? "Wähle das richtige Niveau für deine Sprachziele und starte deinen Weg zum Erfolg."
                : "Choose the right level for your language goals and start your path to success."}
            </p>
          </div>

          {/* Level filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Link
              href={`/${locale}/courses` as any}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                !levelFilter
                  ? "bg-[#E0B873] text-[#05101E] border-[#E0B873]"
                  : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
              }`}
            >
              {tLearn("allLevels")}
            </Link>
            {LEVELS.map((lvl) => (
              <Link
                key={lvl}
                href={`/${locale}/courses?level=${lvl}` as any}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  levelFilter === lvl
                    ? "bg-[#E0B873] text-[#05101E] border-[#E0B873]"
                    : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                }`}
              >
                {lvl}
              </Link>
            ))}
          </div>

          {/* Course grid */}
          {!courses || courses.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>{tLearn("noCourses")}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course: any) => (
                <Link
                  key={course.id}
                  href={`/${locale}/courses/${course.slug}` as any}
                  className="group relative rounded-xl border border-white/10 bg-[#0A2A50]/50 hover:bg-[#0A2A50] hover:border-[#E0B873]/30 transition-all overflow-hidden"
                >
                  {/* Level bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#E0B873] to-[#C99B50]" />
                  <div className="p-6">
                    <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border mb-4 ${levelColors[course.level] ?? levelColors.A1}`}>
                      {course.level}
                    </span>
                    <h2 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#E0B873] transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[#E0B873] text-sm font-medium">
                      {tLearn("startCourse")}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-14">
            <Link
              href={`/${locale}/signup` as any}
              className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-md hover:bg-[#C99B50] transition-colors"
            >
              {locale === "de" ? "Jetzt kostenlos starten" : "Start for free"}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
