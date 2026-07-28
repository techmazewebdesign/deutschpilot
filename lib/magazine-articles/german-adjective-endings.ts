import type { MagazineArticle } from "../magazine";

export const article: MagazineArticle = {
  slug: "german-adjective-endings",
  date: "2026-08-08",
  readingMinutes: 10,
  tags: ["Grammar", "B1", "B2"],
  title_en: "German Adjective Endings (Adjektivdeklination) Without the Panic",
  title_de: "Deutsche Adjektivendungen ohne Panik",
  description_en:
    "German adjective declension tables — weak, mixed, and strong endings — explained with a practical, memorizable approach instead of raw tables to memorize.",
  description_de:
    "Deutsche Adjektivdeklination — schwache, gemischte und starke Endungen — mit einem praktischen, merkbaren Ansatz statt reiner Auswendiglern-Tabellen erklärt.",
  body_en: `<p>Adjective endings have a reputation as the single most punishing part of German grammar, and the reputation is partly earned — there are technically three separate declension patterns, four cases, three genders, and a plural, which multiplies out to dozens of theoretical combinations. The good news: the endings aren't random, there are only <strong>five actual endings</strong> in play (-e, -en, -er, -es, -em), and one simple principle explains most of the pattern before you ever open a table.</p>

<h2>The one idea that unlocks the whole system</h2>
<p>German adjective endings exist to mark case, gender, and number exactly once per noun phrase — not redundantly on every word. If the article in front of the adjective already makes the case/gender/number obvious (like <em>der, die, das, den, dem</em>), the adjective can get away with a weak, minimal ending. If there's no article at all doing that job, the adjective itself has to carry the full information, so it gets a strong ending that mimics what the missing article would have shown. This single trade-off — "who's doing the signaling, the article or the adjective?" — is the logic behind all three tables below.</p>

<h2>Weak declension (after der/die/das, dieser, jeder, welcher...)</h2>
<p>The definite article already signals everything, so the adjective is "weak" — almost always <strong>-e</strong> or <strong>-en</strong>.</p>
<table>
  <thead><tr><th></th><th>Masc.</th><th>Fem.</th><th>Neut.</th><th>Plural</th></tr></thead>
  <tbody>
    <tr><td>Nominative</td><td>der gut<strong>e</strong> Mann</td><td>die gut<strong>e</strong> Frau</td><td>das gut<strong>e</strong> Kind</td><td>die gut<strong>en</strong> Leute</td></tr>
    <tr><td>Accusative</td><td>den gut<strong>en</strong> Mann</td><td>die gut<strong>e</strong> Frau</td><td>das gut<strong>e</strong> Kind</td><td>die gut<strong>en</strong> Leute</td></tr>
    <tr><td>Dative</td><td>dem gut<strong>en</strong> Mann</td><td>der gut<strong>en</strong> Frau</td><td>dem gut<strong>en</strong> Kind</td><td>den gut<strong>en</strong> Leuten</td></tr>
    <tr><td>Genitive</td><td>des gut<strong>en</strong> Mannes</td><td>der gut<strong>en</strong> Frau</td><td>des gut<strong>en</strong> Kindes</td><td>der gut<strong>en</strong> Leute</td></tr>
  </tbody>
</table>
<p>Notice: out of 16 slots, only four are <strong>-e</strong> (all nominative, plus feminine and neuter accusative) — everything else is <strong>-en</strong>. That's the whole weak table in one sentence: "-e in the four slots that are nominative-or-neutral, -en everywhere else."</p>

<h2>Mixed declension (after ein, kein, mein, dein, sein...)</h2>
<p>The indefinite article signals case in most slots, but — critically — <em>ein</em> itself has no ending in masculine nominative and neuter nominative/accusative, so the adjective has to step in and cover for it there. Everywhere else, it behaves exactly like the weak table.</p>
<table>
  <thead><tr><th></th><th>Masc.</th><th>Fem.</th><th>Neut.</th><th>Plural</th></tr></thead>
  <tbody>
    <tr><td>Nominative</td><td>ein gut<strong>er</strong> Mann</td><td>eine gut<strong>e</strong> Frau</td><td>ein gut<strong>es</strong> Kind</td><td>keine gut<strong>en</strong> Leute</td></tr>
    <tr><td>Accusative</td><td>einen gut<strong>en</strong> Mann</td><td>eine gut<strong>e</strong> Frau</td><td>ein gut<strong>es</strong> Kind</td><td>keine gut<strong>en</strong> Leute</td></tr>
    <tr><td>Dative</td><td>einem gut<strong>en</strong> Mann</td><td>einer gut<strong>en</strong> Frau</td><td>einem gut<strong>en</strong> Kind</td><td>keinen gut<strong>en</strong> Leuten</td></tr>
    <tr><td>Genitive</td><td>eines gut<strong>en</strong> Mannes</td><td>einer gut<strong>en</strong> Frau</td><td>eines gut<strong>en</strong> Kindes</td><td>keiner gut<strong>en</strong> Leute</td></tr>
  </tbody>
</table>
<p>Only three cells differ from the weak table: masculine nominative (<strong>-er</strong>) and neuter nominative/accusative (<strong>-es</strong>) — precisely the three slots where <em>ein</em> itself is ending-less and ambiguous. Everywhere <em>ein</em> already looks like <em>der/die/das</em> in shape, the adjective goes back to <strong>-en</strong>.</p>

<h2>Strong declension (no article at all)</h2>
<p>With no article present — after quantity words like <em>viel, wenig</em>, plain plural nouns, or numbers — the adjective is the only thing signaling case and gender, so it takes on endings that look almost exactly like the definite article's own endings.</p>
<table>
  <thead><tr><th></th><th>Masc.</th><th>Fem.</th><th>Neut.</th><th>Plural</th></tr></thead>
  <tbody>
    <tr><td>Nominative</td><td>gut<strong>er</strong> Kaffee</td><td>gut<strong>e</strong> Suppe</td><td>gut<strong>es</strong> Brot</td><td>gut<strong>e</strong> Ideen</td></tr>
    <tr><td>Accusative</td><td>gut<strong>en</strong> Kaffee</td><td>gut<strong>e</strong> Suppe</td><td>gut<strong>es</strong> Brot</td><td>gut<strong>e</strong> Ideen</td></tr>
    <tr><td>Dative</td><td>gut<strong>em</strong> Kaffee</td><td>gut<strong>er</strong> Suppe</td><td>gut<strong>em</strong> Brot</td><td>gut<strong>en</strong> Ideen</td></tr>
    <tr><td>Genitive</td><td>gut<strong>en</strong> Kaffees</td><td>gut<strong>er</strong> Suppe</td><td>gut<strong>en</strong> Brotes</td><td>gut<strong>er</strong> Ideen</td></tr>
  </tbody>
</table>
<p>Compare this row-by-row to <em>der, die, das, den, dem, des</em> and you'll see the adjective endings are nearly a direct copy of the article endings (with the genitive masculine/neuter softened to <strong>-en</strong> for pronunciation reasons). That's the shortcut: strong endings = "pretend the adjective is the missing article."</p>

<h2>A practical way to actually learn this</h2>
<ol>
  <li>Learn the weak table first — it's the smallest (only two endings total) and it's genuinely the most common pattern in daily speech, since <em>der/die/das</em>-type articles are everywhere.</li>
  <li>Learn the three mixed-table exceptions as a standalone fact: "masculine nominative -er, neuter nom/acc -es, everything else same as weak." Don't relearn the whole table — just the delta.</li>
  <li>For strong endings, don't memorize a fourth table — recognize it's just the definite article's endings transplanted onto the adjective. If you already know <em>der/die/das</em> declension cold, you already know 90% of strong adjective endings.</li>
  <li>Drill with real nouns you use daily (<em>Kaffee, Wetter, Auto, Freund</em>) rather than abstract tables — the ending becomes part of the phrase's rhythm, not a rule you consciously apply.</li>
</ol>

<h2>Common mistakes</h2>
<ul>
  <li>Applying strong endings after <em>ein/mein/dein</em> out of habit, forgetting that <em>ein</em> in most slots already signals the case (mixed declension, not strong).</li>
  <li>Using <strong>-e</strong> everywhere as a safe default — it's correct surprisingly often after <em>der/die/das</em>-type words, which reinforces the habit, but it fails immediately in the dative and genitive.</li>
  <li>Forgetting adjectives after <em>alle, beide, diese</em> (plural, definite-like) follow the weak plural pattern (<strong>-en</strong>), while adjectives after <em>viele, wenige, einige</em> (indefinite quantity) follow the strong plural pattern (<strong>-e</strong>/<strong>-er</strong>).</li>
</ul>

<p>Practice adjective endings inside full sentences, not isolated tables, in our <a href="/en/courses">B1 and B2 courses</a>, and test yourself with a <a href="/en/mock-exam">mock exam</a>.</p>`,
  body_de: `<p>Adjektivendungen gelten als der schmerzhafteste Teil der deutschen Grammatik, und der Ruf ist teilweise verdient — es gibt technisch drei getrennte Deklinationsmuster, vier Fälle, drei Genera und einen Plural, was sich zu Dutzenden theoretischen Kombinationen aufmultipliziert. Die gute Nachricht: Die Endungen sind nicht zufällig, es gibt nur <strong>fünf tatsächliche Endungen</strong> (-e, -en, -er, -es, -em), und ein einfaches Prinzip erklärt den größten Teil des Musters, bevor man überhaupt eine Tabelle aufschlägt.</p>

<h2>Die eine Idee, die das ganze System aufschließt</h2>
<p>Deutsche Adjektivendungen existieren, um Fall, Genus und Numerus genau einmal pro Nominalphrase zu markieren — nicht redundant an jedem Wort. Wenn der Artikel vor dem Adjektiv Fall/Genus/Numerus schon eindeutig zeigt (wie <em>der, die, das, den, dem</em>), kann das Adjektiv mit einer schwachen, minimalen Endung davonkommen. Gibt es gar keinen Artikel, der diese Arbeit übernimmt, muss das Adjektiv selbst die volle Information tragen und bekommt eine starke Endung, die nachahmt, was der fehlende Artikel gezeigt hätte. Dieser eine Kompromiss — "wer signalisiert, der Artikel oder das Adjektiv?" — ist die Logik hinter allen drei Tabellen unten.</p>

<h2>Schwache Deklination (nach der/die/das, dieser, jeder, welcher...)</h2>
<p>Der bestimmte Artikel signalisiert bereits alles, daher ist das Adjektiv "schwach" — fast immer <strong>-e</strong> oder <strong>-en</strong>.</p>
<table>
  <thead><tr><th></th><th>Mask.</th><th>Fem.</th><th>Neutr.</th><th>Plural</th></tr></thead>
  <tbody>
    <tr><td>Nominativ</td><td>der gut<strong>e</strong> Mann</td><td>die gut<strong>e</strong> Frau</td><td>das gut<strong>e</strong> Kind</td><td>die gut<strong>en</strong> Leute</td></tr>
    <tr><td>Akkusativ</td><td>den gut<strong>en</strong> Mann</td><td>die gut<strong>e</strong> Frau</td><td>das gut<strong>e</strong> Kind</td><td>die gut<strong>en</strong> Leute</td></tr>
    <tr><td>Dativ</td><td>dem gut<strong>en</strong> Mann</td><td>der gut<strong>en</strong> Frau</td><td>dem gut<strong>en</strong> Kind</td><td>den gut<strong>en</strong> Leuten</td></tr>
    <tr><td>Genitiv</td><td>des gut<strong>en</strong> Mannes</td><td>der gut<strong>en</strong> Frau</td><td>des gut<strong>en</strong> Kindes</td><td>der gut<strong>en</strong> Leute</td></tr>
  </tbody>
</table>
<p>Von 16 Feldern sind nur vier <strong>-e</strong> (alle Nominativ, plus feminin und neutral Akkusativ) — alles andere ist <strong>-en</strong>. Das ist die ganze schwache Tabelle in einem Satz: "-e in den vier nominativ-oder-neutralen Feldern, -en überall sonst."</p>

<h2>Gemischte Deklination (nach ein, kein, mein, dein, sein...)</h2>
<p>Der unbestimmte Artikel signalisiert den Fall in den meisten Feldern, aber — entscheidend — <em>ein</em> selbst hat keine Endung im Maskulinum Nominativ und im Neutrum Nominativ/Akkusativ, sodass das Adjektiv dort einspringen muss. Überall sonst verhält es sich genau wie in der schwachen Tabelle.</p>
<table>
  <thead><tr><th></th><th>Mask.</th><th>Fem.</th><th>Neutr.</th><th>Plural</th></tr></thead>
  <tbody>
    <tr><td>Nominativ</td><td>ein gut<strong>er</strong> Mann</td><td>eine gut<strong>e</strong> Frau</td><td>ein gut<strong>es</strong> Kind</td><td>keine gut<strong>en</strong> Leute</td></tr>
    <tr><td>Akkusativ</td><td>einen gut<strong>en</strong> Mann</td><td>eine gut<strong>e</strong> Frau</td><td>ein gut<strong>es</strong> Kind</td><td>keine gut<strong>en</strong> Leute</td></tr>
    <tr><td>Dativ</td><td>einem gut<strong>en</strong> Mann</td><td>einer gut<strong>en</strong> Frau</td><td>einem gut<strong>en</strong> Kind</td><td>keinen gut<strong>en</strong> Leuten</td></tr>
    <tr><td>Genitiv</td><td>eines gut<strong>en</strong> Mannes</td><td>einer gut<strong>en</strong> Frau</td><td>eines gut<strong>en</strong> Kindes</td><td>keiner gut<strong>en</strong> Leute</td></tr>
  </tbody>
</table>
<p>Nur drei Zellen unterscheiden sich von der schwachen Tabelle: Maskulinum Nominativ (<strong>-er</strong>) und Neutrum Nominativ/Akkusativ (<strong>-es</strong>) — genau die drei Felder, in denen <em>ein</em> selbst endungslos und mehrdeutig ist. Überall, wo <em>ein</em> schon wie <em>der/die/das</em> aussieht, geht das Adjektiv zurück zu <strong>-en</strong>.</p>

<h2>Starke Deklination (ohne Artikel)</h2>
<p>Ohne Artikel — nach Mengenwörtern wie <em>viel, wenig</em>, bloßen Pluralnomen oder Zahlen — ist das Adjektiv das Einzige, das Fall und Genus signalisiert, und bekommt daher Endungen, die fast genau wie die Endungen des bestimmten Artikels aussehen.</p>
<table>
  <thead><tr><th></th><th>Mask.</th><th>Fem.</th><th>Neutr.</th><th>Plural</th></tr></thead>
  <tbody>
    <tr><td>Nominativ</td><td>gut<strong>er</strong> Kaffee</td><td>gut<strong>e</strong> Suppe</td><td>gut<strong>es</strong> Brot</td><td>gut<strong>e</strong> Ideen</td></tr>
    <tr><td>Akkusativ</td><td>gut<strong>en</strong> Kaffee</td><td>gut<strong>e</strong> Suppe</td><td>gut<strong>es</strong> Brot</td><td>gut<strong>e</strong> Ideen</td></tr>
    <tr><td>Dativ</td><td>gut<strong>em</strong> Kaffee</td><td>gut<strong>er</strong> Suppe</td><td>gut<strong>em</strong> Brot</td><td>gut<strong>en</strong> Ideen</td></tr>
    <tr><td>Genitiv</td><td>gut<strong>en</strong> Kaffees</td><td>gut<strong>er</strong> Suppe</td><td>gut<strong>en</strong> Brotes</td><td>gut<strong>er</strong> Ideen</td></tr>
  </tbody>
</table>
<p>Vergleiche das Zeile für Zeile mit <em>der, die, das, den, dem, des</em> und du siehst: Die Adjektivendungen sind fast eine direkte Kopie der Artikelendungen (der Genitiv Maskulinum/Neutrum ist aus Aussprachegründen zu <strong>-en</strong> abgeschwächt). Das ist die Abkürzung: starke Endungen = "tu so, als wäre das Adjektiv der fehlende Artikel."</p>

<h2>Ein praktischer Lernweg</h2>
<ol>
  <li>Lerne zuerst die schwache Tabelle — sie ist am kleinsten (nur zwei Endungen insgesamt) und tatsächlich das häufigste Muster im Alltag, da <em>der/die/das</em>-Artikel überall vorkommen.</li>
  <li>Lerne die drei Ausnahmen der gemischten Tabelle als eigenständige Tatsache: "Maskulinum Nominativ -er, Neutrum Nom/Akk -es, alles andere wie schwach." Nicht die ganze Tabelle neu lernen — nur die Differenz.</li>
  <li>Für starke Endungen keine vierte Tabelle auswendig lernen — erkenne, dass es nur die Endungen des bestimmten Artikels sind, aufs Adjektiv verpflanzt. Kennst du die der/die/das-Deklination sicher, kennst du bereits 90 % der starken Adjektivendungen.</li>
  <li>Übe mit echten, alltäglichen Nomen (<em>Kaffee, Wetter, Auto, Freund</em>) statt mit abstrakten Tabellen — die Endung wird Teil des Sprachrhythmus, keine bewusst angewendete Regel.</li>
</ol>

<h2>Häufige Fehler</h2>
<ul>
  <li>Aus Gewohnheit starke Endungen nach <em>ein/mein/dein</em> anwenden und vergessen, dass <em>ein</em> in den meisten Feldern den Fall bereits signalisiert (gemischte, nicht starke Deklination).</li>
  <li>Überall <strong>-e</strong> als sicheren Standard verwenden — das ist nach <em>der/die/das</em>-Wörtern überraschend oft richtig, was die Gewohnheit verstärkt, scheitert aber sofort im Dativ und Genitiv.</li>
  <li>Vergessen, dass Adjektive nach <em>alle, beide, diese</em> (Plural, artikelartig) dem schwachen Pluralmuster (<strong>-en</strong>) folgen, während Adjektive nach <em>viele, wenige, einige</em> (unbestimmte Menge) dem starken Pluralmuster (<strong>-e</strong>/<strong>-er</strong>) folgen.</li>
</ul>

<p>Übe Adjektivendungen in ganzen Sätzen, nicht in isolierten Tabellen, in unseren <a href="/de/courses">B1- und B2-Kursen</a>, und teste dich selbst mit einer <a href="/de/mock-exam">Probeprüfung</a>.</p>`,
};
