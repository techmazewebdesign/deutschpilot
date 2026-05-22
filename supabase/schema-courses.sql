-- ============================================================
-- DeutschPilot – Courses / Lessons / Exercises Schema
-- Safe to run multiple times (IF NOT EXISTS)
-- Run in Supabase SQL Editor BEFORE seed files
-- ============================================================

-- ── courses ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  title       text        NOT NULL,
  description text,
  level       text        NOT NULL,
  language    text        NOT NULL DEFAULT 'de',
  is_published boolean    NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_level     ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);

-- ── lessons ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug        text        UNIQUE NOT NULL,
  title       text        NOT NULL,
  content     text,
  video_url   text,
  order_index integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id  ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);

-- ── exercises ───────────────────────────────────────────────
-- type values: 'multiple_choice' | 'fill_blank' | 'correction'
-- options: jsonb array of strings (used for multiple_choice)
CREATE TABLE IF NOT EXISTS exercises (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id      uuid        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question       text        NOT NULL,
  type           text        NOT NULL DEFAULT 'multiple_choice',
  options        jsonb,
  correct_answer text        NOT NULL,
  explanation    text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);

-- ── student_progress ────────────────────────────────────────
-- user_id is a NextAuth CUID string, not a Supabase auth UUID.
-- RLS is relaxed because auth is handled by NextAuth, not Supabase.
CREATE TABLE IF NOT EXISTS student_progress (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text        NOT NULL,
  lesson_id   uuid        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id   uuid        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed   boolean     NOT NULL DEFAULT false,
  score       integer     NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_sp_user_id   ON student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sp_lesson_id ON student_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_sp_course_id ON student_progress(course_id);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises        ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- courses, lessons, exercises: publicly readable (anon + authenticated)
DROP POLICY IF EXISTS courses_read   ON courses;
CREATE POLICY courses_read   ON courses   FOR SELECT USING (true);

DROP POLICY IF EXISTS lessons_read   ON lessons;
CREATE POLICY lessons_read   ON lessons   FOR SELECT USING (true);

DROP POLICY IF EXISTS exercises_read ON exercises;
CREATE POLICY exercises_read ON exercises FOR SELECT USING (true);

-- student_progress: open read/write via anon key
-- (NextAuth user IDs cannot be validated by Supabase RLS auth.uid())
DROP POLICY IF EXISTS sp_select ON student_progress;
CREATE POLICY sp_select ON student_progress FOR SELECT USING (true);

DROP POLICY IF EXISTS sp_insert ON student_progress;
CREATE POLICY sp_insert ON student_progress FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS sp_update ON student_progress;
CREATE POLICY sp_update ON student_progress FOR UPDATE USING (true) WITH CHECK (true);
