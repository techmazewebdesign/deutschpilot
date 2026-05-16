import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

const courseData = [
  { level: "A1", price: 299, label: "Beginner", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80" },
  { level: "A2", price: 349, label: "Basics", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80" },
  { level: "B1", price: 399, label: "Intermediate", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", popular: true },
  { level: "B2", price: 449, label: "Advanced", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80" },
  { level: "C1", price: 499, label: "Competent", image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&q=80" },
];

export default async function CoursesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (PLACEHOLDER_LOCALES.includes(locale as any)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const t = await getTranslations({ locale, namespace: "courses" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{t("subtitle")}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">{t("title")}</h1>
            <p className="text-[#C9D2DE] max-w-xl mx-auto">
              {locale === "de"
                ? "Wähle das richtige Niveau für deine Sprachziele und starte deinen Weg zum Erfolg."
                : "Choose the right level for your language goals and start your path to success."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {courseData.map((course) => (
              <div
                key={course.level}
                className={`relative rounded-xl overflow-hidden border border-white/10 bg-[#0B1B33]/50 hover:bg-[#0B1B33] transition-all group ${
                  course.popular ? "ring-1 ring-[#CEA66F]/50" : ""
                }`}
              >
                {course.popular && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[#CEA66F] text-[#071424] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                      {t("popular")}
                    </span>
                  </div>
                )}
                <div
                  className="h-36 bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.image})` }}
                />
                <div className="p-5">
                  <div className="text-3xl font-bold text-white mb-1">{course.level}</div>
                  <div className="text-sm text-white/60 mb-4">{t(`levels.${course.level}.label`)}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{course.price} €</span>
                    <Link
                      href={`/${locale}/signup` as any}
                      className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#CEA66F] group-hover:border-[#CEA66F] transition-colors"
                    >
                      <svg className="h-4 w-4 text-white/60 group-hover:text-[#071424]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/signup` as any}
              className="inline-block bg-[#D9B173] text-[#071424] font-semibold px-8 py-3 rounded-md hover:bg-[#B98A4E] transition-colors"
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
