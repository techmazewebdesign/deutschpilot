import type { Metadata } from "next";

export const SITE_URL = "https://www.deutschpilot.de";

/** Each translated page points to itself, not the locale layout's homepage. */
export function pageAlternates(locale: string, path: string): Metadata["alternates"] {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      de: `${SITE_URL}/de${path}`,
      en: `${SITE_URL}/en${path}`,
      "x-default": `${SITE_URL}/de${path}`,
    },
  };
}
