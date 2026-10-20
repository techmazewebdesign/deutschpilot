-- Supplemental correction for existing normalized school installs.
-- Idempotent; apply only through the authorised migration procedure.
-- No data or storage bytes are changed by installing this function.
begin;
create or replace function public.school_upload_recover(p_school text,p_actor jsonb,p_document_id text,p_confirmation text,p_fence_reference text,p_drain_reference text)
returns text language plpgsql security invoker set search_path=public,extensions as $$
declare
 r school_upload_reservations%rowtype;
 document_payload jsonb;
 document_owner text;
begin
 if p_confirmation<>'WRITERS FENCED AND STORAGE DRAINED'or length(p_fence_reference)<12 or length(p_drain_reference)<12 then raise exception 'SCHOOL_RECOVERY_GUARD';end if;
 perform 1 from school_members where school_id=p_school and id=p_actor->>'id'and payload->>'role'='owner'and(payload->>'active')::boolean for share;
 if not found or not coalesce((p_actor->>'verified')::boolean,false)then raise exception 'SCHOOL_FORBIDDEN';end if;
 -- Match document.hold / cleanup lock order: member, document, reservation.
 -- The durable reservation supplies the owner even if metadata is missing.
 select student_id into document_owner from school_documents where school_id=p_school and id=p_document_id;
 if document_owner is null then
  select student_id into document_owner from school_upload_reservations where school_id=p_school and id=p_document_id;
 end if;
 perform 1 from school_members where school_id=p_school and id=document_owner for share;
 select payload into document_payload from school_documents where school_id=p_school and id=p_document_id for update;
 select*into r from school_upload_reservations where school_id=p_school and id=p_document_id for update;
 if r.id is null or r.status not in('writing','unknown')then raise exception 'SCHOOL_RECOVERY_NOT_REQUIRED';end if;
 if coalesce((document_payload->>'legalHold')::boolean,false)then raise exception 'SCHOOL_RECORDS_HOLD';end if;
 -- The document lock prevents a preservation order from committing between this
 -- decision and cleanup authorization. A later hold observes the durable queue.
 update school_upload_reservations set status='cancelled',cleanup_requested=true,updated_at=now()where school_id=p_school and id=p_document_id;
 insert into school_cleanup(school_id,id,payload)values(p_school,p_document_id,jsonb_build_object('studentId',r.student_id,'path',r.storage_path,'reason','reviewed-upload-recovery'))on conflict(school_id,id)do nothing;
 insert into school_audit(school_id,id,payload)values(p_school,gen_random_uuid()::text,jsonb_build_object('id',gen_random_uuid(),'actorId',p_actor->>'id','action','document.upload.reviewed_recovery','target',p_document_id,'writerFenceReference',p_fence_reference,'providerDrainReference',p_drain_reference,'at',now()));
 return r.storage_path;
end;$$;
revoke all on function public.school_upload_recover(text,jsonb,text,text,text,text) from public,anon,authenticated;
grant execute on function public.school_upload_recover(text,jsonb,text,text,text,text) to service_role;
commit;
