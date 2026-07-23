-- ============================================================
-- DeutschPilot – A2/B1/B2 Listening Practice
-- Additive only: new courses + lessons + exercises. Uses the
-- existing 'multiple_choice' exercise type and the audio-player
-- rendering already added in commit 6fcab80.
--
-- Audio is generated speech hosted on a third-party CDN
-- (Higgsfield/seed_audio), same as A1 listening practice — not
-- guaranteed permanent, consider re-hosting on Supabase Storage
-- before this is core content.
--
-- Does NOT modify any existing rows. Safe to re-run
-- (uses ON CONFLICT DO NOTHING).
-- Appears automatically on the public /courses page once run.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSES
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000018',
   'A2 Listening Practice',
   'a2-listening-practice',
   'Listen to short German audio clips about everyday situations and answer comprehension questions.',
   'A2', 'de', TRUE, NOW()),
  ('00000000-0000-0000-0000-000000000019',
   'B1 Listening Practice',
   'b1-listening-practice',
   'Listen to German audio clips with opinions and everyday topics, and answer comprehension questions.',
   'B1', 'de', TRUE, NOW()),
  ('00000000-0000-0000-0000-000000000020',
   'B2 Listening Practice',
   'b2-listening-practice',
   'Listen to longer, more abstract German audio clips and answer comprehension questions.',
   'B2', 'de', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – A2
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0018-000000000001',
   '00000000-0000-0000-0000-000000000018',
   'Einen Termin vereinbaren',
   'einen-termin-vereinbaren-hoeren',
   '<h2>Hörtext: Einen Termin vereinbaren</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Entschuldigung, ich möchte gern einen Termin für nächste Woche vereinbaren. Haben Sie am Dienstag um zehn Uhr Zeit? Perfekt, dann sehen wir uns am Dienstag."</em></p>',
   1,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_130316_04b88747-8344-4061-b0b8-a4ed7ee82920.wav',
   NOW()),
  ('00000000-0000-0000-0018-000000000002',
   '00000000-0000-0000-0000-000000000018',
   'Der Wochenmarkt',
   'der-wochenmarkt-hoeren',
   '<h2>Hörtext: Der Wochenmarkt</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Jeden Samstag gehe ich auf den Wochenmarkt in meiner Stadt. Dort kaufe ich frisches Gemüse, Obst und manchmal auch Blumen. Die Atmosphäre dort ist immer sehr lebendig und freundlich."</em></p>',
   2,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_175400_c5676faa-7558-4fb9-9aac-c0686ccf725e.wav',
   NOW()),
  ('00000000-0000-0000-0018-000000000003',
   '00000000-0000-0000-0000-000000000018',
   'Eine Reise nach Hamburg',
   'eine-reise-nach-hamburg-hoeren',
   '<h2>Hörtext: Eine Reise nach Hamburg</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Letzten Sommer bin ich nach Hamburg gefahren. Ich habe den Hafen besucht und bin mit einem Boot gefahren. Das Wetter war leider nicht so gut, aber die Stadt hat mir trotzdem sehr gut gefallen."</em></p>',
   3,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_175446_3e1dff1e-7692-4e96-9d58-31ec87cba34f.wav',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B1
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0019-000000000001',
   '00000000-0000-0000-0000-000000000019',
   'Meinung zum Homeoffice',
   'meinung-homeoffice-hoeren',
   '<h2>Hörtext: Meinung zum Homeoffice</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Ich mag es, von zu Hause zu arbeiten, weil ich mich besser konzentrieren kann. Allerdings fehlt mir manchmal der persönliche Austausch mit dem Team. Viele Firmen bieten heute ein hybrides Modell an, und ich finde das eine gute Lösung."</em></p>',
   1,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_175531_26b1f3f0-21aa-43a7-ba1e-d07b8bec124c.wav',
   NOW()),
  ('00000000-0000-0000-0019-000000000002',
   '00000000-0000-0000-0000-000000000019',
   'Nachhaltigkeit im Alltag',
   'nachhaltigkeit-im-alltag-hoeren',
   '<h2>Hörtext: Nachhaltigkeit im Alltag</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Immer mehr Menschen achten auf einen nachhaltigen Lebensstil. Sie kaufen weniger Plastik und nutzen häufiger das Fahrrad. Trotzdem sagen Experten, dass noch viel mehr getan werden muss, damit sich wirklich etwas ändert."</em></p>',
   2,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_175707_c00dd744-f622-4c1e-a70e-2d038396f081.wav',
   NOW()),
  ('00000000-0000-0000-0019-000000000003',
   '00000000-0000-0000-0000-000000000019',
   'Eine schwierige Entscheidung',
   'eine-schwierige-entscheidung-hoeren',
   '<h2>Hörtext: Eine schwierige Entscheidung</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Letztes Jahr habe ich ein Jobangebot in einer anderen Stadt bekommen. Es war eine schwierige Entscheidung, weil ich meine Familie zurücklassen musste. Am Ende habe ich mich für den Umzug entschieden, weil es eine große Chance für meine Karriere war."</em></p>',
   3,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_175802_0c8d7b5d-e95f-430d-b280-fb9d94707dc9.wav',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B2
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0020-000000000001',
   '00000000-0000-0000-0000-000000000020',
   'KI am Arbeitsplatz',
   'ki-arbeitsplatz-hoeren',
   '<h2>Hörtext: KI am Arbeitsplatz</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Künstliche Intelligenz verändert zunehmend die Arbeitswelt. Viele Unternehmen setzen KI-Systeme ein, um repetitive Aufgaben zu automatisieren. Kritiker befürchten, dass dadurch Arbeitsplätze verloren gehen könnten, während Befürworter neue Chancen sehen."</em></p>',
   1,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_175929_3144d3f9-46d1-43f9-9846-0db09cc82a44.wav',
   NOW()),
  ('00000000-0000-0000-0020-000000000002',
   '00000000-0000-0000-0000-000000000020',
   'Der demografische Wandel',
   'der-demografische-wandel-hoeren',
   '<h2>Hörtext: Der demografische Wandel</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Deutschland steht vor einer demografischen Herausforderung: Die Bevölkerung wird im Durchschnitt immer älter, während die Geburtenrate niedrig bleibt. Dies belastet das Rentensystem und führt zu einem Fachkräftemangel in vielen Branchen."</em></p>',
   2,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_175955_3491134a-34f0-4c67-96c3-c6463708fc86.wav',
   NOW()),
  ('00000000-0000-0000-0020-000000000003',
   '00000000-0000-0000-0000-000000000020',
   'Stadt oder Land?',
   'stadt-oder-land-hoeren',
   '<h2>Hörtext: Stadt oder Land?</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Die Debatte darüber, ob das Leben in der Stadt oder auf dem Land vorzuziehen ist, wird seit Jahren geführt. Städte bieten bessere Infrastruktur, aber höhere Mietpreise. Das Landleben bietet Ruhe, aber die Anbindung ist oft eingeschränkt."</em></p>',
   3,
   'https://d8j0ntlcm91z4.cloudfront.net/user_3EMHovGOfATcnVBYpSXoxvqUH0P/hf_20260723_180023_dd1ecaee-ee25-4850-9bce-3503197c4c92.wav',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A2 Lesson 1 (Einen Termin vereinbaren)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0018-0001-000000000001',
   '00000000-0000-0000-0018-000000000001',
   'Für welchen Tag wird der Termin vereinbart?',
   'multiple_choice',
   '["Montag", "Dienstag", "Mittwoch", "Donnerstag"]'::jsonb,
   'Dienstag',
   'Der Sprecher fragt: "Haben Sie am Dienstag um zehn Uhr Zeit?"',
   NOW()),
  ('00000000-0000-0018-0001-000000000002',
   '00000000-0000-0000-0018-000000000001',
   'Um wie viel Uhr ist der Termin?',
   'multiple_choice',
   '["Neun Uhr", "Zehn Uhr", "Elf Uhr", "Zwölf Uhr"]'::jsonb,
   'Zehn Uhr',
   'Der Sprecher fragt: "Haben Sie am Dienstag um zehn Uhr Zeit?"',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A2 Lesson 2 (Der Wochenmarkt)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0018-0002-000000000001',
   '00000000-0000-0000-0018-000000000002',
   'Wann geht die Person auf den Wochenmarkt?',
   'multiple_choice',
   '["Jeden Freitag", "Jeden Samstag", "Jeden Sonntag", "Jeden Tag"]'::jsonb,
   'Jeden Samstag',
   'Der Text beginnt: "Jeden Samstag gehe ich auf den Wochenmarkt."',
   NOW()),
  ('00000000-0000-0018-0002-000000000002',
   '00000000-0000-0000-0018-000000000002',
   'Was kauft die Person dort manchmal, neben Gemüse und Obst?',
   'multiple_choice',
   '["Fleisch", "Blumen", "Käse", "Brot"]'::jsonb,
   'Blumen',
   'Der Text sagt: "...manchmal auch Blumen."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A2 Lesson 3 (Eine Reise nach Hamburg)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0018-0003-000000000001',
   '00000000-0000-0000-0018-000000000003',
   'Wann ist die Person nach Hamburg gefahren?',
   'multiple_choice',
   '["Letzten Winter", "Letzten Sommer", "Letzten Herbst", "Letztes Wochenende"]'::jsonb,
   'Letzten Sommer',
   'Der Text beginnt: "Letzten Sommer bin ich nach Hamburg gefahren."',
   NOW()),
  ('00000000-0000-0018-0003-000000000002',
   '00000000-0000-0000-0018-000000000003',
   'Wie war das Wetter?',
   'multiple_choice',
   '["Sehr gut", "Nicht so gut", "Sehr heiß", "Es hat geschneit"]'::jsonb,
   'Nicht so gut',
   'Der Text sagt: "Das Wetter war leider nicht so gut."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B1 Lesson 1 (Meinung zum Homeoffice)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0019-0001-000000000001',
   '00000000-0000-0000-0019-000000000001',
   'Warum mag die Person Homeoffice?',
   'multiple_choice',
   '["Bessere Bezahlung", "Bessere Konzentration", "Mehr Kollegen", "Kürzere Arbeitszeit"]'::jsonb,
   'Bessere Konzentration',
   'Der Text sagt: "...weil ich mich besser konzentrieren kann."',
   NOW()),
  ('00000000-0000-0019-0001-000000000002',
   '00000000-0000-0000-0019-000000000001',
   'Was fehlt der Person manchmal?',
   'multiple_choice',
   '["Der persönliche Austausch mit dem Team", "Ein Computer", "Ein ruhiger Arbeitsplatz", "Geld"]'::jsonb,
   'Der persönliche Austausch mit dem Team',
   'Der Text sagt: "Allerdings fehlt mir manchmal der persönliche Austausch mit dem Team."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B1 Lesson 2 (Nachhaltigkeit im Alltag)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0019-0002-000000000001',
   '00000000-0000-0000-0019-000000000002',
   'Was kaufen immer mehr Menschen weniger?',
   'multiple_choice',
   '["Plastik", "Gemüse", "Fahrräder", "Kleidung"]'::jsonb,
   'Plastik',
   'Der Text sagt: "Sie kaufen weniger Plastik."',
   NOW()),
  ('00000000-0000-0019-0002-000000000002',
   '00000000-0000-0000-0019-000000000002',
   'Was sagen Experten laut Text?',
   'multiple_choice',
   '["Es reicht bereits aus.", "Es muss noch viel mehr getan werden.", "Nachhaltigkeit ist unwichtig.", "Nichts hat sich geändert."]'::jsonb,
   'Es muss noch viel mehr getan werden.',
   'Der Text sagt: "...dass noch viel mehr getan werden muss."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B1 Lesson 3 (Eine schwierige Entscheidung)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0019-0003-000000000001',
   '00000000-0000-0000-0019-000000000003',
   'Was hat die Person bekommen?',
   'multiple_choice',
   '["Eine Kündigung", "Ein Jobangebot in einer anderen Stadt", "Eine Gehaltserhöhung", "Ein neues Auto"]'::jsonb,
   'Ein Jobangebot in einer anderen Stadt',
   'Der Text sagt: "Letztes Jahr habe ich ein Jobangebot in einer anderen Stadt bekommen."',
   NOW()),
  ('00000000-0000-0019-0003-000000000002',
   '00000000-0000-0000-0019-000000000003',
   'Warum war die Entscheidung schwierig?',
   'multiple_choice',
   '["Wegen des Geldes", "Weil die Person die Familie zurücklassen musste", "Wegen der neuen Stelle", "Wegen des Wetters"]'::jsonb,
   'Weil die Person die Familie zurücklassen musste',
   'Der Text sagt: "...weil ich meine Familie zurücklassen musste."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B2 Lesson 1 (KI am Arbeitsplatz)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0020-0001-000000000001',
   '00000000-0000-0000-0020-000000000001',
   'Wofür setzen Unternehmen laut Text KI-Systeme ein?',
   'multiple_choice',
   '["Um Gehälter zu senken", "Um repetitive Aufgaben zu automatisieren", "Um neue Büros zu bauen", "Um Mitarbeiter einzustellen"]'::jsonb,
   'Um repetitive Aufgaben zu automatisieren',
   'Der Text sagt: "...um repetitive Aufgaben zu automatisieren."',
   NOW()),
  ('00000000-0000-0020-0001-000000000002',
   '00000000-0000-0000-0020-000000000001',
   'Was befürchten Kritiker?',
   'multiple_choice',
   '["Höhere Gehälter", "Den Verlust von Arbeitsplätzen", "Weniger Automatisierung", "Mehr Freizeit"]'::jsonb,
   'Den Verlust von Arbeitsplätzen',
   'Der Text sagt: "...dass dadurch Arbeitsplätze verloren gehen könnten."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B2 Lesson 2 (Der demografische Wandel)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0020-0002-000000000001',
   '00000000-0000-0000-0020-000000000002',
   'Was passiert mit der Bevölkerung laut Text?',
   'multiple_choice',
   '["Sie wird jünger.", "Sie wird im Durchschnitt älter.", "Sie wächst schnell.", "Sie bleibt konstant."]'::jsonb,
   'Sie wird im Durchschnitt älter.',
   'Der Text sagt: "Die Bevölkerung wird im Durchschnitt immer älter."',
   NOW()),
  ('00000000-0000-0020-0002-000000000002',
   '00000000-0000-0000-0020-000000000002',
   'Wozu führt dieser Wandel laut Text?',
   'multiple_choice',
   '["Zu mehr Arbeitsplätzen", "Zu einem Fachkräftemangel", "Zu niedrigeren Steuern", "Zu mehr Geburten"]'::jsonb,
   'Zu einem Fachkräftemangel',
   'Der Text sagt: "...führt zu einem Fachkräftemangel in vielen Branchen."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B2 Lesson 3 (Stadt oder Land?)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0020-0003-000000000001',
   '00000000-0000-0000-0020-000000000003',
   'Was bieten Städte laut Text?',
   'multiple_choice',
   '["Ruhe", "Bessere Infrastruktur", "Günstigen Wohnraum", "Weniger Lärm"]'::jsonb,
   'Bessere Infrastruktur',
   'Der Text sagt: "Städte bieten bessere Infrastruktur, aber höhere Mietpreise."',
   NOW()),
  ('00000000-0000-0020-0003-000000000002',
   '00000000-0000-0000-0020-000000000003',
   'Was ist beim Landleben oft eingeschränkt?',
   'multiple_choice',
   '["Die Ruhe", "Die Anbindung", "Der Wohnraum", "Die Mietpreise"]'::jsonb,
   'Die Anbindung',
   'Der Text sagt: "...aber die Anbindung ist oft eingeschränkt."',
   NOW())
ON CONFLICT (id) DO NOTHING;
