-- ============================================================
-- DeutschPilot – A1 Listening Practice
-- Additive only: new course + lessons + exercises. Uses the
-- existing 'multiple_choice' exercise type (no new type needed)
-- plus an audio URL in lessons.video_url — requires the audio
-- player rendering added in this same deploy (lesson page now
-- shows an inline <audio> player for .wav/.mp3/.m4a/.ogg URLs
-- instead of just a video link; every existing lesson has
-- video_url = NULL so this is non-breaking).
--
-- Audio is generated speech (Higgsfield/seed_audio) hosted in the
-- project's own Supabase Storage bucket "listening-audio" — see
-- migrate-audio-to-storage.sql for the bucket setup + upload steps.
--
-- Does NOT modify any existing rows. Safe to re-run
-- (uses ON CONFLICT DO NOTHING).
-- Run in Supabase SQL Editor AFTER schema-courses.sql.
-- Appears automatically on the public /courses page (level A1)
-- once run.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSE
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000011',
   'A1 Listening Practice',
   'a1-listening-practice',
   'Listen to short German audio clips and answer comprehension questions. Built for absolute beginners.',
   'A1', 'de', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS (video_url holds the generated audio clip)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0011-000000000001',
   '00000000-0000-0000-0000-000000000011',
   'Anna stellt sich vor',
   'anna-stellt-sich-vor-hoeren',
   '<h2>Hörtext: Anna stellt sich vor</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Hallo! Ich heiße Anna. Ich komme aus Berlin und ich bin Studentin. Ich lerne gern Deutsch."</em></p>',
   1,
   'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a1-anna-stellt-sich-vor.mp3',
   NOW()),

  ('00000000-0000-0000-0011-000000000002',
   '00000000-0000-0000-0000-000000000011',
   'Im Café bestellen',
   'im-cafe-bestellen-hoeren',
   '<h2>Hörtext: Im Café bestellen</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Guten Tag! Ich möchte einen Kaffee bestellen, bitte. Und haben Sie auch Kuchen? Ah, sehr gut. Ein Stück Apfelkuchen, bitte. Vielen Dank!"</em></p>',
   2,
   'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a1-im-cafe-bestellen.mp3',
   NOW()),

  ('00000000-0000-0000-0011-000000000003',
   '00000000-0000-0000-0000-000000000011',
   'Mein Wochenende',
   'mein-wochenende-hoeren',
   '<h2>Hörtext: Mein Wochenende</h2>
<p>Höre dir die Aufnahme an. Lies danach den Text, wenn du möchtest.</p>
<p><em>"Am Wochenende gehe ich gern spazieren. Ich stehe spät auf und frühstücke in Ruhe. Danach treffe ich meine Freunde im Park. Wir spielen manchmal Fußball oder wir sitzen einfach und reden."</em></p>',
   3,
   'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a1-mein-wochenende.mp3',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – Lesson 1 (Anna stellt sich vor)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0011-0001-000000000001',
   '00000000-0000-0000-0011-000000000001',
   'Wie heißt die Person in der Aufnahme?',
   'multiple_choice',
   '["Julia", "Anna", "Sofia", "Petra"]'::jsonb,
   'Anna',
   'Die Aufnahme beginnt: "Hallo! Ich heiße Anna."',
   NOW()),
  ('00000000-0000-0011-0001-000000000002',
   '00000000-0000-0000-0011-000000000001',
   'Woher kommt Anna?',
   'multiple_choice',
   '["Aus München", "Aus Berlin", "Aus Hamburg", "Aus Köln"]'::jsonb,
   'Aus Berlin',
   'Sie sagt: "Ich komme aus Berlin."',
   NOW()),
  ('00000000-0000-0011-0001-000000000003',
   '00000000-0000-0000-0011-000000000001',
   'Was ist Anna von Beruf?',
   'multiple_choice',
   '["Lehrerin", "Studentin", "Ärztin", "Kellnerin"]'::jsonb,
   'Studentin',
   'Sie sagt: "Ich bin Studentin."',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – Lesson 2 (Im Café bestellen)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0011-0002-000000000001',
   '00000000-0000-0000-0011-000000000002',
   'Was bestellt die Person zu trinken?',
   'multiple_choice',
   '["Tee", "Kaffee", "Wasser", "Saft"]'::jsonb,
   'Kaffee',
   'Der Sprecher sagt: "Ich möchte einen Kaffee bestellen, bitte."',
   NOW()),
  ('00000000-0000-0011-0002-000000000002',
   '00000000-0000-0000-0011-000000000002',
   'Welchen Kuchen bestellt die Person?',
   'multiple_choice',
   '["Schokoladenkuchen", "Käsekuchen", "Apfelkuchen", "Keinen Kuchen"]'::jsonb,
   'Apfelkuchen',
   'Der Sprecher sagt: "Ein Stück Apfelkuchen, bitte."',
   NOW()),
  ('00000000-0000-0011-0002-000000000003',
   '00000000-0000-0000-0011-000000000002',
   'Wo findet dieses Gespräch statt?',
   'multiple_choice',
   '["Im Supermarkt", "Im Café", "Im Restaurant am Abend", "Zu Hause"]'::jsonb,
   'Im Café',
   'Der Titel und die Bestellung (Kaffee, Kuchen) zeigen: Es ist ein Café.',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – Lesson 3 (Mein Wochenende)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0011-0003-000000000001',
   '00000000-0000-0000-0011-000000000003',
   'Was macht die Person am Wochenende gern?',
   'multiple_choice',
   '["Arbeiten", "Spazieren gehen", "Schlafen den ganzen Tag", "Kochen"]'::jsonb,
   'Spazieren gehen',
   'Der Text beginnt: "Am Wochenende gehe ich gern spazieren."',
   NOW()),
  ('00000000-0000-0011-0003-000000000002',
   '00000000-0000-0000-0011-000000000003',
   'Wo trifft die Person ihre Freunde?',
   'multiple_choice',
   '["Im Café", "Im Park", "Im Kino", "In der Schule"]'::jsonb,
   'Im Park',
   'Der Text sagt: "Danach treffe ich meine Freunde im Park."',
   NOW()),
  ('00000000-0000-0011-0003-000000000003',
   '00000000-0000-0000-0011-000000000003',
   'Was machen sie manchmal im Park?',
   'multiple_choice',
   '["Sie schwimmen.", "Sie spielen Fußball.", "Sie fahren Fahrrad.", "Sie lesen."]'::jsonb,
   'Sie spielen Fußball.',
   'Der Text sagt: "Wir spielen manchmal Fußball oder wir sitzen einfach und reden."',
   NOW())
ON CONFLICT (id) DO NOTHING;
