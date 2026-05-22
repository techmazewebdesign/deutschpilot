-- ============================================================
-- DeutschPilot Live Classes System Migration
-- Run once in Supabase SQL Editor
-- ============================================================

-- --------------------------------------------------------
-- 1. live_classes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS live_classes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  description      text,
  level            text NOT NULL DEFAULT 'A1',
  teacher_id       text NOT NULL,          -- Firebase UID
  teacher_name     text NOT NULL DEFAULT '',
  start_time       timestamptz NOT NULL,
  end_time         timestamptz,
  duration_minutes integer DEFAULT 60,
  meet_url         text,
  max_students     integer DEFAULT 10,
  status           text DEFAULT 'draft'
    CHECK (status IN ('draft','active','completed','cancelled')),
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_live_classes_teacher   ON live_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_status    ON live_classes(status);
CREATE INDEX IF NOT EXISTS idx_live_classes_start     ON live_classes(start_time);
CREATE INDEX IF NOT EXISTS idx_live_classes_level     ON live_classes(level);

-- --------------------------------------------------------
-- 2. class_enrollments
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS class_enrollments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    uuid REFERENCES live_classes(id) ON DELETE CASCADE,
  student_id  text NOT NULL,               -- Firebase UID
  status      text DEFAULT 'enrolled'
    CHECK (status IN ('enrolled','cancelled','attended')),
  created_at  timestamptz DEFAULT now(),
  UNIQUE (class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student  ON class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class    ON class_enrollments(class_id);

-- --------------------------------------------------------
-- 3. teacher_profiles  (keyed by Firebase UID)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS teacher_profiles (
  user_id          text PRIMARY KEY,       -- Firebase UID
  full_name        text NOT NULL DEFAULT '',
  bio              text,
  avatar_url       text,
  teaches_levels   text[] DEFAULT ARRAY['A1','A2'],
  experience_years integer DEFAULT 0,
  languages        text[] DEFAULT ARRAY['English'],
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);
