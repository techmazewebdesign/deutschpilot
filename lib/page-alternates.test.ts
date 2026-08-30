import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { pageAlternates, SITE_URL } from "./page-alternates";

const routes = ["courses", "levels", "rooms", "online-academy", "retreats", "community", "about", "faq", "mock-exam", "driving-theory", "contact", "placement-test", "classes", "impressum", "privacy", "terms"];
for (const route of routes) {
  for (const locale of ["de", "en"]) {
    test(`${locale}/${route} canonical and reciprocal language links`, () => {
      const metadata = pageAlternates(locale, `/${route}`);
      assert.deepEqual(metadata, {
        canonical: `${SITE_URL}/${locale}/${route}`,
        languages: { de: `${SITE_URL}/de/${route}`, en: `${SITE_URL}/en/${route}`, "x-default": `${SITE_URL}/de/${route}` },
      });
      const source = readFileSync(`app/[locale]/${route}/page.tsx`, "utf8");
      assert.ok(source.includes(`alternates: pageAlternates(params.locale, "/${route}")`));
    });
  }
}
test("sitemap preserves editorial dates instead of manufacturing update dates", () => {
  const source = readFileSync("app/sitemap.ts", "utf8");
  assert.ok(!source.includes("lastModified: new Date()"));
  assert.ok(source.includes("lastModified: new Date(article.date)"));
});
