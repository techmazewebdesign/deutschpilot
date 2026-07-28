-- ============================================================
-- DeutschPilot – vocabulary_words table
-- Curated flashcard word bank, public read (no auth required).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.vocabulary_words (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level       text NOT NULL,
  category    text NOT NULL,
  word_de     text NOT NULL,
  word_en     text NOT NULL,
  example_de  text NOT NULL,
  example_en  text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (level, order_index)
);

CREATE INDEX IF NOT EXISTS vocabulary_words_level_idx ON public.vocabulary_words (level, order_index);

ALTER TABLE public.vocabulary_words ENABLE ROW LEVEL SECURITY;
