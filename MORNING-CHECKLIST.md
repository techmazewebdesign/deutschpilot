# Morning Checklist — after the overnight build (2026-07-24/25)

Everything below needs you (DB writes / decisions). All files are in
`supabase/` in this repo; each is additive-only and safe to re-run.
Run them in the Supabase SQL Editor (project "Deutsch Pilot"), copy →
paste → Run, in this order:

## 1. Run the new seed files (≈2 min each)

| # | File | What goes live |
|---|------|----------------|
| 1 | `supabase/seed-depth-reading.sql` | +12 reading lessons, +48 questions (A1–B2 reading courses grow from 3 to 6 lessons) |
| 2 | `supabase/seed-depth-writing-speaking.sql` | +12 writing prompts, +12 speaking prompts (all writing/speaking courses grow to 6 lessons) |
| 3 | `supabase/seed-a2-rooms-01-03.sql` | A2 Rooms 1–3: Alltag, Reisen, Gesundheit (lessons + checkpoint quizzes) |
| 4 | `supabase/seed-a2-rooms-04-06.sql` | A2 Rooms 4–6: Arbeit, Wohnen, Feste (lessons + checkpoint quizzes) |

Each should say "Success. No rows returned". After #3+#4, the A2 tab
on /rooms fills with real lesson counts automatically — code is
already deployed.

## 2. Quick verification (1 min)

- Open https://www.deutschpilot.de/en/rooms?level=A2 — each room
  should show "3 lessons" instead of "—".
- Open any reading course, e.g. /en/courses/a1-reading-practice —
  it should now list 6 lessons.

## 3. Decisions waiting on you (no rush)

- **Pronunciation scoring** for speaking practice: needs a paid
  speech API (ballpark: Azure Pronunciation Assessment ≈ $1 per
  audio-hour). Say "scope it" and a design + cost estimate follows.
- **Verification-email deliverability**: if signup emails keep
  landing in spam, set up a custom sender domain (SPF/DKIM) in
  Firebase Console → Authentication → Templates.

## Already live from tonight (no action needed)

- DeutschPilot Magazine: 6 bilingual SEO articles at /magazine
  (JSON-LD, canonical/hreflang, sitemap).
- A2 rooms UI on /rooms (awaits seeds above for content).
- Per-page SEO metadata for /courses, /levels, /rooms.
- Sitemap now includes /levels, /rooms, and all article URLs.

Delete this file once done — it's a handoff note, not documentation.
