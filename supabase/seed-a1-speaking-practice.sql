-- ============================================================
-- DeutschPilot – A1 Speaking Practice
-- Additive only: new course + lessons + exercises using the
-- 'speaking_prompt' exercise type (requires the app code from
-- commit 2e5b0d7 to render correctly — deploy that first).
-- Does NOT modify any existing rows. Safe to re-run
-- (uses ON CONFLICT DO NOTHING).
-- Run in Supabase SQL Editor AFTER schema-courses.sql.
-- Appears automatically on the public /courses page (level A1)
-- once run — no code deploy needed beyond 2e5b0d7.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSE
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000010',
   'A1 Speaking Practice',
   'a1-speaking-practice',
   'Record yourself saying simple German phrases and compare against a model answer. Self-practice, no automated scoring.',
   'A1', 'de', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0010-000000000001',
   '00000000-0000-0000-0000-000000000010',
   'Begrüßungen üben',
   'begruessungen-ueben',
   '<h2>Sprechübung: Begrüßungen</h2>
<p>Übe diese Begrüßungen laut auszusprechen. Nimm dich auf und höre dir deine Aussprache an.</p>
<p>Tipp: Sprich langsam und deutlich. Achte auf die Betonung der Silben.</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0010-000000000002',
   '00000000-0000-0000-0000-000000000010',
   'Im Restaurant bestellen',
   'im-restaurant-bestellen-sprechen',
   '<h2>Sprechübung: Im Restaurant</h2>
<p>Übe, wie man im Restaurant bestellt. Sprich die Sätze laut aus.</p>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0010-000000000003',
   '00000000-0000-0000-0000-000000000010',
   'Über sich selbst sprechen',
   'ueber-sich-selbst-sprechen',
   '<h2>Sprechübung: Über sich selbst</h2>
<p>Übe, dich auf Deutsch vorzustellen. Sprich die Sätze laut und flüssig.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES (type: speaking_prompt)
-- correct_answer holds the model phrase to compare pronunciation against.
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0010-0001-000000000001',
   '00000000-0000-0000-0010-000000000001',
   'Sag laut: ''Guten Tag, wie geht es Ihnen?''',
   'speaking_prompt',
   NULL,
   'Guten Tag, wie geht es Ihnen?',
   'Achte auf die Betonung: GU-ten Tag, wie GEHT es I-hnen?',
   NOW()),

  ('00000000-0000-0010-0002-000000000001',
   '00000000-0000-0000-0010-000000000002',
   'Sag laut: ''Ich möchte einen Kaffee bestellen, bitte.''',
   'speaking_prompt',
   NULL,
   'Ich möchte einen Kaffee bestellen, bitte.',
   'Sprich "möchte" deutlich aus: MÖCH-te.',
   NOW()),

  ('00000000-0000-0010-0003-000000000001',
   '00000000-0000-0000-0010-000000000003',
   'Sag laut: ''Ich heiße... und ich komme aus...''',
   'speaking_prompt',
   NULL,
   'Ich heiße Anna und ich komme aus Deutschland.',
   'Ersetze den Namen und das Land durch deine eigenen Angaben.',
   NOW())
ON CONFLICT (id) DO NOTHING;
