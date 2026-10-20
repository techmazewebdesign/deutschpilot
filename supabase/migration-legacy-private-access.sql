-- Review/apply through the authorised release process. No production SQL is run by tests.
-- Firebase owns identity. Browser Supabase roles cannot prove a Firebase UID; all
-- private operations therefore use verified server routes and service_role only.
BEGIN;
CREATE TABLE IF NOT EXISTS public.placement_tests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id text NOT NULL,
 level_result text CHECK(level_result IN ('A1','A2','B1','B2','C1')),
 score integer CHECK(score BETWEEN 0 AND 10), answers jsonb,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.placement_tests ADD COLUMN IF NOT EXISTS level_result text;
DO $migration$
DECLARE legacy_table text;
BEGIN
  FOREACH legacy_table IN ARRAY ARRAY[
    'profiles','student_progress','student_room_progress','student_task_progress',
    'placement_tests','class_enrollments','teacher_profiles','live_classes',
    'purchases','access_grants','ai_trainer_entitlements','ai_trainer_usage','sales_training_progress'
  ] LOOP
    IF to_regclass(format('public.%I', legacy_table)) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',legacy_table);
    EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC, anon, authenticated',legacy_table);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role',legacy_table);
    -- Restrictive false still denies if an old schema later reintroduces an open policy/grant.
    EXECUTE format('DROP POLICY IF EXISTS legacy_private_client_deny ON public.%I',legacy_table);
    EXECUTE format('CREATE POLICY legacy_private_client_deny ON public.%I AS RESTRICTIVE FOR ALL TO anon, authenticated USING(false) WITH CHECK(false)',legacy_table);
  END LOOP;
  IF to_regclass('public.teacher_profiles') IS NOT NULL THEN
    ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS public_directory_enabled boolean NOT NULL DEFAULT false;
    -- Existing teacher profiles are never assumed to have authorised directory publication.
  END IF;
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS firebase_uid text;
    CREATE UNIQUE INDEX IF NOT EXISTS profiles_verified_firebase_uid_idx ON public.profiles(firebase_uid) WHERE firebase_uid IS NOT NULL;
    -- Do not infer ownership from email or copy legacy rows to a new Firebase identity.
    -- A verified operator must review/link legacy profiles before their school records return.
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='id' AND data_type='text') THEN
      ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
    END IF;
  END IF;
END $migration$;

-- Only a verified server identity may supply p_user_id. This RPC is inaccessible to
-- anonymous/authenticated Supabase clients, including users carrying a Firebase token.
CREATE OR REPLACE FUNCTION public.save_learning_progress(
 p_user_id text, p_lesson_id uuid, p_course_id uuid, p_score integer, p_completed boolean
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public,pg_temp AS $function$
BEGIN
 IF p_user_id IS NULL OR length(p_user_id) NOT BETWEEN 1 AND 128 OR p_score IS NULL OR p_score NOT BETWEEN 0 AND 100 OR p_completed IS NULL THEN
   RAISE EXCEPTION 'Invalid progress payload' USING ERRCODE='22023';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM public.lessons l JOIN public.courses c ON c.id=l.course_id WHERE l.id=p_lesson_id AND l.course_id=p_course_id AND c.is_published=true) THEN
   RAISE EXCEPTION 'Published lesson/course required' USING ERRCODE='22023';
 END IF;
 INSERT INTO public.student_progress(user_id,lesson_id,course_id,score,completed,updated_at)
 VALUES(p_user_id,p_lesson_id,p_course_id,p_score,p_completed,now())
 ON CONFLICT(user_id,lesson_id) DO UPDATE SET
   score=GREATEST(public.student_progress.score,EXCLUDED.score),
   completed=public.student_progress.completed OR EXCLUDED.completed,
   updated_at=now();
END $function$;
REVOKE ALL ON FUNCTION public.save_learning_progress(text,uuid,uuid,integer,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_learning_progress(text,uuid,uuid,integer,boolean) TO service_role;
COMMIT;
