import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

export default async function LoginPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <>
      <Navigation />
      <main className="min-h-[80vh] bg-[#071424] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-white mb-2">{t("login")}</h1>
            <p className="text-[#C9D2DE]">
              {t("noAccount")}{" "}
              <Link href={`/${locale}/signup` as any} className="text-[#CEA66F] hover:underline">
                {t("register")}
              </Link>
            </p>
          </div>

          <div className="bg-[#0B1B33] border border-white/10 rounded-xl p-8">
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">{t("email")}</label>
                <input
                  type="email"
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CEA66F]/50 transition-colors"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">{t("password")}</label>
                <input
                  type="password"
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CEA66F]/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end">
                <Link href={`/${locale}/login` as any} className="text-xs text-[#CEA66F] hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-[#D9B173] text-[#071424] font-semibold py-2.5 rounded-md hover:bg-[#B98A4E] transition-colors"
              >
                {t("login")}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
