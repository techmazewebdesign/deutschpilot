import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { SigninFormClient } from "@/components/auth/signin-form-client";

export default async function LoginPage({ params }: { params: { locale: string } }) {
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#071424]/90 via-[#071424]/60 to-[#071424]/30" />

        {/* Logo */}
        <Link href={`/${locale}`} className="relative z-10 flex items-center gap-2">
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
            <span className="text-[9px] tracking-[0.22em] text-[#CEA66F] uppercase mt-[2px]">Sprache. Zukunft. Du.</span>
          </div>
        </Link>

        {/* Testimonial */}
        <div className="relative z-10">
          <blockquote className="text-lg font-serif text-white/90 leading-relaxed mb-4">
            &ldquo;{locale === "de"
              ? "DeutschPilot hat meinen Weg zur deutschen Sprache komplett verändert."
              : "DeutschPilot completely changed my path to the German language."}&rdquo;
          </blockquote>
          <p className="text-sm text-[#CEA66F]">Maria L. — B2 {locale === "de" ? "in 3 Monaten" : "in 3 months"}</p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden p-6 border-b border-white/5">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-[13px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-white mb-2">{t("login")}</h1>
              <p className="text-[#C9D2DE] text-sm">
                {t("noAccount")}{" "}
                <Link href={`/${locale}/signup`} className="text-[#CEA66F] hover:underline">
                  {t("register")}
                </Link>
              </p>
            </div>

            <SigninFormClient
              locale={locale}
              loginLabel={t("login")}
              emailLabel={t("email")}
              passwordLabel={t("password")}
              forgotPasswordLabel={t("forgotPassword")}
            />

            <p className="text-center text-xs text-white/30 mt-8">
              © {new Date().getFullYear()} DeutschPilot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
