import { MetadataRoute } from "next";
import { locales } from "@/i18n";

const baseUrl = process.env.NEXTAUTH_URL || "https://deutschpilot.de";

const routes = [
  "",
  "/courses",
  "/online-academy",
  "/retreats",
  "/community",
  "/about",
  "/magazine",
  "/contact",
  "/placement-test",
  "/impressum",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
