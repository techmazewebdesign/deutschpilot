import type { MagazineArticle } from "../magazine";

export const article: MagazineArticle = {
  slug: "german-cases-explained-simply",
  date: "2026-07-22",
  readingMinutes: 8,
  tags: ["Grammar", "A2", "B1"],
  title_en: "German Cases Explained Simply: Nominativ, Akkusativ, Dativ, Genitiv",
  title_de: "Deutsche Fälle einfach erklärt: Nominativ, Akkusativ, Dativ, Genitiv",
  description_en:
    "The four German cases without the jargon: what each case does, the article tables you actually need, and the prepositions that decide everything.",
  description_de:
    "Die vier deutschen Fälle ohne Fachjargon: was jeder Fall macht, die Artikeltabellen, die du wirklich brauchst, und die Präpositionen, die alles entscheiden.",
  body_en: `<p>Cases are the part of German that scares learners the most — and the part where a simple mental model does the most good. Here it is: <strong>cases are job labels for nouns.</strong> They tell you what role a noun plays in the sentence: who acts, who receives, who benefits.</p>

<h2>The four jobs</h2>
<ul>
  <li><strong>Nominativ — the doer.</strong> Who is acting? <em>Der Mann liest.</em> (The man reads.)</li>
  <li><strong>Akkusativ — the direct target.</strong> What is being acted on? <em>Ich sehe den Mann.</em> (I see the man.)</li>
  <li><strong>Dativ — the receiver/beneficiary.</strong> To/for whom? <em>Ich gebe dem Mann das Buch.</em> (I give the man the book.)</li>
  <li><strong>Genitiv — the owner.</strong> Whose? <em>Das Auto des Mannes.</em> (The man's car.)</li>
</ul>

<h2>The only table you need at A2</h2>
<table>
  <thead><tr><th></th><th>masc.</th><th>fem.</th><th>neut.</th><th>plural</th></tr></thead>
  <tbody>
    <tr><td><strong>Nominativ</strong></td><td>der</td><td>die</td><td>das</td><td>die</td></tr>
    <tr><td><strong>Akkusativ</strong></td><td><u>den</u></td><td>die</td><td>das</td><td>die</td></tr>
    <tr><td><strong>Dativ</strong></td><td><u>dem</u></td><td><u>der</u></td><td><u>dem</u></td><td><u>den</u> (+n)</td></tr>
    <tr><td><strong>Genitiv</strong></td><td>des (+s)</td><td>der</td><td>des (+s)</td><td>der</td></tr>
  </tbody>
</table>
<p>Notice how little actually changes: <strong>Akkusativ only changes the masculine</strong> (der → den). That single fact removes half the fear. Dativ is where the real work is — memorize the row "dem, der, dem, den" as a chant.</p>

<h2>Prepositions decide everything</h2>
<p>In practice you rarely "choose" a case — a preposition chooses it for you:</p>
<ul>
  <li><strong>Always Akkusativ:</strong> durch, für, gegen, ohne, um — <em>ein Geschenk für den Lehrer</em></li>
  <li><strong>Always Dativ:</strong> aus, bei, mit, nach, seit, von, zu — <em>ich fahre mit dem Bus</em></li>
  <li><strong>Two-way (Wechselpräpositionen):</strong> in, an, auf, über, unter, vor, hinter, neben, zwischen — <strong>Akkusativ for movement</strong> (Wohin? <em>Ich gehe in die Küche</em>), <strong>Dativ for location</strong> (Wo? <em>Ich bin in der Küche</em>).</li>
</ul>
<p>Learning the preposition lists as fixed chants ("aus-bei-mit-nach-seit-von-zu") is old-fashioned — and it works.</p>

<h2>What about Genitiv?</h2>
<p>Spoken German increasingly replaces Genitiv with "von + Dativ" (<em>das Auto von dem Mann</em>). You need Genitiv for reading and formal writing at B1+, but at A2, focus your energy on Akkusativ and Dativ — that's 95% of daily communication.</p>

<h2>Practice strategy</h2>
<ol>
  <li>Master the masculine Akkusativ (der→den) first — it's the highest-frequency change.</li>
  <li>Chant the Dativ row until it's automatic.</li>
  <li>Drill two-way prepositions with movement/location pairs: <em>in die Küche / in der Küche</em>.</li>
</ol>
<p>Our <a href="/en/courses">practice courses</a> weave case drills into reading and writing exercises with instant AI feedback on your writing.</p>`,
  body_de: `<p>Die Fälle sind der Teil des Deutschen, der Lernende am meisten abschreckt — und der Teil, in dem ein einfaches Denkmodell am meisten hilft. Hier ist es: <strong>Fälle sind Job-Etiketten für Substantive.</strong> Sie sagen dir, welche Rolle ein Substantiv im Satz spielt: wer handelt, wen es trifft, wem es nützt.</p>

<h2>Die vier Jobs</h2>
<ul>
  <li><strong>Nominativ — der Handelnde.</strong> Wer handelt? <em>Der Mann liest.</em></li>
  <li><strong>Akkusativ — das direkte Ziel.</strong> Wen oder was trifft die Handlung? <em>Ich sehe den Mann.</em></li>
  <li><strong>Dativ — der Empfänger.</strong> Wem? <em>Ich gebe dem Mann das Buch.</em></li>
  <li><strong>Genitiv — der Besitzer.</strong> Wessen? <em>Das Auto des Mannes.</em></li>
</ul>

<h2>Die einzige Tabelle, die du auf A2 brauchst</h2>
<table>
  <thead><tr><th></th><th>mask.</th><th>fem.</th><th>neut.</th><th>Plural</th></tr></thead>
  <tbody>
    <tr><td><strong>Nominativ</strong></td><td>der</td><td>die</td><td>das</td><td>die</td></tr>
    <tr><td><strong>Akkusativ</strong></td><td><u>den</u></td><td>die</td><td>das</td><td>die</td></tr>
    <tr><td><strong>Dativ</strong></td><td><u>dem</u></td><td><u>der</u></td><td><u>dem</u></td><td><u>den</u> (+n)</td></tr>
    <tr><td><strong>Genitiv</strong></td><td>des (+s)</td><td>der</td><td>des (+s)</td><td>der</td></tr>
  </tbody>
</table>
<p>Beachte, wie wenig sich tatsächlich ändert: <strong>Der Akkusativ ändert nur das Maskulinum</strong> (der → den). Diese eine Tatsache nimmt die halbe Angst. Der Dativ ist die eigentliche Arbeit — lern die Zeile „dem, der, dem, den" wie einen Sprechgesang.</p>

<h2>Präpositionen entscheiden alles</h2>
<p>In der Praxis „wählst" du selten einen Fall — eine Präposition wählt ihn für dich:</p>
<ul>
  <li><strong>Immer Akkusativ:</strong> durch, für, gegen, ohne, um — <em>ein Geschenk für den Lehrer</em></li>
  <li><strong>Immer Dativ:</strong> aus, bei, mit, nach, seit, von, zu — <em>ich fahre mit dem Bus</em></li>
  <li><strong>Wechselpräpositionen:</strong> in, an, auf, über, unter, vor, hinter, neben, zwischen — <strong>Akkusativ bei Bewegung</strong> (Wohin? <em>Ich gehe in die Küche</em>), <strong>Dativ bei Ort</strong> (Wo? <em>Ich bin in der Küche</em>).</li>
</ul>
<p>Die Präpositionslisten als feste Merksprüche zu lernen („aus-bei-mit-nach-seit-von-zu") ist altmodisch — und es funktioniert.</p>

<h2>Und der Genitiv?</h2>
<p>Das gesprochene Deutsch ersetzt den Genitiv zunehmend durch „von + Dativ" (<em>das Auto von dem Mann</em>). Du brauchst den Genitiv fürs Lesen und formelle Schreiben ab B1 — aber auf A2 gehört deine Energie dem Akkusativ und Dativ. Das sind 95 % der Alltagskommunikation.</p>

<h2>Übungsstrategie</h2>
<ol>
  <li>Meistere zuerst den maskulinen Akkusativ (der→den) — die häufigste Änderung.</li>
  <li>Wiederhole die Dativ-Zeile, bis sie automatisch kommt.</li>
  <li>Übe Wechselpräpositionen mit Bewegungs-/Orts-Paaren: <em>in die Küche / in der Küche</em>.</li>
</ol>
<p>Unsere <a href="/de/courses">Übungskurse</a> verweben Fall-Übungen in Lese- und Schreibaufgaben — mit sofortigem KI-Feedback auf deine Texte.</p>`,
};
