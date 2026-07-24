import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { isPlaceholderLocale, locales } from "@/i18n";
import { articles, getArticle } from "@/lib/magazine";
import { ArrowLeft, Clock } from "lucide-react";

const BASE_URL = "https://www.deutschpilot.de";

export function generateStaticParams() {
  return locales.flatMap((locale) => articles.map((a) => ({ locale, slug: a.slug })));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  const de = params.locale === "de";
  const title = de ? article.title_de : article.title_en;
  const description = de ? article.description_de : article.description_en;
  const url = `${BASE_URL}/${params.locale}/magazine/${article.slug}`;
  return {
    title: `${title} | DeutschPilot`,
    description,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de/magazine/${article.slug}`,
        en: `${BASE_URL}/en/magazine/${article.slug}`,
      },
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "DeutschPilot",
      publishedTime: article.date,
    },
  };
}

export default function MagazineArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  if (isPlaceholderLocale(locale)) notFound();

  const article = getArticle(slug);
  if (!article) notFound();

  const de = locale === "de";
  const title = de ? article.title_de : article.title_en;
  const body = de ? article.body_de : article.body_en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: de ? article.description_de : article.description_en,
    datePublished: article.date,
    inLanguage: de ? "de" : "en",
    author: { "@type": "Organization", name: "DeutschPilot" },
    publisher: { "@type": "Organization", name: "DeutschPilot", url: BASE_URL },
    mainEntityOfPage: `${BASE_URL}/${locale}/magazine/${article.slug}`,
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <Link
            href={`/${locale}/magazine`}
            className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-[#E0B873] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {de ? "Zurück zum Magazin" : "Back to magazine"}
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            {article.tags.map((t) => (
              <span key={t} className="text-[10px] font-semibold uppercase tracking-wider text-[#E0B873]/70 bg-[#E0B873]/8 px-2 py-1 rounded-md">
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4 leading-tight">
            {title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-white/30 mb-10 pb-8 border-b border-white/8">
            <time dateTime={article.date}>
              {new Date(article.date + "T00:00:00").toLocaleDateString(de ? "de-DE" : "en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingMinutes} {de ? "Min. Lesezeit" : "min read"}
            </span>
          </div>

          <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none
              prose-headings:text-white prose-headings:font-serif
              prose-p:text-white/70 prose-p:leading-relaxed
              prose-li:text-white/65
              prose-strong:text-white
              prose-em:text-white/75
              prose-a:text-[#E0B873] prose-a:no-underline hover:prose-a:underline
              prose-table:text-white/70
              prose-td:border-white/10 prose-th:border-white/10 prose-th:text-white/85
              prose-ol:text-white/65"
            dangerouslySetInnerHTML={{ __html: body }}
          />

          <div className="mt-14 rounded-2xl border border-[#E0B873]/25 bg-[#E0B873]/5 p-8 text-center">
            <h2 className="text-xl font-serif font-bold text-white mb-2">
              {de ? "Vom Lesen ins Üben" : "From reading to practicing"}
            </h2>
            <p className="text-sm text-white/50 mb-5 max-w-md mx-auto">
              {de
                ? "Lesen, Hören, Schreiben und Sprechen – kostenlose Übungskurse von A1 bis B2."
                : "Reading, listening, writing and speaking — free practice courses from A1 to B2."}
            </p>
            <Link
              href={`/${locale}/courses`}
              className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
            >
              {de ? "Jetzt kostenlos üben" : "Start practicing free"}
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
