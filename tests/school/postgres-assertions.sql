set role service_role;
do $$ declare ok boolean; begin
 select public.school_platform_compare_and_swap('synthetic-school',0,'{"schoolId":"synthetic-school","version":1,"members":[],"classes":[],"audit":[]}') into ok;
 if not ok then raise exception 'Initial CAS failed';end if;
 select public.school_platform_compare_and_swap('synthetic-school',0,'{"schoolId":"synthetic-school","version":1,"members":[],"classes":[],"audit":[]}') into ok;
 if ok then raise exception 'CAS stale insert accepted';end if;
 select public.school_platform_compare_and_swap('synthetic-school',1,'{"schoolId":"synthetic-school","version":2,"members":[],"classes":[],"audit":[]}') into ok;
 if not ok then raise exception 'CAS update failed';end if;
 select public.school_platform_compare_and_swap('synthetic-school',1,'{"schoolId":"synthetic-school","version":2,"members":[],"classes":[],"audit":[]}') into ok;
 if ok then raise exception 'CAS stale update accepted';end if;
 begin perform public.school_platform_compare_and_swap('synthetic-school',2,'{"version":3,"members":[],"classes":[],"audit":[]}');raise exception 'NULL school accepted';exception when raise_exception then if sqlerrm='NULL school accepted' then raise;end if;end;
 begin perform public.school_platform_compare_and_swap('synthetic-school',2,'{"schoolId":"synthetic-school","members":[],"classes":[],"audit":[]}');raise exception 'NULL version accepted';exception when raise_exception then if sqlerrm='NULL version accepted' then raise;end if;end;
 begin perform public.school_platform_compare_and_swap('synthetic-school',-1,'{}');raise exception 'Negative version accepted';exception when raise_exception then if sqlerrm='Negative version accepted' then raise;end if;end;
end; $$;
reset role;
set role anon;
do $$ declare count_records integer;begin
 begin perform * from public.school_platform_state;raise exception 'Anon state read succeeded';exception when insufficient_privilege then null;end;
 begin perform public.school_platform_compare_and_swap('attack',0,'{}');raise exception 'Anon RPC succeeded';exception when insufficient_privilege then null;end;
 select count(*) into count_records from storage.objects where bucket_id='school-private';if count_records<>0 then raise exception 'Private files leaked through legacy policy';end if;
 select count(*) into count_records from storage.objects where bucket_id='other-bucket';if count_records<>1 then raise exception 'Other bucket unnecessarily blocked';end if;
 begin insert into storage.objects values('attack','school-private');raise exception 'Anon upload succeeded';exception when insufficient_privilege then null;end;
end; $$;
reset role;
set role authenticated;
do $$ declare count_records integer;begin
 begin perform * from public.school_platform_state;raise exception 'Auth state read succeeded';exception when insufficient_privilege then null;end;
 begin perform public.school_platform_compare_and_swap('attack',0,'{}');raise exception 'Auth RPC succeeded';exception when insufficient_privilege then null;end;
 select count(*) into count_records from storage.objects where bucket_id='school-private';if count_records<>0 then raise exception 'Authenticated private files leaked';end if;
 begin insert into storage.objects values('attack-auth','school-private');raise exception 'Auth upload succeeded';exception when insufficient_privilege then null;end;
end; $$;
reset role;
select 'PASS real PostgreSQL CAS conflicts, NULL/type guards, RLS/grants and restrictive storage policy' as result;
