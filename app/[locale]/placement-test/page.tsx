import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PlacementQuiz } from "@/components/learn/placement-quiz";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function PlacementTestPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const t = await getTranslations({ locale, namespace: "placementTest" });

  // Check if user is logged in (optional – test works without account)
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#072143]">
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#E0B873] uppercase mb-3">
              DeutschPilot
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-[#C9D2DE] max-w-lg mx-auto">{t("intro")}</p>
          </div>

          <PlacementQuiz
            locale={locale}
            userId={session?.user.id}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
