import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { locales, RTL_LOCALES, type Locale } from "@/i18n";
import { Toaster } from "@/components/ui/toaster";
import { headingFont, bodyFont, monoFont } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeutschPilot – Premium Deutschkurse & Retreats",
  description:
    "DeutschPilot ist die Premium-Lernplattform für schnelle Fortschritte, echte Ergebnisse und neue Möglichkeiten.",
  keywords: ["Deutsch lernen", "Deutschkurs", "Sprachkurs", "DeutschPilot", "Sprachretreat"],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://deutschpilot.de",
    siteName: "DeutschPilot",
    title: "DeutschPilot – Premium Deutschkurse & Retreats",
    description:
      "DeutschPilot ist die Premium-Lernplattform für schnelle Fortschritte, echte Ergebnisse und neue Möglichkeiten.",
  },
};

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = useMessages();
  const dir = RTL_LOCALES.includes(locale as Locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>{children}</SessionProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
