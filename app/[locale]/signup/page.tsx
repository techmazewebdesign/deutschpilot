import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { isPlaceholderLocale } from "@/i18n";
import { SignupFormClient } from "@/components/auth/signup-form-client";

const benefits = {
  de: ["Zugang zu allen Kursniveaus A1–C1", "Live-Klassen mit erfahrenen Lehrern", "KI-Lernbegleiter rund um die Uhr", "Anerkanntes Zertifikat inklusive"],
  en: ["Access to all course levels A1–C1", "Live classes with experienced teachers", "AI learning companion 24/7", "Recognized certificate included"],
};

export default async function SignupPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "auth" });
  const perks = benefits[locale as keyof typeof benefits] ?? benefits.en;

  return (
    <div className="min-h-screen bg-[#071424] flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <Image
          src="/Images/hero_image.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071424]/92 via-[#071424]/65 to-[#071424]/35" />

        <Link href={`/${locale}`} className="relative z-10 flex items-center gap-2">
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
            <span className="text-[9px] tracking-[0.22em] text-[#CEA66F] uppercase mt-[2px]">Sprache. Zukunft. Du.</span>
          </div>
        </Link>

        <div className="relative z-10">
          <p className="text-xs font-medium tracking-[0.2em] text-[#CEA66F] uppercase mb-5">
            {locale === "de" ? "Was dich erwartet" : "What's included"}
          </p>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-white/80">
                <span className="mt-0.5 h-4 w-4 rounded-full border border-[#CEA66F]/60 flex items-center justify-center flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#CEA66F]" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="lg:hidden p-6 border-b border-white/5">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-[13px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-white mb-2">{t("register")}</h1>
              <p className="text-[#C9D2DE] text-sm">
                {t("hasAccount")}{" "}
                <Link href={`/${locale}/signin`} className="text-[#CEA66F] hover:underline">
                  {t("login")}
                </Link>
              </p>
            </div>

            <SignupFormClient locale={locale} registerLabel={t("register")} />

            <p className="text-center text-xs text-white/30 mt-8">
              © {new Date().getFullYear()} DeutschPilot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
