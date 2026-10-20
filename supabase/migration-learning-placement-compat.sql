-- Minimal additive compatibility repair for deployments missing placement_tests.
-- Does not alter grants, policies or rows on any existing table (including this one).
-- Firebase identity is verified by server routes; browser roles cannot read/write results.
BEGIN;
DO $compat$
BEGIN
  IF to_regclass('public.placement_tests') IS NULL THEN
    CREATE TABLE public.placement_tests (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id text NOT NULL,
      level_result text CHECK (level_result IN ('A1','A2','B1','B2','C1')),
      score integer CHECK (score BETWEEN 0 AND 10),
      answers jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX placement_tests_user_created_idx
      ON public.placement_tests(user_id, created_at DESC);
    ALTER TABLE public.placement_tests ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON public.placement_tests FROM PUBLIC, anon, authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_tests TO service_role;
    CREATE POLICY placement_service_access ON public.placement_tests
      FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY placement_browser_deny ON public.placement_tests
      AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
  END IF;
END
$compat$;
-- Refresh PostgREST metadata after the additive table creation.
NOTIFY pgrst, 'reload schema';
COMMIT;
