import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getMessages } from "next-intl/server";
import { AuthProvider } from "@/contexts/auth-context";
import { locales, RTL_LOCALES, type Locale } from "@/i18n";
import { Toaster } from "@/components/ui/toaster";
import { headingFont, bodyFont, monoFont } from "@/lib/fonts";
import "./globals.css";

import { SITE_URL, OG_IMAGE, pageAlternates } from "@/lib/seo";

const siteUrl = SITE_URL;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isGerman = locale === "de";
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("layoutTitle");
  const description = t("layoutDescription");

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: t("layoutKeywords")
      .split(",")
      .map((k) => k.trim()),
    alternates: pageAlternates(locale),
    openGraph: {
      type: "website",
      locale: isGerman ? "de_DE" : "en_GB",
      url: `${siteUrl}/${locale}`,
      siteName: "DeutschPilot",
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "seo" });
  const dir = RTL_LOCALES.includes(locale as Locale) ? "rtl" : "ltr";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${siteUrl}/#organization`,
        name: "DeutschPilot",
        url: siteUrl,
        logo: `${siteUrl}/Images/Deurschpilot_logo.png`,
        email: "info@deutschpilot.de",
        description: t("orgDescription"),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "DeutschPilot",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: ["de", "en"],
      },
    ],
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body className="font-sans antialiased">
        {/* School candidate: global marketing/analytics scripts are intentionally disabled.
            SPA navigation cannot unload trackers once executed, so no pathname or env gate is used. */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
