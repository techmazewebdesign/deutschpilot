import { NextResponse } from "next/server";
import { isPlaceholderLocale } from "@/i18n";
import { articles } from "@/lib/magazine";

const BASE_URL = "https://deutschpilot.de";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(_req: Request, { params }: { params: { locale: string } }) {
  const { locale } = params;

  if (isPlaceholderLocale(locale)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const de = locale === "de";
  const siteTitle = de
    ? "DeutschPilot Magazin — Deutsch lernen"
    : "DeutschPilot Magazine — Learn German";
  const siteDescription = de
    ? "Grammatik, Prüfungsguides und Lerntipps für Deutschlernende."
    : "Grammar, exam guides, and learning tips for German learners.";

  const items = articles
    .map((a) => {
      const title = de ? a.title_de : a.title_en;
      const description = de ? a.description_de : a.description_en;
      const url = `${BASE_URL}/${locale}/magazine/${a.slug}`;
      const pubDate = new Date(a.date + "T00:00:00Z").toUTCString();
      return `  <item>
    <title>${escapeXml(title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(description)}</description>
    <pubDate>${pubDate}</pubDate>
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteTitle)}</title>
  <link>${BASE_URL}/${locale}/magazine</link>
  <description>${escapeXml(siteDescription)}</description>
  <language>${locale}</language>
${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
