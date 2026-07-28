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
import { article as modalVerbs } from "./magazine-articles/german-modal-verbs";
import { article as b2Exam } from "./magazine-articles/german-b2-exam-guide";
import { article as konjunktivII } from "./magazine-articles/konjunktiv-ii-explained";
import { article as wordOrder } from "./magazine-articles/german-word-order";
import { article as workingInGermany } from "./magazine-articles/working-in-germany-guide";
import { article as idioms } from "./magazine-articles/common-german-idioms";
import { article as falseFriends } from "./magazine-articles/german-false-friends";
import { article as compoundNouns } from "./magazine-articles/german-compound-nouns";
import { article as pronunciation } from "./magazine-articles/german-pronunciation-guide";
import { article as c1Exam } from "./magazine-articles/german-c1-exam-guide";
import { article as twoWayPrepositions } from "./magazine-articles/german-two-way-prepositions";
import { article as businessGerman } from "./magazine-articles/business-german-guide";
import { article as separableVerbs } from "./magazine-articles/german-separable-verbs";
import { article as adjectiveEndings } from "./magazine-articles/german-adjective-endings";
import { article as passiveVoice } from "./magazine-articles/german-passive-voice";
import { article as rentingGuide } from "./magazine-articles/renting-apartment-germany-guide";
import { article as diminutives } from "./magazine-articles/german-diminutives-chen-lein";
import { article as officePhrases } from "./magazine-articles/office-german-phrases";

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
  modalVerbs,
  b2Exam,
  konjunktivII,
  wordOrder,
  workingInGermany,
  idioms,
  falseFriends,
  compoundNouns,
  pronunciation,
  c1Exam,
  twoWayPrepositions,
  businessGerman,
  separableVerbs,
  adjectiveEndings,
  passiveVoice,
  rentingGuide,
  diminutives,
  officePhrases,
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getArticle(slug: string): MagazineArticle | undefined {
  return articles.find((a) => a.slug === slug);
}
