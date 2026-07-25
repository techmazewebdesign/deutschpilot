import type { MagazineArticle } from "../magazine";

export const article: MagazineArticle = {
  slug: "perfekt-vs-praeteritum",
  date: "2026-07-25",
  readingMinutes: 6,
  tags: ["Grammar", "A2", "B1"],
  title_en: "Perfekt vs. Präteritum: Which German Past Tense When?",
  title_de: "Perfekt oder Präteritum: Welche Vergangenheit wann?",
  description_en:
    "The one rule that solves 90% of cases, the famous exception verbs, and how news German differs from spoken German.",
  description_de:
    "Die eine Regel, die 90 % der Fälle löst, die berühmten Ausnahme-Verben und warum Nachrichten anders klingen als Gespräche.",
  body_en: `<p>German has two everyday past tenses, and textbooks often make choosing between them sound harder than it is. Here is the honest, practical version.</p>

<h2>The rule that solves 90% of cases</h2>
<p><strong>Speaking? Use Perfekt. Writing formally? Use Präteritum.</strong></p>
<ul>
  <li>Spoken: <em>Ich <strong>habe</strong> gestern Pizza <strong>gegessen</strong>.</em></li>
  <li>Newspaper: <em>Der Minister <strong>aß</strong> gestern mit der Delegation.</em> (you'd never say this aloud)</li>
</ul>
<p>A German telling a friend about their weekend uses Perfekt almost exclusively. A novel or news article narrates in Präteritum. That's the whole system — with one famous exception group.</p>

<h2>The exception verbs: always Präteritum, even in speech</h2>
<p>A small set of very frequent verbs prefer Präteritum even in casual conversation, simply because their Präteritum forms are shorter:</p>
<table>
  <thead><tr><th>Verb</th><th>Spoken past</th><th>Not usually</th></tr></thead>
  <tbody>
    <tr><td>sein</td><td><strong>ich war</strong></td><td><em>ich bin gewesen</em></td></tr>
    <tr><td>haben</td><td><strong>ich hatte</strong></td><td><em>ich habe gehabt</em></td></tr>
    <tr><td>können</td><td><strong>ich konnte</strong></td><td><em>ich habe gekonnt</em></td></tr>
    <tr><td>müssen</td><td><strong>ich musste</strong></td><td><em>ich habe gemusst</em></td></tr>
    <tr><td>wollen</td><td><strong>ich wollte</strong></td><td><em>ich habe gewollt</em></td></tr>
    <tr><td>wissen</td><td><strong>ich wusste</strong></td><td><em>ich habe gewusst</em></td></tr>
    <tr><td>es gibt</td><td><strong>es gab</strong></td><td><em>es hat gegeben</em></td></tr>
  </tbody>
</table>
<p>So a natural spoken sentence freely mixes both: <em>Ich <strong>war</strong> müde, weil ich schlecht <strong>geschlafen habe</strong>.</em></p>

<h2>Perfekt survival kit: haben or sein?</h2>
<p>Perfekt = <em>haben/sein</em> + Partizip II. Use <strong>sein</strong> with verbs of movement from A to B (<em>gehen, fahren, fliegen, kommen</em>) and change of state (<em>aufwachen, einschlafen, werden, bleiben, sein</em>). Everything else takes <strong>haben</strong> — including reflexives, always: <em>ich habe mich gefreut</em>.</p>

<h2>Regional footnote</h2>
<p>In southern Germany, Austria, and Switzerland, Perfekt is even stronger — you'll hear <em>ich bin gestanden</em> where the north says <em>ich habe gestanden</em>. Don't let it confuse you; both are understood everywhere.</p>

<p>Drill the past-tense patterns in our <a href="/en/courses">A2 and B1 practice courses</a> — the travel and news rooms are built around exactly these forms.</p>`,
  body_de: `<p>Deutsch hat zwei Alltags-Vergangenheiten, und Lehrbücher machen die Wahl oft komplizierter, als sie ist. Hier die ehrliche, praktische Version.</p>

<h2>Die Regel, die 90 % der Fälle löst</h2>
<p><strong>Sprechen? Perfekt. Formell schreiben? Präteritum.</strong></p>
<ul>
  <li>Gesprochen: <em>Ich <strong>habe</strong> gestern Pizza <strong>gegessen</strong>.</em></li>
  <li>Zeitung: <em>Der Minister <strong>aß</strong> gestern mit der Delegation.</em> (so spricht niemand)</li>
</ul>
<p>Wer Freunden vom Wochenende erzählt, benutzt fast nur Perfekt. Romane und Nachrichten erzählen im Präteritum. Das ist das ganze System — mit einer berühmten Ausnahmegruppe.</p>

<h2>Die Ausnahme-Verben: immer Präteritum, auch beim Sprechen</h2>
<p>Eine kleine Gruppe sehr häufiger Verben bevorzugt auch im Gespräch das Präteritum — schlicht, weil die Formen kürzer sind:</p>
<table>
  <thead><tr><th>Verb</th><th>Gesprochen</th><th>Eher nicht</th></tr></thead>
  <tbody>
    <tr><td>sein</td><td><strong>ich war</strong></td><td><em>ich bin gewesen</em></td></tr>
    <tr><td>haben</td><td><strong>ich hatte</strong></td><td><em>ich habe gehabt</em></td></tr>
    <tr><td>können</td><td><strong>ich konnte</strong></td><td><em>ich habe gekonnt</em></td></tr>
    <tr><td>müssen</td><td><strong>ich musste</strong></td><td><em>ich habe gemusst</em></td></tr>
    <tr><td>wollen</td><td><strong>ich wollte</strong></td><td><em>ich habe gewollt</em></td></tr>
    <tr><td>wissen</td><td><strong>ich wusste</strong></td><td><em>ich habe gewusst</em></td></tr>
    <tr><td>es gibt</td><td><strong>es gab</strong></td><td><em>es hat gegeben</em></td></tr>
  </tbody>
</table>
<p>Ein natürlicher Satz mischt deshalb munter beides: <em>Ich <strong>war</strong> müde, weil ich schlecht <strong>geschlafen habe</strong>.</em></p>

<h2>Perfekt-Überlebenspaket: haben oder sein?</h2>
<p>Perfekt = <em>haben/sein</em> + Partizip II. <strong>Sein</strong> nehmen Verben der Bewegung von A nach B (<em>gehen, fahren, fliegen, kommen</em>) und der Zustandsänderung (<em>aufwachen, einschlafen, werden, bleiben, sein</em>). Alles andere nimmt <strong>haben</strong> — Reflexive immer: <em>ich habe mich gefreut</em>.</p>

<h2>Regionale Fußnote</h2>
<p>Im Süden, in Österreich und der Schweiz ist das Perfekt noch stärker — dort hört man <em>ich bin gestanden</em>, wo der Norden <em>ich habe gestanden</em> sagt. Beides wird überall verstanden.</p>

<p>Trainiere die Vergangenheitsformen in unseren <a href="/de/courses">A2- und B1-Übungskursen</a> — die Reise- und Nachrichten-Räume sind genau um diese Formen herum gebaut.</p>`,
};
