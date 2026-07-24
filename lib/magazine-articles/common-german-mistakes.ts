import type { MagazineArticle } from "../magazine";

export const article: MagazineArticle = {
  slug: "common-german-mistakes-beginners",
  date: "2026-07-20",
  readingMinutes: 6,
  tags: ["Learning Strategy", "A1", "A2"],
  title_en: "7 German Mistakes Almost Every Beginner Makes (and Easy Fixes)",
  title_de: "7 Fehler, die fast alle Deutsch-Anfänger machen (und einfache Lösungen)",
  description_en:
    "From verb position to false friends: the seven most common beginner mistakes in German, why they happen, and the quick fixes that stick.",
  description_de:
    "Von der Verbposition bis zu falschen Freunden: die sieben häufigsten Anfängerfehler im Deutschen, warum sie passieren und wie du sie dauerhaft abstellst.",
  body_en: `<p>Mistakes are how you learn a language — but some mistakes waste months because nobody points them out early. Here are the seven we see most often in learner writing and speaking, with fixes you can apply today.</p>

<h2>1. The verb wanders from position 2</h2>
<p>In a German main clause, the conjugated verb is <strong>always the second element</strong> — even when the sentence starts with time or place.</p>
<p>❌ <em>Heute ich gehe ins Kino.</em><br>✅ <em>Heute <strong>gehe</strong> ich ins Kino.</em></p>
<p><strong>Fix:</strong> whenever you start a sentence with anything other than the subject, flip subject and verb. Drill with time-first sentences: Morgen fahre ich… Am Montag habe ich…</p>

<h2>2. Forgetting the verb-to-the-end rule after "weil"</h2>
<p>❌ <em>Ich lerne Deutsch, weil ich mag die Sprache.</em><br>✅ <em>Ich lerne Deutsch, weil ich die Sprache <strong>mag</strong>.</em></p>
<p><strong>Fix:</strong> treat weil/dass/wenn as "verb magnets" that pull the verb to the end. Saying it wrong then correcting yourself out loud builds the reflex fast.</p>

<h2>3. "Ich bin heiß" and other dative traps</h2>
<p>German expresses many states with the dative, not with "ich bin":</p>
<p>❌ <em>Ich bin heiß / kalt / langweilig.</em> (You're calling yourself attractive/frigid/boring!)<br>✅ <em><strong>Mir</strong> ist heiß. Mir ist kalt. Mir ist langweilig.</em></p>

<h2>4. False friends</h2>
<ul>
  <li><em>Ich <strong>will</strong></em> = "I want", not "I will" (future = ich werde)</li>
  <li><em>Ich <strong>bekomme</strong></em> = "I receive", not "I become" (= ich werde)</li>
  <li><em>Das <strong>Gift</strong></em> = poison — never give someone "ein Gift"!</li>
  <li><em><strong>eventuell</strong></em> = possibly, not "eventually" (= schließlich)</li>
</ul>

<h2>5. Translating "for + time" with "für"</h2>
<p>❌ <em>Ich lerne Deutsch für zwei Jahre.</em><br>✅ <em>Ich lerne Deutsch <strong>seit</strong> zwei Jahren.</em> (ongoing) / <em>Ich war zwei Jahre in Berlin.</em> (completed — no preposition at all)</p>

<h2>6. Capitalizing like in English</h2>
<p>Every German noun is capitalized — not just names. <em>das Haus, die Zeit, ein Problem</em>. Lowercase nouns are the single most visible "beginner marker" in writing. <strong>Fix:</strong> when proofreading, scan only for nouns once, capitalize, done.</p>

<h2>7. Waiting to speak until it's "good enough"</h2>
<p>The most expensive mistake isn't grammatical. Learners who postpone speaking until they "know enough" stay silent for years. Germans overwhelmingly react to learner German with patience and switched-on attention — the fear is worse than the reality.</p>

<h2>Turn mistakes into progress</h2>
<p>Our <a href="/en/courses">writing practice courses</a> give instant AI feedback on your German — it flags exactly these patterns in your own sentences, which is how they actually get fixed.</p>`,
  body_de: `<p>Fehler sind der Weg, wie man eine Sprache lernt — aber manche Fehler kosten Monate, weil niemand früh auf sie hinweist. Hier sind die sieben, die wir am häufigsten in Texten und Gesprächen von Lernenden sehen, mit Lösungen, die du heute anwenden kannst.</p>

<h2>1. Das Verb wandert von Position 2 weg</h2>
<p>Im deutschen Hauptsatz steht das konjugierte Verb <strong>immer an zweiter Stelle</strong> — auch wenn der Satz mit Zeit oder Ort beginnt.</p>
<p>❌ <em>Heute ich gehe ins Kino.</em><br>✅ <em>Heute <strong>gehe</strong> ich ins Kino.</em></p>
<p><strong>Lösung:</strong> Beginnt dein Satz mit etwas anderem als dem Subjekt, tausche Subjekt und Verb. Übe mit Zeit-zuerst-Sätzen: Morgen fahre ich… Am Montag habe ich…</p>

<h2>2. Das Verb-ans-Ende nach „weil" vergessen</h2>
<p>❌ <em>Ich lerne Deutsch, weil ich mag die Sprache.</em><br>✅ <em>Ich lerne Deutsch, weil ich die Sprache <strong>mag</strong>.</em></p>
<p><strong>Lösung:</strong> Betrachte weil/dass/wenn als „Verb-Magneten", die das Verb ans Ende ziehen. Den Fehler laut zu korrigieren baut den Reflex am schnellsten auf.</p>

<h2>3. „Ich bin heiß" und andere Dativ-Fallen</h2>
<p>Deutsch drückt viele Zustände mit dem Dativ aus, nicht mit „ich bin":</p>
<p>❌ <em>Ich bin heiß / kalt / langweilig.</em> (Du nennst dich damit attraktiv/frigide/langweilig als Person!)<br>✅ <em><strong>Mir</strong> ist heiß. Mir ist kalt. Mir ist langweilig.</em></p>

<h2>4. Falsche Freunde</h2>
<ul>
  <li><em>Ich <strong>will</strong></em> = „ich möchte", nicht das englische Futur „I will" (= ich werde)</li>
  <li><em>Ich <strong>bekomme</strong></em> = „I receive", nicht „I become" (= ich werde)</li>
  <li><em>Das <strong>Gift</strong></em> = poison — niemals jemandem „ein Gift" schenken!</li>
  <li><em><strong>eventuell</strong></em> = möglicherweise, nicht „eventually" (= schließlich)</li>
</ul>

<h2>5. „for + Zeit" mit „für" übersetzen</h2>
<p>❌ <em>Ich lerne Deutsch für zwei Jahre.</em><br>✅ <em>Ich lerne Deutsch <strong>seit</strong> zwei Jahren.</em> (andauernd) / <em>Ich war zwei Jahre in Berlin.</em> (abgeschlossen — ganz ohne Präposition)</p>

<h2>6. Großschreibung wie im Englischen</h2>
<p>Jedes deutsche Substantiv wird großgeschrieben — nicht nur Namen. <em>das Haus, die Zeit, ein Problem</em>. Kleingeschriebene Substantive sind das sichtbarste „Anfänger-Merkmal" in Texten. <strong>Lösung:</strong> Beim Korrekturlesen einmal nur nach Substantiven scannen, großschreiben, fertig.</p>

<h2>7. Mit dem Sprechen warten, bis es „gut genug" ist</h2>
<p>Der teuerste Fehler ist kein grammatischer. Wer das Sprechen aufschiebt, bis er „genug weiß", bleibt jahrelang stumm. Deutsche reagieren auf Lernenden-Deutsch überwiegend mit Geduld und echter Aufmerksamkeit — die Angst ist schlimmer als die Realität.</p>

<h2>Fehler in Fortschritt verwandeln</h2>
<p>Unsere <a href="/de/courses">Schreibübungskurse</a> geben sofortiges KI-Feedback auf dein Deutsch — genau diese Muster werden in deinen eigenen Sätzen markiert, und genau so werden sie wirklich abgestellt.</p>`,
};
