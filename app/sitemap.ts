import { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { articles } from "@/lib/magazine";
import { SITE_URL } from "@/lib/seo";

const baseUrl = SITE_URL;

const routes = [
  "",
  "/courses",
  "/levels",
  "/rooms",
  "/online-academy",
  "/retreats",
  "/community",
  "/about",
  "/magazine",
  "/faq",
  "/mock-exam",
  "/driving-theory",
  "/contact",
  "/placement-test",
  "/teachers",
  "/classes",
  "/impressum",
  "/privacy",
  "/terms",
];

function languageAlternates(path: string) {
  return {
    languages: {
      de: `${baseUrl}/de${path}`,
      en: `${baseUrl}/en${path}`,
      "x-default": `${baseUrl}/de${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: languageAlternates(route),
      });
    }
    for (const article of articles) {
      const path = `/magazine/${article.slug}`;
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: languageAlternates(path),
      });
    }
  }

  return entries;
}
