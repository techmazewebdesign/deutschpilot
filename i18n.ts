import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

// No RTL locales while only EN + DE are active. Kept exported so the
// rest of the codebase (e.g. app/[locale]/layout.tsx) doesn't break.
export const RTL_LOCALES: Locale[] = [];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Locales that show a "coming soon" placeholder instead of real content.
// Currently empty — all supported locales have full content.
const PLACEHOLDER_LOCALES: string[] = [];

export function isPlaceholderLocale(locale: string): boolean {
  return PLACEHOLDER_LOCALES.includes(locale);
}

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  const localeMessages = (await import(`./messages/${locale}.json`)).default;
  return { messages: localeMessages };
});
