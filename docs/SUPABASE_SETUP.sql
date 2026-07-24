-- ============================================================================
-- RETIRED 2026-07-24 — DO NOT RUN
-- ============================================================================
-- This script predates the switch to Firebase Auth and is incompatible with
-- the live database:
--   * tickets.user_id REFERENCES auth.users(id), but users live in Firebase —
--     auth.users is empty, so every ticket insert would fail.
--   * The auth.uid()-based policies never match (requests use the anon key,
--     not Supabase Auth sessions).
--   * The profiles policies reference a user_id column that does not exist on
--     the live profiles table, and ALTER TABLE profiles ENABLE ROW LEVEL
--     SECURITY would run before those policies error out — risking breakage
--     of existing anon-key reads of profiles.
-- No code references a tickets table. If a support-tickets feature is wanted,
-- design it like live_classes: firebase_uid text column + inserts through a
-- service-role API route.
-- Kept for historical reference only.
-- ============================================================================
-- Supabase Database Setup for Tickets and Profile Updates
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to set up the necessary tables

-- 1. Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS for tickets
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own tickets
CREATE POLICY "Users can read their own tickets"
  ON tickets
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create tickets
CREATE POLICY "Users can create tickets"
  ON tickets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tickets
CREATE POLICY "Users can update their own tickets"
  ON tickets
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);

-- 2. Ensure profiles table has the necessary columns
-- If profiles table doesn't exist, create it
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  firebase_uid TEXT,
  email TEXT NOT NULL,
  full_name TEXT,
  german_level TEXT DEFAULT 'A1',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON profiles(firebase_uid);

-- 3. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to tickets table
DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply the trigger to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Verify Tables and Policies
-- ============================================================================
-- After running the above SQL, you can verify the setup with these queries:
--
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('tickets', 'profiles');
-- SELECT * FROM pg_policies WHERE tablename = 'tickets';
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
