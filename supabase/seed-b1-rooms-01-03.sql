-- ============================================================
-- DeutschPilot – B1 Rooms 01–03 (Meinungen, Medien, Umwelt)
-- Same pattern as the A2 rooms: one course per room, 3 content
-- lessons + checkpoint quiz (order_index 99). Additive only,
-- ON CONFLICT DO NOTHING.
-- ============================================================

-- ── COURSES ─────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES
  ('b1000000-0000-0000-0000-000000000001','opinions-discussions-b1',
   'B1 Room 01 – Meinungen & Diskussionen',
   'State opinions, agree and disagree politely, and build arguments with connectors.',
   'B1','de',TRUE,NOW()),
  ('b1000000-0000-0000-0000-000000000002','media-news-b1',
   'B1 Room 02 – Medien & Nachrichten',
   'Understand news language, report what others said, and use the Passiv.',
   'B1','de',TRUE,NOW()),
  ('b1000000-0000-0000-0000-000000000003','environment-b1',
   'B1 Room 03 – Umwelt & Nachhaltigkeit',
   'Discuss environmental topics, make predictions with the Futur, and express conditions with wenn.',
   'B1','de',TRUE,NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 01 – Meinungen & Diskussionen
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b1000000-0000-0000-0001-000000000001','b1000000-0000-0000-0000-000000000001',
   'b1-meinung-aeussern','Die eigene Meinung äußern',
   '<h2>Die eigene Meinung äußern</h2>
<h3>1. Meinungs-Starter</h3>
<ul>
<li><strong>Meiner Meinung nach</strong> ist das eine gute Idee. (+ Verb an Position 2!)</li>
<li><strong>Ich bin der Meinung, dass</strong> ... (Verb ans Ende)</li>
<li><strong>Ich finde/denke/glaube, dass</strong> ...</li>
<li><strong>Für mich ist wichtig, dass</strong> ...</li>
<li><strong>Aus meiner Sicht</strong> ...</li>
</ul>
<h3>2. Stärke zeigen oder abschwächen</h3>
<ul>
<li>Stark: <strong>Ich bin fest davon überzeugt, dass ...</strong></li>
<li>Neutral: <strong>Ich denke, dass ...</strong></li>
<li>Vorsichtig: <strong>Ich könnte mir vorstellen, dass ...</strong> / <strong>Vielleicht ...</strong></li>
</ul>
<h3>3. Begründen</h3>
<ul>
<li><strong>..., weil/da</strong> + Verb am Ende</li>
<li><strong>..., denn</strong> + normaler Hauptsatz</li>
<li><strong>Deshalb / Darum / Aus diesem Grund</strong> + Verb direkt danach</li>
</ul>
<p><em>Beispiel: Meiner Meinung nach sollten Museen kostenlos sein, denn Kultur gehört allen. Deshalb unterstütze ich die neue Initiative.</em></p>',
   1,NOW()),
  ('b1000000-0000-0000-0001-000000000002','b1000000-0000-0000-0000-000000000001',
   'b1-zustimmen-widersprechen','Zustimmen & höflich widersprechen',
   '<h2>Zustimmen & höflich widersprechen</h2>
<h3>1. Zustimmen</h3>
<ul>
<li><strong>Da stimme ich (dir/Ihnen) völlig zu.</strong></li>
<li><strong>Das sehe ich genauso.</strong></li>
<li><strong>Da hast du recht.</strong> / <strong>Das stimmt.</strong></li>
<li><strong>Genau!</strong> / <strong>Eben!</strong> (informell)</li>
</ul>
<h3>2. Teilweise zustimmen — die B1-Königsdisziplin</h3>
<ul>
<li><strong>Das stimmt zwar, aber ...</strong></li>
<li><strong>Einerseits ja, andererseits ...</strong></li>
<li><strong>Da ist etwas dran, trotzdem ...</strong></li>
</ul>
<h3>3. Widersprechen — höflich, aber klar</h3>
<ul>
<li><strong>Das sehe ich anders.</strong></li>
<li><strong>Da bin ich anderer Meinung.</strong></li>
<li><strong>Ich verstehe deinen Punkt, aber ...</strong></li>
<li>Zu direkt (vermeiden): <em>"Das ist falsch!" / "Quatsch!"</em></li>
</ul>
<h3>4. Mini-Diskussion</h3>
<p><em>— Ich finde, alle sollten mit dem Rad zur Arbeit fahren.<br>
— Das stimmt zwar für die Stadt, aber auf dem Land funktioniert das nicht. Da bin ich anderer Meinung.</em></p>',
   2,NOW()),
  ('b1000000-0000-0000-0001-000000000003','b1000000-0000-0000-0000-000000000001',
   'b1-konnektoren','Argumente verbinden: Konnektoren',
   '<h2>Argumente verbinden: Konnektoren</h2>
<h3>1. Die wichtigsten B1-Konnektoren</h3>
<table>
<thead><tr><th>Konnektor</th><th>Funktion</th><th>Wortstellung</th></tr></thead>
<tbody>
<tr><td><strong>trotzdem</strong></td><td>Gegensatz</td><td>Verb direkt danach</td></tr>
<tr><td><strong>deshalb</strong></td><td>Folge</td><td>Verb direkt danach</td></tr>
<tr><td><strong>obwohl</strong></td><td>Gegensatz</td><td>Verb ans Ende</td></tr>
<tr><td><strong>während</strong></td><td>Kontrast/Zeit</td><td>Verb ans Ende</td></tr>
<tr><td><strong>außerdem</strong></td><td>Aufzählung</td><td>Verb direkt danach</td></tr>
</tbody>
</table>
<h3>2. Beispiele im Kontrast</h3>
<ul>
<li>Es regnet. <strong>Trotzdem</strong> fahre ich mit dem Rad.</li>
<li><strong>Obwohl</strong> es regnet, fahre ich mit dem Rad.</li>
<li>Das Ticket ist teuer. <strong>Deshalb</strong> bleibe ich zu Hause.</li>
<li><strong>Außerdem</strong> spart man mit dem Rad Geld.</li>
</ul>
<h3>3. Ein Argument aufbauen (Muster)</h3>
<p><em>These:</em> Ich bin für mehr Radwege.<br>
<em>Argument 1:</em> Erstens ist Radfahren gesund.<br>
<em>Argument 2:</em> Außerdem schützt es die Umwelt.<br>
<em>Einwand + Konter:</em> Radwege sind zwar teuer, trotzdem lohnt sich die Investition.<br>
<em>Fazit:</em> Deshalb sollte die Stadt mehr Radwege bauen.</p>',
   3,NOW()),
  ('b1000000-0000-0000-0001-000000000099','b1000000-0000-0000-0000-000000000001',
   'b1-room01-quiz','Checkpoint: Meinungen & Diskussionen',
   '<h2>Checkpoint Quiz</h2><p>Meinungen, Widerspruch und Konnektoren — zeig, dass du diskutieren kannst!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b1000000-0000-0001-0001-000000000001','b1000000-0000-0000-0001-000000000001',
   'Welcher Satz ist richtig?','multiple_choice',
   '["Meiner Meinung nach ist das eine gute Idee.", "Meiner Meinung nach das ist eine gute Idee.", "Meiner Meinung nach das eine gute Idee ist.", "Meiner Meinung ist nach das eine gute Idee."]'::jsonb,
   'Meiner Meinung nach ist das eine gute Idee.',
   '"Meiner Meinung nach" zählt als Position 1 — danach kommt sofort das Verb.',NOW()),
  ('b1000000-0000-0001-0001-000000000002','b1000000-0000-0000-0001-000000000001',
   'Vorsichtig formuliert ist:','multiple_choice',
   '["Ich bin fest davon überzeugt, dass...", "Ich könnte mir vorstellen, dass...", "Es ist eine Tatsache, dass...", "Jeder weiß, dass..."]'::jsonb,
   'Ich könnte mir vorstellen, dass...',
   'Der Konjunktiv "könnte" schwächt die Aussage höflich ab.',NOW()),
  ('b1000000-0000-0001-0001-000000000003','b1000000-0000-0000-0001-000000000001',
   '"..., ___ Kultur gehört allen." (Hauptsatz-Wortstellung danach!)','multiple_choice',
   '["denn", "weil", "da", "dass"]'::jsonb,'denn',
   'Nach "denn" folgt normale Hauptsatz-Wortstellung; weil/da schicken das Verb ans Ende.',NOW()),

  ('b1000000-0000-0001-0002-000000000001','b1000000-0000-0000-0001-000000000002',
   'Du stimmst nur teilweise zu. Was sagst du?','multiple_choice',
   '["Das stimmt zwar, aber...", "Quatsch!", "Da hast du völlig recht.", "Das ist falsch."]'::jsonb,
   'Das stimmt zwar, aber...',
   '"Zwar ... aber" = teilweise Zustimmung mit Einwand.',NOW()),
  ('b1000000-0000-0001-0002-000000000002','b1000000-0000-0000-0001-000000000002',
   'Höflicher Widerspruch:','multiple_choice',
   '["Das sehe ich anders.", "Das ist dumm.", "Nein!", "Du liegst total falsch."]'::jsonb,
   'Das sehe ich anders.',
   'Klar in der Sache, respektvoll im Ton.',NOW()),
  ('b1000000-0000-0001-0002-000000000003','b1000000-0000-0000-0001-000000000002',
   '"Das sehe ich genauso" bedeutet:','multiple_choice',
   '["Volle Zustimmung", "Teilweise Zustimmung", "Widerspruch", "Unsicherheit"]'::jsonb,
   'Volle Zustimmung',
   'Genauso sehen = die gleiche Meinung haben.',NOW()),

  ('b1000000-0000-0001-0003-000000000001','b1000000-0000-0000-0001-000000000003',
   '"Es regnet. ___ fahre ich mit dem Rad."','multiple_choice',
   '["Trotzdem", "Obwohl", "Weil", "Dass"]'::jsonb,'Trotzdem',
   'Trotzdem verbindet zwei Hauptsätze — Verb direkt danach.',NOW()),
  ('b1000000-0000-0001-0003-000000000002','b1000000-0000-0000-0001-000000000003',
   '"___ es regnet, fahre ich mit dem Rad."','multiple_choice',
   '["Obwohl", "Trotzdem", "Deshalb", "Außerdem"]'::jsonb,'Obwohl',
   'Obwohl leitet den Nebensatz ein (Verb am Ende des Nebensatzes).',NOW()),

  ('b1000000-0000-0001-0099-000000000001','b1000000-0000-0000-0001-000000000099',
   '"Das Ticket ist teuer. ___ bleibe ich zu Hause."','multiple_choice',
   '["Deshalb", "Obwohl", "Weil", "Denn"]'::jsonb,'Deshalb',
   'Folge ausdrücken: deshalb + Verb direkt danach.',NOW()),
  ('b1000000-0000-0001-0099-000000000002','b1000000-0000-0000-0001-000000000099',
   'Welcher Satz ist FALSCH?','multiple_choice',
   '["Obwohl es regnet, fahre ich Rad.", "Es regnet. Trotzdem fahre ich Rad.", "Obwohl es regnet, ich fahre Rad.", "Ich fahre Rad, obwohl es regnet."]'::jsonb,
   'Obwohl es regnet, ich fahre Rad.',
   'Nach dem Nebensatz beginnt der Hauptsatz mit dem Verb: "..., fahre ich Rad."',NOW()),
  ('b1000000-0000-0001-0099-000000000003','b1000000-0000-0000-0001-000000000099',
   'Ein neues Argument hinzufügen:','multiple_choice',
   '["Außerdem...", "Trotzdem...", "Obwohl...", "Deshalb..."]'::jsonb,'Außerdem',
   'Außerdem = zusätzlich, ein weiteres Argument.',NOW()),
  ('b1000000-0000-0001-0099-000000000004','b1000000-0000-0000-0001-000000000099',
   '"Ich verstehe deinen Punkt, aber..." ist:','multiple_choice',
   '["Höflicher Widerspruch", "Volle Zustimmung", "Eine Frage", "Ein Kompliment"]'::jsonb,
   'Höflicher Widerspruch',
   'Erst würdigen, dann widersprechen — der Diplomaten-Klassiker.',NOW()),
  ('b1000000-0000-0001-0099-000000000005','b1000000-0000-0000-0001-000000000099',
   '"Ich bin fest davon überzeugt" drückt aus:','multiple_choice',
   '["Eine starke Meinung", "Eine vorsichtige Vermutung", "Einen Zweifel", "Eine Frage"]'::jsonb,
   'Eine starke Meinung',
   'Die stärkste Stufe der Meinungsäußerung.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 02 – Medien & Nachrichten
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b1000000-0000-0000-0002-000000000001','b1000000-0000-0000-0000-000000000002',
   'b1-nachrichtensprache','Nachrichtensprache verstehen',
   '<h2>Nachrichtensprache verstehen</h2>
<h3>1. Typische Nachrichten-Wörter</h3>
<ul>
<li><strong>die Meldung</strong> – kurze Nachricht | <strong>die Schlagzeile</strong> – headline</li>
<li><strong>laut</strong> + Dativ – laut der Polizei, laut einer Studie</li>
<li><strong>der Angaben zufolge</strong> – according to the information</li>
<li><strong>voraussichtlich</strong> – probably/expected</li>
<li><strong>derzeit / momentan</strong> – currently</li>
</ul>
<h3>2. Nominalstil erkennen</h3>
<p>Nachrichten lieben Substantive statt Verben:</p>
<ul>
<li>Gesprochen: <em>Die Bahn streikt.</em> → Nachricht: <em>Wegen des <strong>Streiks</strong> der Bahn ...</em></li>
<li>Gesprochen: <em>Die Preise steigen.</em> → Nachricht: <em>Der <strong>Anstieg</strong> der Preise ...</em></li>
</ul>
<h3>3. Strategie fürs Hören und Lesen</h3>
<ol>
<li>Zuerst die W-Fragen suchen: <strong>Wer? Was? Wann? Wo? Warum?</strong></li>
<li>Zahlen und Namen notieren — sie tragen die Hauptinformation.</li>
<li>Nicht jedes Wort verstehen wollen: 70 % reichen für die Kernaussage.</li>
</ol>',
   1,NOW()),
  ('b1000000-0000-0000-0002-000000000002','b1000000-0000-0000-0000-000000000002',
   'b1-indirekte-rede','Berichten: indirekte Rede',
   '<h2>Berichten: Was hat jemand gesagt?</h2>
<h3>1. Mit dass-Sätzen berichten</h3>
<ul>
<li>Anna sagt: "Ich komme später." → Anna sagt, <strong>dass sie später kommt</strong>.</li>
<li>Der Chef meinte: "Das Projekt läuft gut." → Der Chef meinte, <strong>dass das Projekt gut läuft</strong>.</li>
</ul>
<p>Achtung Perspektivwechsel: <em>ich → sie/er, mein → ihr/sein</em>.</p>
<h3>2. Fragen berichten</h3>
<ul>
<li>"Kommst du mit?" → Er fragt, <strong>ob</strong> ich mitkomme.</li>
<li>"Wann beginnt der Kurs?" → Sie fragt, <strong>wann</strong> der Kurs beginnt.</li>
</ul>
<h3>3. Redewiedergabe-Verben variieren</h3>
<ul>
<li><strong>sagen, meinen, erklären, betonen, berichten</strong></li>
<li>Er <strong>betont</strong>, dass ... (= es ist ihm wichtig)</li>
<li>Sie <strong>berichtet</strong>, dass ... (= neutral, sachlich)</li>
<li>Laut Herrn Weber ... / Nach Angaben der Firma ...</li>
</ul>',
   2,NOW()),
  ('b1000000-0000-0000-0002-000000000003','b1000000-0000-0000-0000-000000000002',
   'b1-passiv','Das Passiv in Nachrichten',
   '<h2>Das Passiv in Nachrichten</h2>
<p>Nachrichten benutzen oft das Passiv, weil die Handlung wichtiger ist als die handelnde Person.</p>
<h3>1. Bildung: werden + Partizip II</h3>
<ul>
<li>Aktiv: <em>Die Stadt baut eine neue Schule.</em></li>
<li>Passiv: <em>Eine neue Schule <strong>wird gebaut</strong>.</em></li>
<li>Passiv Vergangenheit: <em>Die Schule <strong>wurde</strong> 2020 <strong>gebaut</strong>.</em></li>
</ul>
<h3>2. Typische Nachrichten-Passive</h3>
<ul>
<li>Der Täter <strong>wurde festgenommen</strong>.</li>
<li>Die Straße <strong>wird gesperrt</strong>.</li>
<li>Ein neues Gesetz <strong>wurde beschlossen</strong>.</li>
<li>Die Preise <strong>werden erhöht</strong>.</li>
</ul>
<h3>3. Wer war es? — von + Dativ</h3>
<p><em>Das Gesetz wurde <strong>vom Parlament</strong> beschlossen.</em><br>
Oft fehlt der Täter aber ganz — genau dafür ist das Passiv da.</p>',
   3,NOW()),
  ('b1000000-0000-0000-0002-000000000099','b1000000-0000-0000-0000-000000000002',
   'b1-room02-quiz','Checkpoint: Medien & Nachrichten',
   '<h2>Checkpoint Quiz</h2><p>Nachrichtensprache, indirekte Rede und Passiv — bist du bereit?</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b1000000-0000-0002-0001-000000000001','b1000000-0000-0000-0002-000000000001',
   '"___ einer Studie schlafen Deutsche zu wenig."','multiple_choice',
   '["Laut", "Wegen", "Trotz", "Für"]'::jsonb,'Laut',
   '"Laut + Dativ" = nach Aussage von — typische Nachrichtensprache.',NOW()),
  ('b1000000-0000-0002-0001-000000000002','b1000000-0000-0000-0002-000000000001',
   '"Voraussichtlich" bedeutet:','multiple_choice',
   '["Wahrscheinlich/erwartet", "Sicher", "Niemals", "Sofort"]'::jsonb,
   'Wahrscheinlich/erwartet',
   'Voraussichtlich = so ist es geplant/erwartet.',NOW()),
  ('b1000000-0000-0002-0001-000000000003','b1000000-0000-0000-0002-000000000001',
   'Nominalstil: "Die Preise steigen" wird zu:','multiple_choice',
   '["Der Anstieg der Preise", "Das Steigen von Preise", "Die gestiegenen Preise sind", "Der Preis steigt"]'::jsonb,
   'Der Anstieg der Preise',
   'Verb → Substantiv: steigen → der Anstieg.',NOW()),

  ('b1000000-0000-0002-0002-000000000001','b1000000-0000-0000-0002-000000000002',
   'Anna sagt: "Ich komme später." — Berichte:','multiple_choice',
   '["Anna sagt, dass sie später kommt.", "Anna sagt, dass ich später komme.", "Anna sagt, dass sie kommt später.", "Anna sagt, sie später kommt."]'::jsonb,
   'Anna sagt, dass sie später kommt.',
   'Perspektive wechseln (ich→sie) + Verb ans Ende.',NOW()),
  ('b1000000-0000-0002-0002-000000000002','b1000000-0000-0000-0002-000000000002',
   '"Kommst du mit?" — Berichte:','multiple_choice',
   '["Er fragt, ob ich mitkomme.", "Er fragt, dass ich mitkomme.", "Er fragt, wann ich mitkomme.", "Er fragt, ich komme mit."]'::jsonb,
   'Er fragt, ob ich mitkomme.',
   'Ja/Nein-Fragen werden mit "ob" berichtet.',NOW()),
  ('b1000000-0000-0002-0002-000000000003','b1000000-0000-0000-0002-000000000002',
   '"Er betont, dass..." bedeutet:','multiple_choice',
   '["Es ist ihm besonders wichtig", "Er flüstert", "Er fragt", "Er widerspricht"]'::jsonb,
   'Es ist ihm besonders wichtig',
   'Betonen = mit Nachdruck sagen.',NOW()),

  ('b1000000-0000-0002-0003-000000000001','b1000000-0000-0000-0002-000000000003',
   'Passiv von "Die Stadt baut eine Schule":','multiple_choice',
   '["Eine Schule wird gebaut.", "Eine Schule ist gebaut.", "Eine Schule baut.", "Eine Schule wurde bauen."]'::jsonb,
   'Eine Schule wird gebaut.',
   'Passiv Präsens: werden + Partizip II.',NOW()),
  ('b1000000-0000-0002-0003-000000000002','b1000000-0000-0000-0002-000000000003',
   'Passiv Vergangenheit: "Der Täter ___ festgenommen."','multiple_choice',
   '["wurde", "wird", "ist", "hat"]'::jsonb,'wurde',
   'Präteritum-Passiv: wurde + Partizip II.',NOW()),

  ('b1000000-0000-0002-0099-000000000001','b1000000-0000-0000-0002-000000000099',
   '"Das Gesetz wurde ___ Parlament beschlossen."','multiple_choice',
   '["vom", "von das", "durch dem", "beim"]'::jsonb,'vom',
   'Täter im Passiv: von + Dativ → von dem = vom.',NOW()),
  ('b1000000-0000-0002-0099-000000000002','b1000000-0000-0000-0002-000000000099',
   'Welche W-Fragen tragen die Kerninfo einer Meldung?','multiple_choice',
   '["Wer, was, wann, wo, warum", "Wie viel kostet es", "Welche Farbe", "Wessen Schuld"]'::jsonb,
   'Wer, was, wann, wo, warum',
   'Die klassischen W-Fragen der Nachricht.',NOW()),
  ('b1000000-0000-0002-0099-000000000003','b1000000-0000-0000-0002-000000000099',
   '"Wann beginnt der Kurs?" — Berichte:','multiple_choice',
   '["Sie fragt, wann der Kurs beginnt.", "Sie fragt, ob der Kurs beginnt.", "Sie fragt, wann beginnt der Kurs.", "Sie fragt, dass der Kurs beginnt."]'::jsonb,
   'Sie fragt, wann der Kurs beginnt.',
   'W-Fragen behalten ihr Fragewort; Verb ans Ende.',NOW()),
  ('b1000000-0000-0002-0099-000000000004','b1000000-0000-0000-0002-000000000099',
   'Warum benutzen Nachrichten das Passiv?','multiple_choice',
   '["Die Handlung ist wichtiger als der Täter", "Es klingt schöner", "Es ist kürzer", "Es ist moderner"]'::jsonb,
   'Die Handlung ist wichtiger als der Täter',
   'Das Passiv rückt das Geschehen in den Fokus.',NOW()),
  ('b1000000-0000-0002-0099-000000000005','b1000000-0000-0000-0002-000000000099',
   '"Die Straße ___ ab Montag gesperrt."','multiple_choice',
   '["wird", "wurde gestern", "ist worden", "hat"]'::jsonb,'wird',
   'Zukunft/Gegenwart-Passiv: wird gesperrt.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 03 – Umwelt & Nachhaltigkeit
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('b1000000-0000-0000-0003-000000000001','b1000000-0000-0000-0000-000000000003',
   'b1-umwelt-wortschatz','Umwelt-Wortschatz',
   '<h2>Umwelt-Wortschatz</h2>
<h3>1. Grundwortschatz</h3>
<ul>
<li><strong>die Umwelt</strong> – environment | <strong>der Klimawandel</strong> – climate change</li>
<li><strong>der Müll / der Abfall</strong> – waste | <strong>die Mülltrennung</strong> – waste separation</li>
<li><strong>erneuerbare Energien</strong> – renewables | <strong>der Strom</strong> – electricity</li>
<li><strong>das Pfand</strong> – deposit (Flaschen zurückbringen!)</li>
<li><strong>umweltfreundlich ↔ umweltschädlich</strong></li>
</ul>
<h3>2. Deutsche Umwelt-Kultur</h3>
<ul>
<li><strong>Mülltrennung</strong> ist Alltag: Papier (blau), Verpackung (gelb), Bio (braun), Rest (schwarz/grau), Glas nach Farben.</li>
<li><strong>Pfandflaschen</strong>: 8–25 Cent pro Flasche — zurück zum Automaten.</li>
<li>Der <strong>Wochenmarkt</strong> und <strong>Unverpackt-Läden</strong> für plastikfreies Einkaufen.</li>
</ul>
<h3>3. Verben zum Thema</h3>
<ul>
<li><strong>trennen, recyceln, wegwerfen, sparen, verschwenden, schützen, verschmutzen</strong></li>
<li>Energie <strong>sparen</strong> ↔ Energie <strong>verschwenden</strong></li>
<li>die Umwelt <strong>schützen</strong> ↔ die Umwelt <strong>verschmutzen</strong></li>
</ul>',
   1,NOW()),
  ('b1000000-0000-0000-0003-000000000002','b1000000-0000-0000-0000-000000000003',
   'b1-wenn-saetze','Bedingungen: wenn-Sätze',
   '<h2>Bedingungen: wenn-Sätze</h2>
<h3>1. Reale Bedingungen (Präsens)</h3>
<ul>
<li><strong>Wenn</strong> alle Müll trennen, <strong>wird</strong> mehr recycelt.</li>
<li><strong>Wenn</strong> du das Licht ausschaltest, <strong>sparst</strong> du Strom.</li>
</ul>
<p>Wortstellung: Im wenn-Satz Verb am Ende; der Hauptsatz danach beginnt mit dem Verb.</p>
<h3>2. Irreale Bedingungen (Konjunktiv II) — B1-Einstieg</h3>
<ul>
<li><strong>Wenn</strong> ich mehr Zeit <strong>hätte</strong>, <strong>würde</strong> ich öfter Rad fahren.</li>
<li><strong>Wenn</strong> Benzin teurer <strong>wäre</strong>, <strong>würden</strong> mehr Menschen Bus fahren.</li>
</ul>
<h3>3. Alternativen zu wenn</h3>
<ul>
<li><strong>falls</strong> – Falls es regnet, nehme ich den Bus. (= für den Fall, dass)</li>
<li><strong>je ..., desto ...</strong> – Je mehr wir sparen, desto besser für die Umwelt.</li>
</ul>',
   2,NOW()),
  ('b1000000-0000-0000-0003-000000000003','b1000000-0000-0000-0000-000000000003',
   'b1-futur-prognosen','Prognosen: das Futur',
   '<h2>Prognosen: das Futur</h2>
<h3>1. Bildung: werden + Infinitiv</h3>
<ul>
<li>Die Temperaturen <strong>werden steigen</strong>.</li>
<li>Wir <strong>werden</strong> mehr erneuerbare Energie <strong>nutzen</strong>.</li>
<li>Das Wetter <strong>wird</strong> extremer <strong>werden</strong>.</li>
</ul>
<h3>2. Futur vs. Präsens + Zeitangabe</h3>
<p>Deutsch benutzt oft das Präsens für die Zukunft, wenn eine Zeitangabe da ist:</p>
<ul>
<li><em>Morgen <strong>fahre</strong> ich nach Berlin.</em> (Präsens reicht)</li>
<li>Das Futur betont die <strong>Prognose oder Vermutung</strong>: <em>Es <strong>wird</strong> wohl <strong>regnen</strong>.</em></li>
</ul>
<h3>3. Vermutungen abstufen</h3>
<ul>
<li><strong>sicher / bestimmt</strong> – Es wird bestimmt wärmer.</li>
<li><strong>wahrscheinlich</strong> – Die Preise werden wahrscheinlich steigen.</li>
<li><strong>vielleicht / möglicherweise</strong> – Vielleicht wird es besser.</li>
<li><strong>wohl</strong> – Es wird wohl so kommen. (Vermutung)</li>
</ul>',
   3,NOW()),
  ('b1000000-0000-0000-0003-000000000099','b1000000-0000-0000-0000-000000000003',
   'b1-room03-quiz','Checkpoint: Umwelt & Nachhaltigkeit',
   '<h2>Checkpoint Quiz</h2><p>Umwelt-Wortschatz, wenn-Sätze und Futur — das B1-Umwelt-Finale!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('b1000000-0000-0003-0001-000000000001','b1000000-0000-0000-0003-000000000001',
   'Wohin gehört Papier bei der Mülltrennung?','multiple_choice',
   '["In die blaue Tonne", "In die gelbe Tonne", "In die braune Tonne", "In die schwarze Tonne"]'::jsonb,
   'In die blaue Tonne',
   'Blau = Papier, gelb = Verpackung, braun = Bio, schwarz/grau = Rest.',NOW()),
  ('b1000000-0000-0003-0001-000000000002','b1000000-0000-0000-0003-000000000001',
   'Was ist "das Pfand"?','multiple_choice',
   '["Geld, das man für Flaschen zurückbekommt", "Eine Steuer", "Eine Strafe", "Ein Rabatt"]'::jsonb,
   'Geld, das man für Flaschen zurückbekommt',
   'Pfandflaschen bringt man zum Automaten zurück (8–25 Cent).',NOW()),
  ('b1000000-0000-0003-0001-000000000003','b1000000-0000-0000-0003-000000000001',
   'Das Gegenteil von "Energie sparen":','multiple_choice',
   '["Energie verschwenden", "Energie schützen", "Energie trennen", "Energie recyceln"]'::jsonb,
   'Energie verschwenden',
   'sparen ↔ verschwenden.',NOW()),

  ('b1000000-0000-0003-0002-000000000001','b1000000-0000-0000-0003-000000000002',
   '"Wenn du das Licht ausschaltest, ___ du Strom."','multiple_choice',
   '["sparst", "spart", "sparen", "gespart"]'::jsonb,'sparst',
   'Hauptsatz nach dem wenn-Satz: Verb zuerst, dann Subjekt — sparst du.',NOW()),
  ('b1000000-0000-0003-0002-000000000002','b1000000-0000-0000-0003-000000000002',
   'Irreal: "Wenn ich mehr Zeit ___, würde ich öfter Rad fahren."','multiple_choice',
   '["hätte", "habe", "hatte", "haben würde"]'::jsonb,'hätte',
   'Irreale Bedingung → Konjunktiv II: hätte.',NOW()),
  ('b1000000-0000-0003-0002-000000000003','b1000000-0000-0000-0003-000000000002',
   '"___ mehr wir sparen, desto besser."','multiple_choice',
   '["Je", "Wenn", "Falls", "Als"]'::jsonb,'Je',
   'Die Struktur heißt: je + Komparativ, desto + Komparativ.',NOW()),

  ('b1000000-0000-0003-0003-000000000001','b1000000-0000-0000-0003-000000000003',
   'Futur: "Die Temperaturen ___ steigen."','multiple_choice',
   '["werden", "wird", "sind", "haben"]'::jsonb,'werden',
   'Futur: werden + Infinitiv; Subjekt Plural → werden.',NOW()),
  ('b1000000-0000-0003-0003-000000000002','b1000000-0000-0000-0003-000000000003',
   '"Es wird ___ regnen." (Vermutung)','multiple_choice',
   '["wohl", "gestern", "nie sicher", "ob"]'::jsonb,'wohl',
   '"Wohl" macht das Futur zur Vermutung.',NOW()),

  ('b1000000-0000-0003-0099-000000000001','b1000000-0000-0000-0003-000000000099',
   '"Morgen fahre ich nach Berlin." — Warum kein Futur?','multiple_choice',
   '["Die Zeitangabe macht das Präsens ausreichend", "Futur ist falsch", "Fahren hat kein Futur", "Das ist Vergangenheit"]'::jsonb,
   'Die Zeitangabe macht das Präsens ausreichend',
   'Mit Zeitangabe nutzt Deutsch meist das Präsens für die Zukunft.',NOW()),
  ('b1000000-0000-0003-0099-000000000002','b1000000-0000-0000-0003-000000000099',
   'Sortiere nach Sicherheit (höchste zuerst): bestimmt / vielleicht / wahrscheinlich','multiple_choice',
   '["bestimmt > wahrscheinlich > vielleicht", "vielleicht > bestimmt > wahrscheinlich", "wahrscheinlich > vielleicht > bestimmt", "Alle gleich"]'::jsonb,
   'bestimmt > wahrscheinlich > vielleicht',
   'bestimmt (sicher) > wahrscheinlich > vielleicht (unsicher).',NOW()),
  ('b1000000-0000-0003-0099-000000000003','b1000000-0000-0000-0003-000000000099',
   '"___ es regnet, nehme ich den Bus." (= für den Fall, dass)','multiple_choice',
   '["Falls", "Obwohl", "Damit", "Bevor"]'::jsonb,'Falls',
   'Falls = wenn der Fall eintritt.',NOW()),
  ('b1000000-0000-0003-0099-000000000004','b1000000-0000-0000-0003-000000000099',
   'Was bedeutet "umweltschädlich"?','multiple_choice',
   '["Schlecht für die Umwelt", "Gut für die Umwelt", "Neutral", "Recycelbar"]'::jsonb,
   'Schlecht für die Umwelt',
   'schädlich = es schadet; Gegenteil: umweltfreundlich.',NOW()),
  ('b1000000-0000-0003-0099-000000000005','b1000000-0000-0000-0003-000000000099',
   'Irreal: "Wenn Benzin teurer wäre, ___ mehr Menschen Bus fahren."','multiple_choice',
   '["würden", "werden", "wurden", "waren"]'::jsonb,'würden',
   'Konjunktiv II im Hauptsatz: würden + Infinitiv.',NOW())
ON CONFLICT (id) DO NOTHING;
