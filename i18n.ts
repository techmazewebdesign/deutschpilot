import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["de", "en", "ar", "fa", "hi", "ta"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const RTL_LOCALES: Locale[] = ["ar", "fa"];
export const PLACEHOLDER_LOCALES: Locale[] = ["ar", "fa", "hi", "ta"];

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key in override) {
    if (
      typeof override[key] === "object" &&
      override[key] !== null &&
      !Array.isArray(override[key]) &&
      typeof base[key] === "object" &&
      base[key] !== null
    ) {
      result[key] = deepMerge(base[key] as Record<string, unknown>, override[key] as Record<string, unknown>);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  const localeMessages = (await import(`./messages/${locale}.json`)).default;

  if (PLACEHOLDER_LOCALES.includes(locale as Locale)) {
    const enMessages = (await import(`./messages/en.json`)).default;
    return { messages: deepMerge(enMessages, localeMessages) };
  }

  return { messages: localeMessages };
});
