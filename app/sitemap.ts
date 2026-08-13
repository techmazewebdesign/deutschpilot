import { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { articles } from "@/lib/magazine";

const SITE_URL = "https://www.deutschpilot.de";

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
  "/rss.xml",
  "/faq",
  "/mock-exam",
  "/driving-theory",
  "/contact",
  "/placement-test",
  "/classes",
  "/impressum",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
    for (const article of articles) {
      entries.push({
        url: `${SITE_URL}/${locale}/magazine/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
