-- ============================================================
-- DeutschPilot – A1 Reading Comprehension Practice
-- Additive only: new course + lessons + exercises.
-- Does NOT modify any existing rows. Safe to re-run
-- (uses ON CONFLICT DO NOTHING, matching supabase/seed.sql style).
-- Run in Supabase SQL Editor AFTER schema-courses.sql.
-- Appears automatically on the public /courses page (level filter: A1)
-- once run — no code deploy needed.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSE
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000005',
   'A1 Reading Practice',
   'a1-reading-practice',
   'Short German texts with comprehension questions, built for absolute beginners. Read simple everyday passages and check your understanding.',
   'A1', 'de', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0005-000000000001',
   '00000000-0000-0000-0000-000000000005',
   'Ein Tag im Leben von Anna',
   'ein-tag-im-leben-von-anna',
   '<h2>Lesetext: Ein Tag im Leben von Anna</h2>
<p>Anna ist 24 Jahre alt. Sie kommt aus München und wohnt jetzt in Berlin. Anna arbeitet als Lehrerin in einer Grundschule.</p>
<p>Jeden Morgen steht Anna um 6 Uhr auf. Sie frühstückt mit Kaffee und Brot. Um 7 Uhr 30 fährt sie mit der U-Bahn zur Arbeit. Die Schule beginnt um 8 Uhr.</p>
<p>Nach der Arbeit geht Anna oft einkaufen. Am Abend kocht sie gern und liest ein Buch. Sie geht um 22 Uhr ins Bett.</p>
<p>Am Wochenende trifft Anna ihre Freunde. Sie gehen zusammen ins Kino oder spazieren im Park.</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0005-000000000002',
   '00000000-0000-0000-0000-000000000005',
   'Im Café',
   'im-cafe',
   '<h2>Lesetext: Im Café</h2>
<p>Markus geht in ein kleines Café in der Stadt. Er setzt sich an einen Tisch am Fenster.</p>
<p><strong>Kellnerin:</strong> Guten Tag! Was möchten Sie trinken?<br>
<strong>Markus:</strong> Einen Kaffee mit Milch, bitte. Und haben Sie auch Kuchen?<br>
<strong>Kellnerin:</strong> Ja, wir haben Apfelkuchen und Schokoladenkuchen.<br>
<strong>Markus:</strong> Ein Stück Apfelkuchen, bitte.<br>
<strong>Kellnerin:</strong> Gerne. Das macht zusammen 6 Euro 50.</p>
<p>Markus bezahlt mit Karte. Er trinkt seinen Kaffee und isst den Kuchen. Es schmeckt sehr gut. Nach 30 Minuten geht er nach Hause.</p>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0005-000000000003',
   '00000000-0000-0000-0000-000000000005',
   'Meine Familie',
   'meine-familie-lesetext',
   '<h2>Lesetext: Meine Familie</h2>
