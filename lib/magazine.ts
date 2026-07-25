/**
 * magazine.ts — file-based article registry for the DeutschPilot Magazine.
 * Articles are plain TS data (no DB) so they ship with the deploy and are
 * fully static/SEO-friendly. One file per article in lib/magazine-articles/.
 */

export type MagazineArticle = {
  slug: string;
  date: string; // ISO yyyy-mm-dd
  readingMinutes: number;
  tags: string[];
  title_en: string;
  title_de: string;
  description_en: string; // meta description, ≤160 chars
  description_de: string;
  body_en: string; // HTML, rendered with the same prose styling as lessons
  body_de: string;
};

import { article as howLong } from "./magazine-articles/how-long-to-learn-german";
import { article as derDieDas } from "./magazine-articles/der-die-das-articles";
import { article as cases } from "./magazine-articles/german-cases-explained";
import { article as a1Exam } from "./magazine-articles/german-a1-exam-guide";
import { article as mistakes } from "./magazine-articles/common-german-mistakes";
import { article as atHome } from "./magazine-articles/learn-german-at-home";
import { article as b1Exam } from "./magazine-articles/german-b1-exam-guide";
import { article as perfekt } from "./magazine-articles/perfekt-vs-praeteritum";
import { article as dative } from "./magazine-articles/german-dative-verbs";
import { article as smallTalk } from "./magazine-articles/german-small-talk-culture";
import { article as integration } from "./magazine-articles/integration-course-guide";
import { article as numbersDates } from "./magazine-articles/german-numbers-dates";

export const articles: MagazineArticle[] = [
  howLong,
  derDieDas,
  cases,
  a1Exam,
  mistakes,
  atHome,
  b1Exam,
  perfekt,
  dative,
  smallTalk,
  integration,
  numbersDates,
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getArticle(slug: string): MagazineArticle | undefined {
  return articles.find((a) => a.slug === slug);
}
