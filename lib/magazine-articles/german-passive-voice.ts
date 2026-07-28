import type { MagazineArticle } from "../magazine";

export const article: MagazineArticle = {
  slug: "german-passive-voice",
  date: "2026-08-09",
  readingMinutes: 8,
  tags: ["Grammar", "B1", "B2"],
  title_en: "German Passive Voice (Passiv): werden-Passive, Zustandspassiv, and When Germans Actually Use It",
  title_de: "Das Passiv im Deutschen: werden-Passiv, Zustandspassiv und wann es wirklich verwendet wird",
  description_en:
    "How to form the German werden-passive, the difference between Vorgangspassiv and Zustandspassiv, and when native speakers actually prefer passive over active voice.",
  description_de:
    "Wie das deutsche werden-Passiv gebildet wird, der Unterschied zwischen Vorgangspassiv und Zustandspassiv, und wann Muttersprachler das Passiv wirklich bevorzugen.",
  body_en: `<p>The passive voice in German is more common — and more grammatically involved — than its English counterpart. English mostly gets away with one passive ("the door is closed"), but German uses two structurally different passives for two different meanings, built from two different auxiliary verbs. Confusing them is a very common intermediate-level mistake, and getting them right is one of the clearer signs of solid B1/B2 grammar.</p>

<h2>Forming the werden-passive (Vorgangspassiv)</h2>
<p>The standard, action-focused passive is built with a conjugated form of <strong>werden</strong> + the past participle of the main verb, sent to the end of the clause exactly like any other participle.</p>
<table>
  <thead><tr><th>Tense</th><th>Formula</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Present</td><td>werden (conjugated) + Partizip II</td><td><em>Das Haus <strong>wird</strong> gebaut.</em> (The house is being built.)</td></tr>
    <tr><td>Simple past</td><td>wurde + Partizip II</td><td><em>Das Haus <strong>wurde</strong> gebaut.</em> (The house was being built.)</td></tr>
    <tr><td>Present perfect</td><td>sein + Partizip II + <em>worden</em></td><td><em>Das Haus <strong>ist</strong> gebaut <strong>worden</strong>.</em> (The house has been built.)</td></tr>
    <tr><td>Future</td><td>werden + Partizip II + <em>werden</em></td><td><em>Das Haus <strong>wird</strong> gebaut <strong>werden</strong>.</em> (The house will be built.)</td></tr>
  </tbody>
</table>
<p>Note the special participle <strong>worden</strong> (not <em>geworden</em>) used only in perfect-tense passive constructions — one of the few places German keeps a fossil form just for this purpose.</p>

<h2>Bringing the agent back in with "von" or "durch"</h2>
<p>The passive de-emphasizes who did the action — that's its whole point — but you can still name the agent if needed:</p>
<ul>
  <li><strong>von</strong> + dative — for a person or active force: <em>Das Haus wird <strong>von</strong> einer Firma gebaut.</em> (The house is being built by a company.)</li>
  <li><strong>durch</strong> + accusative — for a means, cause, or instrument: <em>Die Stadt wurde <strong>durch</strong> ein Erdbeben zerstört.</em> (The city was destroyed by an earthquake.)</li>
</ul>
<p>In practice, most passive sentences in real German drop the agent entirely — that's usually the reason to use passive in the first place (see below).</p>

<h2>Zustandspassiv: the other passive, built with "sein"</h2>
<p>This is the mistake zone. <strong>Zustandspassiv</strong> (state passive) looks similar but describes the resulting state after an action is complete, not the action itself — and it's built with <strong>sein</strong>, not <em>werden</em>.</p>
<table>
  <thead><tr><th></th><th>Focus</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><strong>Vorgangspassiv</strong> (werden)</td><td>the action happening</td><td><em>Die Tür <strong>wird</strong> geschlossen.</em> (The door is being closed — someone is doing it right now.)</td></tr>
    <tr><td><strong>Zustandspassiv</strong> (sein)</td><td>the resulting state</td><td><em>Die Tür <strong>ist</strong> geschlossen.</em> (The door is closed — describing its current condition, action already finished.)</td></tr>
  </tbody>
</table>
<p>A useful test: if you could naturally add "gerade" (right now, in progress) and it still makes sense, it's Vorgangspassiv. If you're really just describing how something currently looks or exists — closer in feel to an adjective than a verb — it's Zustandspassiv. <em>Der Laden ist geöffnet.</em> (The shop is open — a state) vs. <em>Der Laden wird um 9 Uhr geöffnet.</em> (The shop is opened/gets opened at 9 — the action of opening it).</p>

<h2>When Germans actually prefer passive over active</h2>
<p>Passive isn't just a grammar exercise — it does real communicative work, and native speakers reach for it deliberately in specific situations:</p>
<ul>
  <li><strong>The agent is unknown, irrelevant, or obvious from context.</strong> <em>Hier wird nicht geraucht.</em> (No smoking here.) Nobody needs to say who enforces it.</li>
  <li><strong>Instructions, recipes, and manuals.</strong> <em>Das Gemüse wird kleingeschnitten und in die Pfanne gegeben.</em> (The vegetables are cut up and put in the pan.) This is far more common in German written instructions than the English imperative equivalent ("cut the vegetables...").</li>
  <li><strong>Formal, scientific, and bureaucratic writing</strong>, where passive sounds objective and impersonal — a deliberate stylistic choice, not just possible grammar.</li>
  <li><strong>News reporting</strong>, to state facts without immediately assigning blame or credit: <em>Der Verdächtige wurde festgenommen.</em> (The suspect was arrested.)</li>
</ul>
<p>Conversely, everyday spoken German leans active far more than these formal registers — passive is a marker of formality as much as a grammatical tool, so overusing it in casual speech can sound stiff.</p>

<h2>The impersonal passive with "es" or no subject at all</h2>
<p>German passive can drop the subject entirely when there's no direct object to promote, which has no clean English equivalent: <em>Es wird getanzt.</em> / <em>Hier wird getanzt.</em> (There's dancing going on / people are dancing.) The dummy <em>es</em> disappears the moment another element takes first position in the clause.</p>

<h2>Common mistakes</h2>
<ul>
  <li>Using <em>sein</em> instead of <em>werden</em> for an ongoing action, or vice versa — this is the single most common error and it changes the meaning, not just the style.</li>
  <li>Forgetting <em>worden</em> in the present perfect passive, or wrongly using <em>geworden</em> (which means "became," from the ordinary verb <em>werden</em>, not the passive auxiliary).</li>
  <li>Overusing <em>von</em> when <em>durch</em> is more natural for a cause rather than an active agent, and vice versa.</li>
</ul>

<p>Practice recognizing and forming both passive types in our <a href="/en/courses">B1 and B2 courses</a>, and check related grammar topics in our <a href="/en/faq">FAQ</a>.</p>`,
  body_de: `<p>Das Passiv ist im Deutschen häufiger — und grammatisch aufwendiger — als sein englisches Gegenstück. Englisch kommt meist mit einem Passiv aus ("the door is closed"), aber Deutsch verwendet zwei strukturell unterschiedliche Passivformen für zwei unterschiedliche Bedeutungen, gebildet mit zwei unterschiedlichen Hilfsverben. Sie zu verwechseln ist ein sehr häufiger Fehler auf mittlerem Niveau, und sie richtig zu unterscheiden ist eines der klareren Zeichen solider B1/B2-Grammatik.</p>

<h2>Das werden-Passiv bilden (Vorgangspassiv)</h2>
<p>Das Standard-Passiv, das den Vorgang betont, wird mit einer konjugierten Form von <strong>werden</strong> + Partizip II des Hauptverbs gebildet, das genau wie jedes andere Partizip ans Satzende wandert.</p>
<table>
  <thead><tr><th>Zeitform</th><th>Formel</th><th>Beispiel</th></tr></thead>
  <tbody>
    <tr><td>Präsens</td><td>werden (konjugiert) + Partizip II</td><td><em>Das Haus <strong>wird</strong> gebaut.</em></td></tr>
    <tr><td>Präteritum</td><td>wurde + Partizip II</td><td><em>Das Haus <strong>wurde</strong> gebaut.</em></td></tr>
    <tr><td>Perfekt</td><td>sein + Partizip II + <em>worden</em></td><td><em>Das Haus <strong>ist</strong> gebaut <strong>worden</strong>.</em></td></tr>
    <tr><td>Futur</td><td>werden + Partizip II + <em>werden</em></td><td><em>Das Haus <strong>wird</strong> gebaut <strong>werden</strong>.</em></td></tr>
  </tbody>
</table>
<p>Beachte das besondere Partizip <strong>worden</strong> (nicht <em>geworden</em>), das nur im Perfekt-Passiv verwendet wird — eine der wenigen Stellen, an denen das Deutsche eine fossile Form nur für diesen Zweck bewahrt.</p>

<h2>Den Handelnden mit "von" oder "durch" wieder einbringen</h2>
<p>Das Passiv rückt in den Hintergrund, wer die Handlung ausführt — das ist sein ganzer Sinn — aber man kann den Handelnden bei Bedarf trotzdem nennen:</p>
<ul>
  <li><strong>von</strong> + Dativ — für eine Person oder aktive Kraft: <em>Das Haus wird <strong>von</strong> einer Firma gebaut.</em></li>
  <li><strong>durch</strong> + Akkusativ — für Mittel, Ursache oder Instrument: <em>Die Stadt wurde <strong>durch</strong> ein Erdbeben zerstört.</em></li>
</ul>
<p>In der Praxis lässt die Mehrheit der Passivsätze im echten Deutsch den Handelnden ganz weg — genau das ist meist der Grund, überhaupt das Passiv zu verwenden (siehe unten).</p>

<h2>Zustandspassiv: das andere Passiv, gebildet mit "sein"</h2>
<p>Hier passieren die meisten Fehler. Das <strong>Zustandspassiv</strong> sieht ähnlich aus, beschreibt aber den resultierenden Zustand nach Abschluss einer Handlung, nicht die Handlung selbst — und wird mit <strong>sein</strong> gebildet, nicht mit <em>werden</em>.</p>
<table>
  <thead><tr><th></th><th>Fokus</th><th>Beispiel</th></tr></thead>
  <tbody>
    <tr><td><strong>Vorgangspassiv</strong> (werden)</td><td>die Handlung selbst</td><td><em>Die Tür <strong>wird</strong> geschlossen.</em> (Jemand tut es gerade.)</td></tr>
    <tr><td><strong>Zustandspassiv</strong> (sein)</td><td>der resultierende Zustand</td><td><em>Die Tür <strong>ist</strong> geschlossen.</em> (Beschreibt den aktuellen Zustand, Handlung bereits abgeschlossen.)</td></tr>
  </tbody>
</table>
<p>Ein nützlicher Test: Lässt sich natürlich "gerade" einfügen und der Satz ergibt weiterhin Sinn, ist es Vorgangspassiv. Beschreibt man wirklich nur, wie etwas gerade aussieht oder beschaffen ist — näher an einem Adjektiv als an einem Verb — ist es Zustandspassiv. <em>Der Laden ist geöffnet.</em> (Zustand) vs. <em>Der Laden wird um 9 Uhr geöffnet.</em> (die Handlung des Öffnens).</p>

<h2>Wann Deutsche das Passiv tatsächlich dem Aktiv vorziehen</h2>
<p>Das Passiv ist keine reine Grammatikübung — es leistet echte kommunikative Arbeit, und Muttersprachler greifen in bestimmten Situationen bewusst dazu:</p>
<ul>
  <li><strong>Der Handelnde ist unbekannt, irrelevant oder aus dem Kontext offensichtlich.</strong> <em>Hier wird nicht geraucht.</em> Niemand muss sagen, wer das durchsetzt.</li>
  <li><strong>Anleitungen, Rezepte und Handbücher.</strong> <em>Das Gemüse wird kleingeschnitten und in die Pfanne gegeben.</em> Das ist in deutschen schriftlichen Anleitungen weit üblicher als das englische Imperativ-Äquivalent ("cut the vegetables...").</li>
  <li><strong>Formelle, wissenschaftliche und behördliche Texte</strong>, wo Passiv objektiv und unpersönlich klingt — eine bewusste stilistische Wahl, nicht nur mögliche Grammatik.</li>
  <li><strong>Nachrichten</strong>, um Fakten zu nennen, ohne sofort Schuld oder Verdienst zuzuweisen: <em>Der Verdächtige wurde festgenommen.</em></li>
</ul>
<p>Umgekehrt neigt gesprochenes Alltagsdeutsch weit stärker zum Aktiv als diese formellen Register — Passiv ist ebenso ein Marker für Formalität wie ein grammatisches Werkzeug, weshalb übermäßiger Gebrauch im lockeren Gespräch steif wirken kann.</p>

<h2>Das unpersönliche Passiv mit "es" oder ganz ohne Subjekt</h2>
<p>Das deutsche Passiv kann das Subjekt ganz weglassen, wenn es kein direktes Objekt gibt, das befördert werden könnte — ohne saubere englische Entsprechung: <em>Es wird getanzt.</em> / <em>Hier wird getanzt.</em> Das Platzhalter-<em>es</em> verschwindet, sobald ein anderes Element die erste Position im Satz einnimmt.</p>

<h2>Häufige Fehler</h2>
<ul>
  <li><em>sein</em> statt <em>werden</em> für eine andauernde Handlung verwenden, oder umgekehrt — das ist der mit Abstand häufigste Fehler und ändert die Bedeutung, nicht nur den Stil.</li>
  <li><em>worden</em> im Perfekt-Passiv vergessen, oder fälschlich <em>geworden</em> verwenden (das "wurde zu" bedeutet, vom gewöhnlichen Verb <em>werden</em>, nicht vom Passiv-Hilfsverb).</li>
  <li><em>von</em> übernutzen, wenn <em>durch</em> für eine Ursache statt eines aktiven Handelnden natürlicher wäre, und umgekehrt.</li>
</ul>

<p>Übe das Erkennen und Bilden beider Passivformen in unseren <a href="/de/courses">B1- und B2-Kursen</a>, und schau dir verwandte Grammatikthemen in unserem <a href="/de/faq">FAQ</a> an.</p>`,
};
