import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { isPlaceholderLocale, locales } from "@/i18n";
import { articles, getArticle } from "@/lib/magazine";
import { ArrowLeft, Clock } from "lucide-react";
import { MagazineComments } from "@/components/magazine/comments";

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

export default async function MagazineArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  if (isPlaceholderLocale(locale)) notFound();

  const article = getArticle(slug);
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: "magazine" });
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("badge"), item: `${BASE_URL}/${locale}/magazine` },
      { "@type": "ListItem", position: 3, name: title, item: `${BASE_URL}/${locale}/magazine/${article.slug}` },
    ],
  };

  const related = articles
    .filter((a) => a.slug !== article.slug && a.tags.some((t) => article.tags.includes(t)))
    .slice(0, 3);
  const relatedFill = articles.filter((a) => a.slug !== article.slug && !related.includes(a));
  const relatedArticles = [...related, ...relatedFill].slice(0, 3);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <article className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <Link
            href={`/${locale}/magazine`}
            className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-[#E0B873] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToMagazine")}
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
              {t("readingTime", { minutes: article.readingMinutes })}
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

          {relatedArticles.length > 0 && (
            <div className="mt-14 pt-10 border-t border-white/8">
              <h2 className="text-lg font-serif font-bold text-white mb-5">
                {t("youMightAlsoLike")}
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedArticles.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/${locale}/magazine/${a.slug}`}
                    className="group rounded-xl border border-white/10 bg-[#0A1E35]/50 hover:border-[#E0B873]/30 p-4 transition-colors"
                  >
                    <p className="text-sm font-semibold text-white group-hover:text-[#E0B873] transition-colors leading-snug mb-1.5 line-clamp-2">
                      {de ? a.title_de : a.title_en}
                    </p>
                    <p className="text-xs text-white/35">
                      {t("readingTime", { minutes: a.readingMinutes })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 rounded-2xl border border-[#E0B873]/25 bg-[#E0B873]/5 p-8 text-center">
            <h2 className="text-xl font-serif font-bold text-white mb-2">
              {t("readingToPracticingHeading")}
            </h2>
            <p className="text-sm text-white/50 mb-5 max-w-md mx-auto">
              {t("readingToPracticingBody")}
            </p>
            <Link
              href={`/${locale}/courses`}
              className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
            >
              {t("startPracticingFree")}
            </Link>
          </div>

          <MagazineComments slug={article.slug} locale={locale} />
        </article>
      </main>
      <Footer />
    </>
  );
}
