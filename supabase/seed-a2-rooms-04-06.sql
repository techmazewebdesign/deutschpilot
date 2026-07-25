-- ============================================================
-- DeutschPilot – A2 Rooms 04–06 (Arbeit, Wohnen, Feste)
-- Same pattern as seed-a2-rooms-01-03.sql. Additive only,
-- ON CONFLICT DO NOTHING.
-- ============================================================

-- ── COURSES ─────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES
  ('a2000000-0000-0000-0000-000000000004','work-career-a2',
   'A2 Room 04 – Arbeit & Beruf',
   'Talk about your job, understand workplace communication, and give reasons with weil and dass.',
   'A2','de',TRUE,NOW()),
  ('a2000000-0000-0000-0000-000000000005','living-together-a2',
   'A2 Room 05 – Wohnen & Zusammenleben',
   'Describe your home, compare flats, and master two-way prepositions for locations.',
   'A2','de',TRUE,NOW()),
  ('a2000000-0000-0000-0000-000000000006','celebrations-culture-a2',
   'A2 Room 06 – Feste & Kultur',
   'German holidays and traditions, invitations, and telling stories with war and hatte.',
   'A2','de',TRUE,NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 04 – Arbeit & Beruf
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('a2000000-0000-0000-0004-000000000001','a2000000-0000-0000-0000-000000000004',
   'a2-berufe-arbeitsalltag','Berufe & Arbeitsalltag',
   '<h2>Berufe & Arbeitsalltag</h2>
<h3>1. Über den Beruf sprechen</h3>
<ul>
<li><strong>Ich arbeite als</strong> Verkäuferin / Ingenieur / Pfleger.</li>
<li><strong>Ich bin</strong> Lehrerin <strong>von Beruf</strong>.</li>
<li><strong>Ich arbeite bei</strong> Siemens / <strong>in</strong> einem Krankenhaus.</li>
<li><strong>Ich arbeite Vollzeit / Teilzeit / im Schichtdienst.</strong></li>
</ul>
<h3>2. Der Arbeitsalltag</h3>
<ul>
<li>die Besprechung – das Meeting</li>
<li>die Pause – Um 12 Uhr mache ich Mittagspause.</li>
<li>der Feierabend – Nach Feierabend gehe ich einkaufen.</li>
<li>der Urlaub – Ich habe 28 Tage Urlaub im Jahr.</li>
<li>die Überstunde – Diese Woche habe ich fünf Überstunden gemacht.</li>
</ul>
<h3>3. Small Talk im Büro</h3>
<p><em>— Na, wie läuft dein Projekt?<br>
— Ganz gut, danke! Aber wir haben viel zu tun. Und bei dir?<br>
— Auch viel Arbeit. Zum Glück ist bald Wochenende!</em></p>',
   1,NOW()),
  ('a2000000-0000-0000-0004-000000000002','a2000000-0000-0000-0000-000000000004',
   'a2-weil-dass','Gründe nennen: weil & dass',
   '<h2>Gründe nennen: weil & dass</h2>
<p>Mit <strong>weil</strong> und <strong>dass</strong> baust du echte A2-Sätze — Achtung: Das Verb wandert ans Ende!</p>
<h3>1. weil (Grund)</h3>
<ul>
<li>Ich lerne Deutsch, <strong>weil</strong> ich in Deutschland <strong>arbeite</strong>.</li>
<li>Sie kommt später, <strong>weil</strong> ihr Zug Verspätung <strong>hat</strong>.</li>
<li>Er ist müde, <strong>weil</strong> er Überstunden <strong>gemacht hat</strong>.</li>
</ul>
<h3>2. dass (Aussage/Meinung)</h3>
<ul>
<li>Ich finde, <strong>dass</strong> mein Job interessant <strong>ist</strong>.</li>
<li>Der Chef sagt, <strong>dass</strong> wir früher anfangen <strong>müssen</strong>.</li>
<li>Ich hoffe, <strong>dass</strong> ich bald Urlaub <strong>bekomme</strong>.</li>
</ul>
<h3>3. Die goldene Regel</h3>
<p>Nach weil/dass: <strong>Subjekt zuerst, konjugiertes Verb ganz am Ende.</strong><br>
❌ <em>...weil ich habe viel Arbeit.</em><br>
✅ <em>...weil ich viel Arbeit <strong>habe</strong>.</em></p>',
   2,NOW()),
  ('a2000000-0000-0000-0004-000000000003','a2000000-0000-0000-0000-000000000004',
   'a2-telefonieren-email','Telefonieren & kurze E-Mails',
   '<h2>Telefonieren & kurze E-Mails im Job</h2>
<h3>1. Am Telefon</h3>
<p><em>— Firma Bauer, Schmidt am Apparat. Was kann ich für Sie tun?<br>
— Guten Tag, hier ist Ali Khan. Könnte ich bitte mit Frau Weber sprechen?<br>
— Frau Weber ist gerade in einer Besprechung. Möchten Sie eine Nachricht hinterlassen?<br>
— Ja, gern. Sie kann mich unter 0176 123456 zurückrufen.</em></p>
<h3>2. Nützliche Telefon-Sätze</h3>
<ul>
<li><strong>Könnte ich bitte mit ... sprechen?</strong></li>
<li><strong>Worum geht es?</strong> – What is it about?</li>
<li><strong>Können Sie das bitte wiederholen?</strong></li>
<li><strong>Ich verbinde Sie.</strong> – I'll put you through.</li>
</ul>
<h3>3. Die kurze Arbeits-E-Mail</h3>
<p><em>Betreff: Krankmeldung<br><br>
Sehr geehrte Frau Weber,<br>
leider bin ich heute krank und kann nicht zur Arbeit kommen. Die Krankschreibung schicke ich Ihnen morgen.<br>
Mit freundlichen Grüßen<br>
Ali Khan</em></p>',
   3,NOW()),
  ('a2000000-0000-0000-0004-000000000099','a2000000-0000-0000-0000-000000000004',
   'a2-room04-quiz','Checkpoint: Arbeit & Beruf',
   '<h2>Checkpoint Quiz</h2><p>Berufe, weil/dass und Bürokommunikation — zeig dein Können!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('a2000000-0000-0004-0001-000000000001','a2000000-0000-0000-0004-000000000001',
   '"Ich arbeite ___ Siemens."','multiple_choice',
   '["bei", "in", "an", "auf"]'::jsonb,'bei',
   'Firmenname → bei: Ich arbeite bei Siemens.',NOW()),
  ('a2000000-0000-0004-0001-000000000002','a2000000-0000-0000-0004-000000000001',
   'Was ist "der Feierabend"?','multiple_choice',
   '["Eine Party", "Das Ende des Arbeitstages", "Ein Feiertag", "Die Mittagspause"]'::jsonb,
   'Das Ende des Arbeitstages',
   'Feierabend = wenn die Arbeit vorbei ist.',NOW()),
  ('a2000000-0000-0004-0001-000000000003','a2000000-0000-0000-0004-000000000001',
   '"Diese Woche habe ich fünf ___ gemacht." (mehr gearbeitet als normal)','multiple_choice',
   '["Überstunden", "Pausen", "Urlaube", "Besprechungen"]'::jsonb,'Überstunden',
   'Überstunden = zusätzliche Arbeitsstunden.',NOW()),

  ('a2000000-0000-0004-0002-000000000001','a2000000-0000-0000-0004-000000000002',
   'Ergänze richtig: "Ich lerne Deutsch, weil ich in Deutschland ___."','multiple_choice',
   '["arbeite", "arbeiten", "arbeitet", "gearbeitet"]'::jsonb,'arbeite',
   'Nach "weil": konjugiertes Verb am Ende — ich arbeite.',NOW()),
  ('a2000000-0000-0004-0002-000000000002','a2000000-0000-0000-0004-000000000002',
   'Welcher Satz ist richtig?','multiple_choice',
   '["Ich finde, dass mein Job interessant ist.", "Ich finde, dass mein Job ist interessant.", "Ich finde, dass ist mein Job interessant.", "Ich finde, mein Job dass interessant ist."]'::jsonb,
   'Ich finde, dass mein Job interessant ist.',
   'Nach "dass" geht das Verb ans Satzende.',NOW()),
  ('a2000000-0000-0004-0002-000000000003','a2000000-0000-0000-0004-000000000002',
   'Welcher Satz ist FALSCH?','multiple_choice',
   '["Sie kommt später, weil ihr Zug Verspätung hat.", "Er ist müde, weil er Überstunden gemacht hat.", "Ich bleibe zu Hause, weil ich bin krank.", "Ich hoffe, dass ich bald Urlaub bekomme."]'::jsonb,
   'Ich bleibe zu Hause, weil ich bin krank.',
   'Richtig: "...weil ich krank bin." — Verb ans Ende!',NOW()),

  ('a2000000-0000-0004-0003-000000000001','a2000000-0000-0000-0004-000000000003',
   'Du willst mit Frau Weber telefonieren. Was sagst du?','multiple_choice',
   '["Könnte ich bitte mit Frau Weber sprechen?", "Wo ist Frau Weber?", "Frau Weber, bitte kommen!", "Ich will Frau Weber."]'::jsonb,
   'Könnte ich bitte mit Frau Weber sprechen?',
   'Die höfliche Standard-Formel am Telefon.',NOW()),
  ('a2000000-0000-0004-0003-000000000002','a2000000-0000-0000-0004-000000000003',
   '"Ich verbinde Sie" bedeutet:','multiple_choice',
   '["Ich lege auf", "Ich stelle Sie durch", "Ich rufe zurück", "Ich hinterlasse eine Nachricht"]'::jsonb,
   'Ich stelle Sie durch',
   '"Verbinden" am Telefon = durchstellen (put through).',NOW()),

  ('a2000000-0000-0004-0099-000000000001','a2000000-0000-0000-0004-000000000099',
   '"Ich bin Lehrerin ___ Beruf."','multiple_choice',
   '["von", "bei", "als", "für"]'::jsonb,'von',
   'Feste Wendung: von Beruf.',NOW()),
  ('a2000000-0000-0004-0099-000000000002','a2000000-0000-0000-0004-000000000099',
   'Ergänze: "Der Chef sagt, dass wir früher anfangen ___."','multiple_choice',
   '["müssen", "muss", "musst", "gemusst"]'::jsonb,'müssen',
   'Subjekt "wir" → müssen, am Satzende.',NOW()),
  ('a2000000-0000-0004-0099-000000000003','a2000000-0000-0000-0004-000000000099',
   'Was ist ein guter Betreff für eine Krankmeldung?','multiple_choice',
   '["Krankmeldung", "Hallo", "Wichtig!!!", "Frage"]'::jsonb,'Krankmeldung',
   'Der Betreff nennt kurz und klar das Thema.',NOW()),
  ('a2000000-0000-0004-0099-000000000004','a2000000-0000-0000-0004-000000000099',
   '"Worum geht es?" fragt nach:','multiple_choice',
   '["dem Thema", "der Uhrzeit", "dem Namen", "der Telefonnummer"]'::jsonb,
   'dem Thema',
   '"Worum geht es?" = What is it about?',NOW()),
  ('a2000000-0000-0004-0099-000000000005','a2000000-0000-0000-0004-000000000099',
   'Verbinde richtig: "Er ist müde, weil er ___ ___."','multiple_choice',
   '["Überstunden gemacht hat", "hat Überstunden gemacht", "gemacht Überstunden hat", "hat gemacht Überstunden"]'::jsonb,
   'Überstunden gemacht hat',
   'Im weil-Satz mit Perfekt: Partizip + Hilfsverb ganz am Ende.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 05 – Wohnen & Zusammenleben
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('a2000000-0000-0000-0005-000000000001','a2000000-0000-0000-0000-000000000005',
   'a2-wohnungssuche','Die Wohnungssuche',
   '<h2>Die Wohnungssuche</h2>
<h3>1. Wohnungsanzeigen verstehen</h3>
<ul>
<li><strong>2-Zimmer-Wohnung, 55 m², 3. OG</strong> – zwei Zimmer, 55 Quadratmeter, 3. Obergeschoss</li>
<li><strong>Kaltmiete / Warmmiete</strong> – ohne / mit Nebenkosten</li>
<li><strong>die Kaution</strong> – meist 2–3 Kaltmieten als Sicherheit</li>
<li><strong>ab sofort / ab 1.9.</strong> – frei ab wann</li>
<li><strong>WG-Zimmer</strong> – ein Zimmer in einer Wohngemeinschaft</li>
</ul>
<h3>2. Bei der Besichtigung fragen</h3>
<ul>
<li>Wie hoch sind die <strong>Nebenkosten</strong>?</li>
<li>Ist die Wohnung <strong>möbliert</strong>?</li>
<li>Gibt es einen <strong>Keller</strong> / <strong>Balkon</strong> / <strong>Aufzug</strong>?</li>
<li>Sind <strong>Haustiere</strong> erlaubt?</li>
</ul>
<h3>3. Mini-Dialog</h3>
<p><em>— Die Wohnung gefällt mir sehr. Wie hoch ist die Kaution?<br>
— Zwei Kaltmieten, also 1300 Euro.<br>
— Und ab wann ist die Wohnung frei?<br>
— Ab dem ersten Oktober.</em></p>',
   1,NOW()),
  ('a2000000-0000-0000-0005-000000000002','a2000000-0000-0000-0000-000000000005',
   'a2-wechselpraepositionen','Wo ist was? Wechselpräpositionen',
   '<h2>Wo ist was? Wechselpräpositionen</h2>
<p>in, an, auf, über, unter, vor, hinter, neben, zwischen — die wichtigsten Präpositionen fürs Wohnen.</p>
<h3>1. WO? → Dativ (Position)</h3>
<ul>
<li>Die Lampe hängt <strong>über dem</strong> Tisch.</li>
<li>Der Teppich liegt <strong>unter dem</strong> Sofa.</li>
<li>Das Bild hängt <strong>an der</strong> Wand.</li>
<li>Die Katze schläft <strong>auf dem</strong> Bett.</li>
</ul>
<h3>2. WOHIN? → Akkusativ (Bewegung)</h3>
<ul>
<li>Ich hänge die Lampe <strong>über den</strong> Tisch.</li>
<li>Ich lege den Teppich <strong>unter das</strong> Sofa.</li>
<li>Ich hänge das Bild <strong>an die</strong> Wand.</li>
<li>Die Katze springt <strong>auf das</strong> Bett.</li>
</ul>
<h3>3. Die Verb-Paare</h3>
<table>
<thead><tr><th>WO? (Dativ)</th><th>WOHIN? (Akkusativ)</th></tr></thead>
<tbody>
<tr><td>stehen</td><td>stellen</td></tr>
<tr><td>liegen</td><td>legen</td></tr>
<tr><td>hängen</td><td>hängen</td></tr>
<tr><td>sitzen</td><td>setzen</td></tr>
</tbody>
</table>',
   2,NOW()),
  ('a2000000-0000-0000-0005-000000000003','a2000000-0000-0000-0000-000000000005',
   'a2-nachbarn-vergleiche','Nachbarn & Vergleiche',
   '<h2>Nachbarn & Vergleiche</h2>
<h3>1. Der Komparativ</h3>
<ul>
<li>klein → <strong>kleiner</strong> | groß → <strong>größer</strong> | teuer → <strong>teurer</strong></li>
<li>Meine neue Wohnung ist <strong>größer als</strong> die alte.</li>
<li>Die Miete ist leider auch <strong>höher als</strong> vorher.</li>
</ul>
<h3>2. genauso ... wie</h3>
<ul>
<li>Das neue Viertel ist <strong>genauso schön wie</strong> das alte.</li>
<li>Mein Zimmer ist <strong>nicht so groß wie</strong> deins.</li>
</ul>
<h3>3. Mit Nachbarn sprechen</h3>
<ul>
<li><strong>Willkommen im Haus! Ich bin Ihre Nachbarin aus dem zweiten Stock.</strong></li>
<li><strong>Entschuldigung, könnten Sie die Musik etwas leiser machen?</strong></li>
<li><strong>Könnten Sie mein Paket annehmen? Ich bin morgen nicht da.</strong></li>
<li>die Hausordnung – Regeln für alle im Haus (z. B. Ruhezeiten ab 22 Uhr)</li>
</ul>',
   3,NOW()),
  ('a2000000-0000-0000-0005-000000000099','a2000000-0000-0000-0000-000000000005',
   'a2-room05-quiz','Checkpoint: Wohnen & Zusammenleben',
   '<h2>Checkpoint Quiz</h2><p>Wohnungssuche, Wechselpräpositionen und Vergleiche — auf zum nächsten Raum!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('a2000000-0000-0005-0001-000000000001','a2000000-0000-0000-0005-000000000001',
   'Was ist die "Warmmiete"?','multiple_choice',
   '["Miete mit Nebenkosten", "Miete ohne Nebenkosten", "Die Kaution", "Die Heizung"]'::jsonb,
   'Miete mit Nebenkosten',
   'Warmmiete = Kaltmiete + Nebenkosten (Heizung, Wasser...).',NOW()),
  ('a2000000-0000-0005-0001-000000000002','a2000000-0000-0000-0005-000000000001',
   'Was ist die Kaution?','multiple_choice',
   '["Eine Sicherheitszahlung", "Die erste Miete", "Eine Strafe", "Die Nebenkosten"]'::jsonb,
   'Eine Sicherheitszahlung',
   'Die Kaution (meist 2–3 Kaltmieten) bekommst du beim Auszug zurück.',NOW()),
  ('a2000000-0000-0005-0001-000000000003','a2000000-0000-0000-0005-000000000001',
   '"3. OG" bedeutet:','multiple_choice',
   '["Drittes Obergeschoss", "Drei Zimmer", "Drei Personen", "Dritter Oktober"]'::jsonb,
   'Drittes Obergeschoss',
   'OG = Obergeschoss (floor).',NOW()),

  ('a2000000-0000-0005-0002-000000000001','a2000000-0000-0000-0005-000000000002',
   'WO? "Das Bild hängt ___ Wand."','multiple_choice',
   '["an der", "an die", "auf der", "in die"]'::jsonb,'an der',
   'Position (WO?) → Dativ: an der Wand.',NOW()),
  ('a2000000-0000-0005-0002-000000000002','a2000000-0000-0000-0005-000000000002',
   'WOHIN? "Die Katze springt ___ Bett."','multiple_choice',
   '["auf dem", "auf das", "auf der", "auf den"]'::jsonb,'auf das',
   'Bewegung (WOHIN?) → Akkusativ: auf das Bett.',NOW()),
  ('a2000000-0000-0005-0002-000000000003','a2000000-0000-0000-0005-000000000002',
   'Welches Verb passt? "Ich ___ die Vase auf den Tisch."','multiple_choice',
   '["stelle", "stehe", "liege", "sitze"]'::jsonb,'stelle',
   'Bewegung → stellen (WO? → stehen).',NOW()),

  ('a2000000-0000-0005-0003-000000000001','a2000000-0000-0000-0005-000000000003',
   'Komparativ von "groß":','multiple_choice',
   '["großer", "größer", "am größten", "mehr groß"]'::jsonb,'größer',
   'groß → größer (mit Umlaut).',NOW()),
  ('a2000000-0000-0005-0003-000000000002','a2000000-0000-0000-0005-000000000003',
   '"Meine Wohnung ist größer ___ die alte."','multiple_choice',
   '["als", "wie", "von", "dass"]'::jsonb,'als',
   'Komparativ + als: größer als.',NOW()),

  ('a2000000-0000-0005-0099-000000000001','a2000000-0000-0000-0005-000000000099',
   '"Genauso schön ___ das alte Viertel."','multiple_choice',
   '["als", "wie", "so", "denn"]'::jsonb,'wie',
   'genauso ... wie (Gleichheit); als nur beim Komparativ.',NOW()),
  ('a2000000-0000-0005-0099-000000000002','a2000000-0000-0000-0005-000000000099',
   'WO? "Der Teppich liegt ___ Sofa."','multiple_choice',
   '["unter dem", "unter das", "unter den", "unter die"]'::jsonb,'unter dem',
   'Position → Dativ: unter dem Sofa.',NOW()),
  ('a2000000-0000-0005-0099-000000000003','a2000000-0000-0000-0005-000000000099',
   'Höfliche Bitte an den Nachbarn:','multiple_choice',
   '["Könnten Sie die Musik etwas leiser machen?", "Musik aus! Sofort!", "Ihre Musik ist schlecht.", "Ich rufe die Polizei."]'::jsonb,
   'Könnten Sie die Musik etwas leiser machen?',
   '"Könnten Sie..." ist die höfliche Bitte.',NOW()),
  ('a2000000-0000-0005-0099-000000000004','a2000000-0000-0000-0005-000000000099',
   'Was regelt die Hausordnung?','multiple_choice',
   '["Regeln für alle im Haus", "Die Miete", "Den Kaufvertrag", "Die Möbel"]'::jsonb,
   'Regeln für alle im Haus',
   'Z. B. Ruhezeiten, Treppenhausreinigung, Müll.',NOW()),
  ('a2000000-0000-0005-0099-000000000005','a2000000-0000-0000-0005-000000000099',
   'Komparativ von "teuer":','multiple_choice',
   '["teuerer", "teurer", "am teuersten", "mehr teuer"]'::jsonb,'teurer',
   'teuer → teurer (das zweite e fällt weg).',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 06 – Feste & Kultur
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('a2000000-0000-0000-0006-000000000001','a2000000-0000-0000-0000-000000000006',
   'a2-feste-deutschland','Feste in Deutschland',
   '<h2>Feste in Deutschland</h2>
<h3>1. Die wichtigsten Feste im Jahr</h3>
<ul>
<li><strong>Karneval / Fasching</strong> (Februar) – Kostüme, Umzüge, besonders in Köln und Mainz</li>
<li><strong>Ostern</strong> (März/April) – Ostereier suchen, Familienessen</li>
<li><strong>der Tag der Deutschen Einheit</strong> (3. Oktober) – Nationalfeiertag</li>
<li><strong>das Oktoberfest</strong> (September/Oktober) – das größte Volksfest der Welt, in München</li>
<li><strong>der Advent & Weihnachten</strong> (Dezember) – Weihnachtsmärkte, Plätzchen, Geschenke am 24.12.</li>
<li><strong>Silvester</strong> (31. Dezember) – Feuerwerk und "Frohes neues Jahr!"</li>
</ul>
<h3>2. Glückwünsche</h3>
<ul>
<li><strong>Herzlichen Glückwunsch zum Geburtstag!</strong></li>
<li><strong>Frohe Weihnachten!</strong> / <strong>Frohe Ostern!</strong></li>
<li><strong>Einen guten Rutsch ins neue Jahr!</strong> (vor Silvester)</li>
<li><strong>Alles Gute!</strong> – passt fast immer</li>
</ul>
<h3>3. Kulturtipp</h3>
<p>Auf Weihnachtsmärkten trinkt man <strong>Glühwein</strong> und isst <strong>gebrannte Mandeln</strong>. Die Märkte öffnen meist Ende November.</p>',
   1,NOW()),
  ('a2000000-0000-0000-0006-000000000002','a2000000-0000-0000-0000-000000000006',
   'a2-einladungen','Einladungen: zusagen & absagen',
   '<h2>Einladungen: zusagen & absagen</h2>
<h3>1. Einladen</h3>
<ul>
<li><strong>Ich möchte dich zu meiner Party einladen.</strong></li>
<li><strong>Hast du am Samstag Zeit?</strong></li>
<li><strong>Kommst du auch?</strong></li>
</ul>
<h3>2. Zusagen</h3>
<ul>
<li><strong>Ja, gern! Ich komme.</strong></li>
<li><strong>Danke für die Einladung! Ich freue mich.</strong></li>
<li><strong>Soll ich etwas mitbringen?</strong> – die wichtigste deutsche Partyfrage!</li>
</ul>
<h3>3. Höflich absagen</h3>
<ul>
<li><strong>Es tut mir leid, aber ich kann leider nicht kommen.</strong></li>
<li><strong>Schade, da habe ich schon etwas vor.</strong></li>
<li><strong>Vielleicht klappt es beim nächsten Mal!</strong></li>
</ul>
<p>Tipp: In Deutschland sagt man bei Einladungen fast immer klar zu oder ab — ein unverbindliches "mal sehen" gilt als unhöflich.</p>',
   2,NOW()),
  ('a2000000-0000-0000-0006-000000000003','a2000000-0000-0000-0000-000000000006',
   'a2-war-hatte','Erzählen mit war & hatte',
   '<h2>Erzählen mit war & hatte</h2>
<p>Beim Erzählen benutzt man "sein" und "haben" meist im <strong>Präteritum</strong> — auch beim Sprechen.</p>
<h3>1. Die Formen</h3>
<table>
<thead><tr><th></th><th>sein → war</th><th>haben → hatte</th></tr></thead>
<tbody>
<tr><td>ich</td><td>war</td><td>hatte</td></tr>
<tr><td>du</td><td>warst</td><td>hattest</td></tr>
<tr><td>er/sie/es</td><td>war</td><td>hatte</td></tr>
<tr><td>wir</td><td>waren</td><td>hatten</td></tr>
<tr><td>ihr</td><td>wart</td><td>hattet</td></tr>
<tr><td>sie/Sie</td><td>waren</td><td>hatten</td></tr>
</tbody>
</table>
<h3>2. Vom Fest erzählen</h3>
<p><em>Die Party <strong>war</strong> super! Wir <strong>waren</strong> ungefähr zwanzig Leute. Das Essen <strong>war</strong> lecker, und wir <strong>hatten</strong> viel Spaß. Nur das Wetter <strong>war</strong> schlecht — aber das <strong>war</strong> egal!</em></p>
<h3>3. Typische Fragen</h3>
<ul>
<li><strong>Wie war dein Wochenende?</strong> – Es war schön / anstrengend / ruhig.</li>
<li><strong>Wie war das Fest?</strong> – Es war toll! Wir hatten viel Spaß.</li>
<li><strong>Wart ihr auch da?</strong> – Nein, wir hatten leider keine Zeit.</li>
</ul>',
   3,NOW()),
  ('a2000000-0000-0000-0006-000000000099','a2000000-0000-0000-0000-000000000006',
   'a2-room06-quiz','Checkpoint: Feste & Kultur',
   '<h2>Checkpoint Quiz</h2><p>Feste, Einladungen und war/hatte — das große A2-Finale!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('a2000000-0000-0006-0001-000000000001','a2000000-0000-0000-0006-000000000001',
   'Wann ist der Tag der Deutschen Einheit?','multiple_choice',
   '["Am 1. Mai", "Am 3. Oktober", "Am 24. Dezember", "Am 31. Dezember"]'::jsonb,
   'Am 3. Oktober',
   'Der 3. Oktober ist der deutsche Nationalfeiertag.',NOW()),
  ('a2000000-0000-0006-0001-000000000002','a2000000-0000-0000-0006-000000000001',
   'Was sagt man vor Silvester?','multiple_choice',
   '["Einen guten Rutsch!", "Frohe Ostern!", "Herzlichen Glückwunsch!", "Gute Besserung!"]'::jsonb,
   'Einen guten Rutsch!',
   '"Einen guten Rutsch ins neue Jahr!" sagt man VOR Silvester.',NOW()),
  ('a2000000-0000-0006-0001-000000000003','a2000000-0000-0000-0006-000000000001',
   'Wo findet das Oktoberfest statt?','multiple_choice',
   '["In Berlin", "In München", "In Köln", "In Hamburg"]'::jsonb,
   'In München',
   'Das Oktoberfest ist das größte Volksfest der Welt — in München.',NOW()),

  ('a2000000-0000-0006-0002-000000000001','a2000000-0000-0000-0006-000000000002',
   'Die klassische deutsche Partyfrage:','multiple_choice',
   '["Soll ich etwas mitbringen?", "Wer bezahlt?", "Wann ist Schluss?", "Wo parke ich?"]'::jsonb,
   'Soll ich etwas mitbringen?',
   'Bei Einladungen bietet man in Deutschland fast immer an, etwas mitzubringen.',NOW()),
  ('a2000000-0000-0006-0002-000000000002','a2000000-0000-0000-0006-000000000002',
   'Höflich absagen:','multiple_choice',
   '["Es tut mir leid, aber ich kann leider nicht kommen.", "Nein.", "Keine Lust.", "Vielleicht, mal sehen."]'::jsonb,
   'Es tut mir leid, aber ich kann leider nicht kommen.',
   'Klar und höflich absagen — "mal sehen" gilt als unhöflich.',NOW()),

  ('a2000000-0000-0006-0003-000000000001','a2000000-0000-0000-0006-000000000003',
   'Präteritum: "Wie ___ dein Wochenende?"','multiple_choice',
   '["war", "warst", "waren", "hatte"]'::jsonb,'war',
   '"Das Wochenende" = es → war.',NOW()),
  ('a2000000-0000-0006-0003-000000000002','a2000000-0000-0000-0006-000000000003',
   'Ergänze: "Wir ___ viel Spaß."','multiple_choice',
   '["hatten", "waren", "hatte", "habt"]'::jsonb,'hatten',
   'Spaß haben → wir hatten viel Spaß.',NOW()),
  ('a2000000-0000-0006-0003-000000000003','a2000000-0000-0000-0006-000000000003',
   'Ergänze: "___ ihr auch da?"','multiple_choice',
   '["Wart", "Waren", "Warst", "War"]'::jsonb,'Wart',
   '2. Person Plural: ihr wart.',NOW()),

  ('a2000000-0000-0006-0099-000000000001','a2000000-0000-0000-0006-000000000099',
   'Was trinkt man auf dem Weihnachtsmarkt?','multiple_choice',
   '["Glühwein", "Eistee", "Limonade", "Milchkaffee"]'::jsonb,'Glühwein',
   'Glühwein ist DAS Weihnachtsmarkt-Getränk.',NOW()),
  ('a2000000-0000-0006-0099-000000000002','a2000000-0000-0000-0006-000000000099',
   '"Herzlichen Glückwunsch zum Geburtstag!" sagt man:','multiple_choice',
   '["Zum Geburtstag", "Zu Weihnachten", "Zu Silvester", "Zu Ostern"]'::jsonb,
   'Zum Geburtstag',
   'Die Standard-Gratulation zum Geburtstag.',NOW()),
  ('a2000000-0000-0006-0099-000000000003','a2000000-0000-0000-0006-000000000099',
   'Ergänze: "Die Party ___ super, und wir ___ viel Spaß."','multiple_choice',
   '["war / hatten", "hatte / waren", "war / waren", "hatten / war"]'::jsonb,
   'war / hatten',
   'Die Party war (sein), wir hatten Spaß (haben).',NOW()),
  ('a2000000-0000-0006-0099-000000000004','a2000000-0000-0000-0006-000000000099',
   'Jemand lädt dich ein und du hast Zeit. Du sagst:','multiple_choice',
   '["Danke für die Einladung! Ich freue mich.", "Mal sehen.", "Warum ich?", "Ich antworte später."]'::jsonb,
   'Danke für die Einladung! Ich freue mich.',
   'Klar zusagen und sich bedanken.',NOW()),
  ('a2000000-0000-0006-0099-000000000005','a2000000-0000-0000-0006-000000000099',
   'Karneval feiert man besonders in:','multiple_choice',
   '["Köln und Mainz", "München und Stuttgart", "Hamburg und Bremen", "Dresden und Leipzig"]'::jsonb,
   'Köln und Mainz',
   'Die Karnevalshochburgen liegen im Rheinland.',NOW())
ON CONFLICT (id) DO NOTHING;
