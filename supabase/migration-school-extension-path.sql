-- Supabase installs pgcrypto in extensions; local PostgreSQL may use public.
-- School routines are SECURITY INVOKER and only service_role can execute them.
-- Preserve the fixed trusted lookup path on both installations.
do $$declare f record;begin
 for f in select p.oid::regprocedure signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'school_%'
 loop execute 'alter function '||f.signature||' set search_path=public,extensions';end loop;
end;$$;
