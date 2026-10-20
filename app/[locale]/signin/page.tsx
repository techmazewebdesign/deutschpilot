import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { schoolReturnTarget } from "@/lib/school/auth-return";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { isPlaceholderLocale } from "@/i18n";
import { SigninFormClient } from "@/components/auth/signin-form-client";

export default async function SigninPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { returnTo?: string | string[] };
}) {
  const { locale } = params;
  const returnTo = schoolReturnTarget(searchParams?.returnTo, locale);
  if (returnTo && (await auth())?.user) redirect(returnTo);

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
    <div className="flex min-h-screen bg-[#071424]">
      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-1/2">
        <Image
          src="/Images/hero_image.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071424]/90 via-[#071424]/60 to-[#071424]/30" />

        <Link href={`/${locale}`} className="relative z-10 flex items-center gap-2">
          <div style={{ mixBlendMode: "screen" }} className="flex-shrink-0">
            <Image
              src="/Images/Deurschpilot_logo.png"
              alt=""
              width={44}
              height={44}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold uppercase tracking-[0.18em] text-white">
              DeutschPilot
            </span>
            <span className="mt-[2px] text-[9px] uppercase tracking-[0.22em] text-[#CEA66F]">
              Sprache. Zukunft. Du.
            </span>
          </div>
        </Link>

        <div className="relative z-10">
          <blockquote className="mb-4 font-serif text-lg leading-relaxed text-white/90">
            &ldquo;{t("testimonialQuote")}&rdquo;
          </blockquote>
          <p className="text-sm text-[#CEA66F]">{t("testimonialCaption")}</p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="border-b border-white/5 p-6 lg:hidden">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div style={{ mixBlendMode: "screen" }} className="flex-shrink-0">
              <Image
                src="/Images/Deurschpilot_logo.png"
                alt=""
                width={32}
                height={32}
                className="h-6 w-6 object-contain"
              />
            </div>
            <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-white">
              DeutschPilot
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="mb-2 font-serif text-3xl font-bold text-white">{t("login")}</h1>
              <p className="text-sm text-[#C9D2DE]">
                {t("noAccount")}{" "}
                <Link href={`/${locale}/signup`} className="text-[#CEA66F] hover:underline">
                  {t("register")}
                </Link>
              </p>
            </div>

            <SigninFormClient
              locale={locale}
              returnTo={returnTo}
              loginLabel={t("login")}
              emailLabel={t("email")}
              passwordLabel={t("password")}
              forgotPasswordLabel={t("forgotPassword")}
            />

            <p className="mt-8 text-center text-xs text-white/30">
              © {new Date().getFullYear()} DeutschPilot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
