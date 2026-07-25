-- ============================================================
-- DeutschPilot – B2 Rooms 01–03 (Arbeitswelt, Wissenschaft, Politik)
-- Same pattern as the A2/B1 rooms: one course per room, 3 content
-- lessons + checkpoint quiz (order_index 99). Additive only,
-- ON CONFLICT DO NOTHING.
-- ============================================================

-- ── COURSES ─────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES
  ('b2000000-0000-0000-0000-000000000001','work-applications-b2',
   'B2 Room 01 – Arbeitswelt & Bewerbung',
   'Write convincing applications, master formal correspondence, and shine in job interviews.',
   'B2','de',TRUE,NOW()),
  ('b2000000-0000-0000-0000-000000000002','science-technology-b2',
   'B2 Room 02 – Wissenschaft & Technik',
   'Understand academic style: Nominalisierung, Passiv mit Modalverben, and describing processes.',
   'B2','de',TRUE,NOW()),
  ('b2000000-0000-0000-0000-000000000003','politics-society-b2',
   'B2 Room 03 – Politik & Gesellschaft',
   'Debate skillfully, report claims with Konjunktiv I, and analyse arguments critically.',
   'B2','de',TRUE,NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 01 – Arbeitswelt & Bewerbung
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b2000000-0000-0000-0001-000000000001','b2000000-0000-0000-0000-000000000001',
   'b2-bewerbung-schreiben','Die schriftliche Bewerbung',
   '<h2>Die schriftliche Bewerbung</h2>
<h3>1. Die Bestandteile</h3>
<ul>
<li><strong>das Anschreiben</strong> – eine Seite: Warum du? Warum diese Firma?</li>
<li><strong>der Lebenslauf</strong> – tabellarisch, antichronologisch (Neuestes zuerst), mit Foto ist in Deutschland noch üblich, aber nicht Pflicht</li>
<li><strong>die Zeugnisse</strong> – Arbeitszeugnisse und Abschlüsse als Anhang</li>
</ul>
<h3>2. Das Anschreiben: der Bauplan</h3>
<ol>
<li><strong>Betreff:</strong> Bewerbung als [Position], Referenznummer falls vorhanden</li>
<li><strong>Einstieg ohne Floskel:</strong> statt "hiermit bewerbe ich mich" lieber ein konkreter Aufhänger: <em>"Als Projektleiterin mit fünf Jahren Erfahrung im E-Commerce hat mich Ihre Ausschreibung sofort angesprochen."</em></li>
<li><strong>Hauptteil:</strong> zwei, drei Belege statt Behauptungen — nicht "Ich bin teamfähig", sondern <em>"In meinem letzten Projekt habe ich ein sechsköpfiges Team koordiniert."</em></li>
<li><strong>Schluss:</strong> Gesprächswunsch + Verfügbarkeit: <em>"Über die Gelegenheit, mich persönlich vorzustellen, freue ich mich sehr."</em></li>
</ol>
<h3>3. Stilregeln für B2</h3>
<ul>
<li>Aktiv statt Passiv: "Ich habe eingeführt" schlägt "Es wurde eingeführt".</li>
<li>Konjunktiv II für Höflichkeit im Schluss: <em>"Gern würde ich Ihnen in einem Gespräch zeigen, ..."</em></li>
<li>Keine Superlative ohne Beleg ("hochmotiviert", "absolut zuverlässig") — Personaler überlesen sie.</li>
</ul>',
   1,NOW()),
  ('b2000000-0000-0000-0001-000000000002','b2000000-0000-0000-0000-000000000001',
   'b2-vorstellungsgespraech','Das Vorstellungsgespräch',
   '<h2>Das Vorstellungsgespräch</h2>
<h3>1. Die Standard-Dramaturgie</h3>
<ol>
<li>Small Talk zum Ankommen (Anreise, Wetter)</li>
<li><strong>"Erzählen Sie etwas über sich"</strong> – 2 Minuten, roter Faden: Gegenwart → Erfahrung → Warum hier</li>
<li>Fachfragen + Verhaltensfragen ("Beschreiben Sie eine Situation, in der ...")</li>
<li><strong>Deine Rückfragen</strong> – keine zu haben wirkt desinteressiert</li>
<li>Organisatorisches (Gehalt, Starttermin)</li>
</ol>
<h3>2. Verhaltensfragen mit der STAR-Methode</h3>
<p><strong>S</strong>ituation → <strong>T</strong>ask (Aufgabe) → <strong>A</strong>ction (Handlung) → <strong>R</strong>esult (Ergebnis).<br>
<em>"In meinem letzten Job (S) musste ich ein verspätetes Projekt retten (T). Ich habe die Aufgaben neu priorisiert und tägliche Kurzmeetings eingeführt (A). Wir haben die Deadline um zwei Tage unterboten (R)."</em></p>
<h3>3. Über Gehalt sprechen</h3>
<ul>
<li>Die Frage kommt meist am Ende: <em>"Welche Gehaltsvorstellung haben Sie?"</em></li>
<li>Antwort als Jahresbrutto-Spanne: <em>"Ich stelle mir ein Jahresgehalt zwischen 48.000 und 52.000 Euro vor."</em></li>
<li>Nachverhandeln ist normal — aber erst, wenn ein Angebot auf dem Tisch liegt.</li>
</ul>',
   2,NOW()),
  ('b2000000-0000-0000-0001-000000000003','b2000000-0000-0000-0000-000000000001',
   'b2-formelle-korrespondenz','Formelle Korrespondenz im Beruf',
   '<h2>Formelle Korrespondenz im Beruf</h2>
<h3>1. Die E-Mail-Architektur</h3>
<ul>
<li><strong>Anrede:</strong> "Sehr geehrte Frau Dr. Weber," → nach mehreren Mails oft "Liebe Frau Weber," / "Guten Tag Herr Kaya,"</li>
<li><strong>Schluss:</strong> "Mit freundlichen Grüßen" (Standard), "Beste Grüße" (halbformell), "Viele Grüße" (kollegial)</li>
</ul>
<h3>2. Die wichtigsten Funktions-Bausteine</h3>
<ul>
<li>Bezug nehmen: <em>"Bezug nehmend auf unser Telefonat vom ..."</em> / <em>"Vielen Dank für Ihre schnelle Rückmeldung."</em></li>
<li>Bitten: <em>"Ich wäre Ihnen dankbar, wenn Sie mir ... zusenden könnten."</em></li>
<li>Erinnern (höflich mahnen): <em>"Dürfte ich Sie freundlich an ... erinnern?"</em></li>
<li>Absagen: <em>"Leider müssen wir Ihnen mitteilen, dass ..."</em></li>
<li>Anhang: <em>"Im Anhang finden Sie ..."</em> / <em>"Anbei sende ich Ihnen ..."</em></li>
</ul>
<h3>3. Ton-Fallen für Fortgeschrittene</h3>
<ul>
<li>"ASAP"-Kultur gibt es nicht: Fristen konkret nennen (<em>"bis Freitag, den 12.09."</em>).</li>
<li>Imperative vermeiden: statt <em>"Schicken Sie mir ..."</em> lieber <em>"Könnten Sie mir ... schicken?"</em></li>
<li>Doppelte Verneinung höflich nutzen: <em>"Das ist nicht unproblematisch"</em> = deutliche Warnung im Businesston.</li>
</ul>',
   3,NOW()),
  ('b2000000-0000-0000-0001-000000000099','b2000000-0000-0000-0000-000000000001',
   'b2-room01-quiz','Checkpoint: Arbeitswelt & Bewerbung',
   '<h2>Checkpoint Quiz</h2><p>Bewerbung, Vorstellungsgespräch und formelle Korrespondenz — der Karriere-Check!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b2000000-0000-0001-0001-000000000001','b2000000-0000-0000-0001-000000000001',
   'Wie ist ein deutscher Lebenslauf aufgebaut?','multiple_choice',
   '["Tabellarisch, Neuestes zuerst", "Als Fließtext", "Chronologisch ab Geburt", "Ohne Datumsangaben"]'::jsonb,
   'Tabellarisch, Neuestes zuerst',
   'Tabellarisch und antichronologisch ist der Standard.',NOW()),
  ('b2000000-0000-0001-0001-000000000002','b2000000-0000-0000-0001-000000000001',
   'Welcher Einstieg ist am stärksten?','multiple_choice',
   '["Als Projektleiterin mit fünf Jahren Erfahrung hat mich Ihre Ausschreibung sofort angesprochen.", "Hiermit bewerbe ich mich um die ausgeschriebene Stelle.", "Ich schreibe Ihnen, weil ich einen Job suche.", "Sehr geehrte Damen und Herren, ich bin sehr motiviert."]'::jsonb,
   'Als Projektleiterin mit fünf Jahren Erfahrung hat mich Ihre Ausschreibung sofort angesprochen.',
   'Konkreter Aufhänger statt Floskel — das liest der Personaler weiter.',NOW()),
  ('b2000000-0000-0001-0001-000000000003','b2000000-0000-0000-0001-000000000001',
   'Statt "Ich bin teamfähig" schreibst du besser:','multiple_choice',
   '["In meinem letzten Projekt habe ich ein sechsköpfiges Team koordiniert.", "Ich bin wirklich sehr teamfähig.", "Alle sagen, ich bin teamfähig.", "Teamfähigkeit ist meine Stärke."]'::jsonb,
   'In meinem letzten Projekt habe ich ein sechsköpfiges Team koordiniert.',
   'Belege schlagen Behauptungen.',NOW()),

  ('b2000000-0000-0001-0002-000000000001','b2000000-0000-0000-0001-000000000002',
   'Wofür steht STAR?','multiple_choice',
   '["Situation, Task, Action, Result", "Start, Talk, Answer, Repeat", "Stärken, Talente, Arbeit, Referenzen", "Situation, Team, Aufgabe, Rede"]'::jsonb,
   'Situation, Task, Action, Result',
   'Die STAR-Methode strukturiert Antworten auf Verhaltensfragen.',NOW()),
  ('b2000000-0000-0001-0002-000000000002','b2000000-0000-0000-0001-000000000002',
   'Keine eigenen Rückfragen im Interview wirken:','multiple_choice',
   '["Desinteressiert", "Souverän", "Höflich", "Effizient"]'::jsonb,
   'Desinteressiert',
   'Rückfragen zeigen echtes Interesse — immer 2–3 vorbereiten.',NOW()),
  ('b2000000-0000-0001-0002-000000000003','b2000000-0000-0000-0001-000000000002',
   'Die Gehaltsvorstellung nennt man üblicherweise als:','multiple_choice',
   '["Jahresbrutto-Spanne", "Netto pro Woche", "Stundenlohn bar", "Gar nicht"]'::jsonb,
   'Jahresbrutto-Spanne',
   'Z. B. "zwischen 48.000 und 52.000 Euro brutto im Jahr".',NOW()),

  ('b2000000-0000-0001-0003-000000000001','b2000000-0000-0000-0001-000000000003',
   'Standard-Schlussformel im Geschäftsbrief:','multiple_choice',
   '["Mit freundlichen Grüßen", "Tschüss", "Hochachtungsvoll dein", "Bis bald mal"]'::jsonb,
   'Mit freundlichen Grüßen',
   'MfG ausgeschrieben — die sichere Standardformel.',NOW()),
  ('b2000000-0000-0001-0003-000000000002','b2000000-0000-0000-0001-000000000003',
   '"Im ___ finden Sie den Bericht."','multiple_choice',
   '["Anhang", "Angang", "Abhang", "Umhang"]'::jsonb,'Anhang',
   'Der Anhang = attachment.',NOW()),

  ('b2000000-0000-0001-0099-000000000001','b2000000-0000-0000-0001-000000000099',
   'Höflich erinnern:','multiple_choice',
   '["Dürfte ich Sie freundlich an die Unterlagen erinnern?", "Wo bleiben die Unterlagen?!", "Sie haben die Unterlagen vergessen!", "Schicken Sie endlich!"]'::jsonb,
   'Dürfte ich Sie freundlich an die Unterlagen erinnern?',
   'Konjunktiv II + "freundlich" = professionelle Mahnung.',NOW()),
  ('b2000000-0000-0001-0099-000000000002','b2000000-0000-0000-0001-000000000099',
   '"Das ist nicht unproblematisch" bedeutet im Businesston:','multiple_choice',
   '["Eine deutliche Warnung", "Alles in Ordnung", "Ein Lob", "Eine Zusage"]'::jsonb,
   'Eine deutliche Warnung',
   'Die doppelte Verneinung ist höflich verpackter Ernst.',NOW()),
  ('b2000000-0000-0001-0099-000000000003','b2000000-0000-0000-0001-000000000099',
   'Aktiv statt Passiv im Anschreiben heißt:','multiple_choice',
   '["Ich habe das System eingeführt.", "Das System wurde eingeführt.", "Das System ist eingeführt worden.", "Man führte das System ein."]'::jsonb,
   'Ich habe das System eingeführt.',
   'Im Anschreiben zählt dein Beitrag — aktiv formulieren.',NOW()),
  ('b2000000-0000-0001-0099-000000000004','b2000000-0000-0000-0001-000000000099',
   'Fristen nennt man im deutschen Berufsalltag:','multiple_choice',
   '["Konkret mit Datum", "Mit ASAP", "Gar nicht", "Nur mündlich"]'::jsonb,
   'Konkret mit Datum',
   '"Bis Freitag, den 12.09." schlägt jedes "so schnell wie möglich".',NOW()),
  ('b2000000-0000-0001-0099-000000000005','b2000000-0000-0000-0001-000000000099',
   'Verhandeln über Gehalt: wann?','multiple_choice',
   '["Wenn ein Angebot auf dem Tisch liegt", "In der ersten Mail", "Beim Small Talk", "Nie"]'::jsonb,
   'Wenn ein Angebot auf dem Tisch liegt',
   'Erst das Angebot, dann die Verhandlung.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 02 – Wissenschaft & Technik
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b2000000-0000-0000-0002-000000000001','b2000000-0000-0000-0000-000000000002',
   'b2-nominalisierung','Nominalstil: Verben zu Nomen',
   '<h2>Nominalstil: Verben zu Nomen</h2>
<h3>1. Warum das wichtig ist</h3>
<p>Wissenschaft, Verwaltung und Fachtexte verdichten Sätze zu Nomen. Wer B2-Texte lesen will, muss diesen Stil entpacken können — und für Berichte selbst beherrschen.</p>
<h3>2. Die Baumuster</h3>
<table>
<thead><tr><th>Verb</th><th>Nomen</th><th>Muster</th></tr></thead>
<tbody>
<tr><td>untersuchen</td><td>die Untersuchung</td><td>-ung (am häufigsten)</td></tr>
<tr><td>wachsen</td><td>das Wachstum</td><td>-tum</td></tr>
<tr><td>analysieren</td><td>die Analyse</td><td>Fremdwort bleibt</td></tr>
<tr><td>verlieren</td><td>der Verlust</td><td>Stammänderung</td></tr>
<tr><td>lesen</td><td>das Lesen</td><td>substantivierter Infinitiv</td></tr>
</tbody>
</table>
<h3>3. Sätze umbauen — in beide Richtungen</h3>
<ul>
<li>Verbal: <em>Nachdem die Daten analysiert wurden, ...</em><br>
Nominal: <em><strong>Nach der Analyse</strong> der Daten ...</em></li>
<li>Verbal: <em>Weil die Kosten gestiegen sind, ...</em><br>
Nominal: <em><strong>Wegen des Kostenanstiegs</strong> ...</em></li>
<li>Merke die Präpositions-Paare: nachdem→nach, weil→wegen, obwohl→trotz, damit→zu/für, wenn→bei.</li>
</ul>',
   1,NOW()),
  ('b2000000-0000-0000-0002-000000000002','b2000000-0000-0000-0000-000000000002',
   'b2-passiv-modal','Passiv mit Modalverben',
   '<h2>Passiv mit Modalverben</h2>
<h3>1. Die Struktur</h3>
<p>Modalverb + Partizip II + <strong>werden</strong> (Infinitiv am Satzende):</p>
<ul>
<li>Die Daten <strong>müssen</strong> täglich <strong>gesichert werden</strong>.</li>
<li>Das Gerät <strong>kann</strong> per App <strong>gesteuert werden</strong>.</li>
<li>Der Fehler <strong>sollte</strong> sofort <strong>behoben werden</strong>.</li>
</ul>
<h3>2. Vergangenheit</h3>
<ul>
<li>Präteritum: Die Daten <strong>mussten gesichert werden</strong>.</li>
<li>Perfekt (selten, sperrig): Die Daten <strong>haben gesichert werden müssen</strong> — im Alltag weicht man aufs Präteritum aus.</li>
</ul>
<h3>3. Alternativen, die Profis nutzen</h3>
<ul>
<li><strong>sein + zu + Infinitiv:</strong> Die Daten <strong>sind</strong> täglich <strong>zu sichern</strong>. (= müssen gesichert werden)</li>
<li><strong>-bar:</strong> Das Gerät ist <strong>steuerbar</strong>. (= kann gesteuert werden)</li>
<li><strong>lässt sich:</strong> Der Fehler <strong>lässt sich beheben</strong>. (= kann behoben werden)</li>
</ul>',
   2,NOW()),
  ('b2000000-0000-0000-0002-000000000003','b2000000-0000-0000-0000-000000000002',
   'b2-prozesse-beschreiben','Prozesse und Grafiken beschreiben',
   '<h2>Prozesse und Grafiken beschreiben</h2>
<h3>1. Prozess-Konnektoren in Reihenfolge</h3>
<p><strong>Zunächst / Zuerst</strong> → <strong>anschließend / danach</strong> → <strong>dabei</strong> (gleichzeitig) → <strong>schließlich / abschließend</strong></p>
<p><em>Zunächst werden die Rohstoffe geprüft. Anschließend wird das Material erhitzt, wobei die Temperatur konstant gehalten wird. Schließlich wird das Produkt verpackt.</em></p>
<h3>2. Grafiken versprachlichen (Prüfungsklassiker)</h3>
<ul>
<li>Einstieg: <em>Die Grafik <strong>zeigt / stellt dar / gibt Auskunft über</strong> ...</em></li>
<li>Entwicklung: <em>Die Zahl <strong>ist gestiegen / gesunken / hat sich verdoppelt / ist konstant geblieben</strong>.</em></li>
<li>Vergleich: <em>Im Vergleich zu 2020 ... / Während X steigt, sinkt Y.</em></li>
<li>Höhe- und Tiefpunkte: <em>Der Höchststand wurde 2023 erreicht.</em></li>
</ul>
<h3>3. Vorsicht, präzise Sprache</h3>
<ul>
<li><em>deutlich / stark / leicht</em> gestiegen — Größenordnung immer mitliefern.</li>
<li>Nicht übertreiben: "explodiert" gehört in die Boulevardpresse, nicht in den Bericht.</li>
<li>Quelle nennen: <em>Laut Statistischem Bundesamt ...</em></li>
</ul>',
   3,NOW()),
  ('b2000000-0000-0000-0002-000000000099','b2000000-0000-0000-0000-000000000002',
   'b2-room02-quiz','Checkpoint: Wissenschaft & Technik',
   '<h2>Checkpoint Quiz</h2><p>Nominalstil, Passiv mit Modalverben und Prozessbeschreibung — der Fachsprache-Check!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b2000000-0000-0002-0001-000000000001','b2000000-0000-0000-0002-000000000001',
   'Nominalisierung von "untersuchen":','multiple_choice',
   '["die Untersuchung", "das Untersuchen­tum", "der Untersuch", "die Untersuchheit"]'::jsonb,
   'die Untersuchung',
   '-ung ist das häufigste Muster.',NOW()),
  ('b2000000-0000-0002-0001-000000000002','b2000000-0000-0000-0002-000000000001',
   '"Nachdem die Daten analysiert wurden" nominal:','multiple_choice',
   '["Nach der Analyse der Daten", "Wegen der Analyse der Daten", "Trotz der Analyse der Daten", "Bei dem Analysieren"]'::jsonb,
   'Nach der Analyse der Daten',
   'nachdem → nach + Nomen.',NOW()),
  ('b2000000-0000-0002-0001-000000000003','b2000000-0000-0000-0002-000000000001',
   '"Obwohl" entspricht nominal:','multiple_choice',
   '["trotz", "wegen", "nach", "bei"]'::jsonb,'trotz',
   'obwohl → trotz + Genitiv.',NOW()),

  ('b2000000-0000-0002-0002-000000000001','b2000000-0000-0000-0002-000000000002',
   '"Die Daten müssen täglich ___ ___."','multiple_choice',
   '["gesichert werden", "werden gesichert", "sichern werden", "gesichert worden"]'::jsonb,
   'gesichert werden',
   'Modalverb + Partizip II + werden am Ende.',NOW()),
  ('b2000000-0000-0002-0002-000000000002','b2000000-0000-0000-0002-000000000002',
   '"Die Daten sind täglich zu sichern" bedeutet:','multiple_choice',
   '["Sie müssen gesichert werden", "Sie dürfen nicht gesichert werden", "Sie sind schon gesichert", "Sie können nicht gesichert werden"]'::jsonb,
   'Sie müssen gesichert werden',
   'sein + zu + Infinitiv = Notwendigkeit (oder Möglichkeit) im Passivsinn.',NOW()),
  ('b2000000-0000-0002-0002-000000000003','b2000000-0000-0000-0002-000000000002',
   '"Das Gerät ist steuerbar" heißt:','multiple_choice',
   '["Es kann gesteuert werden", "Es muss gesteuert werden", "Es wurde gesteuert", "Es steuert selbst"]'::jsonb,
   'Es kann gesteuert werden',
   '-bar drückt Möglichkeit aus.',NOW()),

  ('b2000000-0000-0002-0003-000000000001','b2000000-0000-0000-0002-000000000003',
   'Reihenfolge-Konnektoren, richtig sortiert:','multiple_choice',
   '["Zunächst – anschließend – schließlich", "Schließlich – zuerst – danach", "Dabei – zunächst – zuerst", "Abschließend – danach – zunächst"]'::jsonb,
   'Zunächst – anschließend – schließlich',
   'Anfang → Mitte → Ende.',NOW()),
  ('b2000000-0000-0002-0003-000000000002','b2000000-0000-0000-0002-000000000003',
   '"Die Grafik ___ die Entwicklung der Studierendenzahlen."','multiple_choice',
   '["zeigt", "schaut", "sieht", "guckt"]'::jsonb,'zeigt',
   'zeigen / darstellen / Auskunft geben über — die Einstiegsverben.',NOW()),

  ('b2000000-0000-0002-0099-000000000001','b2000000-0000-0000-0002-000000000099',
   '"Die Zahl hat sich verdoppelt" bedeutet:','multiple_choice',
   '["Sie ist zweimal so hoch wie vorher", "Sie ist gesunken", "Sie ist konstant", "Sie ist um 2 gestiegen"]'::jsonb,
   'Sie ist zweimal so hoch wie vorher',
   'verdoppeln = ×2.',NOW()),
  ('b2000000-0000-0002-0099-000000000002','b2000000-0000-0000-0002-000000000099',
   '"Der Fehler lässt sich beheben" heißt:','multiple_choice',
   '["Er kann behoben werden", "Er muss bleiben", "Er wurde nie behoben", "Er behebt sich täglich selbst"]'::jsonb,
   'Er kann behoben werden',
   'lässt sich + Infinitiv = Passiv-Alternative der Möglichkeit.',NOW()),
  ('b2000000-0000-0002-0099-000000000003','b2000000-0000-0000-0002-000000000099',
   '"Wegen ___ Kostenanstiegs" — welcher Kasus?','multiple_choice',
   '["des (Genitiv)", "dem (Dativ)", "den (Akkusativ)", "der (Nominativ)"]'::jsonb,
   'des (Genitiv)',
   'wegen + Genitiv im Standard: wegen des Kostenanstiegs.',NOW()),
  ('b2000000-0000-0002-0099-000000000004','b2000000-0000-0000-0002-000000000099',
   'Prät.-Passiv mit Modalverb: "Die Daten ___ gesichert werden."','multiple_choice',
   '["mussten", "müssen hat", "gemusst haben", "musste"]'::jsonb,
   'mussten',
   'Plural Präteritum: mussten gesichert werden.',NOW()),
  ('b2000000-0000-0002-0099-000000000005','b2000000-0000-0000-0002-000000000099',
   'Seriöse Berichtssprache vermeidet:','multiple_choice',
   '["Boulevard-Wörter wie \"explodiert\"", "Quellenangaben", "Vergleiche", "Zahlen"]'::jsonb,
   'Boulevard-Wörter wie "explodiert"',
   'Präzise statt dramatisch: deutlich/stark/leicht + Zahl.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 03 – Politik & Gesellschaft
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b2000000-0000-0000-0003-000000000001','b2000000-0000-0000-0000-000000000003',
   'b2-debattieren','Debattieren: Argumente entkräften',
   '<h2>Debattieren: Argumente entkräften</h2>
<h3>1. Die Eskalationsleiter der Zustimmung</h3>
<ol>
<li><strong>Konzedieren:</strong> <em>Zugegeben, ... / Es stimmt zwar, dass ...</em></li>
<li><strong>Relativieren:</strong> <em>Allerdings greift dieses Argument zu kurz, denn ...</em></li>
<li><strong>Kontern:</strong> <em>Dem ist entgegenzuhalten, dass ...</em></li>
</ol>
<h3>2. Werkzeuge für die Diskussion</h3>
<ul>
<li>Auf den Punkt bringen: <em>Der Kern des Problems ist doch, dass ...</em></li>
<li>Unterbrechen, höflich: <em>Darf ich da kurz einhaken?</em></li>
<li>Zurückholen: <em>Um auf die eigentliche Frage zurückzukommen: ...</em></li>
<li>Beispiel einfordern: <em>Können Sie das an einem Beispiel konkretisieren?</em></li>
</ul>
<h3>3. Fairness-Regeln</h3>
<ul>
<li>Argument angreifen, nie die Person (<em>ad hominem</em> zerstört jede Debatte).</li>
<li>Das stärkste Gegenargument zuerst ernst nehmen — wer nur Strohmänner widerlegt, überzeugt niemanden.</li>
<li>Am Ende zusammenfassen: <em>Festzuhalten bleibt, dass ...</em></li>
</ul>',
   1,NOW()),
  ('b2000000-0000-0000-0003-000000000002','b2000000-0000-0000-0000-000000000003',
   'b2-konjunktiv-1','Konjunktiv I: Behauptungen wiedergeben',
   '<h2>Konjunktiv I: Behauptungen wiedergeben</h2>
<h3>1. Wozu er da ist</h3>
<p>Der Konjunktiv I signalisiert: <strong>Das ist nicht meine Aussage — ich gebe sie nur wieder.</strong> Er ist die Distanz-Maschine des Journalismus:</p>
<ul>
<li>Der Minister sagte, die Lage <strong>sei</strong> stabil. (er sagt es — ob es stimmt, offen)</li>
<li>Die Opposition erklärte, sie <strong>habe</strong> Beweise.</li>
</ul>
<h3>2. Die Formen, die du wirklich brauchst</h3>
<table>
<thead><tr><th></th><th>sein</th><th>haben</th><th>andere Verben</th></tr></thead>
<tbody>
<tr><td>er/sie/es</td><td><strong>sei</strong></td><td><strong>habe</strong></td><td>Stamm + e: <strong>komme, wisse</strong></td></tr>
<tr><td>sie (Pl.)</td><td><strong>seien</strong></td><td>hätten*</td><td>würden + Inf.*</td></tr>
</tbody>
</table>
<p>*Wo Konjunktiv I wie Indikativ aussieht (sie haben), springt Konjunktiv II ein (sie hätten).</p>
<h3>3. Lesen können reicht oft</h3>
<p>Aktiv produzieren musst du den Konjunktiv I auf B2 selten — aber in jeder Zeitung steht er. Wer <em>sei/habe/wolle/könne</em> als "Zitat-Marker" erkennt, liest Nachrichten doppelt so kritisch: Steht dort <em>ist</em> oder <em>sei</em>? Das ist der Unterschied zwischen Fakt und Behauptung.</p>',
   2,NOW()),
  ('b2000000-0000-0000-0003-000000000003','b2000000-0000-0000-0000-000000000003',
   'b2-politik-wortschatz','Politik-Wortschatz & das System',
   '<h2>Politik-Wortschatz & das politische System</h2>
<h3>1. Die Institutionen in 60 Sekunden</h3>
<ul>
<li><strong>der Bundestag</strong> – das Parlament, direkt gewählt</li>
<li><strong>der Bundesrat</strong> – die Vertretung der 16 Bundesländer</li>
<li><strong>die Bundesregierung</strong> – Kanzler(in) + Minister(innen)</li>
<li><strong>der/die Bundespräsident(in)</strong> – Staatsoberhaupt, vor allem repräsentativ</li>
<li><strong>das Bundesverfassungsgericht</strong> – wacht über das Grundgesetz</li>
</ul>
<h3>2. Wahl-Vokabular</h3>
<ul>
<li><strong>die Wahl, wählen, die Stimme abgeben</strong></li>
<li><strong>die Koalition</strong> – Regierungsbündnis mehrerer Parteien (der Normalfall)</li>
<li><strong>die Mehrheit ↔ die Opposition</strong></li>
<li><strong>der Kompromiss</strong> – das Lieblingswort deutscher Politik</li>
</ul>
<h3>3. Diskutieren über Politik — Formulierungen</h3>
<ul>
<li><em>Ich halte diese Maßnahme für sinnvoll/problematisch, weil ...</em></li>
<li><em>Kritiker wenden ein, dass ... Befürworter halten dagegen, dass ...</em></li>
<li><em>Langfristig dürfte das dazu führen, dass ...</em> (dürfte = vorsichtige Prognose)</li>
</ul>',
   3,NOW()),
  ('b2000000-0000-0000-0003-000000000099','b2000000-0000-0000-0000-000000000003',
   'b2-room03-quiz','Checkpoint: Politik & Gesellschaft',
   '<h2>Checkpoint Quiz</h2><p>Debatte, Konjunktiv I und das politische System — der Gesellschafts-Check!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b2000000-0000-0003-0001-000000000001','b2000000-0000-0000-0003-000000000001',
   '"Zugegeben, ..., allerdings ..." ist die Technik des:','multiple_choice',
   '["Konzedierens und Konterns", "Beleidigens", "Themawechsels", "Zustimmens"]'::jsonb,
   'Konzedierens und Konterns',
   'Erst einräumen, dann entkräften — die stärkste Debattenfigur.',NOW()),
  ('b2000000-0000-0003-0001-000000000002','b2000000-0000-0000-0003-000000000001',
   'Höflich unterbrechen:','multiple_choice',
   '["Darf ich da kurz einhaken?", "Stopp! Falsch!", "Ich rede jetzt!", "Sie verstehen das nicht."]'::jsonb,
   'Darf ich da kurz einhaken?',
   'Die Standard-Formel für den fairen Einwurf.',NOW()),
  ('b2000000-0000-0003-0001-000000000003','b2000000-0000-0000-0003-000000000001',
   'Ein Ad-hominem-Angriff richtet sich gegen:','multiple_choice',
   '["Die Person statt das Argument", "Das stärkste Argument", "Die Statistik", "Das Publikum"]'::jsonb,
   'Die Person statt das Argument',
   'Unfair und wirkungslos — immer beim Argument bleiben.',NOW()),

  ('b2000000-0000-0003-0002-000000000001','b2000000-0000-0000-0003-000000000002',
   '"Der Minister sagte, die Lage ___ stabil."','multiple_choice',
   '["sei", "ist", "wäre gewesen", "war"]'::jsonb,'sei',
   'Konjunktiv I markiert die Wiedergabe fremder Aussagen.',NOW()),
  ('b2000000-0000-0003-0002-000000000002','b2000000-0000-0000-0003-000000000002',
   'Was signalisiert der Konjunktiv I in Nachrichten?','multiple_choice',
   '["Distanz: Das ist eine wiedergegebene Behauptung", "Zustimmung des Journalisten", "Vergangenheit", "Höflichkeit"]'::jsonb,
   'Distanz: Das ist eine wiedergegebene Behauptung',
   'sei/habe = Zitat-Marker, nicht bestätigter Fakt.',NOW()),
  ('b2000000-0000-0003-0002-000000000003','b2000000-0000-0000-0003-000000000002',
   'Konjunktiv I von "haben" (er/sie/es):','multiple_choice',
   '["habe", "hätte", "hat", "habte"]'::jsonb,'habe',
   'er habe — bei Formgleichheit mit dem Indikativ springt sonst Konjunktiv II ein.',NOW()),

  ('b2000000-0000-0003-0003-000000000001','b2000000-0000-0000-0003-000000000003',
   'Wer vertritt die Bundesländer?','multiple_choice',
   '["Der Bundesrat", "Der Bundestag", "Das Verfassungsgericht", "Die Bundespräsidentin"]'::jsonb,
   'Der Bundesrat',
   'Bundestag = gewähltes Parlament; Bundesrat = Länderkammer.',NOW()),
  ('b2000000-0000-0003-0003-000000000002','b2000000-0000-0000-0003-000000000003',
   'Eine "Koalition" ist:','multiple_choice',
   '["Ein Regierungsbündnis mehrerer Parteien", "Eine Wahlmaschine", "Ein Gericht", "Eine Demonstration"]'::jsonb,
   'Ein Regierungsbündnis mehrerer Parteien',
   'In Deutschland regiert fast immer eine Koalition.',NOW()),

  ('b2000000-0000-0003-0099-000000000001','b2000000-0000-0000-0003-000000000099',
   '"Langfristig ___ das dazu führen, dass ..." (vorsichtige Prognose)','multiple_choice',
   '["dürfte", "darf", "durfte", "muss"]'::jsonb,'dürfte',
   'dürfte + Infinitiv = wahrscheinlich, aber vorsichtig formuliert.',NOW()),
  ('b2000000-0000-0003-0099-000000000002','b2000000-0000-0000-0003-000000000099',
   'Steht in der Zeitung "Die Lage ist stabil" statt "sei stabil", dann:','multiple_choice',
   '["Stellt die Redaktion es als Fakt dar", "Ist es ein Zitat", "Ist es Konjunktiv", "Ist es Vergangenheit"]'::jsonb,
   'Stellt die Redaktion es als Fakt dar',
   'ist = Faktbehauptung der Redaktion; sei = wiedergegebene Aussage.',NOW()),
  ('b2000000-0000-0003-0099-000000000003','b2000000-0000-0000-0003-000000000099',
   'Wer wacht über das Grundgesetz?','multiple_choice',
   '["Das Bundesverfassungsgericht", "Der Bundesrat", "Die Polizei", "Die Koalition"]'::jsonb,
   'Das Bundesverfassungsgericht',
   'Sitz in Karlsruhe — die letzte Instanz für Verfassungsfragen.',NOW()),
  ('b2000000-0000-0003-0099-000000000004','b2000000-0000-0000-0003-000000000099',
   'Eine Debatte fair zusammenfassen beginnt mit:','multiple_choice',
   '["Festzuhalten bleibt, dass ...", "Ich hatte sowieso recht:", "Ende der Diskussion:", "Wie ich schon sagte:"]'::jsonb,
   'Festzuhalten bleibt, dass ...',
   'Neutrale Bilanzformel statt Rechthaberei.',NOW()),
  ('b2000000-0000-0003-0099-000000000005','b2000000-0000-0000-0003-000000000099',
   '"Kritiker wenden ein, dass ... Befürworter ___ dagegen, dass ..."','multiple_choice',
   '["halten", "stellen", "gehen", "sagen"]'::jsonb,'halten',
   'dagegenhalten = das Gegenargument setzen.',NOW())
ON CONFLICT (id) DO NOTHING;
