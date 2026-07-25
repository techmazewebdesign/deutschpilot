import type { MagazineArticle } from "../magazine";

export const article: MagazineArticle = {
  slug: "german-numbers-dates",
  date: "2026-07-25",
  readingMinutes: 6,
  tags: ["Vocabulary", "A1", "A2"],
  title_en: "German Numbers, Dates and Time: Master the Backwards Logic",
  title_de: "Zahlen, Datum und Uhrzeit: Die Rückwärts-Logik meistern",
  description_en:
    "Why 21 is 'one-and-twenty', how halb acht means 7:30 not 8:30, ordinal dates, and the phone-number survival drill.",
  description_de:
    "Warum 21 'einundzwanzig' heißt, warum halb acht 7:30 ist, Ordinalzahlen im Datum und das Telefonnummern-Überlebenstraining.",
  body_en: `<p>Numbers are where German ambushes beginners twice: once with reversed two-digit numbers, and again with a clock system where <em>halb acht</em> is <strong>7:30</strong>. Both become automatic with the right drills — here's the full map.</p>

<h2>The backwards numbers</h2>
<p>From 21 to 99, German says the ones digit first: <strong>einundzwanzig</strong> (one-and-twenty) = 21, <strong>vierundsechzig</strong> = 64. Written as one word, always. The traps:</p>
<ul>
  <li><strong>Hearing them:</strong> when someone dictates "vierundsechzig", learners write 46. Fix: always write the second-heard digit first. Drill with prices and phone numbers, not number lists.</li>
  <li><strong>ein vs. eins:</strong> counting says <em>eins</em>, but inside numbers it's <em>ein</em>und…, and before nouns it declines (<em>ein Euro, eine Minute</em>).</li>
  <li><strong>Big numbers:</strong> no reversal above 99 — <em>dreihundertvierundzwanzig</em> = 324 (three hundred + four-and-twenty).</li>
</ul>

<h2>The clock: halb means half TO</h2>
<table>
  <thead><tr><th>Time</th><th>Colloquial German</th><th>Logic</th></tr></thead>
  <tbody>
    <tr><td>7:30</td><td><strong>halb acht</strong></td><td>half of the way to 8</td></tr>
    <tr><td>7:15</td><td><strong>Viertel nach sieben</strong></td><td>quarter past 7</td></tr>
    <tr><td>7:45</td><td><strong>Viertel vor acht</strong></td><td>quarter to 8</td></tr>
    <tr><td>7:25</td><td><strong>fünf vor halb acht</strong></td><td>5 before half-to-8 (yes, really)</td></tr>
  </tbody>
</table>
<p>Official contexts (train stations, TV) use the 24-hour clock plainly: <em>neunzehn Uhr dreißig</em> = 19:30. When in doubt, use that — it's always understood and unambiguous. Regional note: in parts of the south and east you'll hear <em>Viertel acht</em> (7:15) and <em>drei viertel acht</em> (7:45).</p>

<h2>Dates and ordinals</h2>
<ul>
  <li>Format: day.month.year — <strong>03.10.2026</strong> is October 3rd, never March 10th.</li>
  <li>Spoken with ordinals + <em>am</em>: <em>am <strong>dritten</strong> Oktober</em>; the year plainly: <em>zweitausendsechsundzwanzig</em>.</li>
  <li>Ordinal rule: 1.–19. add <strong>-te</strong> (der zweite, der neunzehnte — irregular: erste, dritte, siebte), from 20. add <strong>-ste</strong> (der zwanzigste).</li>
</ul>

<h2>The phone-number survival drill</h2>
<p>Germans often dictate numbers in pairs: <em>34 76 12</em> = vierunddreißig, sechsundsiebzig, zwölf. Three-minute daily drill: have any voice assistant or partner read 5 phone numbers and 5 prices; write, check, repeat. Two weeks of this beats any textbook chapter.</p>

<p>Numbers, times and dates run throughout our <a href="/en/courses">A1 and A2 courses</a> — including listening exercises where you have to catch them at native speed.</p>`,
  body_de: `<p>Bei den Zahlen legt das Deutsche Anfängern gleich zwei Fallen: erst die umgedrehten Zweierzahlen, dann ein Uhrzeitsystem, in dem <em>halb acht</em> <strong>7:30</strong> bedeutet. Beides wird mit den richtigen Übungen automatisch — hier die komplette Landkarte.</p>

<h2>Die Rückwärts-Zahlen</h2>
<p>Von 21 bis 99 nennt Deutsch die Einerstelle zuerst: <strong>einundzwanzig</strong> = 21, <strong>vierundsechzig</strong> = 64. Immer in einem Wort. Die Fallen:</p>
<ul>
  <li><strong>Beim Hören:</strong> Wer "vierundsechzig" hört, schreibt schnell 46. Trick: immer die <em>zweitgehörte</em> Ziffer zuerst notieren. Mit Preisen und Telefonnummern üben, nicht mit Zahlenreihen.</li>
  <li><strong>ein vs. eins:</strong> Gezählt wird <em>eins</em>, in Zahlen heißt es <em>ein</em>und…, vor Nomen wird dekliniert (<em>ein Euro, eine Minute</em>).</li>
  <li><strong>Große Zahlen:</strong> über 99 nichts Umgedrehtes mehr — <em>dreihundertvierundzwanzig</em> = 324.</li>
</ul>

<h2>Die Uhr: halb heißt halb VOR</h2>
<table>
  <thead><tr><th>Uhrzeit</th><th>Umgangssprachlich</th><th>Logik</th></tr></thead>
  <tbody>
    <tr><td>7:30</td><td><strong>halb acht</strong></td><td>die Hälfte des Wegs zur 8</td></tr>
    <tr><td>7:15</td><td><strong>Viertel nach sieben</strong></td><td>15 Minuten nach 7</td></tr>
    <tr><td>7:45</td><td><strong>Viertel vor acht</strong></td><td>15 Minuten vor 8</td></tr>
    <tr><td>7:25</td><td><strong>fünf vor halb acht</strong></td><td>5 Minuten vor halb acht (ja, wirklich)</td></tr>
  </tbody>
</table>
<p>Offizielle Kontexte (Bahnhof, Fernsehen) nutzen schlicht die 24-Stunden-Uhr: <em>neunzehn Uhr dreißig</em>. Im Zweifel: genau die verwenden — immer eindeutig. Regional: Im Süden und Osten hört man <em>Viertel acht</em> (7:15) und <em>drei viertel acht</em> (7:45).</p>

<h2>Datum und Ordinalzahlen</h2>
<ul>
  <li>Format: Tag.Monat.Jahr — <strong>03.10.2026</strong> ist der 3. Oktober.</li>
  <li>Gesprochen mit Ordinalzahl + <em>am</em>: <em>am <strong>dritten</strong> Oktober</em>; das Jahr schlicht: <em>zweitausendsechsundzwanzig</em>.</li>
  <li>Ordinal-Regel: 1.–19. mit <strong>-te</strong> (der zweite, der neunzehnte — unregelmäßig: erste, dritte, siebte), ab 20. mit <strong>-ste</strong> (der zwanzigste).</li>
</ul>

<h2>Das Telefonnummern-Überlebenstraining</h2>
<p>Telefonnummern werden oft in Paaren diktiert: <em>34 76 12</em> = vierunddreißig, sechsundsiebzig, zwölf. Tägliche Drei-Minuten-Übung: fünf Nummern und fünf Preise diktieren lassen, mitschreiben, prüfen, wiederholen. Zwei Wochen davon schlagen jedes Lehrbuchkapitel.</p>

<p>Zahlen, Uhrzeiten und Daten ziehen sich durch unsere <a href="/de/courses">A1- und A2-Kurse</a> — inklusive Hörübungen, in denen du sie in echtem Tempo erfassen musst.</p>`,
};
