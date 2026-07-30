import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/auth-context";
import { locales, RTL_LOCALES, type Locale } from "@/i18n";
import { Toaster } from "@/components/ui/toaster";
import { headingFont, bodyFont, monoFont } from "@/lib/fonts";
import "./globals.css";

const GOOGLE_TAG_MANAGER_ID = "GTM-KBNSN7ST";

const siteUrl = "https://www.deutschpilot.de";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isGerman = locale === "de";
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("layoutTitle");
  const description = t("layoutDescription");

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: t("layoutKeywords").split(",").map((k) => k.trim()),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        de: `${siteUrl}/de`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/de`,
      },
    },
    openGraph: {
      type: "website",
      locale: isGerman ? "de_DE" : "en_GB",
      url: `${siteUrl}/${locale}`,
      siteName: "DeutschPilot",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const dynamic = 'force-dynamic';

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
    <html lang={locale} dir={dir} className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="font-sans antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
          <Analytics />
        </NextIntlClientProvider>
        <Script id="deutschpilot-google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');`}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
