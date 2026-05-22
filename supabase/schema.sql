-- ============================================================
-- DeutschPilot Learning Journey Schema
-- Firebase Auth — user IDs are TEXT (Firebase UIDs), NOT uuid.
-- Safe to run on a fresh database.
-- For existing databases, run migration-firebase-uid-fix.sql instead.
-- ============================================================

-- --------------------------------------------------------
-- Helper: auto-update updated_at
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------
-- 1. profiles
--    Firebase UID stored as TEXT — no FK to auth.users
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id              text PRIMARY KEY,          -- Firebase UID (e.g. "abc123xyz")
    full_name       text,
    email           text,
    german_level    text DEFAULT 'A1',
    learning_goal   text,
    preferred_language text DEFAULT 'en',
    role            text DEFAULT 'student',
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

-- Trigger: auto-update profiles.updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 2. learning_rooms
--    The 12-room learning journey (content IDs remain uuid)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_rooms (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            text UNIQUE NOT NULL,
    room_number     integer NOT NULL,
    title_en        text NOT NULL,
    title_de        text NOT NULL,
    description_en  text,
    description_de  text,
    purpose_en      text,
    purpose_de      text,
    unlock_order    integer NOT NULL,
    is_active       boolean DEFAULT true,
    created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learning_rooms_unlock_order ON learning_rooms(unlock_order);
CREATE INDEX IF NOT EXISTS idx_learning_rooms_active ON learning_rooms(is_active);

-- --------------------------------------------------------
-- 3. room_tasks
--    Tasks inside each room
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS room_tasks (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         uuid REFERENCES learning_rooms(id) ON DELETE CASCADE,
    task_key        text NOT NULL,
    title_en        text NOT NULL,
    title_de        text NOT NULL,
    description_en  text,
    description_de  text,
    order_index     integer NOT NULL,
    created_at      timestamptz DEFAULT now(),
    UNIQUE (room_id, task_key)
);

CREATE INDEX IF NOT EXISTS idx_room_tasks_room_id ON room_tasks(room_id);

-- --------------------------------------------------------
-- 4. student_room_progress
--    Per-user per-room progress — user_id is Firebase UID (text)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_room_progress (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             text NOT NULL,          -- Firebase UID
    room_id             uuid REFERENCES learning_rooms(id) ON DELETE CASCADE,
    status              text DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'active', 'completed')),
    progress_percentage integer DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    started_at          timestamptz,
    completed_at        timestamptz,
    updated_at          timestamptz DEFAULT now(),
    UNIQUE (user_id, room_id)
);

CREATE INDEX IF NOT EXISTS idx_srp_user_id ON student_room_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_srp_room_id ON student_room_progress(room_id);

-- Trigger: auto-update student_room_progress.updated_at
DROP TRIGGER IF EXISTS trg_srp_updated_at ON student_room_progress;
CREATE TRIGGER trg_srp_updated_at
    BEFORE UPDATE ON student_room_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 5. student_task_progress
--    Per-user per-task completion — user_id is Firebase UID (text)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_task_progress (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         text NOT NULL,              -- Firebase UID
    task_id         uuid REFERENCES room_tasks(id) ON DELETE CASCADE,
    completed       boolean DEFAULT false,
    completed_at    timestamptz,
    created_at      timestamptz DEFAULT now(),
    UNIQUE (user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_stp_user_id ON student_task_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_stp_task_id ON student_task_progress(task_id);

-- ============================================================
-- Row Level Security (RLS)
-- All Firebase user data uses service-role client (bypasses RLS).
-- RLS policies use USING (true) — open to service role, closed to anon.
-- auth.uid() is NOT used because this app uses Firebase Auth, not Supabase Auth.
-- ============================================================

ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS learning_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS room_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_room_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_task_progress ENABLE ROW LEVEL SECURITY;

-- Allow service role (server-side) full access to all tables
-- Service role bypasses RLS entirely — these policies cover anon/authenticated clients

DROP POLICY IF EXISTS profiles_open ON profiles;
CREATE POLICY profiles_open ON profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS learning_rooms_read ON learning_rooms;
CREATE POLICY learning_rooms_read ON learning_rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS room_tasks_read ON room_tasks;
CREATE POLICY room_tasks_read ON room_tasks FOR SELECT USING (true);

DROP POLICY IF EXISTS srp_open ON student_room_progress;
CREATE POLICY srp_open ON student_room_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS stp_open ON student_task_progress;
CREATE POLICY stp_open ON student_task_progress FOR ALL USING (true) WITH CHECK (true);
