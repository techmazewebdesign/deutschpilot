-- ============================================================
-- DeutschPilot – C1 Rooms 04–06 (Recht, Philosophie, Rhetorik)
-- Same pattern as seed-c1-rooms-01-03.sql. Additive only,
-- ON CONFLICT DO NOTHING.
-- ============================================================

-- ── COURSES ─────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES
  ('c1000000-0000-0000-0000-000000000004','law-administration-c1',
   'C1 Room 04 – Recht & Verwaltung',
   'Decode Amtsdeutsch, understand contracts and official notices, master legal passive constructions, and file a formal Widerspruch.',
   'C1','de',TRUE,NOW()),
  ('c1000000-0000-0000-0000-000000000005','philosophy-abstraction-c1',
   'C1 Room 05 – Philosophie & Abstraktion',
   'Build abstract noun phrases, structure philosophical argumentation, and use precise genitive constructions for ethics and ideas.',
   'C1','de',TRUE,NOW()),
  ('c1000000-0000-0000-0000-000000000006','rhetoric-debate-c1',
   'C1 Room 06 – Rhetorik & Debattieren',
   'Structure formal debates, deploy persuasive rhetorical strategies, counter arguments, and use advanced Modalpartikeln precisely.',
   'C1','de',TRUE,NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 04 – Recht & Verwaltung
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('c1000000-0000-0000-0004-000000000001','c1000000-0000-0000-0000-000000000004',
   'c1-amtsdeutsch','Amtsdeutsch verstehen',
   '<h2>Amtsdeutsch verstehen</h2>
<h3>1. Was Amtsdeutsch von Alltagsdeutsch unterscheidet</h3>
<p>Behörden, Gerichte und Ämter kommunizieren in einem eigenen Register: sehr nominal, sehr passivisch, mit festen Formeln, deren wörtliche Bedeutung oft schwerer zu erschließen ist als ihr eigentlicher Sinn.</p>
<h3>2. Typische Amtsdeutsch-Formeln und ihre Übersetzung</h3>
<table>
<thead><tr><th>Amtsdeutsch</th><th>Bedeutet auf Deutsch (verständlich)</th></tr></thead>
<tbody>
<tr><td>Hiermit wird Ihnen mitgeteilt, dass ...</td><td>Wir teilen Ihnen mit: ...</td></tr>
<tr><td>Der Antrag wird hiermit abgelehnt.</td><td>Ihr Antrag ist abgelehnt.</td></tr>
<tr><td>Es wird gebeten, die beigefügten Unterlagen fristgerecht einzureichen.</td><td>Bitte schicken Sie die Unterlagen rechtzeitig.</td></tr>
<tr><td>Gegen diesen Bescheid kann Widerspruch eingelegt werden.</td><td>Sie können gegen diese Entscheidung protestieren.</td></tr>
<tr><td>Der Sachverhalt wird wie folgt dargestellt: ...</td><td>So ist die Situation: ...</td></tr>
</tbody>
</table>
<h3>3. Substantivierte Verwaltungsbegriffe</h3>
<ul>
<li><strong>der Bescheid</strong> – die schriftliche Entscheidung einer Behörde</li>
<li><strong>die Frist</strong> – der Zeitraum, in dem etwas erledigt werden muss</li>
<li><strong>die Zuständigkeit</strong> – wer rechtlich verantwortlich ist</li>
<li><strong>der Antragsteller / die Antragstellerin</strong> – wer etwas beantragt</li>
<li><strong>die Rechtsgrundlage</strong> – das Gesetz, auf dem eine Entscheidung beruht</li>
</ul>
<h3>4. Strategie beim Lesen von Bescheiden</h3>
<p>Zuerst den Kern suchen: Was wird entschieden (bewilligt/abgelehnt)? Dann: Welche Frist gilt? Zuletzt: Welche Rechtsmittel (Widerspruch, Klage) stehen offen? Der Rest ist meist Begründung und Formalie.</p>',
   1,NOW()),
  ('c1000000-0000-0000-0004-000000000002','c1000000-0000-0000-0000-000000000004',
   'c1-passiv-juristisch','Passiv mit juristischer Nuance',
   '<h2>Passiv mit juristischer Nuance</h2>
<h3>1. Warum Juristen das Passiv lieben</h3>
<p>Das Passiv verschweigt den Handelnden — praktisch, wenn die Behörde als Institution spricht, nicht als Person: <em>Der Antrag <strong>wurde geprüft</strong> und <strong>abgelehnt</strong>.</em> (nicht: "Herr Müller hat Ihren Antrag abgelehnt")</p>
<h3>2. Das Zustandspassiv vs. das Vorgangspassiv</h3>
<table>
<thead><tr><th>Typ</th><th>Bildung</th><th>Bedeutung</th></tr></thead>
<tbody>
<tr><td>Vorgangspassiv</td><td>werden + Partizip II</td><td>der Vorgang selbst: Der Antrag <strong>wird geprüft</strong>.</td></tr>
<tr><td>Zustandspassiv</td><td>sein + Partizip II</td><td>das Ergebnis: Der Antrag <strong>ist geprüft</strong> (= die Prüfung ist abgeschlossen).</td></tr>
</tbody>
</table>
<h3>3. Passiv mit Modalverben in Gesetzestexten</h3>
<ul>
<li><em>Der Widerspruch <strong>muss</strong> innerhalb eines Monats <strong>eingelegt werden</strong>.</em></li>
<li><em>Die Frist <strong>kann</strong> in begründeten Fällen <strong>verlängert werden</strong>.</em></li>
<li><em>Der Bescheid <strong>ist</strong> dem Antragsteller schriftlich <strong>zuzustellen</strong>.</em> (sein + zu + Infinitiv = juristische Pflichtform)</li>
</ul>
<h3>4. Der Unterschied zwischen "man" und Passiv im Amtsstil</h3>
<p>"Man" wirkt im Amtsdeutsch zu informell. Statt <em>Man muss den Antrag stellen</em> heißt es korrekt: <em>Der Antrag ist zu stellen</em> oder <em>Der Antrag muss gestellt werden</em>. Amtssprache vermeidet fast durchgängig ein sichtbares Subjekt.</p>
<h3>5. Passivkonstruktionen entschlüsseln</h3>
<p><em>Es wird darauf hingewiesen, dass bei Nichteinhaltung der Frist von einer Rücknahme des Antrags ausgegangen wird.</em> → Kern: Wenn die Frist verpasst wird, gilt der Antrag als zurückgezogen.</p>',
   2,NOW()),
  ('c1000000-0000-0000-0004-000000000003','c1000000-0000-0000-0000-000000000004',
   'c1-widerspruch-einlegen','Widerspruch einlegen: formelle Einwände',
   '<h2>Widerspruch einlegen: formelle Einwände</h2>
<h3>1. Was ein Widerspruch ist</h3>
<p>Der <strong>Widerspruch</strong> ist das formelle Mittel, mit dem man gegen einen behördlichen Bescheid vorgeht, bevor man vor Gericht zieht. Er muss fristgerecht, schriftlich und meist begründet eingereicht werden.</p>
<h3>2. Der Aufbau eines Widerspruchsschreibens</h3>
<ol>
<li><strong>Betreff:</strong> Widerspruch gegen den Bescheid vom [Datum], Aktenzeichen [...]</li>
<li><strong>Formelle Einleitung:</strong> <em>Hiermit lege ich gegen den oben genannten Bescheid form- und fristgerecht Widerspruch ein.</em></li>
<li><strong>Begründung:</strong> Sachverhalt darstellen, Argumente, ggf. Belege nennen</li>
<li><strong>Antrag:</strong> <em>Ich beantrage, den Bescheid aufzuheben / abzuändern.</em></li>
<li><strong>Schluss:</strong> Formel + Unterschrift</li>
</ol>
<h3>3. Formulierungen für den formellen Einwand</h3>
<ul>
<li><em>Der Bescheid ist aus folgenden Gründen nicht nachvollziehbar: ...</em></li>
<li><em>Die zugrunde gelegte Rechtsgrundlage findet hier aus unserer Sicht keine Anwendung, da ...</em></li>
<li><em>Es wird beantragt, den Sachverhalt erneut zu prüfen.</em></li>
<li><em>Vorsorglich weise ich darauf hin, dass ...</em></li>
</ul>
<h3>4. Ton: bestimmt, aber nicht aggressiv</h3>
<p>Ein Widerspruch bleibt sachlich und formell, auch wenn man mit einer Entscheidung unzufrieden ist. Aggressive Formulierungen ("Das ist eine Frechheit!") schwächen die eigene Position — Behörden reagieren auf klare Argumentation, nicht auf Emotion.</p>
<h3>5. Fristen ernst nehmen</h3>
<p>Meist gilt: <strong>ein Monat</strong> ab Zustellung des Bescheids. Wird die Frist versäumt, ist der Bescheid in der Regel bestandskräftig — der Widerspruch nur noch in Ausnahmefällen möglich.</p>',
   3,NOW()),
  ('c1000000-0000-0000-0004-000000000099','c1000000-0000-0000-0000-000000000004',
   'c1-room04-quiz','Checkpoint: Recht & Verwaltung',
   '<h2>Checkpoint Quiz</h2><p>Amtsdeutsch, juristisches Passiv und Widerspruch einlegen — der Verwaltungs-Check!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('c1000000-0000-0004-0001-000000000001','c1000000-0000-0000-0004-000000000001',
   '"Der Antrag wird hiermit abgelehnt" bedeutet auf Deutsch:','multiple_choice',
   '["Ihr Antrag ist abgelehnt.", "Ihr Antrag wird noch geprüft.", "Ihr Antrag ist genehmigt.", "Es fehlen Unterlagen."]'::jsonb,
   'Ihr Antrag ist abgelehnt.',
   'Amtsdeutsch verpackt eine klare Ablehnung in eine unpersönliche Passivform.',NOW()),
  ('c1000000-0000-0004-0001-000000000002','c1000000-0000-0000-0004-000000000001',
   'Der "Bescheid" ist:','multiple_choice',
   '["Die schriftliche Entscheidung einer Behörde", "Ein Antragsformular", "Eine Rechnung", "Eine Einladung"]'::jsonb,
   'Die schriftliche Entscheidung einer Behörde',
   'Der zentrale Begriff jeder Verwaltungskommunikation.',NOW()),
  ('c1000000-0000-0004-0001-000000000003','c1000000-0000-0000-0004-000000000001',
   'Beim Lesen eines Bescheids sucht man zuerst:','multiple_choice',
   '["Den Kern der Entscheidung", "Die Schriftart", "Das Datum des Briefkopfs", "Die Grußformel"]'::jsonb,
   'Den Kern der Entscheidung',
   'Bewilligt oder abgelehnt? Danach Frist und Rechtsmittel prüfen.',NOW()),

  ('c1000000-0000-0004-0002-000000000001','c1000000-0000-0000-0004-000000000002',
   '"Der Antrag ist geprüft" (Zustandspassiv) bedeutet:','multiple_choice',
   '["Die Prüfung ist abgeschlossen", "Die Prüfung läuft gerade", "Der Antrag wurde nie geprüft", "Der Antrag wird morgen geprüft"]'::jsonb,
   'Die Prüfung ist abgeschlossen',
   'sein + Partizip II beschreibt das Ergebnis, nicht den Vorgang.',NOW()),
  ('c1000000-0000-0004-0002-000000000002','c1000000-0000-0000-0004-000000000002',
   '"Der Bescheid ___ dem Antragsteller schriftlich zuzustellen." (juristische Pflichtform)','multiple_choice',
   '["ist", "wird", "hat", "kann"]'::jsonb,
   'ist',
   'sein + zu + Infinitiv = juristische Verpflichtung, hier: die Zustellung ist Pflicht.',NOW()),
  ('c1000000-0000-0004-0002-000000000003','c1000000-0000-0000-0004-000000000002',
   'Warum vermeidet Amtsdeutsch "man"?','multiple_choice',
   '["Weil es zu informell wirkt", "Weil es grammatisch falsch ist", "Weil es zu höflich ist", "Weil es Dialekt ist"]'::jsonb,
   'Weil es zu informell wirkt',
   'Amtssprache bevorzugt Passiv oder \"sein + zu + Infinitiv\" statt \"man\".',NOW()),

  ('c1000000-0000-0004-0003-000000000001','c1000000-0000-0000-0004-000000000003',
   'Ein Widerspruch richtet sich gegen:','multiple_choice',
   '["Einen behördlichen Bescheid", "Ein Gerichtsurteil ausschließlich", "Eine Rechnung", "Einen Vertrag zwischen Privatpersonen"]'::jsonb,
   'Einen behördlichen Bescheid',
   'Der Widerspruch ist das vorgerichtliche Mittel gegen Verwaltungsentscheidungen.',NOW()),
  ('c1000000-0000-0004-0003-000000000002','c1000000-0000-0000-0004-000000000003',
   'Die übliche Frist für einen Widerspruch beträgt:','multiple_choice',
   '["Einen Monat ab Zustellung", "Eine Woche", "Ein Jahr", "Es gibt keine Frist"]'::jsonb,
   'Einen Monat ab Zustellung',
   'Wird sie versäumt, ist der Bescheid meist bestandskräftig.',NOW()),
  ('c1000000-0000-0004-0003-000000000003','c1000000-0000-0000-0004-000000000003',
   'Der richtige Ton in einem Widerspruchsschreiben ist:','multiple_choice',
   '["Sachlich und bestimmt", "Aggressiv und emotional", "Locker und umgangssprachlich", "Vage und unverbindlich"]'::jsonb,
   'Sachlich und bestimmt',
   'Klare Argumentation überzeugt Behörden eher als Emotion.',NOW()),

  ('c1000000-0000-0004-0099-000000000001','c1000000-0000-0000-0004-000000000099',
   '"Es wird gebeten, die Unterlagen fristgerecht einzureichen" heißt:','multiple_choice',
   '["Bitte schicken Sie die Unterlagen rechtzeitig.", "Die Unterlagen sind nicht nötig.", "Die Frist ist bereits abgelaufen.", "Man darf die Unterlagen ignorieren."]'::jsonb,
   'Bitte schicken Sie die Unterlagen rechtzeitig.',
   'Die unpersönliche Passivkonstruktion ist eine höfliche Aufforderung.',NOW()),
  ('c1000000-0000-0004-0099-000000000002','c1000000-0000-0000-0004-000000000099',
   'Die "Rechtsgrundlage" ist:','multiple_choice',
   '["Das Gesetz, auf dem eine Entscheidung beruht", "Die Unterschrift des Sachbearbeiters", "Das Aktenzeichen", "Die Postanschrift der Behörde"]'::jsonb,
   'Das Gesetz, auf dem eine Entscheidung beruht',
   'Jeder Bescheid muss sich auf eine Rechtsgrundlage stützen.',NOW()),
  ('c1000000-0000-0004-0099-000000000003','c1000000-0000-0000-0004-000000000099',
   '"Der Widerspruch ___ innerhalb eines Monats eingelegt werden."','multiple_choice',
   '["muss", "möge", "sei", "wäre"]'::jsonb,
   'muss',
   'Modalverb + Partizip II + werden = Passiv mit Modalverb.',NOW()),
  ('c1000000-0000-0004-0099-000000000004','c1000000-0000-0000-0004-000000000099',
   'Was steht im Antragsteil eines Widerspruchsschreibens?','multiple_choice',
   '["Die konkrete Forderung, z. B. den Bescheid aufzuheben", "Die Grußformel", "Das Datum allein", "Die Bankverbindung"]'::jsonb,
   'Die konkrete Forderung, z. B. den Bescheid aufzuheben',
   '\"Ich beantrage, den Bescheid aufzuheben / abzuändern.\"',NOW()),
  ('c1000000-0000-0004-0099-000000000005','c1000000-0000-0000-0004-000000000099',
   'Nach Ablauf der Widerspruchsfrist ist ein Bescheid in der Regel:','multiple_choice',
   '["Bestandskräftig", "Automatisch ungültig", "Erneut zu prüfen", "Verlängerbar ohne Grund"]'::jsonb,
   'Bestandskräftig',
   'Danach ist ein Widerspruch nur noch in Ausnahmefällen möglich.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 05 – Philosophie & Abstraktion
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('c1000000-0000-0000-0005-000000000001','c1000000-0000-0000-0000-000000000005',
   'c1-abstrakte-nominalphrasen','Abstrakte Nominalphrasen bilden',
   '<h2>Abstrakte Nominalphrasen bilden</h2>
<h3>1. Warum Philosophie so nominal klingt</h3>
<p>Philosophische Texte handeln von Begriffen, nicht von Handlungen — daher dominieren abstrakte Substantive: <strong>die Wahrnehmung, die Erkenntnis, das Bewusstsein, die Verantwortung, die Freiheit</strong>. Diese Substantive lassen sich zu komplexen Phrasen kombinieren.</p>
<h3>2. Abstraktionsmuster</h3>
<table>
<thead><tr><th>Adjektiv/Verb</th><th>Abstraktes Nomen</th></tr></thead>
<tbody>
<tr><td>wahrnehmen</td><td>die Wahrnehmung</td></tr>
<tr><td>erkennen</td><td>die Erkenntnis</td></tr>
<tr><td>verantwortlich</td><td>die Verantwortung</td></tr>
<tr><td>frei</td><td>die Freiheit</td></tr>
<tr><td>wirklich</td><td>die Wirklichkeit</td></tr>
<tr><td>bewusst</td><td>das Bewusstsein</td></tr>
</tbody>
</table>
<h3>3. Abstrakta kombinieren</h3>
<ul>
<li><em>die <strong>Grenzen der menschlichen Erkenntnis</strong></em></li>
<li><em>die <strong>Verantwortung des Einzelnen gegenüber der Gesellschaft</strong></em></li>
<li><em>das <strong>Verhältnis von Freiheit und Verantwortung</strong></em></li>
</ul>
<h3>4. Präzision statt Vagheit</h3>
<p>C1-Philosophiedeutsch verlangt Trennschärfe: <em>Wissen</em> (belegte Kenntnis) ist nicht <em>Meinung</em> (subjektive Ansicht), <em>Erkenntnis</em> (Prozess/Ergebnis des Erkennens) ist nicht dasselbe wie <em>Wahrnehmung</em> (sinnliche Aufnahme, ohne Deutung). Diese Unterschiede präzise zu benennen, ist der Kern philosophischen Schreibens.</p>
<h3>5. Ein Beispielsatz</h3>
<p><em>Die <strong>Frage nach den Grenzen menschlicher Erkenntnisfähigkeit</strong> beschäftigt die Philosophie seit der Antike — von der <strong>Wahrnehmungstäuschung</strong> bis zur <strong>Unmöglichkeit absoluter Gewissheit</strong>.</em></p>',
   1,NOW()),
  ('c1000000-0000-0000-0005-000000000002','c1000000-0000-0000-0000-000000000005',
   'c1-philosophische-argumentation','Philosophische Argumentation aufbauen',
   '<h2>Philosophische Argumentation aufbauen</h2>
<h3>1. Die klassische Argumentstruktur</h3>
<ol>
<li><strong>These:</strong> die zu verteidigende Behauptung</li>
<li><strong>Prämissen:</strong> die Voraussetzungen, aus denen die These folgt</li>
<li><strong>Schlussfolgerung:</strong> was logisch daraus folgt</li>
<li><strong>Einwände:</strong> mögliche Gegenpositionen</li>
<li><strong>Verteidigung:</strong> Reaktion auf die Einwände</li>
</ol>
<h3>2. Formulierungen für den Argumentationsaufbau</h3>
<ul>
<li><em>Ausgehend von der Annahme, dass ..., lässt sich folgern, dass ...</em></li>
<li><em>Setzt man voraus, dass X gilt, so folgt daraus notwendigerweise Y.</em></li>
<li><em>Dagegen ließe sich einwenden, dass ...</em></li>
<li><em>Dieser Einwand greift jedoch zu kurz, denn ...</em></li>
</ul>
<h3>3. Gedankenexperimente einführen</h3>
<p><em>Man stelle sich vor, eine Person hätte niemals Kontakt zu anderen Menschen gehabt — würde sie dennoch ein moralisches Bewusstsein entwickeln?</em> Solche hypothetischen Konstruktionen (oft im Konjunktiv II) sind ein zentrales Werkzeug philosophischer Argumentation.</p>
<h3>4. Über Ethik sprechen</h3>
<ul>
<li><em>Aus utilitaristischer Sicht wäre eine Handlung dann zu rechtfertigen, wenn sie den größten Nutzen für die größte Zahl erzeugt.</em></li>
<li><em>Kant zufolge handelt moralisch, wer nach einer Maxime handelt, die zugleich allgemeines Gesetz sein könnte.</em></li>
<li><em>Die Verantwortung des Einzelnen endet dort, wo die Freiheit des Anderen beginnt.</em></li>
</ul>
<h3>5. Präzision bei Widersprüchen</h3>
<p><em>Diese beiden Positionen scheinen sich zu widersprechen, lassen sich jedoch auflösen, wenn man zwischen ... und ... unterscheidet.</em></p>',
   2,NOW()),
  ('c1000000-0000-0000-0005-000000000003','c1000000-0000-0000-0000-000000000005',
   'c1-genitiv-praezision','Komplexe Genitivkonstruktionen & Präzisionsvokabular',
   '<h2>Komplexe Genitivkonstruktionen & Präzisionsvokabular</h2>
<h3>1. Der Genitiv als Werkzeug der Präzision</h3>
<p>Philosophisches Deutsch nutzt verschachtelte Genitivketten, um Beziehungen zwischen Begriffen exakt zu benennen — oft mehrere Genitive hintereinander:</p>
<ul>
<li><em>die <strong>Grenzen der Erkenntnisfähigkeit des Menschen</strong></em> (2 Genitive)</li>
<li><em>die <strong>Bedeutung der Freiheit des Einzelnen für das Zusammenleben der Gesellschaft</strong></em> (3 Genitive)</li>
</ul>
<h3>2. Genitiv vs. von-Konstruktion</h3>
<p>Auf C1 gilt: der echte Genitiv wirkt schriftsprachlich-präzise, die von-Konstruktion umgangssprachlicher. <em>die Verantwortung des Einzelnen</em> (formal) statt <em>die Verantwortung von dem Einzelnen</em> (vermeiden!) — aber: <em>die Meinung von Kant</em> ist bei Eigennamen ohne Artikel meist mit "von" gebräuchlicher als "Kants Meinung".</p>
<h3>3. Präzisionsvokabular: feine Unterschiede</h3>
<table>
<thead><tr><th>Begriff</th><th>Abgrenzung</th></tr></thead>
<tbody>
<tr><td>die Wahrnehmung</td><td>sinnliche Aufnahme, ohne Bewertung</td></tr>
<tr><td>die Erkenntnis</td><td>Ergebnis eines Denkprozesses, oft mit Anspruch auf Wahrheit</td></tr>
<tr><td>die Überzeugung</td><td>subjektiv fest geglaubt, nicht zwingend bewiesen</td></tr>
<tr><td>die Gewissheit</td><td>höchster Grad an subjektiver Sicherheit</td></tr>
<tr><td>die Verantwortung</td><td>Zurechenbarkeit von Handlungen und deren Folgen</td></tr>
</tbody>
</table>
<h3>4. Ein verschachtelter Beispielsatz</h3>
<p><em>Die <strong>Frage nach der Vereinbarkeit der Freiheit des Individuums mit den Erfordernissen des gesellschaftlichen Zusammenlebens</strong> zählt zu den ältesten Problemen der politischen Philosophie.</em></p>
<h3>5. Grenzen der Verschachtelung</h3>
<p>Auch hier gilt: drei Genitive hintereinander sind die praktische Obergrenze. Wird es länger, sollte man den Satz in zwei Teile aufbrechen, um die Verständlichkeit zu erhalten.</p>',
   3,NOW()),
  ('c1000000-0000-0000-0005-000000000099','c1000000-0000-0000-0000-000000000005',
   'c1-room05-quiz','Checkpoint: Philosophie & Abstraktion',
   '<h2>Checkpoint Quiz</h2><p>Abstrakte Nominalphrasen, philosophische Argumentation und Genitivketten!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('c1000000-0000-0005-0001-000000000001','c1000000-0000-0000-0005-000000000001',
   'Die Nominalisierung von "wahrnehmen" ist:','multiple_choice',
   '["die Wahrnehmung", "das Wahrnehmen­tum", "der Wahrnehm", "die Wahrnehmheit"]'::jsonb,
   'die Wahrnehmung',
   'Regelmäßiges -ung-Muster wie in vielen abstrakten Nomen.',NOW()),
  ('c1000000-0000-0005-0001-000000000002','c1000000-0000-0000-0005-000000000001',
   'Der Unterschied zwischen "Wissen" und "Meinung" ist:','multiple_choice',
   '["Wissen ist belegte Kenntnis, Meinung eine subjektive Ansicht", "Beide sind identisch", "Meinung ist immer bewiesen", "Wissen ist immer falsch"]'::jsonb,
   'Wissen ist belegte Kenntnis, Meinung eine subjektive Ansicht',
   'Trennschärfe zwischen Begriffen ist zentral für philosophisches Schreiben.',NOW()),
  ('c1000000-0000-0005-0001-000000000003','c1000000-0000-0000-0005-000000000001',
   '"Bewusst" wird zum abstrakten Nomen:','multiple_choice',
   '["das Bewusstsein", "die Bewusstheit ausschließlich", "der Bewusst", "das Bewusstwerden ausschließlich"]'::jsonb,
   'das Bewusstsein',
   'Das gängige philosophische Fachwort ist "das Bewusstsein".',NOW()),

  ('c1000000-0000-0005-0002-000000000001','c1000000-0000-0000-0005-000000000002',
   'Die klassische Argumentstruktur beginnt mit:','multiple_choice',
   '["Der These", "Dem Einwand", "Der Verteidigung", "Der Schlussfolgerung"]'::jsonb,
   'Der These',
   'These → Prämissen → Schlussfolgerung → Einwände → Verteidigung.',NOW()),
  ('c1000000-0000-0005-0002-000000000002','c1000000-0000-0000-0005-000000000002',
   'Gedankenexperimente stehen oft im:','multiple_choice',
   '["Konjunktiv II", "Imperativ", "Präsens Indikativ", "Perfekt"]'::jsonb,
   'Konjunktiv II',
   '"Man stelle sich vor, eine Person hätte ..." — hypothetische Konstruktion.',NOW()),
  ('c1000000-0000-0005-0002-000000000003','c1000000-0000-0000-0005-000000000002',
   'Laut utilitaristischer Ethik ist eine Handlung zu rechtfertigen, wenn:','multiple_choice',
   '["Sie den größten Nutzen für die größte Zahl erzeugt", "Sie einer Person am meisten nützt", "Sie einem Gesetz widerspricht", "Sie keine Folgen hat"]'::jsonb,
   'Sie den größten Nutzen für die größte Zahl erzeugt',
   'Kernprinzip des Utilitarismus.',NOW()),

  ('c1000000-0000-0005-0003-000000000001','c1000000-0000-0000-0005-000000000003',
   '"Die Grenzen der Erkenntnisfähigkeit des Menschen" enthält wie viele Genitive?','multiple_choice',
   '["Zwei", "Eins", "Drei", "Keinen"]'::jsonb,
   'Zwei',
   'der Erkenntnisfähigkeit + des Menschen — zwei verschachtelte Genitive.',NOW()),
  ('c1000000-0000-0005-0003-000000000002','c1000000-0000-0000-0005-000000000003',
   'Was ist die praktische Obergrenze verschachtelter Genitive?','multiple_choice',
   '["Drei", "Zehn", "Eins", "Es gibt keine Grenze"]'::jsonb,
   'Drei',
   'Danach leidet die Verständlichkeit — der Satz sollte aufgebrochen werden.',NOW()),
  ('c1000000-0000-0005-0003-000000000003','c1000000-0000-0000-0005-000000000003',
   '"Gewissheit" bezeichnet:','multiple_choice',
   '["Den höchsten Grad subjektiver Sicherheit", "Eine unbewiesene Vermutung", "Eine sinnliche Wahrnehmung ohne Deutung", "Eine allgemein akzeptierte Meinung"]'::jsonb,
   'Den höchsten Grad subjektiver Sicherheit',
   'Stärker als Überzeugung, aber weiterhin subjektiv.',NOW()),

  ('c1000000-0000-0005-0099-000000000001','c1000000-0000-0000-0005-000000000099',
   'Der Unterschied zwischen "Wahrnehmung" und "Erkenntnis":','multiple_choice',
   '["Wahrnehmung ist sinnliche Aufnahme, Erkenntnis das Ergebnis eines Denkprozesses", "Beide sind Synonyme", "Erkenntnis ist rein sinnlich", "Wahrnehmung setzt Beweise voraus"]'::jsonb,
   'Wahrnehmung ist sinnliche Aufnahme, Erkenntnis das Ergebnis eines Denkprozesses',
   'Wahrnehmung liefert Rohdaten, Erkenntnis interpretiert und ordnet sie ein.',NOW()),
  ('c1000000-0000-0005-0099-000000000002','c1000000-0000-0000-0005-000000000099',
   '"Kant zufolge handelt moralisch, wer ..." — "zufolge" steht hier:','multiple_choice',
   '["Nach dem Bezugswort (Kant zufolge)", "Immer vor dem Bezugswort", "Nur mit Genitiv", "Nur in der gesprochenen Sprache"]'::jsonb,
   'Nach dem Bezugswort (Kant zufolge)',
   '"zufolge" kann nachgestellt (mit Dativ) oder vorangestellt (mit Genitiv) stehen; nachgestellt ist hier der Normalfall.',NOW()),
  ('c1000000-0000-0005-0099-000000000003','c1000000-0000-0000-0005-000000000099',
   '"Dagegen ließe sich einwenden, dass ..." leitet ein:','multiple_choice',
   '["Einen möglichen Gegenein­wand", "Eine Zustimmung", "Eine Quellenangabe", "Eine Schlussfolgerung"]'::jsonb,
   'Einen möglichen Gegenein­wand',
   'Konjunktiv II + "einwenden" signalisiert eine hypothetische Gegenposition.',NOW()),
  ('c1000000-0000-0005-0099-000000000004','c1000000-0000-0000-0005-000000000099',
   'Die "Verantwortung" bezeichnet philosophisch präzise:','multiple_choice',
   '["Die Zurechenbarkeit von Handlungen und deren Folgen", "Ein Rechtsgefühl ohne Konsequenz", "Eine bloße Meinung", "Eine sinnliche Wahrnehmung"]'::jsonb,
   'Die Zurechenbarkeit von Handlungen und deren Folgen',
   'Verantwortung setzt voraus, dass eine Handlung einer Person zugeschrieben werden kann.',NOW()),
  ('c1000000-0000-0005-0099-000000000005','c1000000-0000-0000-0005-000000000099',
   'Bei Eigennamen wie "Kant" wird der Besitz meist ausgedrückt durch:','multiple_choice',
   '["von + Name, oder Name + s (Kants Meinung)", "Ausschließlich den Artikel-Genitiv", "Niemals possessiv", "Nur den Dativ"]'::jsonb,
   'von + Name, oder Name + s (Kants Meinung)',
   'Beide Formen sind bei Eigennamen ohne Artikel gebräuchlich.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 06 – Rhetorik & Debattieren
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('c1000000-0000-0000-0006-000000000001','c1000000-0000-0000-0000-000000000006',
   'c1-debattenstruktur','Aufbau einer formellen Debatte',
   '<h2>Aufbau einer formellen Debatte</h2>
<h3>1. Die klassische Debattenstruktur</h3>
<ol>
<li><strong>Eröffnungsrede:</strong> These vorstellen, Position klar benennen</li>
<li><strong>Argumentation:</strong> zwei bis drei Hauptargumente, je mit Beleg</li>
<li><strong>Widerlegung (Rebuttal):</strong> auf die Gegenseite eingehen</li>
<li><strong>Schlussplädoyer:</strong> zusammenfassen, den stärksten Punkt wiederholen</li>
</ol>
<h3>2. Eine Debatte eröffnen</h3>
<ul>
<li><em>Meine Position lässt sich in einem Satz zusammenfassen: ...</em></li>
<li><em>Im Folgenden werde ich drei Argumente anführen, die diese These stützen.</em></li>
<li><em>Bevor ich zu meinen Argumenten komme, möchte ich den Kernbegriff klären: ...</em></li>
</ul>
<h3>3. Argumente strukturiert vortragen</h3>
<p>Jedes Argument folgt idealerweise dem Muster <strong>Behauptung → Begründung → Beleg → Konsequenz</strong>: <em>Erstens ist X notwendig, denn Y. Dies zeigt sich an Z. Daraus folgt, dass ...</em></p>
<h3>4. Auf Zeit und Struktur achten</h3>
<p>Formelle Debatten (z. B. im Debattierclub) haben feste Redezeiten. Wer seine Argumente vorab in Stichpunkte gliedert, verliert unter Zeitdruck nicht den roten Faden.</p>',
   1,NOW()),
  ('c1000000-0000-0000-0006-000000000002','c1000000-0000-0000-0000-000000000006',
   'c1-gegenargumente','Gegenargumente & rhetorische Strategien',
   '<h2>Gegenargumente & rhetorische Strategien</h2>
<h3>1. Das stärkste Gegenargument zuerst</h3>
<p>Wer nur schwache Gegenpositionen (Strohmänner) widerlegt, überzeugt niemanden. C1-Rhetorik verlangt, das stärkste Argument der Gegenseite ernst zu nehmen und dann zu entkräften — das schafft Glaubwürdigkeit.</p>
<h3>2. Strategien der Widerlegung</h3>
<table>
<thead><tr><th>Strategie</th><th>Formulierung</th></tr></thead>
<tbody>
<tr><td>Prämisse angreifen</td><td><em>Die Annahme, auf der dieses Argument beruht, hält einer genaueren Prüfung nicht stand.</em></td></tr>
<tr><td>Konsequenz aufzeigen</td><td><em>Würde man dieser Logik folgen, ergäbe sich daraus ein Widerspruch.</em></td></tr>
<tr><td>Differenzieren</td><td><em>Das gilt zwar grundsätzlich, trifft aber auf den vorliegenden Fall nicht zu, weil ...</em></td></tr>
<tr><td>Relativieren</td><td><em>Dieses Argument greift zu kurz, denn es berücksichtigt nicht ...</em></td></tr>
</tbody>
</table>
<h3>3. Rhetorische Strategien für Überzeugungskraft</h3>
<ul>
<li><strong>Dreierfigur (Tricolon):</strong> drei parallele Punkte wirken besonders überzeugend: <em>schneller, günstiger, nachhaltiger</em></li>
<li><strong>Rhetorische Frage:</strong> <em>Wollen wir wirklich riskieren, dass ...?</em></li>
<li><strong>Konzession vor Konter:</strong> <em>Zugegeben, der Ansatz hat Vorteile — dennoch überwiegen die Risiken.</em></li>
</ul>
<h3>4. Fairness bleibt Pflicht</h3>
<p>Auch die überzeugendste Rhetorik darf nicht ad hominem werden: Das Argument angreifen, nie die Person.</p>',
   2,NOW()),
  ('c1000000-0000-0000-0006-000000000003','c1000000-0000-0000-0000-000000000006',
   'c1-modalpartikeln-rhetorik','Modalpartikeln & rhetorische Fragen auf C1-Niveau',
   '<h2>Modalpartikeln & rhetorische Fragen auf C1-Niveau</h2>
<h3>1. Modalpartikeln in der gehobenen Rede</h3>
<p>Modalpartikeln (doch, ja, eben, halt, schließlich, immerhin) gelten oft als umgangssprachlich — in der gehobenen Rhetorik gezielt eingesetzt, verleihen sie Aussagen Nachdruck, ohne aggressiv zu wirken.</p>
<table>
<thead><tr><th>Partikel</th><th>Wirkung im Redebeitrag</th></tr></thead>
<tbody>
<tr><td><strong>doch</strong></td><td>Widerspruch/Nachdruck: <em>Das ist doch offensichtlich unhaltbar.</em></td></tr>
<tr><td><strong>schließlich</strong></td><td>Begründung mit Gewicht: <em>Wir sprechen hier schließlich über die Zukunft ganzer Generationen.</em></td></tr>
<tr><td><strong>immerhin</strong></td><td>Einräumung mit Relativierung: <em>Immerhin hat die Gegenseite einen Punkt.</em></td></tr>
<tr><td><strong>eben</strong></td><td>Bestätigung des Offensichtlichen: <em>Genau das ist eben das Problem.</em></td></tr>
</tbody>
</table>
<h3>2. Rhetorische Fragen gezielt einsetzen</h3>
<ul>
<li><em>Wollen wir wirklich eine Gesellschaft, in der ...?</em> (impliziert: nein)</li>
<li><em>Ist es nicht offensichtlich, dass ...?</em> (fordert Zustimmung ein, ohne sie direkt zu behaupten)</li>
<li><em>Wer, wenn nicht wir, sollte hier handeln?</em> (appelliert an Verantwortung)</li>
</ul>
<h3>3. Dosierung: das C1-Feingefühl</h3>
<p>Zu viele Modalpartikeln oder rhetorische Fragen hintereinander wirken manipulativ statt überzeugend. Eine gezielt platzierte rhetorische Frage am Ende eines Arguments wirkt stärker als drei in Folge.</p>
<h3>4. Register bewahren</h3>
<p>Auch mit Modalpartikeln bleibt der Rest der Rede formell — sie sind ein Würzmittel, kein Stilbruch, solange die grammatische und lexikalische Grundhaltung gehoben bleibt.</p>',
   3,NOW()),
  ('c1000000-0000-0000-0006-000000000099','c1000000-0000-0000-0000-000000000006',
   'c1-room06-quiz','Checkpoint: Rhetorik & Debattieren',
   '<h2>Checkpoint Quiz</h2><p>Debattenstruktur, Gegenargumente und Modalpartikeln — das große C1-Finale!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('c1000000-0000-0006-0001-000000000001','c1000000-0000-0000-0006-000000000001',
   'Die formelle Debatte beginnt mit:','multiple_choice',
   '["Der Eröffnungsrede", "Der Widerlegung", "Dem Schlussplädoyer", "Der Publikumsfrage"]'::jsonb,
   'Der Eröffnungsrede',
   'Eröffnungsrede → Argumentation → Widerlegung → Schlussplädoyer.',NOW()),
  ('c1000000-0000-0006-0001-000000000002','c1000000-0000-0000-0006-000000000001',
   'Das Argumentationsmuster lautet:','multiple_choice',
   '["Behauptung → Begründung → Beleg → Konsequenz", "Beleg → Behauptung", "Nur Behauptung ohne Beleg", "Konsequenz zuerst"]'::jsonb,
   'Behauptung → Begründung → Beleg → Konsequenz',
   'Jedes Argument sollte diesem Vierschritt folgen.',NOW()),
  ('c1000000-0000-0006-0001-000000000003','c1000000-0000-0000-0006-000000000001',
   'Warum sollte man Argumente vorab in Stichpunkte gliedern?','multiple_choice',
   '["Um unter Zeitdruck den roten Faden nicht zu verlieren", "Um länger reden zu können", "Um das Publikum zu verwirren", "Weil es vorgeschrieben ist"]'::jsonb,
   'Um unter Zeitdruck den roten Faden nicht zu verlieren',
   'Feste Redezeiten verlangen klare Vorbereitung.',NOW()),

  ('c1000000-0000-0006-0002-000000000001','c1000000-0000-0000-0006-000000000002',
   'Warum sollte man das stärkste Gegenargument zuerst behandeln?','multiple_choice',
   '["Weil das Widerlegen von Strohmännern niemanden überzeugt", "Weil es einfacher ist", "Weil es höflicher wirkt", "Weil die Redezeit es verlangt"]'::jsonb,
   'Weil das Widerlegen von Strohmännern niemanden überzeugt',
   'Glaubwürdigkeit entsteht, wenn man die ernstzunehmendste Gegenposition entkräftet.',NOW()),
  ('c1000000-0000-0006-0002-000000000002','c1000000-0000-0000-0006-000000000002',
   'Eine Dreierfigur wie "schneller, günstiger, nachhaltiger" nennt man:','multiple_choice',
   '["Ein Tricolon", "Eine Anapher", "Eine Ironie", "Eine Antithese"]'::jsonb,
   'Ein Tricolon',
   'Drei parallele Punkte wirken rhetorisch besonders überzeugend.',NOW()),
  ('c1000000-0000-0006-0002-000000000003','c1000000-0000-0000-0006-000000000002',
   'Ein Ad-hominem-Angriff ist in der Debatte:','multiple_choice',
   '["Unfair und zu vermeiden", "Die effektivste Strategie", "Nur bei Politikern erlaubt", "Ein Pflichtelement"]'::jsonb,
   'Unfair und zu vermeiden',
   'Das Argument angreifen, nie die Person.',NOW()),

  ('c1000000-0000-0006-0003-000000000001','c1000000-0000-0000-0006-000000000003',
   '"Wir sprechen hier schließlich über die Zukunft ganzer Generationen" — "schließlich" wirkt hier:','multiple_choice',
   '["Als Begründung mit Gewicht", "Als reine Zeitangabe (am Ende)", "Als Frage", "Als Verneinung"]'::jsonb,
   'Als Begründung mit Gewicht',
   'In dieser Funktion ist "schließlich" eine Modalpartikel, kein Temporaladverb.',NOW()),
  ('c1000000-0000-0006-0003-000000000002','c1000000-0000-0000-0006-000000000003',
   'Eine rhetorische Frage wie "Ist es nicht offensichtlich, dass ...?" dient dazu:','multiple_choice',
   '["Zustimmung einzufordern, ohne sie direkt zu behaupten", "Eine echte Information zu erfragen", "Unsicherheit auszudrücken", "Das Thema zu wechseln"]'::jsonb,
   'Zustimmung einzufordern, ohne sie direkt zu behaupten',
   'Rhetorische Fragen implizieren die gewünschte Antwort, statt sie zu behaupten.',NOW()),
  ('c1000000-0000-0006-0003-000000000003','c1000000-0000-0000-0006-000000000003',
   'Zu viele rhetorische Fragen hintereinander wirken:','multiple_choice',
   '["Manipulativ statt überzeugend", "Immer überzeugender", "Neutral", "Wissenschaftlich"]'::jsonb,
   'Manipulativ statt überzeugend',
   'Dosierung ist auch hier entscheidend — eine gezielt platzierte Frage wirkt stärker.',NOW()),

  ('c1000000-0000-0006-0099-000000000001','c1000000-0000-0000-0006-000000000099',
   '"Immerhin hat die Gegenseite einen Punkt" drückt aus:','multiple_choice',
   '["Eine Einräumung mit Relativierung", "Eine völlige Zustimmung", "Eine klare Ablehnung", "Eine Verneinung"]'::jsonb,
   'Eine Einräumung mit Relativierung',
   '"immerhin" räumt etwas ein, ohne die eigene Position aufzugeben.',NOW()),
  ('c1000000-0000-0006-0099-000000000002','c1000000-0000-0000-0006-000000000099',
   'Das Schlussplädoyer einer Debatte sollte:','multiple_choice',
   '["Zusammenfassen und den stärksten Punkt wiederholen", "Neue Argumente einführen", "Die Gegenseite persönlich angreifen", "Nur Fragen stellen"]'::jsonb,
   'Zusammenfassen und den stärksten Punkt wiederholen',
   'Neue Argumente gehören in die Argumentationsphase, nicht in den Schluss.',NOW()),
  ('c1000000-0000-0006-0099-000000000003','c1000000-0000-0000-0006-000000000099',
   '"Würde man dieser Logik folgen, ergäbe sich daraus ein Widerspruch" ist eine Strategie zur:','multiple_choice',
   '["Aufzeigen einer Konsequenz", "Konzession", "Bloßen Wiederholung", "Ironisierung"]'::jsonb,
   'Aufzeigen einer Konsequenz',
   'Man führt das gegnerische Argument zu Ende und zeigt den daraus folgenden Widerspruch.',NOW()),
  ('c1000000-0000-0006-0099-000000000004','c1000000-0000-0000-0006-000000000099',
   'Modalpartikeln in der gehobenen Rede sind:','multiple_choice',
   '["Ein gezielt eingesetztes Würzmittel, kein Stilbruch", "Grundsätzlich zu vermeiden", "Nur in der Umgangssprache erlaubt", "Ein Zeichen mangelnder Bildung"]'::jsonb,
   'Ein gezielt eingesetztes Würzmittel, kein Stilbruch',
   'Richtig dosiert verstärken sie Nachdruck, ohne das Register zu brechen.',NOW()),
  ('c1000000-0000-0006-0099-000000000005','c1000000-0000-0000-0006-000000000099',
   '"Wer, wenn nicht wir, sollte hier handeln?" appelliert an:','multiple_choice',
   '["Verantwortung", "Angst", "Humor", "Nostalgie"]'::jsonb,
   'Verantwortung',
   'Eine klassische rhetorische Frage, die kollektive Verantwortung einfordert.',NOW())
ON CONFLICT (id) DO NOTHING;