<p>Ich heiße Lukas und ich bin 30 Jahre alt. Ich komme aus Hamburg. Meine Familie ist nicht sehr groß.</p>
<p>Meine Mutter heißt Petra. Sie ist 58 Jahre alt und arbeitet als Ärztin. Mein Vater heißt Thomas. Er ist 60 Jahre alt und ist Ingenieur.</p>
<p>Ich habe eine Schwester. Sie heißt Julia und ist 27 Jahre alt. Julia wohnt in Köln und studiert dort Medizin.</p>
<p>Meine Großeltern wohnen auf dem Land. Wir besuchen sie oft am Wochenende. Meine Oma kocht immer sehr lecker.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – Lesson 1 (Ein Tag im Leben von Anna)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0005-0001-000000000001',
   '00000000-0000-0000-0005-000000000001',
   'Was ist Annas Beruf?',
   'multiple_choice',
   '["Ärztin", "Lehrerin", "Kellnerin", "Ingenieurin"]'::jsonb,
   'Lehrerin',
   'Der Text sagt: "Anna arbeitet als Lehrerin in einer Grundschule."',
   NOW()),

  ('00000000-0000-0005-0001-000000000002',
   '00000000-0000-0000-0005-000000000001',
   'Um wie viel Uhr steht Anna auf?',
   'multiple_choice',
   '["6 Uhr", "7 Uhr 30", "8 Uhr", "22 Uhr"]'::jsonb,
   '6 Uhr',
   'Der Text sagt: "Jeden Morgen steht Anna um 6 Uhr auf."',
   NOW()),

  ('00000000-0000-0005-0001-000000000003',
   '00000000-0000-0000-0005-000000000001',
   'Was macht Anna am Wochenende?',
   'multiple_choice',
   '["Sie arbeitet.", "Sie trifft ihre Freunde.", "Sie fliegt nach München.", "Sie kocht in der Schule."]'::jsonb,
   'Sie trifft ihre Freunde.',
   'Der Text sagt: "Am Wochenende trifft Anna ihre Freunde."',
   NOW()),

  ('00000000-0000-0005-0001-000000000004',
   '00000000-0000-0000-0005-000000000001',
   'Wie fährt Anna zur Arbeit?',
   'multiple_choice',
   '["Mit dem Bus", "Mit dem Auto", "Mit der U-Bahn", "Zu Fuß"]'::jsonb,
   'Mit der U-Bahn',
   'Der Text sagt: "Um 7 Uhr 30 fährt sie mit der U-Bahn zur Arbeit."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – Lesson 2 (Im Café)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0005-0002-000000000001',
   '00000000-0000-0000-0005-000000000002',
   'Was trinkt Markus?',
   'multiple_choice',
   '["Tee", "Kaffee mit Milch", "Wasser", "Saft"]'::jsonb,
   'Kaffee mit Milch',
   'Markus bestellt: "Einen Kaffee mit Milch, bitte."',
   NOW()),

  ('00000000-0000-0005-0002-000000000002',
   '00000000-0000-0000-0005-000000000002',
   'Welchen Kuchen bestellt Markus?',
   'multiple_choice',
   '["Schokoladenkuchen", "Käsekuchen", "Apfelkuchen", "Keinen Kuchen"]'::jsonb,
   'Apfelkuchen',
   'Markus sagt: "Ein Stück Apfelkuchen, bitte."',
   NOW()),

  ('00000000-0000-0005-0002-000000000003',
   '00000000-0000-0000-0005-000000000002',
   'Wie viel bezahlt Markus?',
   'multiple_choice',
   '["5 Euro", "6 Euro 50", "8 Euro", "10 Euro"]'::jsonb,
   '6 Euro 50',
   'Die Kellnerin sagt: "Das macht zusammen 6 Euro 50."',
   NOW()),

  ('00000000-0000-0005-0002-000000000004',
   '00000000-0000-0000-0005-000000000002',
   'Wie bezahlt Markus?',
   'multiple_choice',
   '["Mit Bargeld", "Mit Karte", "Er bezahlt nicht", "Mit einem Gutschein"]'::jsonb,
   'Mit Karte',
   'Der Text sagt: "Markus bezahlt mit Karte."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – Lesson 3 (Meine Familie)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0005-0003-000000000001',
   '00000000-0000-0000-0005-000000000003',
   'Was ist der Beruf von Lukas Mutter?',
   'multiple_choice',
   '["Lehrerin", "Ärztin", "Ingenieurin", "Studentin"]'::jsonb,
   'Ärztin',
   'Der Text sagt: "Meine Mutter heißt Petra... und arbeitet als Ärztin."',
   NOW()),

  ('00000000-0000-0005-0003-000000000002',
   '00000000-0000-0000-0005-000000000003',
   'Wo wohnt Julia?',
   'multiple_choice',
   '["In Hamburg", "In München", "In Köln", "In Berlin"]'::jsonb,
   'In Köln',
   'Der Text sagt: "Julia wohnt in Köln und studiert dort Medizin."',
   NOW()),

  ('00000000-0000-0005-0003-000000000003',
   '00000000-0000-0000-0005-000000000003',
   'Was studiert Julia?',
   'multiple_choice',
   '["Medizin", "Jura", "Kunst", "Informatik"]'::jsonb,
   'Medizin',
   'Der Text sagt: "Julia... studiert dort Medizin."',
   NOW()),

  ('00000000-0000-0005-0003-000000000004',
   '00000000-0000-0000-0005-000000000003',
   'Wann besucht Lukas seine Großeltern?',
   'multiple_choice',
   '["Jeden Tag", "Am Wochenende", "Nur im Sommer", "Nie"]'::jsonb,
   'Am Wochenende',
   'Der Text sagt: "Wir besuchen sie oft am Wochenende."',
   NOW())
ON CONFLICT (id) DO NOTHING;
