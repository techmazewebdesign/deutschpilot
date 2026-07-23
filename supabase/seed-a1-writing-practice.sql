-- ============================================================
-- DeutschPilot – A1 Writing Practice
-- Additive only: new course + lessons + exercises using the
-- 'writing_prompt' exercise type (requires the app code from
-- commit ddced77 to render correctly — deploy that first).
-- Does NOT modify any existing rows. Safe to re-run
-- (uses ON CONFLICT DO NOTHING).
-- Run in Supabase SQL Editor AFTER schema-courses.sql.
-- Appears automatically on the public /courses page (level A1)
-- once run — no code deploy needed beyond ddced77.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSE
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000009',
   'A1 Writing Practice',
   'a1-writing-practice',
   'Short writing prompts for absolute beginners, with instant AI feedback on your German.',
   'A1', 'de', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0009-000000000001',
   '00000000-0000-0000-0000-000000000009',
   'Über mich',
   'ueber-mich-schreiben',
   '<h2>Schreibaufgabe: Über mich</h2>
<p>Schreibe 3-4 einfache Sätze über dich selbst. Benutze diese Fragen als Hilfe:</p>
<ul>
  <li>Wie heißt du?</li>
  <li>Woher kommst du?</li>
  <li>Was ist dein Beruf oder was studierst du?</li>
  <li>Wie alt bist du?</li>
</ul>
<p>Klicke danach auf "Übung starten", um deine Antwort zu schreiben und KI-Feedback zu bekommen.</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0009-000000000002',
   '00000000-0000-0000-0000-000000000009',
   'Meine Familie',
   'meine-familie-schreiben',
   '<h2>Schreibaufgabe: Meine Familie</h2>
<p>Schreibe 3-4 Sätze über deine Familie. Benutze Wörter wie <strong>Mutter</strong>, <strong>Vater</strong>, <strong>Schwester</strong>, <strong>Bruder</strong>.</p>
<p>Tipp: Beschreibe, wer in deiner Familie ist und wie alt sie sind.</p>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0009-000000000003',
   '00000000-0000-0000-0000-000000000009',
   'Mein Tagesablauf',
   'mein-tagesablauf-schreiben',
   '<h2>Schreibaufgabe: Mein Tagesablauf</h2>
<p>Schreibe 4-5 Sätze über deinen typischen Tag. Benutze Zeitangaben wie <strong>um 7 Uhr</strong>, <strong>am Morgen</strong>, <strong>am Abend</strong>.</p>
<p>Tipp: Was machst du zuerst? Was machst du danach?</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES (type: writing_prompt)
-- correct_answer holds a sample answer for the student to compare
-- against, not an exact-match target.
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0009-0001-000000000001',
   '00000000-0000-0000-0009-000000000001',
   'Schreibe 3-4 Sätze über dich selbst: Name, Herkunft, Beruf/Studium, Alter.',
   'writing_prompt',
   NULL,
   'Ich heiße Anna. Ich komme aus Deutschland. Ich bin Studentin. Ich bin 22 Jahre alt.',
   'Benutze einfache Sätze mit "Ich" + Verb. Zum Beispiel: Ich heiße... Ich komme aus... Ich bin...',
   NOW()),

  ('00000000-0000-0009-0002-000000000001',
   '00000000-0000-0000-0009-000000000002',
   'Schreibe 3-4 Sätze über deine Familie.',
   'writing_prompt',
   NULL,
   'Meine Familie ist klein. Ich habe eine Schwester. Sie heißt Julia und ist 25 Jahre alt. Meine Eltern wohnen in Berlin.',
   'Benutze "Ich habe..." für Familienmitglieder und "Er/Sie heißt..." für Namen.',
   NOW()),

  ('00000000-0000-0009-0003-000000000001',
   '00000000-0000-0000-0009-000000000003',
   'Schreibe 4-5 Sätze über deinen typischen Tag.',
   'writing_prompt',
   NULL,
   'Ich stehe um 7 Uhr auf. Ich frühstücke und trinke Kaffee. Um 9 Uhr gehe ich zur Arbeit. Am Abend koche ich und lese ein Buch. Ich gehe um 22 Uhr ins Bett.',
   'Benutze das Präsens (ich stehe auf, ich gehe, ich koche) und Zeitangaben (um 7 Uhr, am Abend).',
   NOW())
ON CONFLICT (id) DO NOTHING;
