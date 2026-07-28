-- ============================================================
-- DeutschPilot – driving_theory_questions table
-- Klasse B (car) prep questions. These are original questions
-- covering well-established, high-confidence German traffic-law
-- topics (BAC limits, speed limits, right-of-way, etc.) — NOT
-- verbatim reproductions of the official Fragenkatalog (no
-- licensed source for that data was available at build time).
-- Public read (no auth required, matches the free-preview spirit
-- of A1); writes go through service-role only.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.driving_theory_questions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_class     text NOT NULL DEFAULT 'B',
  category          text NOT NULL,
  question_de       text NOT NULL,
  question_en       text NOT NULL,
  options_de        jsonb NOT NULL,
  options_en        jsonb NOT NULL,
  correct_answer_de text NOT NULL,
  correct_answer_en text NOT NULL,
  explanation_de    text,
  explanation_en    text,
  order_index       integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (license_class, order_index)
);

CREATE INDEX IF NOT EXISTS driving_theory_questions_class_idx ON public.driving_theory_questions (license_class, order_index);

ALTER TABLE public.driving_theory_questions ENABLE ROW LEVEL SECURITY;
