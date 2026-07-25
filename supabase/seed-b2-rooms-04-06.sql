-- ============================================================
-- DeutschPilot – B2 Rooms 04–06 (Kultur, Wirtschaft, Sprache)
-- Same pattern as seed-b2-rooms-01-03.sql. Additive only,
-- ON CONFLICT DO NOTHING.
-- ============================================================

-- ── COURSES ─────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES
  ('b2000000-0000-0000-0000-000000000004','arts-culture-b2',
   'B2 Room 04 – Kunst & Kultur',
   'Write reviews, use participle attributes, and talk about films, books, and exhibitions with nuance.',
   'B2','de',TRUE,NOW()),
  ('b2000000-0000-0000-0000-000000000005','economy-consumption-b2',
   'B2 Room 05 – Wirtschaft & Konsum',
   'Understand economic language, master two-part connectors, and argue about consumption critically.',
   'B2','de',TRUE,NOW()),
  ('b2000000-0000-0000-0000-000000000006','language-identity-b2',
   'B2 Room 06 – Sprache & Identität',
   'Idioms Germans actually use, register switching, and talking about multilingual identity.',
   'B2','de',TRUE,NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 04 – Kunst & Kultur
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b2000000-0000-0000-0004-000000000001','b2000000-0000-0000-0000-000000000004',
   'b2-rezension-schreiben','Die Rezension: bewerten mit Stil',
   '<h2>Die Rezension: bewerten mit Stil</h2>
<h3>1. Der Aufbau einer Rezension</h3>
<ol>
<li><strong>Einstieg mit Haken:</strong> eine These, eine Frage oder eine Szene — nie "In diesem Text geht es um".</li>
<li><strong>Kurzinfo:</strong> Titel, Autor/Regisseurin, Genre, Erscheinungsjahr — in zwei Sätzen.</li>
<li><strong>Inhalt ohne Spoiler:</strong> die Ausgangslage, nicht die Auflösung.</li>
<li><strong>Bewertung mit Begründung:</strong> das Herzstück — jede Wertung braucht ein Warum.</li>
<li><strong>Fazit + Empfehlung:</strong> Für wen lohnt es sich?</li>
</ol>
<h3>2. Bewertungs-Vokabular jenseits von "gut/schlecht"</h3>
<ul>
<li>Positiv: <strong>überzeugend, mitreißend, vielschichtig, gelungen, eindrucksvoll</strong></li>
<li>Negativ: <strong>vorhersehbar, langatmig, oberflächlich, konstruiert, enttäuschend</strong></li>
<li>Differenziert: <em>Zwar überzeugt die Hauptfigur, doch die Nebenhandlung wirkt konstruiert.</em></li>
</ul>
<h3>3. Nützliche Rezensions-Formeln</h3>
<ul>
<li><em>Der Film <strong>besticht durch</strong> seine Bildsprache.</em></li>
<li><em>Dem Roman <strong>gelingt es</strong>, ... / Der Autorin <strong>gelingt</strong> das Kunststück, ...</em></li>
<li><em>Weniger überzeugend <strong>fällt</strong> das Ende <strong>aus</strong>.</em></li>
<li><em><strong>Sehenswert ist</strong> der Film <strong>allemal</strong> — vor allem für ...</em></li>
</ul>',
   1,NOW()),
  ('b2000000-0000-0000-0004-000000000002','b2000000-0000-0000-0000-000000000004',
   'b2-partizipialattribute','Partizipialattribute: der eleganteste Trick',
   '<h2>Partizipialattribute: der eleganteste Trick der Schriftsprache</h2>
<h3>1. Was das ist</h3>
<p>Ein Relativsatz, komprimiert vor das Nomen:</p>
<ul>
<li><em>der Film, der gerade läuft</em> → <em>der <strong>gerade laufende</strong> Film</em></li>
<li><em>das Buch, das 2020 veröffentlicht wurde</em> → <em>das <strong>2020 veröffentlichte</strong> Buch</em></li>
</ul>
<h3>2. Partizip I vs. Partizip II</h3>
<table>
<thead><tr><th></th><th>Bildung</th><th>Bedeutung</th><th>Beispiel</th></tr></thead>
<tbody>
<tr><td><strong>Partizip I</strong></td><td>Infinitiv + d</td><td>aktiv, gleichzeitig</td><td>die <strong>lachenden</strong> Kinder (= die lachen)</td></tr>
<tr><td><strong>Partizip II</strong></td><td>ge...t / ge...en</td><td>passiv/abgeschlossen</td><td>die <strong>gelesenen</strong> Bücher (= die gelesen wurden)</td></tr>
</tbody>
</table>
<h3>3. Entpacken beim Lesen — die B2-Lesetechnik</h3>
<p>Feuilleton-Sätze wie <em>"die von der Kritik gefeierte, in Venedig ausgezeichnete Regisseurin"</em> entpackst du rückwärts: Regisseurin → wurde in Venedig ausgezeichnet → wurde von der Kritik gefeiert. Artikel und Nomen suchen, alles dazwischen ist Beschreibung.</p>',
   2,NOW()),
  ('b2000000-0000-0000-0004-000000000003','b2000000-0000-0000-0000-000000000004',
   'b2-kulturszene','Die deutsche Kulturszene',
   '<h2>Die deutsche Kulturszene — Orientierung</h2>
<h3>1. Institutionen & Ereignisse</h3>
<ul>
<li><strong>die Berlinale</strong> – eines der drei großen Filmfestivals Europas (Februar, Berlin)</li>
<li><strong>die Frankfurter Buchmesse</strong> – größte Buchmesse der Welt (Oktober)</li>
<li><strong>das Stadttheater</strong> – fast jede Stadt leistet sich eins, stark subventioniert</li>
<li><strong>die Kleinkunst</strong> – Kabarett, Comedy, Poetry Slam</li>
</ul>
<h3>2. Praktisch: Kultur günstig erleben</h3>
<ul>
<li><strong>Theatertag / Kinotag</strong> – vergünstigte Tickets an festen Wochentagen (oft Montag/Dienstag)</li>
<li><strong>Museumssonntag</strong> – in mehreren Städten monatlich freier Eintritt</li>
<li><strong>Abendkasse & Restkarten</strong> – kurz vor Beginn oft stark reduziert</li>
</ul>
<h3>3. Über Kultur sprechen</h3>
<ul>
<li><em>Ich habe mir ... angesehen/angehört.</em> (reflexiv + Dativ!)</li>
<li><em>Was hältst du von ...? — Ich fand es <strong>gelungen / eher enttäuschend</strong>.</em></li>
<li><em>Es hat mich <strong>zum Nachdenken gebracht</strong> / <strong>kaltgelassen</strong>.</em></li>
</ul>',
   3,NOW()),
  ('b2000000-0000-0000-0004-000000000099','b2000000-0000-0000-0000-000000000004',
   'b2-room04-quiz','Checkpoint: Kunst & Kultur',
   '<h2>Checkpoint Quiz</h2><p>Rezensionen, Partizipialattribute und Kulturszene — der Feuilleton-Check!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b2000000-0000-0004-0001-000000000001','b2000000-0000-0000-0004-000000000001',
   'Das Herzstück jeder Rezension ist:','multiple_choice',
   '["Bewertung mit Begründung", "Die komplette Nacherzählung", "Das Erscheinungsjahr", "Die Länge"]'::jsonb,
   'Bewertung mit Begründung',
   'Jede Wertung braucht ein Warum — sonst ist es nur Meinung.',NOW()),
  ('b2000000-0000-0004-0001-000000000002','b2000000-0000-0000-0004-000000000001',
   'Differenzierte Kritik klingt so:','multiple_choice',
   '["Zwar überzeugt die Hauptfigur, doch die Nebenhandlung wirkt konstruiert.", "Alles super!", "Totaler Mist.", "War okay."]'::jsonb,
   'Zwar überzeugt die Hauptfigur, doch die Nebenhandlung wirkt konstruiert.',
   'Stärken UND Schwächen benennen = B2-Niveau.',NOW()),
  ('b2000000-0000-0004-0001-000000000003','b2000000-0000-0000-0004-000000000001',
   '"Der Film besticht ___ seine Bildsprache."','multiple_choice',
   '["durch", "mit", "von", "über"]'::jsonb,'durch',
   'bestechen durch = besonders überzeugen mit.',NOW()),

  ('b2000000-0000-0004-0002-000000000001','b2000000-0000-0000-0004-000000000002',
   '"Der Film, der gerade läuft" als Partizipialattribut:','multiple_choice',
   '["der gerade laufende Film", "der gerade gelaufene Film", "der gerade zu laufende Film", "der läuft gerade Film"]'::jsonb,
   'der gerade laufende Film',
   'Aktiv + gleichzeitig → Partizip I: laufend.',NOW()),
  ('b2000000-0000-0004-0002-000000000002','b2000000-0000-0000-0004-000000000002',
   '"Das 2020 veröffentlichte Buch" bedeutet:','multiple_choice',
   '["Das Buch, das 2020 veröffentlicht wurde", "Das Buch, das 2020 veröffentlicht", "Das Buch veröffentlicht 2020", "Das Buch, das veröffentlichen wird"]'::jsonb,
   'Das Buch, das 2020 veröffentlicht wurde',
   'Partizip II = passiv/abgeschlossen.',NOW()),
  ('b2000000-0000-0004-0002-000000000003','b2000000-0000-0000-0004-000000000002',
   '"Die lachenden Kinder" sind Kinder, die:','multiple_choice',
   '["gerade lachen", "ausgelacht wurden", "lachen werden", "nie lachen"]'::jsonb,
   'gerade lachen',
   'Partizip I = aktive, gleichzeitige Handlung.',NOW()),

  ('b2000000-0000-0004-0003-000000000001','b2000000-0000-0000-0004-000000000003',
   'Die größte Buchmesse der Welt findet statt in:','multiple_choice',
   '["Frankfurt", "Berlin", "München", "Leipzig ausschließlich"]'::jsonb,
   'Frankfurt',
   'Frankfurter Buchmesse im Oktober; Leipzig hat die zweite große im Frühjahr.',NOW()),
  ('b2000000-0000-0004-0003-000000000002','b2000000-0000-0000-0004-000000000003',
   '"Ich habe ___ den Film angesehen."','multiple_choice',
   '["mir", "mich", "sich", "ihm"]'::jsonb,'mir',
   'sich (Dativ) etwas ansehen: Ich habe mir den Film angesehen.',NOW()),

  ('b2000000-0000-0004-0099-000000000001','b2000000-0000-0000-0004-000000000099',
   '"Es hat mich kaltgelassen" bedeutet:','multiple_choice',
   '["Es hat mich emotional nicht berührt", "Ich habe gefroren", "Es war spannend", "Ich war begeistert"]'::jsonb,
   'Es hat mich emotional nicht berührt',
   'kaltlassen = keine Wirkung haben.',NOW()),
  ('b2000000-0000-0004-0099-000000000002','b2000000-0000-0000-0004-000000000099',
   'Entpacke: "die von der Kritik gefeierte Regisseurin"','multiple_choice',
   '["Die Regisseurin, die von der Kritik gefeiert wurde", "Die Kritik, die die Regisseurin feiert", "Die Regisseurin feiert die Kritik", "Die gefeierte Kritik"]'::jsonb,
   'Die Regisseurin, die von der Kritik gefeiert wurde',
   'Artikel + Nomen suchen, Mitte als Relativsatz entpacken.',NOW()),
  ('b2000000-0000-0004-0099-000000000003','b2000000-0000-0000-0004-000000000099',
   'Günstig ins Theater kommst du:','multiple_choice',
   '["Am Theatertag oder mit Restkarten", "Nur mit Abo", "Gar nicht", "Nur im Sommer"]'::jsonb,
   'Am Theatertag oder mit Restkarten',
   'Feste vergünstigte Tage + Abendkasse kurz vor Beginn.',NOW()),
  ('b2000000-0000-0004-0099-000000000004','b2000000-0000-0000-0004-000000000099',
   '"Vorhersehbar" ist ein ___ Bewertungswort.','multiple_choice',
   '["negatives", "positives", "neutrales", "veraltetes"]'::jsonb,
   'negatives',
   'Vorhersehbar = man ahnt alles vorher — Kritikpunkt.',NOW()),
  ('b2000000-0000-0004-0099-000000000005','b2000000-0000-0000-0004-000000000099',
   '"Weniger überzeugend ___ das Ende ___."','multiple_choice',
   '["fällt ... aus", "geht ... aus", "kommt ... an", "sieht ... aus"]'::jsonb,
   'fällt ... aus',
   'ausfallen = (in einer Qualität) geraten: Das Ende fällt schwächer aus.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 05 – Wirtschaft & Konsum
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b2000000-0000-0000-0005-000000000001','b2000000-0000-0000-0000-000000000005',
   'b2-wirtschaft-wortschatz','Wirtschaftsdeutsch entschlüsseln',
   '<h2>Wirtschaftsdeutsch entschlüsseln</h2>
<h3>1. Der Grundwortschatz</h3>
<ul>
<li><strong>der Umsatz</strong> – alle Einnahmen | <strong>der Gewinn</strong> – was übrig bleibt | <strong>der Verlust</strong> – das Minus</li>
<li><strong>die Nachfrage ↔ das Angebot</strong> – demand & supply</li>
<li><strong>die Inflation</strong> – Preise steigen, Geld verliert Wert</li>
<li><strong>der Aufschwung ↔ die Rezession</strong> – Wachstum ↔ Schrumpfung</li>
<li><strong>die Branche</strong> – der Wirtschaftszweig (die Autobranche, die IT-Branche)</li>
</ul>
<h3>2. Zahlen kommentieren wie der Wirtschaftsteil</h3>
<ul>
<li><em>Der Umsatz <strong>stieg um</strong> 5 Prozent <strong>auf</strong> 2 Millionen Euro.</em> (um = Differenz, auf = Endwert!)</li>
<li><em>Die Nachfrage <strong>ging</strong> leicht <strong>zurück</strong>.</em></li>
<li><em>Die Preise <strong>haben sich</strong> binnen eines Jahres <strong>verdoppelt</strong>.</em></li>
</ul>
<h3>3. Die Mini-Logik der Marktwirtschaft</h3>
<p>Steigt die Nachfrage bei gleichem Angebot, steigen die Preise — und umgekehrt. Wer diese eine Mechanik kennt, versteht 80 % aller Wirtschaftsmeldungen: vom Wohnungsmarkt bis zum Strompreis.</p>',
   1,NOW()),
  ('b2000000-0000-0000-0005-000000000002','b2000000-0000-0000-0000-000000000005',
   'b2-zweiteilige-konnektoren','Zweiteilige Konnektoren',
   '<h2>Zweiteilige Konnektoren</h2>
<h3>1. Das Set, das B2-Texte zusammenhält</h3>
<table>
<thead><tr><th>Konnektor</th><th>Bedeutung</th><th>Beispiel</th></tr></thead>
<tbody>
<tr><td><strong>sowohl ... als auch</strong></td><td>beides</td><td>sowohl der Preis als auch die Qualität</td></tr>
<tr><td><strong>entweder ... oder</strong></td><td>eins von beiden</td><td>entweder sparen oder investieren</td></tr>
<tr><td><strong>weder ... noch</strong></td><td>keins von beiden</td><td>weder billig noch gut</td></tr>
<tr><td><strong>zwar ... aber</strong></td><td>Einräumung</td><td>zwar teuer, aber langlebig</td></tr>
<tr><td><strong>je ... desto</strong></td><td>Proportion</td><td>je knapper, desto teurer</td></tr>
<tr><td><strong>einerseits ... andererseits</strong></td><td>zwei Seiten</td><td>einerseits praktisch, andererseits riskant</td></tr>
</tbody>
</table>
<h3>2. Die Grammatik-Falle bei je ... desto</h3>
<p><em><strong>Je</strong> knapper das Angebot <strong>ist</strong> (Verb ans Ende!), <strong>desto</strong> höher <strong>steigen</strong> die Preise (Verb direkt nach dem Komparativ).</em></p>
<h3>3. Verhandlungs- und Konsum-Kontexte</h3>
<ul>
<li><em>Wir können <strong>entweder</strong> die Lieferzeit verkürzen <strong>oder</strong> den Preis senken — beides geht nicht.</em></li>
<li><em>Das Produkt ist <strong>weder</strong> nachhaltig <strong>noch</strong> fair produziert.</em></li>
<li><em><strong>Je</strong> mehr Bewertungen ein Produkt hat, <strong>desto</strong> mehr vertrauen ihm Käufer.</em></li>
</ul>',
   2,NOW()),
  ('b2000000-0000-0000-0005-000000000003','b2000000-0000-0000-0000-000000000005',
   'b2-konsum-debatte','Konsumkritik: die große Debatte',
   '<h2>Konsumkritik: die große Debatte</h2>
<h3>1. Die Begriffe der Debatte</h3>
<ul>
<li><strong>die Nachhaltigkeit</strong> – nicht auf Kosten der Zukunft leben</li>
<li><strong>die Wegwerfgesellschaft</strong> – kaufen, benutzen, wegwerfen</li>
<li><strong>die geplante Obsoleszenz</strong> – Produkte, die absichtlich früh kaputtgehen (umstritten!)</li>
<li><strong>der bewusste Konsum</strong> – weniger, dafür besser kaufen</li>
<li><strong>das Greenwashing</strong> – grünes Image ohne grüne Substanz</li>
</ul>
<h3>2. Beide Seiten fair aufbauen</h3>
<p><strong>Pro Konsumkritik:</strong> <em>Befürworter bewussten Konsums argumentieren, dass jede Kaufentscheidung eine Stimme für eine Produktionsweise sei.</em><br>
<strong>Contra:</strong> <em>Kritiker wenden ein, dass individuelle Konsumentscheidungen strukturelle Probleme nicht lösen könnten und günstige Produkte für viele schlicht notwendig seien.</em></p>
<h3>3. Formulierungen für die eigene Position</h3>
<ul>
<li><em>Ich neige zu der Ansicht, dass ...</em></li>
<li><em>Entscheidend scheint mir, dass ...</em></li>
<li><em>Man muss allerdings unterscheiden zwischen ... und ...</em></li>
<li><em>Ein Mittelweg könnte darin bestehen, ... zu ...</em></li>
</ul>',
   3,NOW()),
  ('b2000000-0000-0000-0005-000000000099','b2000000-0000-0000-0000-000000000005',
   'b2-room05-quiz','Checkpoint: Wirtschaft & Konsum',
   '<h2>Checkpoint Quiz</h2><p>Wirtschaftsvokabular, zweiteilige Konnektoren und Konsumdebatte!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b2000000-0000-0005-0001-000000000001','b2000000-0000-0000-0005-000000000001',
   'Der Unterschied zwischen Umsatz und Gewinn:','multiple_choice',
   '["Umsatz = alle Einnahmen, Gewinn = was übrig bleibt", "Beides ist dasselbe", "Gewinn = alle Einnahmen", "Umsatz = das Minus"]'::jsonb,
   'Umsatz = alle Einnahmen, Gewinn = was übrig bleibt',
   'Umsatz minus Kosten = Gewinn (oder Verlust).',NOW()),
  ('b2000000-0000-0005-0001-000000000002','b2000000-0000-0000-0005-000000000001',
   '"Der Umsatz stieg ___ 5 Prozent ___ 2 Millionen Euro."','multiple_choice',
   '["um ... auf", "auf ... um", "mit ... zu", "von ... um"]'::jsonb,
   'um ... auf',
   'um = die Differenz, auf = der Endwert.',NOW()),
  ('b2000000-0000-0005-0001-000000000003','b2000000-0000-0000-0005-000000000001',
   'Steigt die Nachfrage bei gleichem Angebot, dann:','multiple_choice',
   '["Steigen die Preise", "Sinken die Preise", "Bleiben Preise immer gleich", "Sinkt der Umsatz automatisch"]'::jsonb,
   'Steigen die Preise',
   'Die Grundmechanik von Angebot und Nachfrage.',NOW()),

  ('b2000000-0000-0005-0002-000000000001','b2000000-0000-0000-0005-000000000002',
   '"___ billig ___ gut" (keins von beiden):','multiple_choice',
   '["weder ... noch", "sowohl ... als auch", "entweder ... oder", "zwar ... aber"]'::jsonb,
   'weder ... noch',
   'weder...noch = doppelte Verneinung.',NOW()),
  ('b2000000-0000-0005-0002-000000000002','b2000000-0000-0000-0005-000000000002',
   '"Je knapper das Angebot ist, desto höher ___ die Preise."','multiple_choice',
   '["steigen", "die Preise steigen", "gestiegen", "zu steigen"]'::jsonb,
   'steigen',
   'Nach desto + Komparativ folgt sofort das Verb.',NOW()),
  ('b2000000-0000-0005-0002-000000000003','b2000000-0000-0000-0005-000000000002',
   '"Zwar teuer, ___ langlebig."','multiple_choice',
   '["aber", "oder", "noch", "desto"]'::jsonb,'aber',
   'zwar ... aber = Einräumung mit Wendung.',NOW()),

  ('b2000000-0000-0005-0003-000000000001','b2000000-0000-0000-0005-000000000003',
   '"Greenwashing" bedeutet:','multiple_choice',
   '["Grünes Image ohne grüne Substanz", "Umweltfreundliche Produktion", "Kleidung waschen", "Recycling"]'::jsonb,
   'Grünes Image ohne grüne Substanz',
   'Marketing-Öko statt echtem Öko.',NOW()),
  ('b2000000-0000-0005-0003-000000000002','b2000000-0000-0000-0005-000000000003',
   '"Ich neige zu der Ansicht, dass..." drückt aus:','multiple_choice',
   '["Eine vorsichtig formulierte Position", "Absolute Sicherheit", "Ablehnung", "Eine Frage"]'::jsonb,
   'Eine vorsichtig formulierte Position',
   'Differenzierte Meinungssprache auf B2-Niveau.',NOW()),

  ('b2000000-0000-0005-0099-000000000001','b2000000-0000-0000-0005-000000000099',
   'Die "Wegwerfgesellschaft" beschreibt:','multiple_choice',
   '["Kaufen, kurz benutzen, wegwerfen", "Mülltrennung", "Second-Hand-Kultur", "Reparaturcafés"]'::jsonb,
   'Kaufen, kurz benutzen, wegwerfen',
   'Der kritische Begriff für kurzlebigen Konsum.',NOW()),
  ('b2000000-0000-0005-0099-000000000002','b2000000-0000-0000-0005-000000000099',
   '"Aufschwung" ist das Gegenteil von:','multiple_choice',
   '["Rezession", "Inflation", "Umsatz", "Angebot"]'::jsonb,
   'Rezession',
   'Aufschwung = Wachstum; Rezession = Schrumpfung.',NOW()),
  ('b2000000-0000-0005-0099-000000000003','b2000000-0000-0000-0005-000000000099',
   '"Wir können entweder liefern ___ den Preis senken."','multiple_choice',
   '["oder", "noch", "als auch", "desto"]'::jsonb,'oder',
   'entweder ... oder = genau eine der Optionen.',NOW()),
  ('b2000000-0000-0005-0099-000000000004','b2000000-0000-0000-0005-000000000099',
   '"Ein Mittelweg könnte darin bestehen, weniger, aber besser ___ kaufen."','multiple_choice',
   '["zu", "für", "um", "als"]'::jsonb,'zu',
   'bestehen darin, ... zu + Infinitiv.',NOW()),
  ('b2000000-0000-0005-0099-000000000005','b2000000-0000-0000-0005-000000000099',
   '"Die Branche" bedeutet:','multiple_choice',
   '["Der Wirtschaftszweig", "Die Bank", "Der Gewinn", "Die Steuer"]'::jsonb,
   'Der Wirtschaftszweig',
   'Die Autobranche, die IT-Branche, die Baubranche.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 06 – Sprache & Identität
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b2000000-0000-0000-0006-000000000001','b2000000-0000-0000-0000-000000000006',
   'b2-redewendungen','Redewendungen, die Deutsche wirklich benutzen',
   '<h2>Redewendungen, die Deutsche wirklich benutzen</h2>
<h3>1. Die Alltags-Top-10</h3>
<ul>
<li><strong>Das ist mir Wurst.</strong> – Das ist mir egal.</li>
<li><strong>Ich verstehe nur Bahnhof.</strong> – Ich verstehe gar nichts.</li>
<li><strong>Die Daumen drücken.</strong> – Glück wünschen.</li>
<li><strong>Auf dem Holzweg sein.</strong> – sich irren.</li>
<li><strong>Etwas auf die lange Bank schieben.</strong> – aufschieben.</li>
<li><strong>Zwei Fliegen mit einer Klappe schlagen.</strong> – zwei Ziele auf einmal.</li>
<li><strong>Jemandem die Daumenschrauben anziehen</strong> – Druck machen (eher Medien).</li>
<li><strong>Das Kind ist in den Brunnen gefallen.</strong> – Das Unglück ist schon passiert.</li>
<li><strong>Da liegt der Hund begraben.</strong> – Das ist der eigentliche Kern des Problems.</li>
<li><strong>Ins kalte Wasser springen.</strong> – etwas ohne Vorbereitung wagen.</li>
</ul>
<h3>2. Dosierung ist alles</h3>
<p>Eine Redewendung pro Gespräch wirkt souverän; fünf wirken wie ein Sprachlehrbuch von 1985. Und: Redewendungen nie wörtlich übersetzen — "Das ist mir Sausage" hat schon viele Meetings erheitert.</p>
<h3>3. Verstehen vs. verwenden</h3>
<p>Fürs B2-Niveau gilt: alle verstehen, die sichersten selbst benutzen (Daumen drücken, ins kalte Wasser springen, zwei Fliegen mit einer Klappe). Bei Unsicherheit: einfach sagen, was man meint.</p>',
   1,NOW()),
  ('b2000000-0000-0000-0006-000000000002','b2000000-0000-0000-0000-000000000006',
   'b2-register','Register: formell, neutral, locker',
   '<h2>Register: formell, neutral, locker</h2>
<h3>1. Dasselbe, dreimal anders</h3>
<table>
<thead><tr><th>Locker</th><th>Neutral</th><th>Formell</th></tr></thead>
<tbody>
<tr><td>Kriegst du hin?</td><td>Schaffst du das?</td><td>Wäre das für Sie machbar?</td></tr>
<tr><td>Keine Ahnung.</td><td>Das weiß ich nicht.</td><td>Dazu liegen mir keine Informationen vor.</td></tr>
<tr><td>Mega gut!</td><td>Sehr gut.</td><td>Außerordentlich gelungen.</td></tr>
<tr><td>Bock auf Kino?</td><td>Hast du Lust auf Kino?</td><td>Hätten Sie Interesse an einem Kinobesuch?</td></tr>
</tbody>
</table>
<h3>2. Die Signalwörter der Register</h3>
<ul>
<li><strong>Locker:</strong> krass, mega, echt, halt, quasi, Partikeln überall</li>
<li><strong>Formell:</strong> Nominalstil, Konjunktiv II, "bezüglich", "diesbezüglich", Passiv</li>
<li><strong>Gefahrenzone:</strong> lockere Wörter in formellen Mails ("Hi Herr Dr. Weber, mega Angebot!")</li>
</ul>
<h3>3. Umschalten trainieren</h3>
<p>Die B2-Kompetenz ist nicht ein Register zu können, sondern zu <strong>wechseln</strong>: dieselbe Bitte einmal an den Professor, einmal an die WG formulieren. Wer das übt, klingt nie wieder unfreiwillig komisch.</p>',
   2,NOW()),
  ('b2000000-0000-0000-0006-000000000003','b2000000-0000-0000-0000-000000000006',
   'b2-mehrsprachigkeit','Mehrsprachigkeit & Identität',
   '<h2>Mehrsprachigkeit & Identität</h2>
<h3>1. Über die eigene Sprachbiografie sprechen</h3>
<ul>
<li><em>Meine <strong>Muttersprache</strong> ist ... / Ich bin <strong>zweisprachig aufgewachsen</strong>.</em></li>
<li><em>Deutsch ist meine <strong>Zweitsprache</strong> / <strong>Drittsprache</strong>.</em></li>
<li><em>Ich <strong>wechsle zwischen den Sprachen</strong>, je nachdem, mit wem ich spreche.</em> (Code-Switching)</li>
<li><em>Auf Deutsch <strong>fühle ich mich</strong> manchmal <strong>wie eine andere Person</strong>.</em> — ein Gefühl, das fast alle Mehrsprachigen kennen</li>
</ul>
<h3>2. Der Akzent — Umarmung statt Kampf</h3>
<p>Ein Akzent ist keine Schwäche, sondern der Beweis, dass du mindestens zwei Sprachen kannst. Ziel auf B2 ist <strong>Verständlichkeit</strong>, nicht Perfektion. Studien und Alltag zeigen: Klare Struktur und guter Wortschatz zählen für Zuhörer weit mehr als perfekte Aussprache.</p>
<h3>3. Sprachgefühl weiterentwickeln — was ab B2 wirklich hilft</h3>
<ul>
<li><strong>Serien mit deutschen Untertiteln</strong> (nicht in der Muttersprache!)</li>
<li><strong>Ein Thema tief statt zehn flach:</strong> Podcast + Artikel + Gespräch zum selben Thema in einer Woche</li>
<li><strong>Fehler-Tagebuch:</strong> die eigenen fünf Lieblingsfehler kennen und gezielt jagen</li>
<li><strong>Laut denken auf Deutsch</strong> — der billigste Sprechtrainer der Welt</li>
</ul>',
   3,NOW()),
  ('b2000000-0000-0000-0006-000000000099','b2000000-0000-0000-0000-000000000006',
   'b2-room06-quiz','Checkpoint: Sprache & Identität',
   '<h2>Checkpoint Quiz</h2><p>Redewendungen, Register und Mehrsprachigkeit — das große B2-Finale!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b2000000-0000-0006-0001-000000000001','b2000000-0000-0000-0006-000000000001',
   '"Ich verstehe nur Bahnhof" bedeutet:','multiple_choice',
   '["Ich verstehe gar nichts", "Ich fahre Zug", "Ich verstehe alles", "Ich bin am Bahnhof"]'::jsonb,
   'Ich verstehe gar nichts',
   'Der Klassiker unter den Redewendungen.',NOW()),
  ('b2000000-0000-0006-0001-000000000002','b2000000-0000-0000-0006-000000000001',
   '"Zwei Fliegen mit einer Klappe schlagen" heißt:','multiple_choice',
   '["Zwei Ziele mit einer Aktion erreichen", "Insekten jagen", "Doppelt bezahlen", "Zweimal scheitern"]'::jsonb,
   'Zwei Ziele mit einer Aktion erreichen',
   'Effizienz als Redewendung.',NOW()),
  ('b2000000-0000-0006-0001-000000000003','b2000000-0000-0000-0006-000000000001',
   '"Da liegt der Hund begraben" bedeutet:','multiple_choice',
   '["Das ist der Kern des Problems", "Der Hund ist gestorben", "Es ist langweilig", "Das ist der Garten"]'::jsonb,
   'Das ist der Kern des Problems',
   'Der eigentliche Grund, warum etwas nicht funktioniert.',NOW()),

  ('b2000000-0000-0006-0002-000000000001','b2000000-0000-0000-0006-000000000002',
   'Formelle Version von "Keine Ahnung":','multiple_choice',
   '["Dazu liegen mir keine Informationen vor.", "Weiß nicht.", "Null Plan.", "Frag wen anders."]'::jsonb,
   'Dazu liegen mir keine Informationen vor.',
   'Nominalstil + unpersönliche Konstruktion = formelles Register.',NOW()),
  ('b2000000-0000-0006-0002-000000000002','b2000000-0000-0000-0006-000000000002',
   'Was gehört NICHT in eine formelle Mail?','multiple_choice',
   '["mega", "bezüglich", "diesbezüglich", "Mit freundlichen Grüßen"]'::jsonb,
   'mega',
   'Umgangssprachliche Verstärker brechen das Register.',NOW()),
  ('b2000000-0000-0006-0002-000000000003','b2000000-0000-0000-0006-000000000002',
   'Die eigentliche B2-Registerkompetenz ist:','multiple_choice',
   '["Zwischen Registern wechseln können", "Nur formell schreiben", "Nur locker sprechen", "Register vermeiden"]'::jsonb,
   'Zwischen Registern wechseln können',
   'Situationsgerecht umschalten — das ist die Kunst.',NOW()),

  ('b2000000-0000-0006-0003-000000000001','b2000000-0000-0000-0006-000000000003',
   'Was ist "Code-Switching"?','multiple_choice',
   '["Zwischen Sprachen wechseln je nach Situation", "Programmieren lernen", "Passwörter ändern", "Dialekt vergessen"]'::jsonb,
   'Zwischen Sprachen wechseln je nach Situation',
   'Alltag fast aller Mehrsprachigen.',NOW()),
  ('b2000000-0000-0006-0003-000000000002','b2000000-0000-0000-0006-000000000003',
   'Das realistische Aussprache-Ziel auf B2:','multiple_choice',
   '["Verständlichkeit", "Akzentfreiheit", "Bühnendeutsch", "Flüstern"]'::jsonb,
   'Verständlichkeit',
   'Klarheit schlägt Perfektion — der Akzent darf bleiben.',NOW()),

  ('b2000000-0000-0006-0099-000000000001','b2000000-0000-0000-0006-000000000099',
   '"Etwas auf die lange Bank schieben" heißt:','multiple_choice',
   '["Aufschieben", "Schnell erledigen", "Vergessen", "Delegieren"]'::jsonb,
   'Aufschieben',
   'Prokrastination, deutsch und bildhaft.',NOW()),
  ('b2000000-0000-0006-0099-000000000002','b2000000-0000-0000-0006-000000000099',
   'Serien schaust du zum Lernen am besten:','multiple_choice',
   '["Mit deutschen Untertiteln", "Mit Untertiteln in der Muttersprache", "Ohne Ton", "Auf Englisch"]'::jsonb,
   'Mit deutschen Untertiteln',
   'Hören + Mitlesen in derselben Sprache verankert doppelt.',NOW()),
  ('b2000000-0000-0006-0099-000000000003','b2000000-0000-0000-0006-000000000099',
   'Wie viele Redewendungen pro Gespräch wirken souverän?','multiple_choice',
   '["Etwa eine", "Mindestens fünf", "Keine, nie benutzen", "In jedem Satz eine"]'::jsonb,
   'Etwa eine',
   'Dosierung ist alles — sonst klingt es nach Lehrbuch.',NOW()),
  ('b2000000-0000-0006-0099-000000000004','b2000000-0000-0000-0006-000000000099',
   '"Ins kalte Wasser springen" bedeutet:','multiple_choice',
   '["Etwas ohne Vorbereitung wagen", "Schwimmen gehen", "Krank werden", "Aufgeben"]'::jsonb,
   'Etwas ohne Vorbereitung wagen',
   'Mut zur Praxis — wie Deutschsprechen ab Tag eins.',NOW()),
  ('b2000000-0000-0006-0099-000000000005','b2000000-0000-0000-0006-000000000099',
   'Das "Fehler-Tagebuch" hilft, weil:','multiple_choice',
   '["Man die eigenen Muster erkennt und gezielt übt", "Fehler peinlich sind", "Man weniger schreibt", "Lehrer es verlangen"]'::jsonb,
   'Man die eigenen Muster erkennt und gezielt übt',
   'Die eigenen Top-5-Fehler jagen bringt mehr als breites Wiederholen.',NOW())
ON CONFLICT (id) DO NOTHING;
