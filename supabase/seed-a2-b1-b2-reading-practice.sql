-- ============================================================
-- DeutschPilot – A2/B1/B2 Reading Comprehension Practice
-- Additive only: new courses + lessons + exercises.
-- Does NOT modify any existing rows. Safe to re-run
-- (uses ON CONFLICT DO NOTHING, matching supabase/seed.sql style).
-- Run in Supabase SQL Editor AFTER schema-courses.sql and
-- seed-a1-reading-practice.sql. Appears automatically on the
-- public /courses page (level filter) once run — no code deploy needed.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSES
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000006',
   'A2 Reading Practice',
   'a2-reading-practice',
   'Slightly longer German texts about everyday situations, with comprehension questions for A2 learners.',
   'A2', 'de', TRUE, NOW()),
  ('00000000-0000-0000-0000-000000000007',
   'B1 Reading Practice',
   'b1-reading-practice',
   'Everyday and opinion-based German texts with comprehension questions for B1 learners.',
   'B1', 'de', TRUE, NOW()),
  ('00000000-0000-0000-0000-000000000008',
   'B2 Reading Practice',
   'b2-reading-practice',
   'Longer, more abstract German texts on work and society, with comprehension questions for B2 learners.',
   'B2', 'de', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – A2 Reading Practice
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0006-000000000001',
   '00000000-0000-0000-0000-000000000006',
   'Ein Umzug nach Berlin',
   'ein-umzug-nach-berlin',
   '<h2>Lesetext: Ein Umzug nach Berlin</h2>
<p>Letztes Jahr ist Sofia von Madrid nach Berlin gezogen. Sie hat dort eine neue Stelle als Grafikdesignerin gefunden. Am Anfang war es nicht einfach, weil sie kein Deutsch sprechen konnte.</p>
<p>Sofia hat einen Deutschkurs besucht und jeden Tag eine Stunde gelernt. Nach sechs Monaten konnte sie schon gut mit ihren Kollegen sprechen. Sie hat auch neue Freunde gefunden, weil sie in einem Sportverein Volleyball spielt.</p>
<p>Heute lebt Sofia gerne in Berlin. Sie sagt: "Am Anfang war es schwierig, aber jetzt fühle ich mich zu Hause."</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0006-000000000002',
   '00000000-0000-0000-0000-000000000006',
   'Der Wochenmarkt',
   'der-wochenmarkt',
   '<h2>Lesetext: Der Wochenmarkt</h2>
<p>Jeden Samstag geht Familie Weber auf den Wochenmarkt in ihrer Stadt. Dort kaufen sie frisches Obst, Gemüse und Käse direkt von den Bauern.</p>
<p>Herr Weber kauft immer Äpfel und Kartoffeln. Frau Weber sucht gerne nach neuen Käsesorten. Ihre Tochter Mia isst am liebsten die frischen Erdbeeren im Sommer.</p>
<p>Nach dem Einkaufen trinken sie oft einen Kaffee an einem kleinen Stand und unterhalten sich mit den Verkäufern. Der Markt ist nicht nur zum Einkaufen da, sondern auch ein Treffpunkt für die ganze Nachbarschaft.</p>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0006-000000000003',
   '00000000-0000-0000-0000-000000000006',
   'Ein Arzttermin',
   'ein-arzttermin',
   '<h2>Lesetext: Ein Arzttermin</h2>
<p>Herr Klein hat seit drei Tagen Kopfschmerzen und ein bisschen Fieber. Er ruft in der Arztpraxis an und bekommt einen Termin für den nächsten Morgen.</p>
<p>Die Ärztin untersucht ihn und fragt nach seinen Symptomen. Sie sagt, dass es wahrscheinlich eine leichte Erkältung ist. Sie verschreibt ihm Medikamente und rät ihm, viel zu trinken und sich auszuruhen.</p>
<p>Herr Klein soll für drei Tage zu Hause bleiben. Wenn es ihm nicht besser geht, soll er wiederkommen. Nach einer Woche fühlt er sich wieder gesund.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B1 Reading Practice
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0007-000000000001',
   '00000000-0000-0000-0000-000000000007',
   'Homeoffice oder Büro?',
   'homeoffice-oder-buero',
   '<h2>Lesetext: Homeoffice oder Büro?</h2>
<p>Seit der Pandemie arbeiten viele Menschen im Homeoffice. Manche finden das sehr praktisch, weil sie keine Zeit für den Arbeitsweg verlieren und flexibler arbeiten können. Andere vermissen den direkten Kontakt zu ihren Kollegen.</p>
<p>Laura, die als Softwareentwicklerin arbeitet, sagt: "Ich mag es, von zu Hause zu arbeiten, weil ich mich besser konzentrieren kann. Allerdings fehlt mir manchmal der persönliche Austausch mit dem Team."</p>
<p>Viele Firmen bieten heute ein hybrides Modell an: Die Mitarbeiter arbeiten teilweise im Büro und teilweise zu Hause. So können sie die Vorteile von beidem nutzen.</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0007-000000000002',
   '00000000-0000-0000-0000-000000000007',
   'Nachhaltigkeit im Alltag',
   'nachhaltigkeit-im-alltag',
   '<h2>Lesetext: Nachhaltigkeit im Alltag</h2>
<p>Immer mehr Menschen in Deutschland achten auf einen nachhaltigen Lebensstil. Sie kaufen weniger Plastik, reparieren kaputte Geräte, statt neue zu kaufen, und nutzen häufiger das Fahrrad oder öffentliche Verkehrsmittel.</p>
<p>Ein Grund dafür ist das wachsende Bewusstsein für den Klimawandel. Viele Städte fördern deshalb den Ausbau von Fahrradwegen und bieten günstigere Tickets für Busse und Bahnen an.</p>
<p>Trotzdem sagen Experten, dass noch viel mehr getan werden muss, damit sich wirklich etwas ändert. Kleine Schritte im Alltag sind ein Anfang, reichen aber allein nicht aus.</p>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0007-000000000003',
   '00000000-0000-0000-0000-000000000007',
   'Eine schwierige Entscheidung',
   'eine-schwierige-entscheidung',
   '<h2>Lesetext: Eine schwierige Entscheidung</h2>
<p>Tobias hat vor Kurzem ein Jobangebot in einer anderen Stadt bekommen. Das neue Gehalt wäre deutlich höher, aber er müsste seine Familie und Freunde zurücklassen.</p>
<p>Er hat lange mit seiner Partnerin darüber gesprochen. Sie meint, dass Geld nicht alles ist, aber sie versteht auch, dass die Stelle eine große Chance für seine Karriere wäre.</p>
<p>Am Ende hat sich Tobias entschieden, das Angebot anzunehmen, aber nur, weil seine Firma ihm erlaubt, teilweise im Homeoffice zu arbeiten und regelmäßig nach Hause zu fahren.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B2 Reading Practice
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0008-000000000001',
   '00000000-0000-0000-0000-000000000008',
   'Künstliche Intelligenz am Arbeitsplatz',
   'kuenstliche-intelligenz-am-arbeitsplatz',
   '<h2>Lesetext: Künstliche Intelligenz am Arbeitsplatz</h2>
<p>Künstliche Intelligenz verändert zunehmend die Arbeitswelt. Viele Unternehmen setzen KI-Systeme ein, um repetitive Aufgaben zu automatisieren und Prozesse effizienter zu gestalten. Dies betrifft nicht nur die Industrie, sondern auch Bürotätigkeiten wie die Datenanalyse oder Kundenkommunikation.</p>
<p>Kritiker befürchten, dass dadurch zahlreiche Arbeitsplätze verloren gehen könnten. Befürworter hingegen argumentieren, dass neue Technologien historisch gesehen stets neue Berufsfelder geschaffen haben, auch wenn dieser Wandel Zeit und Weiterbildung erfordert.</p>
<p>Es scheint daher wichtig, dass Arbeitnehmer sich kontinuierlich weiterbilden, um mit den technologischen Entwicklungen Schritt zu halten, anstatt von ihnen überholt zu werden.</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0008-000000000002',
   '00000000-0000-0000-0000-000000000008',
   'Der demografische Wandel',
   'der-demografische-wandel',
   '<h2>Lesetext: Der demografische Wandel</h2>
<p>Deutschland steht vor einer demografischen Herausforderung: Die Bevölkerung wird im Durchschnitt immer älter, während gleichzeitig die Geburtenrate niedrig bleibt. Dies hat weitreichende Folgen für das Rentensystem und den Arbeitsmarkt.</p>
<p>Um dem Fachkräftemangel entgegenzuwirken, setzt die Bundesregierung unter anderem auf gezielte Zuwanderung qualifizierter Arbeitskräfte sowie auf Maßnahmen zur besseren Vereinbarkeit von Familie und Beruf.</p>
<p>Ökonomen betonen jedoch, dass diese Maßnahmen allein nicht ausreichen werden und weitere strukturelle Reformen notwendig sind, um die sozialen Sicherungssysteme langfristig zu stabilisieren.</p>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0008-000000000003',
   '00000000-0000-0000-0000-000000000008',
   'Stadt oder Land?',
   'stadt-oder-land',
   '<h2>Lesetext: Stadt oder Land?</h2>
<p>Die Debatte darüber, ob das Leben in der Stadt oder auf dem Land vorzuziehen ist, wird in Deutschland seit Jahren geführt. Städte bieten zwar bessere Infrastruktur, mehr Kulturangebote und Karrieremöglichkeiten, gehen jedoch oft mit hohen Mietpreisen und Lärmbelastung einher.</p>
<p>Das Leben auf dem Land wiederum wird häufig mit Ruhe, günstigerem Wohnraum und einer engeren Gemeinschaft assoziiert, wobei die Anbindung an öffentliche Verkehrsmittel und medizinische Versorgung teilweise eingeschränkt ist.</p>
<p>Seit der Pandemie und der Zunahme von Homeoffice-Möglichkeiten ziehen jedoch wieder mehr Menschen aufs Land, da sie nicht mehr täglich ins Büro pendeln müssen.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A2 Lesson 1 (Ein Umzug nach Berlin)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0006-0001-000000000001',
   '00000000-0000-0000-0006-000000000001',
   'Woher kommt Sofia?',
   'multiple_choice',
   '["Aus Berlin", "Aus Madrid", "Aus Hamburg", "Aus München"]'::jsonb,
   'Aus Madrid',
   'Der Text sagt: "Letztes Jahr ist Sofia von Madrid nach Berlin gezogen."',
   NOW()),
  ('00000000-0000-0006-0001-000000000002',
   '00000000-0000-0000-0006-000000000001',
   'Was ist Sofias Beruf?',
   'multiple_choice',
   '["Ärztin", "Grafikdesignerin", "Lehrerin", "Ingenieurin"]'::jsonb,
   'Grafikdesignerin',
   'Der Text sagt: "Sie hat dort eine neue Stelle als Grafikdesignerin gefunden."',
   NOW()),
  ('00000000-0000-0006-0001-000000000003',
   '00000000-0000-0000-0006-000000000001',
   'Wie hat Sofia neue Freunde gefunden?',
   'multiple_choice',
   '["Über die Arbeit", "Im Sportverein", "In der Uni", "Beim Einkaufen"]'::jsonb,
   'Im Sportverein',
   'Der Text sagt: "Sie hat auch neue Freunde gefunden, weil sie in einem Sportverein Volleyball spielt."',
   NOW()),
  ('00000000-0000-0006-0001-000000000004',
   '00000000-0000-0000-0006-000000000001',
   'Wie lange hat es gedauert, bis Sofia gut mit Kollegen sprechen konnte?',
   'multiple_choice',
   '["Drei Monate", "Sechs Monate", "Ein Jahr", "Zwei Jahre"]'::jsonb,
   'Sechs Monate',
   'Der Text sagt: "Nach sechs Monaten konnte sie schon gut mit ihren Kollegen sprechen."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A2 Lesson 2 (Der Wochenmarkt)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0006-0002-000000000001',
   '00000000-0000-0000-0006-000000000002',
   'Wann geht Familie Weber auf den Markt?',
   'multiple_choice',
   '["Jeden Freitag", "Jeden Samstag", "Jeden Sonntag", "Jeden Tag"]'::jsonb,
   'Jeden Samstag',
   'Der Text sagt: "Jeden Samstag geht Familie Weber auf den Wochenmarkt."',
   NOW()),
  ('00000000-0000-0006-0002-000000000002',
   '00000000-0000-0000-0006-000000000002',
   'Was kauft Herr Weber immer?',
   'multiple_choice',
   '["Käse und Brot", "Äpfel und Kartoffeln", "Erdbeeren", "Fisch"]'::jsonb,
   'Äpfel und Kartoffeln',
   'Der Text sagt: "Herr Weber kauft immer Äpfel und Kartoffeln."',
   NOW()),
  ('00000000-0000-0006-0002-000000000003',
   '00000000-0000-0000-0006-000000000002',
   'Was isst Mia am liebsten im Sommer?',
   'multiple_choice',
   '["Äpfel", "Kartoffeln", "Erdbeeren", "Käse"]'::jsonb,
   'Erdbeeren',
   'Der Text sagt: "Ihre Tochter Mia isst am liebsten die frischen Erdbeeren im Sommer."',
   NOW()),
  ('00000000-0000-0006-0002-000000000004',
   '00000000-0000-0000-0006-000000000002',
   'Was machen sie nach dem Einkaufen oft?',
   'multiple_choice',
   '["Sie gehen nach Hause.", "Sie trinken Kaffee und unterhalten sich.", "Sie gehen ins Kino.", "Sie schlafen."]'::jsonb,
   'Sie trinken Kaffee und unterhalten sich.',
   'Der Text sagt: "Nach dem Einkaufen trinken sie oft einen Kaffee... und unterhalten sich mit den Verkäufern."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A2 Lesson 3 (Ein Arzttermin)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0006-0003-000000000001',
   '00000000-0000-0000-0006-000000000003',
   'Seit wann hat Herr Klein Kopfschmerzen?',
   'multiple_choice',
   '["Seit einem Tag", "Seit drei Tagen", "Seit einer Woche", "Seit einem Monat"]'::jsonb,
   'Seit drei Tagen',
   'Der Text sagt: "Herr Klein hat seit drei Tagen Kopfschmerzen."',
   NOW()),
  ('00000000-0000-0006-0003-000000000002',
   '00000000-0000-0000-0006-000000000003',
   'Was verschreibt die Ärztin?',
   'multiple_choice',
   '["Nichts", "Medikamente", "Eine Operation", "Einen Krankenhausaufenthalt"]'::jsonb,
   'Medikamente',
   'Der Text sagt: "Sie verschreibt ihm Medikamente."',
   NOW()),
  ('00000000-0000-0006-0003-000000000003',
   '00000000-0000-0000-0006-000000000003',
   'Wie lange soll Herr Klein zu Hause bleiben?',
   'multiple_choice',
   '["Einen Tag", "Drei Tage", "Eine Woche", "Zwei Wochen"]'::jsonb,
   'Drei Tage',
   'Der Text sagt: "Herr Klein soll für drei Tage zu Hause bleiben."',
   NOW()),
  ('00000000-0000-0006-0003-000000000004',
   '00000000-0000-0000-0006-000000000003',
   'Wie fühlt sich Herr Klein nach einer Woche?',
   'multiple_choice',
   '["Immer noch krank", "Wieder gesund", "Schlechter", "Müde"]'::jsonb,
   'Wieder gesund',
   'Der Text sagt: "Nach einer Woche fühlt er sich wieder gesund."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B1 Lesson 1 (Homeoffice oder Büro?)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0007-0001-000000000001',
   '00000000-0000-0000-0007-000000000001',
   'Was ist Lauras Beruf?',
   'multiple_choice',
   '["Ärztin", "Softwareentwicklerin", "Lehrerin", "Verkäuferin"]'::jsonb,
   'Softwareentwicklerin',
   'Der Text sagt: "Laura, die als Softwareentwicklerin arbeitet..."',
   NOW()),
  ('00000000-0000-0007-0001-000000000002',
   '00000000-0000-0000-0007-000000000001',
   'Was vermisst Laura manchmal?',
   'multiple_choice',
   '["Den Arbeitsweg", "Den persönlichen Austausch mit dem Team", "Ihr Büro", "Ihren Computer"]'::jsonb,
   'Den persönlichen Austausch mit dem Team',
   'Der Text sagt: "Allerdings fehlt mir manchmal der persönliche Austausch mit dem Team."',
   NOW()),
  ('00000000-0000-0007-0001-000000000003',
   '00000000-0000-0000-0007-000000000001',
   'Was bieten viele Firmen heute an?',
   'multiple_choice',
   '["Nur Büroarbeit", "Nur Homeoffice", "Ein hybrides Modell", "Keine Arbeit von zu Hause"]'::jsonb,
   'Ein hybrides Modell',
   'Der Text sagt: "Viele Firmen bieten heute ein hybrides Modell an."',
   NOW()),
  ('00000000-0000-0007-0001-000000000004',
   '00000000-0000-0000-0007-000000000001',
   'Warum mag Laura das Homeoffice?',
   'multiple_choice',
   '["Sie kann besser schlafen.", "Sie kann sich besser konzentrieren.", "Sie mag ihre Kollegen nicht.", "Sie hat kein Auto."]'::jsonb,
   'Sie kann sich besser konzentrieren.',
   'Der Text sagt: "Ich mag es, von zu Hause zu arbeiten, weil ich mich besser konzentrieren kann."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B1 Lesson 2 (Nachhaltigkeit im Alltag)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0007-0002-000000000001',
   '00000000-0000-0000-0007-000000000002',
   'Was machen viele Menschen statt neue Geräte zu kaufen?',
   'multiple_choice',
   '["Sie leihen sie.", "Sie reparieren kaputte Geräte.", "Sie verkaufen sie.", "Sie sammeln sie."]'::jsonb,
   'Sie reparieren kaputte Geräte.',
   'Der Text sagt: "...reparieren kaputte Geräte, statt neue zu kaufen."',
   NOW()),
  ('00000000-0000-0007-0002-000000000002',
   '00000000-0000-0000-0007-000000000002',
   'Was fördern viele Städte?',
   'multiple_choice',
   '["Autobahnen", "Fahrradwege und günstigere Tickets", "Neue Einkaufszentren", "Flughäfen"]'::jsonb,
   'Fahrradwege und günstigere Tickets',
   'Der Text sagt: "...fördern deshalb den Ausbau von Fahrradwegen und bieten günstigere Tickets."',
   NOW()),
  ('00000000-0000-0007-0002-000000000003',
   '00000000-0000-0000-0007-000000000002',
   'Was sagen Experten über kleine Schritte im Alltag?',
   'multiple_choice',
   '["Sie reichen völlig aus.", "Sie sind ein Anfang, reichen aber nicht aus.", "Sie sind unnötig.", "Sie schaden dem Klima."]'::jsonb,
   'Sie sind ein Anfang, reichen aber nicht aus.',
   'Der Text sagt: "Kleine Schritte im Alltag sind ein Anfang, reichen aber allein nicht aus."',
   NOW()),
  ('00000000-0000-0007-0002-000000000004',
   '00000000-0000-0000-0007-000000000002',
   'Warum achten mehr Menschen auf Nachhaltigkeit?',
   'multiple_choice',
   '["Wegen des Bewusstseins für den Klimawandel", "Wegen neuer Gesetze", "Wegen niedrigerer Preise", "Wegen der Mode"]'::jsonb,
   'Wegen des Bewusstseins für den Klimawandel',
   'Der Text sagt: "Ein Grund dafür ist das wachsende Bewusstsein für den Klimawandel."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B1 Lesson 3 (Eine schwierige Entscheidung)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0007-0003-000000000001',
   '00000000-0000-0000-0007-000000000003',
   'Was hat Tobias bekommen?',
   'multiple_choice',
   '["Eine Beförderung", "Ein Jobangebot in einer anderen Stadt", "Ein neues Auto", "Eine Kündigung"]'::jsonb,
   'Ein Jobangebot in einer anderen Stadt',
   'Der Text sagt: "Tobias hat vor Kurzem ein Jobangebot in einer anderen Stadt bekommen."',
   NOW()),
  ('00000000-0000-0007-0003-000000000002',
   '00000000-0000-0000-0007-000000000003',
   'Was meint seine Partnerin?',
   'multiple_choice',
   '["Geld ist alles.", "Geld ist nicht alles, aber es ist eine große Chance.", "Er soll ablehnen.", "Sie ist dagegen."]'::jsonb,
   'Geld ist nicht alles, aber es ist eine große Chance.',
   'Der Text sagt: "Sie meint, dass Geld nicht alles ist, aber sie versteht auch, dass die Stelle eine große Chance... wäre."',
   NOW()),
  ('00000000-0000-0007-0003-000000000003',
   '00000000-0000-0000-0007-000000000003',
   'Wofür entscheidet sich Tobias am Ende?',
   'multiple_choice',
   '["Er lehnt das Angebot ab.", "Er nimmt das Angebot an.", "Er wartet noch ein Jahr.", "Er kündigt seinen Job."]'::jsonb,
   'Er nimmt das Angebot an.',
   'Der Text sagt: "Am Ende hat sich Tobias entschieden, das Angebot anzunehmen."',
   NOW()),
  ('00000000-0000-0007-0003-000000000004',
   '00000000-0000-0000-0007-000000000003',
   'Was erlaubt ihm seine neue Firma?',
   'multiple_choice',
   '["Nur im Büro zu arbeiten", "Teilweise im Homeoffice zu arbeiten", "Nie zu reisen", "Nur am Wochenende zu arbeiten"]'::jsonb,
   'Teilweise im Homeoffice zu arbeiten',
   'Der Text sagt: "...seine Firma ihm erlaubt, teilweise im Homeoffice zu arbeiten."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B2 Lesson 1 (Künstliche Intelligenz am Arbeitsplatz)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0008-0001-000000000001',
   '00000000-0000-0000-0008-000000000001',
   'Wofür setzen Unternehmen KI-Systeme ein?',
   'multiple_choice',
   '["Um Gehälter zu senken", "Um repetitive Aufgaben zu automatisieren", "Um Mitarbeiter zu überwachen", "Um neue Büros zu bauen"]'::jsonb,
   'Um repetitive Aufgaben zu automatisieren',
   'Der Text sagt: "...um repetitive Aufgaben zu automatisieren und Prozesse effizienter zu gestalten."',
   NOW()),
  ('00000000-0000-0008-0001-000000000002',
   '00000000-0000-0000-0008-000000000001',
   'Was befürchten Kritiker?',
   'multiple_choice',
   '["Höhere Löhne", "Den Verlust von Arbeitsplätzen", "Weniger Automatisierung", "Mehr Büros"]'::jsonb,
   'Den Verlust von Arbeitsplätzen',
   'Der Text sagt: "Kritiker befürchten, dass dadurch zahlreiche Arbeitsplätze verloren gehen könnten."',
   NOW()),
  ('00000000-0000-0008-0001-000000000003',
   '00000000-0000-0000-0008-000000000001',
   'Was argumentieren Befürworter?',
   'multiple_choice',
   '["KI schafft keine neuen Jobs.", "Neue Technologien haben historisch stets neue Berufsfelder geschaffen.", "KI ist gefährlich.", "Weiterbildung ist unnötig."]'::jsonb,
   'Neue Technologien haben historisch stets neue Berufsfelder geschaffen.',
   'Der Text sagt: "...dass neue Technologien historisch gesehen stets neue Berufsfelder geschaffen haben."',
   NOW()),
  ('00000000-0000-0008-0001-000000000004',
   '00000000-0000-0000-0008-000000000001',
   'Was sollten Arbeitnehmer laut Text tun?',
   'multiple_choice',
   '["Den Job wechseln", "Sich kontinuierlich weiterbilden", "Weniger arbeiten", "Die Technologie ignorieren"]'::jsonb,
   'Sich kontinuierlich weiterbilden',
   'Der Text sagt: "...dass Arbeitnehmer sich kontinuierlich weiterbilden."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B2 Lesson 2 (Der demografische Wandel)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0008-0002-000000000001',
   '00000000-0000-0000-0008-000000000002',
   'Was passiert mit der Bevölkerung in Deutschland?',
   'multiple_choice',
   '["Sie wird jünger.", "Sie wird im Durchschnitt älter.", "Sie wächst schnell.", "Sie bleibt gleich."]'::jsonb,
   'Sie wird im Durchschnitt älter.',
   'Der Text sagt: "Die Bevölkerung wird im Durchschnitt immer älter."',
   NOW()),
  ('00000000-0000-0008-0002-000000000002',
   '00000000-0000-0000-0008-000000000002',
   'Worauf setzt die Bundesregierung gegen den Fachkräftemangel?',
   'multiple_choice',
   '["Höhere Steuern", "Gezielte Zuwanderung qualifizierter Arbeitskräfte", "Weniger Arbeitsplätze", "Kürzere Arbeitszeiten"]'::jsonb,
   'Gezielte Zuwanderung qualifizierter Arbeitskräfte',
   'Der Text sagt: "...setzt die Bundesregierung unter anderem auf gezielte Zuwanderung qualifizierter Arbeitskräfte."',
   NOW()),
  ('00000000-0000-0008-0002-000000000003',
   '00000000-0000-0000-0008-000000000002',
   'Was betonen Ökonomen?',
   'multiple_choice',
   '["Die Maßnahmen reichen aus.", "Weitere strukturelle Reformen sind notwendig.", "Zuwanderung ist unnötig.", "Das Rentensystem ist stabil."]'::jsonb,
   'Weitere strukturelle Reformen sind notwendig.',
   'Der Text sagt: "...dass diese Maßnahmen allein nicht ausreichen werden und weitere strukturelle Reformen notwendig sind."',
   NOW()),
  ('00000000-0000-0008-0002-000000000004',
   '00000000-0000-0000-0008-000000000002',
   'Was bleibt niedrig, während die Bevölkerung altert?',
   'multiple_choice',
   '["Die Geburtenrate", "Die Lebenserwartung", "Die Arbeitslosigkeit", "Die Steuern"]'::jsonb,
   'Die Geburtenrate',
   'Der Text sagt: "...während gleichzeitig die Geburtenrate niedrig bleibt."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B2 Lesson 3 (Stadt oder Land?)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0008-0003-000000000001',
   '00000000-0000-0000-0008-000000000003',
   'Was bieten Städte laut Text?',
   'multiple_choice',
   '["Ruhe und günstigen Wohnraum", "Bessere Infrastruktur und Karrieremöglichkeiten", "Weniger Lärm", "Nur schlechte Verkehrsanbindung"]'::jsonb,
   'Bessere Infrastruktur und Karrieremöglichkeiten',
   'Der Text sagt: "Städte bieten zwar bessere Infrastruktur, mehr Kulturangebote und Karrieremöglichkeiten."',
   NOW()),
  ('00000000-0000-0008-0003-000000000002',
   '00000000-0000-0000-0008-000000000003',
   'Womit wird das Landleben oft assoziiert?',
   'multiple_choice',
   '["Hohen Mietpreisen", "Ruhe und günstigerem Wohnraum", "Lärmbelastung", "Vielen Karrieremöglichkeiten"]'::jsonb,
   'Ruhe und günstigerem Wohnraum',
   'Der Text sagt: "...wird häufig mit Ruhe, günstigerem Wohnraum und einer engeren Gemeinschaft assoziiert."',
   NOW()),
  ('00000000-0000-0008-0003-000000000003',
   '00000000-0000-0000-0008-000000000003',
   'Was ist auf dem Land teilweise eingeschränkt?',
   'multiple_choice',
   '["Die Ruhe", "Die Anbindung an öffentliche Verkehrsmittel und medizinische Versorgung", "Der Wohnraum", "Die Gemeinschaft"]'::jsonb,
   'Die Anbindung an öffentliche Verkehrsmittel und medizinische Versorgung',
   'Der Text sagt: "...wobei die Anbindung an öffentliche Verkehrsmittel und medizinische Versorgung teilweise eingeschränkt ist."',
   NOW()),
  ('00000000-0000-0008-0003-000000000004',
   '00000000-0000-0000-0008-000000000003',
   'Warum ziehen seit der Pandemie wieder mehr Menschen aufs Land?',
   'multiple_choice',
   '["Wegen niedrigerer Steuern", "Weil sie nicht mehr täglich ins Büro pendeln müssen", "Wegen besserer Schulen", "Wegen des Wetters"]'::jsonb,
   'Weil sie nicht mehr täglich ins Büro pendeln müssen',
   'Der Text sagt: "...da sie nicht mehr täglich ins Büro pendeln müssen."',
   NOW())
ON CONFLICT (id) DO NOTHING;
