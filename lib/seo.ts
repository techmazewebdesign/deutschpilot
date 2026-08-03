export const SITE_URL = "https://www.deutschpilot.de";

export const OG_IMAGE = {
  url: `${SITE_URL}/Images/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: "DeutschPilot – Deutschkurse, Sprachreisen & Retreats",
};

/**
 * Canonical + hreflang alternates for a locale-prefixed route.
 * `path` starts with "/" and excludes the locale segment (e.g. "/courses").
 */
export function pageAlternates(locale: string, path = "") {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      de: `${SITE_URL}/de${path}`,
      en: `${SITE_URL}/en${path}`,
      "x-default": `${SITE_URL}/de${path}`,
    },
  };
}
