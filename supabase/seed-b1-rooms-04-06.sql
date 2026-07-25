-- ============================================================
-- DeutschPilot – B1 Rooms 04–06 (Bildung, Behörden, Gesellschaft)
-- Same pattern as seed-b1-rooms-01-03.sql. Additive only,
-- ON CONFLICT DO NOTHING.
-- ============================================================

-- ── COURSES ─────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES
  ('b1000000-0000-0000-0000-000000000004','education-b1',
   'B1 Room 04 – Bildung & Weiterbildung',
   'Talk about your education path, understand course offers, and use Infinitiv mit zu.',
   'B1','de',TRUE,NOW()),
  ('b1000000-0000-0000-0000-000000000005','bureaucracy-b1',
   'B1 Room 05 – Behörden & Formalitäten',
   'Survive German bureaucracy: Anmeldung, forms, official letters, and polite formal requests.',
   'B1','de',TRUE,NOW()),
  ('b1000000-0000-0000-0000-000000000006','society-relationships-b1',
   'B1 Room 06 – Beziehungen & Gesellschaft',
   'Talk about relationships and social life, use relative clauses, and describe people precisely.',
   'B1','de',TRUE,NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 04 – Bildung & Weiterbildung
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b1000000-0000-0000-0004-000000000001','b1000000-0000-0000-0000-000000000004',
   'b1-bildungsweg','Der Bildungsweg in Deutschland',
   '<h2>Der Bildungsweg in Deutschland</h2>
<h3>1. Die Stationen</h3>
<ul>
<li><strong>die Grundschule</strong> (Klasse 1–4) → danach verschiedene Schulformen</li>
<li><strong>das Gymnasium</strong> → endet mit dem <strong>Abitur</strong> (Studienberechtigung)</li>
<li><strong>die Ausbildung</strong> – praktischer Beruf + Berufsschule (das duale System)</li>
<li><strong>das Studium</strong> an Universität oder Fachhochschule → Bachelor, Master</li>
<li><strong>die Weiterbildung</strong> – Kurse neben dem Beruf, z. B. an der Volkshochschule (VHS)</li>
</ul>
<h3>2. Über den eigenen Weg sprechen</h3>
<ul>
<li>Ich habe in ... die Schule <strong>besucht</strong> / <strong>abgeschlossen</strong>.</li>
<li>Ich habe eine Ausbildung <strong>als</strong> Elektrikerin <strong>gemacht</strong>.</li>
<li>Ich habe ... <strong>studiert</strong> und mit dem Bachelor <strong>abgeschlossen</strong>.</li>
<li>Mein Abschluss wurde in Deutschland <strong>anerkannt</strong>. (wichtig für Zugewanderte!)</li>
</ul>
<h3>3. Nützlich zu wissen</h3>
<p>Die <strong>Anerkennung ausländischer Abschlüsse</strong> läuft über die Website "Anerkennung in Deutschland". Die <strong>VHS</strong> bietet günstige Kurse — von Deutsch bis Computerkurse.</p>',
   1,NOW()),
  ('b1000000-0000-0000-0004-000000000002','b1000000-0000-0000-0000-000000000004',
   'b1-infinitiv-zu','Pläne & Ziele: Infinitiv mit zu',
   '<h2>Pläne & Ziele: Infinitiv mit zu</h2>
<h3>1. Nach bestimmten Verben und Ausdrücken</h3>
<ul>
<li>Ich habe vor, einen Kurs <strong>zu machen</strong>.</li>
<li>Ich versuche, jeden Tag <strong>zu lernen</strong>.</li>
<li>Es ist wichtig, regelmäßig <strong>zu üben</strong>.</li>
<li>Ich habe keine Zeit, fernzusehen. (trennbares Verb: fern<strong>zu</strong>sehen!)</li>
</ul>
<h3>2. um ... zu (Ziel/Zweck)</h3>
<ul>
<li>Ich lerne Deutsch, <strong>um</strong> in Deutschland <strong>zu arbeiten</strong>.</li>
<li>Sie macht eine Weiterbildung, <strong>um</strong> mehr <strong>zu verdienen</strong>.</li>
</ul>
<h3>3. ohne ... zu / statt ... zu</h3>
<ul>
<li>Er ging, <strong>ohne</strong> sich <strong>zu verabschieden</strong>.</li>
<li><strong>Statt</strong> zu klagen, solltest du üben.</li>
</ul>
<p>Merke: Kein "zu" nach Modalverben (ich will lernen) und nach werden (ich werde lernen).</p>',
   2,NOW()),
  ('b1000000-0000-0000-0004-000000000003','b1000000-0000-0000-0000-000000000004',
   'b1-kursangebote','Kursangebote verstehen & buchen',
   '<h2>Kursangebote verstehen & buchen</h2>
<h3>1. Die Kursbeschreibung entschlüsseln</h3>
<ul>
<li><strong>der Einstufungstest</strong> – zeigt dein Niveau vor Kursbeginn</li>
<li><strong>die Teilnahmegebühr</strong> – was der Kurs kostet</li>
<li><strong>die Ermäßigung</strong> – Rabatt (z. B. für Studierende, Arbeitslose)</li>
<li><strong>der Präsenzkurs ↔ der Onlinekurs</strong></li>
<li><strong>die Teilnahmebescheinigung</strong> – Nachweis am Ende</li>
</ul>
<h3>2. Fragen zur Anmeldung</h3>
<ul>
<li>Gibt es noch <strong>freie Plätze</strong>?</li>
<li>Wann <strong>findet</strong> der Kurs <strong>statt</strong>?</li>
<li>Gibt es eine <strong>Ermäßigung</strong> für Studierende?</li>
<li>Kann ich die Teilnahme <strong>stornieren</strong>, wenn ich krank werde?</li>
</ul>
<h3>3. Kurz-E-Mail zur Anmeldung</h3>
<p><em>Sehr geehrte Damen und Herren,<br>
ich interessiere mich für den Deutschkurs B1 am Abend. Könnten Sie mir mitteilen, ob es noch freie Plätze gibt und wie hoch die Teilnahmegebühr ist?<br>
Mit freundlichen Grüßen</em></p>',
   3,NOW()),
  ('b1000000-0000-0000-0004-000000000099','b1000000-0000-0000-0000-000000000004',
   'b1-room04-quiz','Checkpoint: Bildung & Weiterbildung',
   '<h2>Checkpoint Quiz</h2><p>Bildungsweg, Infinitiv mit zu und Kursangebote — weiter geht es!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b1000000-0000-0004-0001-000000000001','b1000000-0000-0000-0004-000000000001',
   'Was ist das "duale System"?','multiple_choice',
   '["Ausbildung im Betrieb + Berufsschule", "Zwei Studiengänge gleichzeitig", "Schule am Vormittag und Abend", "Bachelor und Master"]'::jsonb,
   'Ausbildung im Betrieb + Berufsschule',
   'Die duale Ausbildung kombiniert Praxis im Betrieb mit Theorie in der Berufsschule.',NOW()),
  ('b1000000-0000-0004-0001-000000000002','b1000000-0000-0000-0004-000000000001',
   'Womit endet das Gymnasium?','multiple_choice',
   '["Mit dem Abitur", "Mit dem Bachelor", "Mit der Ausbildung", "Mit dem Einstufungstest"]'::jsonb,
   'Mit dem Abitur',
   'Das Abitur berechtigt zum Studium.',NOW()),
  ('b1000000-0000-0004-0001-000000000003','b1000000-0000-0000-0004-000000000001',
   'Was bedeutet "Mein Abschluss wurde anerkannt"?','multiple_choice',
   '["Er gilt offiziell auch in Deutschland", "Er wurde verloren", "Er war zu alt", "Er wurde übersetzt"]'::jsonb,
   'Er gilt offiziell auch in Deutschland',
   'Anerkennung = der ausländische Abschluss zählt offiziell.',NOW()),

  ('b1000000-0000-0004-0002-000000000001','b1000000-0000-0000-0004-000000000002',
   '"Ich habe vor, einen Kurs ___ ___."','multiple_choice',
   '["zu machen", "machen zu", "zu mache", "machen"]'::jsonb,'zu machen',
   'vorhaben + Infinitiv mit zu: ..., einen Kurs zu machen.',NOW()),
  ('b1000000-0000-0004-0002-000000000002','b1000000-0000-0000-0004-000000000002',
   '"Ich lerne Deutsch, ___ in Deutschland zu arbeiten."','multiple_choice',
   '["um", "für", "damit", "weil"]'::jsonb,'um',
   'Ziel/Zweck mit gleichem Subjekt: um ... zu.',NOW()),
  ('b1000000-0000-0004-0002-000000000003','b1000000-0000-0000-0004-000000000002',
   'Trennbares Verb mit zu: "Ich habe keine Zeit, ___."','multiple_choice',
   '["fernzusehen", "zu fernsehen", "fernsehen zu", "zu fern zu sehen"]'::jsonb,
   'fernzusehen',
   'Bei trennbaren Verben wandert "zu" in die Mitte: fern-zu-sehen.',NOW()),

  ('b1000000-0000-0004-0003-000000000001','b1000000-0000-0000-0004-000000000003',
   'Was ist eine "Ermäßigung"?','multiple_choice',
   '["Ein Rabatt", "Eine Strafe", "Ein Test", "Eine Bescheinigung"]'::jsonb,'Ein Rabatt',
   'Ermäßigung = reduzierter Preis, z. B. für Studierende.',NOW()),
  ('b1000000-0000-0004-0003-000000000002','b1000000-0000-0000-0004-000000000003',
   'Was zeigt der Einstufungstest?','multiple_choice',
   '["Dein aktuelles Sprachniveau", "Deine Noten", "Deine Anwesenheit", "Deine Gebühren"]'::jsonb,
   'Dein aktuelles Sprachniveau',
   'Der Einstufungstest ordnet dich vor Kursbeginn dem richtigen Niveau zu.',NOW()),

  ('b1000000-0000-0004-0099-000000000001','b1000000-0000-0000-0004-000000000099',
   'Wo gibt es günstige Weiterbildungskurse?','multiple_choice',
   '["An der Volkshochschule (VHS)", "Nur an Universitäten", "Nur online", "Im Rathaus"]'::jsonb,
   'An der Volkshochschule (VHS)',
   'Die VHS ist die klassische günstige Weiterbildungsadresse.',NOW()),
  ('b1000000-0000-0004-0099-000000000002','b1000000-0000-0000-0004-000000000099',
   'Wo steht KEIN "zu"?','multiple_choice',
   '["Ich will Deutsch lernen.", "Ich versuche, Deutsch ... lernen.", "Es ist wichtig, ... üben.", "Ich habe vor, ... machen."]'::jsonb,
   'Ich will Deutsch lernen.',
   'Nach Modalverben steht der reine Infinitiv ohne zu.',NOW()),
  ('b1000000-0000-0004-0099-000000000003','b1000000-0000-0000-0004-000000000099',
   '"Er ging, ___ sich zu verabschieden."','multiple_choice',
   '["ohne", "um", "statt", "für"]'::jsonb,'ohne',
   'ohne ... zu = etwas passiert nicht dabei.',NOW()),
  ('b1000000-0000-0004-0099-000000000004','b1000000-0000-0000-0004-000000000099',
   'Was bekommst du am Kursende als Nachweis?','multiple_choice',
   '["Die Teilnahmebescheinigung", "Die Ermäßigung", "Den Einstufungstest", "Die Teilnahmegebühr"]'::jsonb,
   'Die Teilnahmebescheinigung',
   'Die Bescheinigung dokumentiert die Teilnahme.',NOW()),
  ('b1000000-0000-0004-0099-000000000005','b1000000-0000-0000-0004-000000000099',
   '"Sie macht eine Weiterbildung, um mehr ___ ___."','multiple_choice',
   '["zu verdienen", "verdienen zu", "zu verdient", "verdienen"]'::jsonb,
   'zu verdienen',
   'um ... zu + Infinitiv am Ende.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 05 – Behörden & Formalitäten
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b1000000-0000-0000-0005-000000000001','b1000000-0000-0000-0000-000000000005',
   'b1-anmeldung-amt','Die Anmeldung & das Bürgeramt',
   '<h2>Die Anmeldung & das Bürgeramt</h2>
<h3>1. Der Klassiker: sich anmelden</h3>
<p>Wer nach Deutschland zieht (oder umzieht), muss sich innerhalb von zwei Wochen beim <strong>Bürgeramt</strong> anmelden. Dafür brauchst du:</p>
<ul>
<li>den <strong>Personalausweis oder Reisepass</strong></li>
<li>die <strong>Wohnungsgeberbestätigung</strong> (vom Vermieter!)</li>
<li>oft einen <strong>Termin</strong> — online buchen, Wochen im Voraus</li>
</ul>
<h3>2. Wichtige Behörden-Wörter</h3>
<ul>
<li><strong>das Formular</strong> – ausfüllen, unterschreiben, abgeben</li>
<li><strong>die Bescheinigung</strong> – offizielles Dokument als Nachweis</li>
<li><strong>der Bescheid</strong> – offizielle Entscheidung per Brief</li>
<li><strong>die Frist</strong> – bis wann etwas erledigt sein muss</li>
<li><strong>beantragen</strong> – offiziell um etwas bitten (einen Antrag stellen)</li>
</ul>
<h3>3. Am Schalter</h3>
<p><em>— Guten Tag, ich möchte mich anmelden. Ich bin letzte Woche umgezogen.<br>
— Haben Sie die Wohnungsgeberbestätigung dabei?<br>
— Ja, hier bitte. Und mein Reisepass.<br>
— Danke. Füllen Sie bitte noch dieses Formular aus.</em></p>',
   1,NOW()),
  ('b1000000-0000-0000-0005-000000000002','b1000000-0000-0000-0000-000000000005',
   'b1-briefe-verstehen','Offizielle Briefe verstehen',
   '<h2>Offizielle Briefe verstehen</h2>
<h3>1. Die Struktur eines Behördenbriefs</h3>
<ul>
<li><strong>Betreff</strong> – das Thema in einer Zeile (immer zuerst lesen!)</li>
<li><strong>Aktenzeichen</strong> – die Nummer deines Falls (bei Antworten angeben)</li>
<li><strong>die Frist</strong> – "bis zum 15.08." — im Kalender markieren!</li>
</ul>
<h3>2. Typische Formulierungen übersetzt</h3>
<ul>
<li><em>"Wir bitten um Rückmeldung bis ..."</em> → Antworte bis zu diesem Datum.</li>
<li><em>"Reichen Sie folgende Unterlagen ein: ..."</em> → Schicke diese Dokumente.</li>
<li><em>"Andernfalls ..."</em> → Sonst passiert Folgendes (oft nichts Gutes).</li>
<li><em>"Widerspruch einlegen"</em> → offiziell gegen eine Entscheidung protestieren (meist innerhalb eines Monats).</li>
</ul>
<h3>3. Die 3-Schritte-Strategie</h3>
<ol>
<li><strong>Betreff + Absender</strong> lesen: Worum geht es, von wem?</li>
<li><strong>Frist suchen</strong>: Gibt es ein Datum? Markieren!</li>
<li><strong>Was muss ich tun?</strong> Meist steht es im letzten Absatz. Im Zweifel: nachfragen oder Hilfe holen (Migrationsberatung ist kostenlos).</li>
</ol>',
   2,NOW()),
  ('b1000000-0000-0000-0005-000000000003','b1000000-0000-0000-0000-000000000005',
   'b1-hoefliche-anfragen','Höfliche Anfragen: Konjunktiv II',
   '<h2>Höfliche Anfragen: Konjunktiv II</h2>
<h3>1. Die Höflichkeits-Formeln</h3>
<ul>
<li><strong>Könnten Sie mir bitte helfen?</strong></li>
<li><strong>Würden Sie mir das Formular erklären?</strong></li>
<li><strong>Ich hätte eine Frage.</strong></li>
<li><strong>Wäre es möglich, den Termin zu verschieben?</strong></li>
<li><strong>Ich würde gern einen Antrag stellen.</strong></li>
</ul>
<h3>2. Direkt vs. höflich</h3>
<table>
<thead><tr><th>Direkt (unhöflich)</th><th>Höflich (Konjunktiv II)</th></tr></thead>
<tbody>
<tr><td>Helfen Sie mir!</td><td>Könnten Sie mir bitte helfen?</td></tr>
<tr><td>Ich will einen Termin.</td><td>Ich hätte gern einen Termin.</td></tr>
<tr><td>Erklären Sie das!</td><td>Würden Sie mir das bitte erklären?</td></tr>
</tbody>
</table>
<h3>3. Nachfragen, wenn etwas unklar ist</h3>
<ul>
<li><strong>Entschuldigung, das habe ich nicht verstanden. Könnten Sie das bitte wiederholen?</strong></li>
<li><strong>Was bedeutet dieses Wort?</strong> – Fragen ist erlaubt und normal!</li>
<li><strong>Könnten Sie bitte etwas langsamer sprechen?</strong></li>
</ul>',
   3,NOW()),
  ('b1000000-0000-0000-0005-000000000099','b1000000-0000-0000-0000-000000000005',
   'b1-room05-quiz','Checkpoint: Behörden & Formalitäten',
   '<h2>Checkpoint Quiz</h2><p>Anmeldung, Behördenbriefe und höfliche Anfragen — der Bürokratie-Check!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b1000000-0000-0005-0001-000000000001','b1000000-0000-0000-0005-000000000001',
   'Was brauchst du vom Vermieter für die Anmeldung?','multiple_choice',
   '["Die Wohnungsgeberbestätigung", "Den Mietvertrag-Entwurf", "Eine Visitenkarte", "Die Kaution"]'::jsonb,
   'Die Wohnungsgeberbestätigung',
   'Ohne Wohnungsgeberbestätigung keine Anmeldung.',NOW()),
  ('b1000000-0000-0005-0001-000000000002','b1000000-0000-0000-0005-000000000001',
   'Was ist "die Frist"?','multiple_choice',
   '["Bis wann etwas erledigt sein muss", "Eine Gebühr", "Ein Formular", "Ein Termin beim Arzt"]'::jsonb,
   'Bis wann etwas erledigt sein muss',
   'Frist = Deadline. Immer im Kalender markieren!',NOW()),
  ('b1000000-0000-0005-0001-000000000003','b1000000-0000-0000-0005-000000000001',
   '"Beantragen" bedeutet:','multiple_choice',
   '["Offiziell um etwas bitten", "Etwas bezahlen", "Etwas ablehnen", "Etwas verlieren"]'::jsonb,
   'Offiziell um etwas bitten',
   'Einen Antrag stellen = beantragen.',NOW()),

  ('b1000000-0000-0005-0002-000000000001','b1000000-0000-0000-0005-000000000002',
   'Was liest du in einem Behördenbrief ZUERST?','multiple_choice',
   '["Betreff und Absender", "Die Unterschrift", "Das Kleingedruckte", "Das Datum von gestern"]'::jsonb,
   'Betreff und Absender',
   'Betreff + Absender sagen dir sofort, worum es geht.',NOW()),
  ('b1000000-0000-0005-0002-000000000002','b1000000-0000-0000-0005-000000000002',
   '"Widerspruch einlegen" bedeutet:','multiple_choice',
   '["Offiziell gegen eine Entscheidung protestieren", "Zustimmen", "Den Brief wegwerfen", "Eine neue Adresse melden"]'::jsonb,
   'Offiziell gegen eine Entscheidung protestieren',
   'Gegen Bescheide kann man meist innerhalb eines Monats Widerspruch einlegen.',NOW()),
  ('b1000000-0000-0005-0002-000000000003','b1000000-0000-0000-0005-000000000002',
   '"Andernfalls..." in einem Brief kündigt an:','multiple_choice',
   '["Was passiert, wenn du nicht reagierst", "Ein Geschenk", "Das Ende des Briefes", "Eine Entschuldigung"]'::jsonb,
   'Was passiert, wenn du nicht reagierst',
   '"Andernfalls" = sonst — meist eine Konsequenz.',NOW()),

  ('b1000000-0000-0005-0003-000000000001','b1000000-0000-0000-0005-000000000003',
   'Höflich statt "Ich will einen Termin":','multiple_choice',
   '["Ich hätte gern einen Termin.", "Termin. Jetzt.", "Geben Sie mir einen Termin!", "Ich brauche sofort einen Termin!"]'::jsonb,
   'Ich hätte gern einen Termin.',
   'Konjunktiv II (hätte) macht die Bitte höflich.',NOW()),
  ('b1000000-0000-0005-0003-000000000002','b1000000-0000-0000-0005-000000000003',
   '"___ es möglich, den Termin zu verschieben?"','multiple_choice',
   '["Wäre", "Ist war", "Würde sein", "Hätte"]'::jsonb,'Wäre',
   '"Wäre es möglich..." — die höfliche Standardfrage.',NOW()),

  ('b1000000-0000-0005-0099-000000000001','b1000000-0000-0000-0005-000000000099',
   'Innerhalb welcher Zeit musst du dich nach einem Umzug anmelden?','multiple_choice',
   '["Zwei Wochen", "Sechs Monate", "Ein Jahr", "Es gibt keine Frist"]'::jsonb,
   'Zwei Wochen',
   'Die Anmeldung muss innerhalb von zwei Wochen erfolgen.',NOW()),
  ('b1000000-0000-0005-0099-000000000002','b1000000-0000-0000-0005-000000000099',
   'Was gibst du bei einer Antwort an die Behörde immer an?','multiple_choice',
   '["Das Aktenzeichen", "Dein Lieblingsessen", "Deine Handynummer", "Dein Alter"]'::jsonb,
   'Das Aktenzeichen',
   'Das Aktenzeichen ordnet deinen Fall zu.',NOW()),
  ('b1000000-0000-0005-0099-000000000003','b1000000-0000-0000-0005-000000000099',
   'Du verstehst den Beamten nicht. Was sagst du?','multiple_choice',
   '["Könnten Sie das bitte wiederholen?", "Egal, weiter.", "Ich unterschreibe einfach.", "Auf Wiedersehen."]'::jsonb,
   'Könnten Sie das bitte wiederholen?',
   'Nachfragen ist normal und dein gutes Recht.',NOW()),
  ('b1000000-0000-0005-0099-000000000004','b1000000-0000-0000-0005-000000000099',
   'Was ist "der Bescheid"?','multiple_choice',
   '["Eine offizielle Entscheidung per Brief", "Ein Termin", "Eine Gebühr", "Ein Formular zum Ausfüllen"]'::jsonb,
   'Eine offizielle Entscheidung per Brief',
   'Der Bescheid teilt die Entscheidung der Behörde mit.',NOW()),
  ('b1000000-0000-0005-0099-000000000005','b1000000-0000-0000-0005-000000000099',
   'Wo bekommst du kostenlose Hilfe mit Behördenbriefen?','multiple_choice',
   '["Bei der Migrationsberatung", "Nur beim Anwalt", "Im Supermarkt", "Nirgendwo"]'::jsonb,
   'Bei der Migrationsberatung',
   'Migrationsberatungsstellen helfen kostenlos.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 06 – Beziehungen & Gesellschaft
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b1000000-0000-0000-0006-000000000001','b1000000-0000-0000-0000-000000000006',
   'b1-relativsaetze','Menschen beschreiben: Relativsätze',
   '<h2>Menschen beschreiben: Relativsätze</h2>
<h3>1. Warum Relativsätze?</h3>
<p>Statt zwei kurzer Sätze — ein eleganter:</p>
<ul>
<li><em>Das ist mein Kollege. Er arbeitet in Berlin.</em> →<br>
<em>Das ist mein Kollege, <strong>der</strong> in Berlin <strong>arbeitet</strong>.</em></li>
</ul>
<h3>2. Die Relativpronomen (Nominativ/Akkusativ)</h3>
<table>
<thead><tr><th></th><th>mask.</th><th>fem.</th><th>neut.</th><th>Plural</th></tr></thead>
<tbody>
<tr><td>Nominativ</td><td>der</td><td>die</td><td>das</td><td>die</td></tr>
<tr><td>Akkusativ</td><td>den</td><td>die</td><td>das</td><td>die</td></tr>
</tbody>
</table>
<ul>
<li>Die Frau, <strong>die</strong> nebenan wohnt, ist Ärztin. (Nominativ)</li>
<li>Der Film, <strong>den</strong> wir gesehen haben, war super. (Akkusativ)</li>
<li>Das Buch, <strong>das</strong> du mir empfohlen hast, lese ich gerade.</li>
</ul>
<h3>3. Mit Präposition</h3>
<ul>
<li>Der Freund, <strong>mit dem</strong> ich wohne, kocht gern.</li>
<li>Die Kollegin, <strong>von der</strong> ich erzählt habe, kommt heute.</li>
</ul>',
   1,NOW()),
  ('b1000000-0000-0000-0006-000000000002','b1000000-0000-0000-0000-000000000006',
   'b1-freundschaft-smalltalk','Freundschaften & Small Talk',
   '<h2>Freundschaften & Small Talk in Deutschland</h2>
<h3>1. Du oder Sie?</h3>
<ul>
<li><strong>Sie</strong> + Nachname: Arbeit (anfangs), Behörden, Fremde</li>
<li><strong>du</strong> + Vorname: Freunde, Familie, oft unter Jungen, im Sportverein</li>
<li>Der Wechsel: <em>"Wollen wir uns duzen?"</em> — meist bietet es die ältere/ranghöhere Person an.</li>
</ul>
<h3>2. Small-Talk-Themen, die funktionieren</h3>
<ul>
<li>Das Wetter (der Klassiker), Urlaub & Reisen, Essen, Sport, die Region</li>
<li>Vorsicht bei: Gehalt, Politik, Religion, Alter — eher private Themen.</li>
</ul>
<h3>3. Gespräche am Laufen halten</h3>
<ul>
<li><strong>Echt? Erzähl mal!</strong> / <strong>Wie war das denn?</strong></li>
<li><strong>Das kenne ich!</strong> / <strong>Bei mir war das ähnlich.</strong></li>
<li>Rückfragen stellen zeigt Interesse: <strong>Und wie findest du ...?</strong></li>
</ul>
<p>Kulturhinweis: Deutsche Freundschaften wachsen oft langsam, sind dafür aber stabil. Ein "Wie geht''s?" ist hier eine echte Frage — eine ehrliche Antwort ist völlig okay.</p>',
   2,NOW()),
  ('b1000000-0000-0000-0006-000000000003','b1000000-0000-0000-0000-000000000006',
   'b1-gefuehle-konflikte','Gefühle ausdrücken & Konflikte lösen',
   '<h2>Gefühle ausdrücken & Konflikte lösen</h2>
<h3>1. Gefühle differenziert benennen</h3>
<ul>
<li><strong>sich freuen über</strong> (+Akk.) – Ich freue mich über deine Nachricht.</li>
<li><strong>sich ärgern über</strong> (+Akk.) – Er ärgert sich über den Lärm.</li>
<li><strong>enttäuscht sein von</strong> – Ich bin enttäuscht von dem Ergebnis.</li>
<li><strong>stolz sein auf</strong> (+Akk.) – Sie ist stolz auf ihre Tochter.</li>
<li><strong>Angst haben vor</strong> (+Dat.) – Ich habe Angst vor der Prüfung.</li>
</ul>
<h3>2. Ich-Botschaften statt Vorwürfe</h3>
<table>
<thead><tr><th>Vorwurf (eskaliert)</th><th>Ich-Botschaft (löst)</th></tr></thead>
<tbody>
<tr><td>Du bist immer zu spät!</td><td>Ich ärgere mich, wenn ich lange warten muss.</td></tr>
<tr><td>Du hörst nie zu!</td><td>Mir ist wichtig, dass du mir zuhörst.</td></tr>
</tbody>
</table>
<h3>3. Einen Konflikt ansprechen</h3>
<ul>
<li><strong>Können wir kurz über etwas sprechen?</strong></li>
<li><strong>Mich stört, dass ...</strong> / <strong>Mir ist aufgefallen, dass ...</strong></li>
<li><strong>Wie siehst du das?</strong> (die andere Seite hören)</li>
<li><strong>Lass uns eine Lösung finden.</strong></li>
</ul>',
   3,NOW()),
  ('b1000000-0000-0000-0006-000000000099','b1000000-0000-0000-0000-000000000006',
   'b1-room06-quiz','Checkpoint: Beziehungen & Gesellschaft',
   '<h2>Checkpoint Quiz</h2><p>Relativsätze, Small Talk und Gefühle — das große B1-Finale!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b1000000-0000-0006-0001-000000000001','b1000000-0000-0000-0006-000000000001',
   '"Das ist der Kollege, ___ in Berlin arbeitet."','multiple_choice',
   '["der", "den", "dem", "das"]'::jsonb,'der',
   'Der Kollege arbeitet (Subjekt im Relativsatz) → Nominativ: der.',NOW()),
  ('b1000000-0000-0006-0001-000000000002','b1000000-0000-0000-0006-000000000001',
   '"Der Film, ___ wir gesehen haben, war super."','multiple_choice',
   '["den", "der", "dem", "das"]'::jsonb,'den',
   'Wir haben den Film gesehen (Akkusativ-Objekt) → den.',NOW()),
  ('b1000000-0000-0006-0001-000000000003','b1000000-0000-0000-0006-000000000001',
   '"Der Freund, ___ ___ ich wohne, kocht gern."','multiple_choice',
   '["mit dem", "mit den", "mit der", "dem mit"]'::jsonb,'mit dem',
   'Präposition + Relativpronomen: mit + Dativ maskulin = mit dem.',NOW()),

  ('b1000000-0000-0006-0002-000000000001','b1000000-0000-0000-0006-000000000002',
   'Wen sprichst du in Deutschland mit "Sie" an?','multiple_choice',
   '["Fremde und Behördenmitarbeiter", "Deine Kinder", "Enge Freunde", "Dein Haustier"]'::jsonb,
   'Fremde und Behördenmitarbeiter',
   'Sie = formell; du = privat/vertraut.',NOW()),
  ('b1000000-0000-0006-0002-000000000002','b1000000-0000-0000-0006-000000000002',
   'Sicheres Small-Talk-Thema:','multiple_choice',
   '["Das Wetter", "Das Gehalt", "Religion", "Das Alter"]'::jsonb,'Das Wetter',
   'Wetter, Reisen, Essen funktionieren immer; Gehalt/Politik/Religion sind heikel.',NOW()),
  ('b1000000-0000-0006-0002-000000000003','b1000000-0000-0000-0006-000000000002',
   '"Wollen wir uns duzen?" bedeutet:','multiple_choice',
   '["Das Angebot, du zu sagen", "Eine Einladung zum Essen", "Ein Streit", "Eine Verabschiedung"]'::jsonb,
   'Das Angebot, du zu sagen',
   'Der offizielle Wechsel von Sie zu du.',NOW()),

  ('b1000000-0000-0006-0003-000000000001','b1000000-0000-0000-0006-000000000003',
   '"Ich freue mich ___ deine Nachricht."','multiple_choice',
   '["über", "auf", "von", "mit"]'::jsonb,'über',
   'sich freuen über = über etwas, das schon da ist. (auf = Vorfreude)',NOW()),
  ('b1000000-0000-0006-0003-000000000002','b1000000-0000-0000-0006-000000000003',
   '"Ich habe Angst ___ der Prüfung."','multiple_choice',
   '["vor", "von", "über", "auf"]'::jsonb,'vor',
   'Angst haben vor + Dativ.',NOW()),

  ('b1000000-0000-0006-0099-000000000001','b1000000-0000-0000-0006-000000000099',
   'Welche Ich-Botschaft ersetzt "Du bist immer zu spät!"?','multiple_choice',
   '["Ich ärgere mich, wenn ich lange warten muss.", "Du bist unmöglich!", "Immer dasselbe mit dir!", "Warum bist du so?"]'::jsonb,
   'Ich ärgere mich, wenn ich lange warten muss.',
   'Ich-Botschaften beschreiben das eigene Gefühl statt anzuklagen.',NOW()),
  ('b1000000-0000-0006-0099-000000000002','b1000000-0000-0000-0006-000000000099',
   '"Sie ist stolz ___ ihre Tochter."','multiple_choice',
   '["auf", "über", "von", "für"]'::jsonb,'auf',
   'stolz sein auf + Akkusativ.',NOW()),
  ('b1000000-0000-0006-0099-000000000003','b1000000-0000-0000-0006-000000000099',
   '"Das Buch, ___ du mir empfohlen hast, lese ich gerade."','multiple_choice',
   '["das", "den", "die", "dem"]'::jsonb,'das',
   'Das Buch (neutrum, Akkusativ) → das.',NOW()),
  ('b1000000-0000-0006-0099-000000000004','b1000000-0000-0000-0006-000000000099',
   'Einen Konflikt konstruktiv beginnen:','multiple_choice',
   '["Können wir kurz über etwas sprechen?", "Du schon wieder!", "Ich rede nicht mehr mit dir.", "Alles deine Schuld."]'::jsonb,
   'Können wir kurz über etwas sprechen?',
   'Ruhig ansprechen, dann Ich-Botschaft, dann Lösung suchen.',NOW()),
  ('b1000000-0000-0006-0099-000000000005','b1000000-0000-0000-0006-000000000099',
   '"Wie geht''s?" ist in Deutschland:','multiple_choice',
   '["Eine echte Frage — ehrliche Antwort okay", "Nur eine Floskel ohne Antwort", "Unhöflich", "Nur schriftlich üblich"]'::jsonb,
   'Eine echte Frage — ehrliche Antwort okay',
   'Anders als das englische "How are you?" erwartet es oft eine echte Antwort.',NOW())
ON CONFLICT (id) DO NOTHING;
