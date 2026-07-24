-- ============================================================
-- DeutschPilot – Migrate listening audio to Supabase Storage
-- Run in Supabase SQL Editor in TWO steps:
--   1. Run STEP 1 below, then upload the 12 .mp3 files into the
--      new "listening-audio" bucket (Dashboard → Storage).
--   2. Run STEP 2 to point the lessons at the new URLs.
-- Safe to re-run (idempotent inserts/updates).
-- ============================================================

-- ── STEP 1: public bucket ─────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('listening-audio', 'listening-audio', true)
ON CONFLICT (id) DO NOTHING;

-- ── STEP 2: repoint lessons (run AFTER uploading the files) ───
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a1-anna-stellt-sich-vor.mp3'      WHERE id = '00000000-0000-0000-0011-000000000001';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a1-im-cafe-bestellen.mp3'          WHERE id = '00000000-0000-0000-0011-000000000002';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a1-mein-wochenende.mp3'            WHERE id = '00000000-0000-0000-0011-000000000003';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a2-einen-termin-vereinbaren.mp3'   WHERE id = '00000000-0000-0000-0018-000000000001';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a2-der-wochenmarkt.mp3'            WHERE id = '00000000-0000-0000-0018-000000000002';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/a2-eine-reise-nach-hamburg.mp3'    WHERE id = '00000000-0000-0000-0018-000000000003';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/b1-meinung-homeoffice.mp3'         WHERE id = '00000000-0000-0000-0019-000000000001';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/b1-nachhaltigkeit-im-alltag.mp3'   WHERE id = '00000000-0000-0000-0019-000000000002';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/b1-eine-schwierige-entscheidung.mp3' WHERE id = '00000000-0000-0000-0019-000000000003';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/b2-ki-arbeitsplatz.mp3'            WHERE id = '00000000-0000-0000-0020-000000000001';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/b2-der-demografische-wandel.mp3'   WHERE id = '00000000-0000-0000-0020-000000000002';
UPDATE public.lessons SET video_url = 'https://lwptyvqxivtrysbcimkq.supabase.co/storage/v1/object/public/listening-audio/b2-stadt-oder-land.mp3'            WHERE id = '00000000-0000-0000-0020-000000000003';
