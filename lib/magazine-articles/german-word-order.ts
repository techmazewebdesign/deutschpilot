import type { MagazineArticle } from "../magazine";

export const article: MagazineArticle = {
  slug: "german-word-order",
  date: "2026-07-29",
  readingMinutes: 8,
  tags: ["Grammar", "A2", "B1"],
  title_en: "German Word Order (Satzstellung): V2, Verb-Final, and TMP",
  title_de: "Deutsche Satzstellung: Verb an Position 2, Verbend und TeKaMoLo",
  description_en:
    "German word order explained clearly: the verb-second rule in main clauses, verb-final order in subordinate clauses, and the time-manner-place rule.",
  description_de:
    "Deutsche Satzstellung klar erklärt: die Verb-Zweit-Regel im Hauptsatz, Verbend im Nebensatz und die Regel Zeit-Art-Ort (TeKaMoLo).",
  body_en: `<p>German word order feels chaotic at first because it isn't subject-verb-object like English. It's actually a small set of strict rules — once you internalize them, German sentences become far more predictable than English ones.</p>

<h2>Rule 1: Verb-second (V2) in main clauses</h2>
<p>In every German main clause (statement or question with a question word), the <strong>conjugated verb is always in second position</strong> — not necessarily the second word, but the second "slot." Whatever comes first (subject, time expression, object) doesn't matter; the verb stays put.</p>
<ul>
  <li><em><strong>Ich</strong> <strong>fahre</strong> morgen nach Berlin.</em> (Subject first, verb second.)</li>
  <li><em><strong>Morgen</strong> <strong>fahre</strong> ich nach Berlin.</em> (Time expression first — verb still second, subject now after the verb!)</li>
  <li><em><strong>Nach Berlin</strong> <strong>fahre</strong> ich morgen.</em> (Object first — same rule.)</li>
</ul>
<p>This is the single most important fact about German syntax: putting something other than the subject first does not change where the verb goes, but it does force the subject to move after the verb. Beginners often try to keep subject-verb order no matter what comes first — that's the #1 word order mistake.</p>

<h2>Rule 2: Verb-final in subordinate clauses</h2>
<p>The moment a clause is introduced by a subordinating conjunction (<em>weil, dass, wenn, obwohl, während, bevor</em>...) or is a relative clause, the conjugated verb jumps to the <strong>very end</strong> of that clause.</p>
<ul>
  <li><em>Ich bleibe zu Hause, <strong>weil</strong> es <strong>regnet</strong>.</em> (I'm staying home because it's raining.)</li>
  <li><em>Sie sagt, <strong>dass</strong> sie morgen <strong>kommt</strong>.</em> (She says that she's coming tomorrow.)</li>
  <li><em>Das ist der Mann, <strong>den</strong> ich gestern <strong>gesehen habe</strong>.</em> (That's the man I saw yesterday — with two-part verbs, the whole verb group goes to the end, conjugated part last.)</li>
</ul>
<p>Coordinating conjunctions (<em>und, oder, aber, denn, sondern</em>) do <strong>not</strong> trigger this — they simply join two independent main clauses, each keeping V2: <em>Ich bleibe zu Hause, <strong>denn</strong> es <strong>regnet</strong>.</em></p>

<h2>Rule 3: Time – Manner – Place (TeKaMoLo)</h2>
<p>When a sentence has multiple adverbial elements (time, cause/manner, place), German has a default order: <strong>Temporal – Kausal – Modal – Lokal</strong>, usually simplified for learners as <strong>time, manner, place</strong>.</p>
<ul>
  <li><em>Ich fahre <strong>morgen</strong> (time) <strong>mit dem Zug</strong> (manner) <strong>nach Berlin</strong> (place).</em></li>
</ul>
<p>English speakers instinctively say place before time ("I'm going to Berlin tomorrow"), which is backwards in German. If in doubt, time first.</p>

<h2>Putting it together: the "verb bracket" (Satzklammer)</h2>
<p>Many German sentences use two verb parts that "bracket" the rest of the sentence — the conjugated part in position 2, everything else (separable prefix, past participle, infinitive) at the very end:</p>
<ul>
  <li><em>Ich <strong>rufe</strong> dich morgen <strong>an</strong>.</em> (separable verb anrufen)</li>
  <li><em>Ich <strong>habe</strong> das Buch schon <strong>gelesen</strong>.</em> (Perfekt)</li>
  <li><em>Ich <strong>werde</strong> morgen <strong>kommen</strong>.</em> (Futur I)</li>
</ul>
<p>Everything between the two verb parts — the "middle field" (Mittelfeld) — is where time/manner/place expressions, objects, and pronouns live, roughly following TeKaMoLo plus "pronouns before nouns."</p>

<h2>Common mistakes</h2>
<ul>
  <li>Keeping the verb in third position after starting with a time expression: wrong <em>Morgen ich fahre</em>, right <em>Morgen fahre ich</em>.</li>
  <li>Forgetting to send the verb to the end after <em>weil/dass/wenn</em>: wrong <em>weil ich bin müde</em>, right <em>weil ich müde bin</em>.</li>
  <li>Wrong order of time/place: wrong <em>Ich fahre nach Berlin morgen</em>, right <em>Ich fahre morgen nach Berlin</em>.</li>
  <li>Splitting separable-prefix verbs incorrectly or forgetting the prefix at the end.</li>
</ul>

<p>Word order clicks fastest through pattern drills, not rules alone — practice both main- and subordinate-clause building in our <a href="/en/courses">A2 and B1 courses</a>.</p>`,
  body_de: `<p>Die deutsche Satzstellung wirkt zunächst chaotisch, weil sie nicht wie im Englischen Subjekt-Verb-Objekt folgt. Tatsächlich handelt es sich um eine kleine Zahl strenger Regeln — sobald sie sitzen, sind deutsche Sätze deutlich vorhersehbarer als englische.</p>

<h2>Regel 1: Verb an Position 2 im Hauptsatz</h2>
<p>In jedem deutschen Hauptsatz (Aussage oder Frage mit Fragewort) steht das <strong>konjugierte Verb immer an zweiter Position</strong> — nicht unbedingt das zweite Wort, aber der zweite "Platz". Was zuerst kommt (Subjekt, Zeitangabe, Objekt), spielt keine Rolle; das Verb bleibt an seinem Platz.</p>
<ul>
  <li><em><strong>Ich</strong> <strong>fahre</strong> morgen nach Berlin.</em> (Subjekt zuerst, Verb an zweiter Stelle.)</li>
  <li><em><strong>Morgen</strong> <strong>fahre</strong> ich nach Berlin.</em> (Zeitangabe zuerst — Verb bleibt an zweiter Stelle, Subjekt rutscht nach dem Verb!)</li>
  <li><em><strong>Nach Berlin</strong> <strong>fahre</strong> ich morgen.</em> (Objekt zuerst — gleiche Regel.)</li>
</ul>
<p>Das ist die wichtigste Tatsache der deutschen Syntax: Wenn etwas anderes als das Subjekt zuerst steht, ändert das nicht die Position des Verbs, zwingt aber das Subjekt, nach dem Verb zu stehen. Anfänger versuchen oft, die Subjekt-Verb-Reihenfolge beizubehalten, egal was zuerst kommt — das ist der häufigste Wortstellungsfehler.</p>

<h2>Regel 2: Verbend im Nebensatz</h2>
<p>Sobald ein Satz durch eine unterordnende Konjunktion (<em>weil, dass, wenn, obwohl, während, bevor</em> …) eingeleitet wird oder ein Relativsatz ist, springt das konjugierte Verb ganz ans <strong>Ende</strong> dieses Satzes.</p>
<ul>
  <li><em>Ich bleibe zu Hause, <strong>weil</strong> es <strong>regnet</strong>.</em></li>
  <li><em>Sie sagt, <strong>dass</strong> sie morgen <strong>kommt</strong>.</em></li>
  <li><em>Das ist der Mann, <strong>den</strong> ich gestern <strong>gesehen habe</strong>.</em> (Bei zweiteiligen Verben wandert die ganze Verbgruppe ans Ende, das konjugierte Teil zuletzt.)</li>
</ul>
<p>Nebenordnende Konjunktionen (<em>und, oder, aber, denn, sondern</em>) lösen das <strong>nicht</strong> aus — sie verbinden lediglich zwei selbstständige Hauptsätze, die jeweils Verb-Zweit behalten: <em>Ich bleibe zu Hause, <strong>denn</strong> es <strong>regnet</strong>.</em></p>

<h2>Regel 3: TeKaMoLo (Temporal – Kausal – Modal – Lokal)</h2>
<p>Wenn ein Satz mehrere adverbiale Angaben enthält (Zeit, Grund/Art, Ort), gilt im Deutschen eine Standardreihenfolge: <strong>Temporal – Kausal – Modal – Lokal</strong>, für Lernende oft vereinfacht als <strong>Zeit, Art, Ort</strong>.</p>
<ul>
  <li><em>Ich fahre <strong>morgen</strong> (Zeit) <strong>mit dem Zug</strong> (Art) <strong>nach Berlin</strong> (Ort).</em></li>
</ul>
<p>In anderen Sprachen steht der Ort oft vor der Zeit ("I'm going to Berlin tomorrow") — im Deutschen ist das umgekehrt. Im Zweifel: Zeit zuerst.</p>

<h2>Alles zusammen: die Satzklammer</h2>
<p>Viele deutsche Sätze nutzen zwei Verbteile, die den restlichen Satz "einklammern" — der konjugierte Teil an Position 2, alles andere (trennbares Präfix, Partizip II, Infinitiv) ganz am Ende:</p>
<ul>
  <li><em>Ich <strong>rufe</strong> dich morgen <strong>an</strong>.</em> (trennbares Verb anrufen)</li>
  <li><em>Ich <strong>habe</strong> das Buch schon <strong>gelesen</strong>.</em> (Perfekt)</li>
  <li><em>Ich <strong>werde</strong> morgen <strong>kommen</strong>.</em> (Futur I)</li>
</ul>
<p>Alles zwischen den beiden Verbteilen — das "Mittelfeld" — ist der Ort für Zeit-/Art-/Ortsangaben, Objekte und Pronomen, grob nach TeKaMoLo plus "Pronomen vor Substantiven".</p>

<h2>Häufige Fehler</h2>
<ul>
  <li>Verb an dritter Stelle lassen, wenn mit einer Zeitangabe begonnen wird: falsch <em>Morgen ich fahre</em>, richtig <em>Morgen fahre ich</em>.</li>
  <li>Vergessen, das Verb nach <em>weil/dass/wenn</em> ans Ende zu schicken: falsch <em>weil ich bin müde</em>, richtig <em>weil ich müde bin</em>.</li>
  <li>Falsche Reihenfolge von Zeit/Ort: falsch <em>Ich fahre nach Berlin morgen</em>, richtig <em>Ich fahre morgen nach Berlin</em>.</li>
  <li>Trennbare Verben falsch aufteilen oder das Präfix am Ende vergessen.</li>
</ul>

<p>Satzstellung sitzt am schnellsten durch Musterübungen, nicht nur durch Regeln — übe Haupt- und Nebensatzbau in unseren <a href="/de/courses">A2- und B1-Kursen</a>.</p>`,
};
