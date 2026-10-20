-- Normalized transactional school persistence. No aggregate fallback.
-- Fresh activation migration: stage1 pilot was local-only; see guarded import instructions.
create extension if not exists pgcrypto;
create table if not exists public.school_orgs(id text primary key,created_at timestamptz not null default now());
alter table public.school_orgs enable row level security;
revoke all on public.school_orgs from anon,authenticated;
grant all on public.school_orgs to service_role;
create sequence if not exists public.school_event_sequence;
grant usage,select on sequence public.school_event_sequence to service_role;
create table if not exists public.school_settings(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_settings enable row level security;
revoke all on public.school_settings from anon,authenticated;
grant all on public.school_settings to service_role;
create index if not exists school_settings_student_idx on public.school_settings(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_members(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_members enable row level security;
revoke all on public.school_members from anon,authenticated;
grant all on public.school_members to service_role;
create index if not exists school_members_student_idx on public.school_members(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_classes(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_classes enable row level security;
revoke all on public.school_classes from anon,authenticated;
grant all on public.school_classes to service_role;
create index if not exists school_classes_student_idx on public.school_classes(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_attendance(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_attendance enable row level security;
revoke all on public.school_attendance from anon,authenticated;
grant all on public.school_attendance to service_role;
alter table public.school_attendance add column if not exists retention_at timestamptz not null default now();
create index if not exists school_attendance_student_idx on public.school_attendance(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_absences(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_absences enable row level security;
revoke all on public.school_absences from anon,authenticated;
grant all on public.school_absences to service_role;
alter table public.school_absences add column if not exists retention_at timestamptz not null default now();
create index if not exists school_absences_student_idx on public.school_absences(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_documents(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_documents enable row level security;
revoke all on public.school_documents from anon,authenticated;
grant all on public.school_documents to service_role;
create index if not exists school_documents_student_idx on public.school_documents(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_document_requests(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_document_requests enable row level security;
revoke all on public.school_document_requests from anon,authenticated;
grant all on public.school_document_requests to service_role;
create index if not exists school_document_requests_student_idx on public.school_document_requests(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_letters(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_letters enable row level security;
revoke all on public.school_letters from anon,authenticated;
grant all on public.school_letters to service_role;
alter table public.school_letters add column if not exists retention_at timestamptz not null default now();
create index if not exists school_letters_student_idx on public.school_letters(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_letter_recipients(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_letter_recipients enable row level security;
revoke all on public.school_letter_recipients from anon,authenticated;
grant all on public.school_letter_recipients to service_role;
create index if not exists school_letter_recipients_student_idx on public.school_letter_recipients(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_chat_messages(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_chat_messages enable row level security;
revoke all on public.school_chat_messages from anon,authenticated;
grant all on public.school_chat_messages to service_role;
create index if not exists school_chat_messages_student_idx on public.school_chat_messages(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_chat_reads(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_chat_reads enable row level security;
revoke all on public.school_chat_reads from anon,authenticated;
grant all on public.school_chat_reads to service_role;
create index if not exists school_chat_reads_student_idx on public.school_chat_reads(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_notifications(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_notifications enable row level security;
revoke all on public.school_notifications from anon,authenticated;
grant all on public.school_notifications to service_role;
alter table public.school_notifications add column if not exists retention_at timestamptz not null default now();
create index if not exists school_notifications_student_idx on public.school_notifications(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_devices(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_devices enable row level security;
revoke all on public.school_devices from anon,authenticated;
grant all on public.school_devices to service_role;
create index if not exists school_devices_student_idx on public.school_devices(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_outbox(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_outbox enable row level security;
revoke all on public.school_outbox from anon,authenticated;
grant all on public.school_outbox to service_role;
create index if not exists school_outbox_student_idx on public.school_outbox(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_progress(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_progress enable row level security;
revoke all on public.school_progress from anon,authenticated;
grant all on public.school_progress to service_role;
alter table public.school_progress add column if not exists retention_at timestamptz not null default now();
create index if not exists school_progress_student_idx on public.school_progress(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_audit(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_audit enable row level security;
revoke all on public.school_audit from anon,authenticated;
grant all on public.school_audit to service_role;
alter table public.school_audit add column if not exists retention_at timestamptz not null default now();
create index if not exists school_audit_student_idx on public.school_audit(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_invites(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_invites enable row level security;
revoke all on public.school_invites from anon,authenticated;
grant all on public.school_invites to service_role;
create index if not exists school_invites_student_idx on public.school_invites(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_deletion_requests(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_deletion_requests enable row level security;
revoke all on public.school_deletion_requests from anon,authenticated;
grant all on public.school_deletion_requests to service_role;
create index if not exists school_deletion_requests_student_idx on public.school_deletion_requests(school_id,student_id,created_at desc,id desc);
create table if not exists public.school_cleanup(
 school_id text not null references public.school_orgs(id) on delete cascade,
 id text not null, payload jsonb not null check(jsonb_typeof(payload)='object'),
 student_id text generated always as (coalesce(payload->>'studentId',payload->>'userId')) stored,
 class_id text generated always as (payload->>'classId') stored,
 actor_id text generated always as (coalesce(payload->>'authorId',payload->>'createdBy',payload->>'actorId')) stored,
 created_at timestamptz not null default now(),
 revision bigint not null default nextval('public.school_event_sequence'),
 retention_at timestamptz not null default now(),
 primary key(school_id,id)
);
alter table public.school_cleanup enable row level security;
revoke all on public.school_cleanup from anon,authenticated;
grant all on public.school_cleanup to service_role;
create index if not exists school_cleanup_student_idx on public.school_cleanup(school_id,student_id,created_at desc,id desc);
alter table public.school_settings add column if not exists retention_at timestamptz not null default now();
alter table public.school_members add column if not exists retention_at timestamptz not null default now();
alter table public.school_classes add column if not exists retention_at timestamptz not null default now();
alter table public.school_attendance add column if not exists retention_at timestamptz not null default now();
alter table public.school_absences add column if not exists retention_at timestamptz not null default now();
alter table public.school_documents add column if not exists retention_at timestamptz not null default now();
alter table public.school_document_requests add column if not exists retention_at timestamptz not null default now();
alter table public.school_letters add column if not exists retention_at timestamptz not null default now();
alter table public.school_letter_recipients add column if not exists retention_at timestamptz not null default now();
alter table public.school_chat_messages add column if not exists retention_at timestamptz not null default now();
alter table public.school_chat_reads add column if not exists retention_at timestamptz not null default now();
alter table public.school_notifications add column if not exists retention_at timestamptz not null default now();
alter table public.school_devices add column if not exists retention_at timestamptz not null default now();
alter table public.school_outbox add column if not exists retention_at timestamptz not null default now();
alter table public.school_progress add column if not exists retention_at timestamptz not null default now();
alter table public.school_audit add column if not exists retention_at timestamptz not null default now();
alter table public.school_invites add column if not exists retention_at timestamptz not null default now();
alter table public.school_deletion_requests add column if not exists retention_at timestamptz not null default now();
alter table public.school_cleanup add column if not exists retention_at timestamptz not null default now();
create table if not exists public.school_assignments(school_id text not null,class_id text not null,user_id text not null,role text not null check(role in ('teacher','student')),primary key(school_id,class_id,user_id),foreign key(school_id,class_id) references public.school_classes(school_id,id) on delete cascade);
alter table public.school_assignments enable row level security;
revoke all on public.school_assignments from anon,authenticated;
grant all on public.school_assignments to service_role;
create index if not exists school_assignments_user_idx on public.school_assignments(school_id,user_id,class_id);
create index if not exists school_chat_history_idx on public.school_chat_messages(school_id,class_id,created_at desc,id desc);
create unique index if not exists school_chat_dedupe_idx on public.school_chat_messages(school_id,(payload->>'authorId'),(payload->>'clientMessageId')) where payload ? 'clientMessageId';
create index if not exists school_audit_history_idx on public.school_audit(school_id,created_at desc,id desc);
create index if not exists school_document_expiry_idx on public.school_documents(school_id,((payload->>'expiresAt')),id) where coalesce((payload->>'legalHold')::boolean,false)=false;
create index if not exists school_invites_email_idx on public.school_invites(school_id,((payload->>'email')));
create index if not exists school_outbox_pending_idx on public.school_outbox(school_id,((payload->>'status')),created_at,id);
create index if not exists school_notification_recipient_idx on public.school_notifications(school_id,student_id,created_at desc,id desc);
create index if not exists school_letter_recipient_idx on public.school_letter_recipients(school_id,student_id,(payload->>'letterId'));
create unique index if not exists school_device_token_idx on public.school_devices(school_id,(payload->>'token'));
create or replace function public.school_has_class(p_school text,p_uid text,p_class text) returns boolean language sql stable security invoker set search_path=public as $$select exists(select 1 from school_assignments where school_id=p_school and class_id=p_class and user_id=p_uid)$$;
create or replace function public.school_can_student(p_school text,p_uid text,p_student text) returns boolean language sql stable security invoker set search_path=public as $$select p_uid=p_student or exists(select 1 from school_assignments teacher join school_assignments student on student.school_id=teacher.school_id and student.class_id=teacher.class_id where teacher.school_id=p_school and teacher.user_id=p_uid and teacher.role='teacher' and student.user_id=p_student and student.role='student')$$;
-- Scoped bounded repository hydration. Each kind uses its own tenant/owner/class index.
-- All rows remain server-side; SchoolSnapshot applies a second, defensive redaction pass.
create or replace function public.school_repository_read(p_school text,p_actor jsonb,p_action jsonb default '{}'::jsonb)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare uid text:=p_actor->>'id'; r text; kind text; tbl text; cond text; rows jsonb; result jsonb:='{}'; limits jsonb:='{}'; maximum int; act text:=coalesce(p_action->>'action',''); target text;ordering text;selected_ids text[]:=array(select jsonb_array_elements_text(coalesce(p_action->'studentIds','[]')||coalesce(p_action->'teacherIds','[]')));begin
 if uid is null or coalesce((p_actor->>'verified')::boolean,false)=false then raise exception 'SCHOOL_UNAUTHENTICATED';end if;
 select payload->>'role' into r from school_members where school_id=p_school and id=uid and (payload->>'active')::boolean;
 if r is null and act not in ('bootstrap','invite.accept','privacy.prepare','privacy.finalize') then raise exception 'SCHOOL_NOT_MEMBER';end if;
 for kind,tbl,maximum in select * from (values
 ('settings','settings',1),('members','members',1000),('classes','classes',250),('attendance','attendance',500),('absences','absences',100),('absenceSummaries','absences',100),('documents','documents',100),('documentRequests','document_requests',100),('letters','letters',100),('chatMessages','chat_messages',100),('chatReads','chat_reads',250),('notifications','notifications',100),('progress','progress',1000),('invites','invites',10),('devices','devices',10),('deletionRequests','deletion_requests',100),('audit','audit',0),('cleanup','cleanup',100)) t(kind,tbl,maximum)
 loop
 cond:='false';target:=null;
 case kind
 when 'settings' then cond:='true';
 when 'members' then target:=coalesce(p_action->>'memberId',p_action->>'studentId');cond:=case when r in('owner','office') then 'true' else format('id=%L or exists(select 1 from school_assignments a join school_assignments b on a.school_id=b.school_id and a.class_id=b.class_id where a.school_id=%L and a.user_id=%L and b.user_id=school_members.id)',uid,p_school,uid)end;
 when 'classes' then cond:=case when r in('owner','office') then 'true' else format('school_has_class(%L,%L,id)',p_school,uid)end;target:=coalesce(p_action->>'classId',p_action->>'id');
 when 'attendance' then cond:=case when r in('owner','office') then 'true' when r='teacher' then format('school_has_class(%L,%L,class_id)',p_school,uid)else format('student_id=%L',uid)end;target:=case when act='attendance.set' then (p_action->>'classId')||':'||(p_action->>'studentId')||':'||(p_action->>'date') else null end;
 when 'absenceSummaries' then cond:=case when r='teacher'then format('school_can_student(%L,%L,student_id)',p_school,uid)else'false'end;
 when 'absences' then cond:=case when r in('owner','office') then 'true' else format('student_id=%L',uid)end;target:=p_action->>'absenceId';
 when 'documents' then cond:=case when r in('owner','office') then 'true' else format('student_id=%L',uid)end;target:=p_action->>'documentId';
 when 'documentRequests' then cond:=case when r in('owner','office') then 'true' else format('student_id=%L',uid)end;target:=coalesce(p_action->>'requestId',(select payload->>'requestId' from school_documents where school_id=p_school and id=p_action->>'documentId'));
 when 'letters' then cond:=case when r in('owner','office') then 'true' else format('actor_id=%L or exists(select 1 from school_letter_recipients x where x.school_id=%L and x.student_id=%L and x.payload->>''letterId''=school_letters.id)',uid,p_school,uid)end;target:=coalesce(p_action->>'letterId',(select payload->>'letterId' from school_documents where school_id=p_school and id=p_action->>'documentId'));
 when 'chatMessages' then cond:=case when r in('owner','office') then 'true' else format('school_has_class(%L,%L,class_id)',p_school,uid)end;target:=p_action->>'messageId';
 when 'chatReads' then cond:=format('student_id=%L',uid);
 when 'notifications' then cond:=format('student_id=%L',uid);target:=p_action->>'notificationId';
 when 'progress' then cond:=case when r in('owner','office') then 'true' else format('school_can_student(%L,%L,student_id)',p_school,uid)end;
 when 'invites' then cond:=case when act='invite.accept' then format('id=%L',encode(digest(p_action->>'code','sha256'),'hex')) when act='invite.create' then format('payload->>''email''=%L',lower(p_action->>'email')) else 'false' end;
 when 'devices' then cond:=format('student_id=%L or payload->>''token''=%L',uid,p_action->>'token');
 when 'deletionRequests' then cond:=case when r in('owner','office') then 'true' else format('id=%L',uid)end;
 when 'cleanup' then cond:=case when r in('owner','office') then 'true' else format('student_id=%L',uid)end;
 else cond:='false';end case;
 if kind in('attendance','absences','absenceSummaries','letters','notifications','progress')and(act=''or act='section.page')then cond:='('||cond||')and school_record_visible('||quote_literal(p_school)||','||quote_literal(case when kind='absenceSummaries'then'absences'else kind end)||',payload,created_at)';end if;
 if act in('privacy.prepare','privacy.finalize','data.export') then
  -- Privacy/export use SQL paged/transactional paths, never an unbounded hydrated aggregate.
  if kind not in('settings','members','deletionRequests') then cond:='false';end if;
 end if;
 if act='progress.sync' and kind='progress' then cond:=format('student_id=%L and payload->>''lessonId'' in(select value->>''lessonId'' from jsonb_array_elements(%L::jsonb))',uid,p_action->'items');end if;
 if act in('chat.send','chat.read','chat.moderate') and kind='chatMessages' then cond:=cond||format(' and class_id=%L',p_action->>'classId');if act='chat.send' then cond:=cond||format(' and payload->>''clientMessageId''=%L and payload->>''authorId''=%L and payload ? ''clientMessageId''',p_action->>'clientMessageId',uid);end if;end if;
 if act='member.update' and kind='classes' then cond:=format('exists(select 1 from school_assignments x where x.school_id=%L and x.class_id=school_classes.id and x.user_id=%L)',p_school,p_action->>'memberId');end if;
 if target is not null then cond:='('||cond||')';end if;
 if target is not null and act<>''and kind in('attendance','absences','documents','documentRequests','letters','chatMessages','notifications')then cond:='('||cond||')and id='||quote_literal(target);end if;
 ordering:=case when target is not null then format('(id=%L)desc,',target)else''end||case when kind='members'then format('(id=%L)desc,(id=any(%L::text[]))desc,',uid,selected_ids)else''end||'created_at desc,id desc';
 if kind='chatMessages'and act=''then
  execute format('with visible as(select id from school_classes where school_id=$1 and(%s)order by created_at desc,id desc limit 250),recent as(select m.*from visible c cross join lateral(select id,payload,revision,created_at from school_chat_messages where school_id=$1 and class_id=c.id order by created_at desc,id desc limit 101)m)select coalesce(jsonb_agg(to_jsonb(x)),''[]'')from(select*from recent order by created_at desc,id desc limit 101)x',case when r in('owner','office')then'true'else format('school_has_class(%L,%L,id)',p_school,uid)end)into rows using p_school;
 else
 execute format('select coalesce(jsonb_agg(to_jsonb(x)),''[]''::jsonb) from (select id,payload,revision,created_at from school_%I where school_id=$1 and (%s) order by %s limit $2) x',tbl,cond,ordering) into rows using p_school,maximum+1;
 end if;

 if kind='chatMessages'then select coalesce(jsonb_agg(value||jsonb_build_object('payload',case when school_record_visible(p_school,'chatMessages',value->'payload',(value->>'created_at')::timestamptz)then value->'payload'else(value->'payload')||jsonb_build_object('body','','deletedAt',now(),'deletedBy','retention')end)),'[]')into rows from jsonb_array_elements(rows);end if;
 if kind='letters'then select coalesce(jsonb_agg(value||jsonb_build_object('payload',school_letter_payload(p_school,value->>'id',value->'payload'))),'[]')into rows from jsonb_array_elements(rows);end if;
 if kind='absenceSummaries'then select coalesce(jsonb_agg(value||jsonb_build_object('payload',jsonb_build_object('id',value->'payload'->'id','studentId',value->'payload'->'studentId','from',value->'payload'->'from','to',value->'payload'->'to','status',value->'payload'->'status'))),'[]')into rows from jsonb_array_elements(rows);end if;
 limits:=limits||jsonb_build_object(kind,jsonb_array_length(rows)>maximum);
 if jsonb_array_length(rows)>maximum then rows:=rows-maximum;end if;
 result:=result||jsonb_build_object(kind,rows);
 end loop;
 return jsonb_build_object('records',result,'pagination',limits);
end;$$;
create or replace function public.school_repository_commit(p_school text,p_actor jsonb,p_action jsonb,p_changes jsonb,p_bootstrap_uid text default null)
returns bigint language plpgsql security invoker set search_path=public as $$
declare uid text:=p_actor->>'id'; role_name text; act text:=coalesce(p_action->>'action',''); class_ref text:=p_action->>'classId'; target text; cls jsonb; m jsonb; change jsonb; tbl text; old_revision bigint; prior_payload jsonb; row_payload jsonb; next_revision bigint; anchor_at timestamptz;k text; office boolean; owner_count int;chat_inserted boolean:=false;begin
 if uid is null or coalesce((p_actor->>'verified')::boolean,false)=false or jsonb_typeof(p_changes)<>'array' or jsonb_array_length(p_changes)>2500 then raise exception 'SCHOOL_UNAUTHENTICATED';end if;
 -- Owner mutations serialize only the small owners set, not the school or chat stream.
 if act in('member.update','settings.update','invite.create') then perform 1 from school_members where school_id=p_school and payload->>'role'='owner' order by id for update;end if;
 if act='bootstrap' then
  perform pg_advisory_xact_lock(hashtextextended('bootstrap:'||p_school,0));
  if uid is distinct from p_bootstrap_uid or coalesce((p_actor->>'admin')::boolean,false)=false or exists(select 1 from school_members where school_id=p_school) then raise exception 'SCHOOL_FORBIDDEN';end if;
  insert into school_orgs(id) values(p_school) on conflict do nothing;
 else
  select payload into m from school_members where school_id=p_school and id=uid for share;
  role_name:=m->>'role';office:=role_name in('owner','office');
  if act not in('invite.accept','privacy.finalize') and (m is null or not coalesce((m->>'active')::boolean,false)) then raise exception 'SCHOOL_NOT_MEMBER';end if;
 end if;
 case act
 when 'bootstrap' then null;
 when 'invite.accept' then
  perform 1 from school_invites where school_id=p_school and id=encode(digest(p_action->>'code','sha256'),'hex') and payload->>'email'=lower(p_actor->>'email') and (payload->>'expiresAt')::timestamptz>now() for update;
  if not found or m is not null then raise exception 'SCHOOL_FORBIDDEN';end if;
 when 'settings.update','invite.create' then if role_name<>'owner' then raise exception 'SCHOOL_FORBIDDEN';end if;
 when 'member.update' then
  if role_name<>'owner' then raise exception 'SCHOOL_FORBIDDEN';end if;
  select payload into row_payload from school_members where school_id=p_school and id=p_action->>'memberId' for update;
  if row_payload is null then raise exception 'SCHOOL_FORBIDDEN';end if;
  if row_payload->>'role'='owner' and (p_action->>'role'<>'owner' or not (p_action->>'active')::boolean) and (select count(*) from school_members where school_id=p_school and payload->>'role'='owner' and (payload->>'active')::boolean)<=1 then raise exception 'SCHOOL_LAST_OWNER';end if;
 when 'class.save','absence.review','document.request','document.hold','retention.run','document.rescan' then
  if not office then raise exception 'SCHOOL_FORBIDDEN';end if;
  if act='class.save' then class_ref:=p_action->>'id';perform 1 from school_members where school_id=p_school and id in(select jsonb_array_elements_text(p_action->'teacherIds')union select jsonb_array_elements_text(p_action->'studentIds'))order by id for share;
   if exists(select 1 from jsonb_array_elements_text(p_action->'teacherIds')x where not exists(select 1 from school_members where school_id=p_school and id=x.value and payload->>'role'='teacher'and(payload->>'active')::boolean))or exists(select 1 from jsonb_array_elements_text(p_action->'studentIds')x where not exists(select 1 from school_members where school_id=p_school and id=x.value and payload->>'role'='student'and(payload->>'active')::boolean))then raise exception 'SCHOOL_FORBIDDEN';end if;end if;
  if act='document.hold' then perform 1 from school_members where school_id=p_school and id=(select student_id from school_documents where school_id=p_school and id=p_action->>'documentId')for share;end if;
  if act='document.hold' and exists(select 1 from school_documents d join school_deletion_requests r on r.school_id=d.school_id and r.id=d.student_id where d.school_id=p_school and d.id=p_action->>'documentId' and r.payload->>'status'='cleanup_pending') then raise exception 'SCHOOL_DELETION_IN_PROGRESS';end if;
 when 'attendance.set' then
  if not office and role_name<>'teacher' then raise exception 'SCHOOL_FORBIDDEN';end if;
  if not office and p_action->>'status'='excused' then raise exception 'SCHOOL_FORBIDDEN';end if;
 when 'absence.report','progress.sync','document.upload' then if role_name<>'student' then raise exception 'SCHOOL_FORBIDDEN';end if;
 when 'letter.send' then
  perform 1 from school_classes where school_id=p_school and id in(select class_id from school_assignments where school_id=p_school and user_id=uid)order by id for share;
  if not office and role_name<>'teacher' then raise exception 'SCHOOL_FORBIDDEN';end if;
  for target in select jsonb_array_elements_text(p_action->'studentIds') loop
   if not exists(select 1 from school_members where school_id=p_school and id=target and payload->>'role'='student' and (payload->>'active')::boolean) or (not office and not school_can_student(p_school,uid,target)) then raise exception 'SCHOOL_FORBIDDEN';end if;
  end loop;
 when 'letter.read','letter.acknowledge' then
  if not exists(select 1 from school_letter_recipients where school_id=p_school and student_id=uid and payload->>'letterId'=p_action->>'letterId') then raise exception 'SCHOOL_FORBIDDEN';end if;
 when 'notification.read' then
  if not exists(select 1 from school_notifications where school_id=p_school and id=p_action->>'notificationId' and student_id=uid) then raise exception 'SCHOOL_FORBIDDEN';end if;
 when 'chat.send','chat.read','chat.moderate' then
  if not office and not school_has_class(p_school,uid,class_ref) then raise exception 'SCHOOL_FORBIDDEN';end if;
  if act='chat.moderate' and not office and not exists(select 1 from school_assignments where school_id=p_school and class_id=class_ref and user_id=uid and role='teacher') then raise exception 'SCHOOL_FORBIDDEN';end if;
 when 'document.download','document.scan' then
  select payload into row_payload from school_documents where school_id=p_school and id=p_action->>'documentId' for update;
  if row_payload is null or (not office and row_payload->>'studentId'<>uid) then raise exception 'SCHOOL_FORBIDDEN';end if;
  if act='document.download' and (row_payload->>'scanStatus'<>'clean' or (row_payload->>'expiresAt')::timestamptz<=now()) then raise exception 'SCHOOL_DOCUMENT_UNAVAILABLE';end if;
 when 'device.register','device.unregister','privacy.deletion.request' then null;
 when 'privacy.prepare','privacy.finalize' then raise exception 'SCHOOL_PRIVACY_RPC_REQUIRED';
 else raise exception 'SCHOOL_INVALID_ACTION';end case;
 if class_ref is not null then
  select payload into cls from school_classes where school_id=p_school and id=class_ref for share;
  if cls is null then raise exception 'SCHOOL_FORBIDDEN';end if;
  if act='attendance.set' and (not exists(select 1 from school_assignments where school_id=p_school and class_id=class_ref and user_id=p_action->>'studentId' and role='student') or (not office and not exists(select 1 from school_assignments where school_id=p_school and class_id=class_ref and user_id=uid and role='teacher'))) then raise exception 'SCHOOL_FORBIDDEN';end if;
 end if;
 if act='document.upload' or (act='absence.report' and p_action->>'reason'='illness') then
  select payload into row_payload from school_settings where school_id=p_school and id='settings' for share;
  if coalesce((row_payload->>'sensitiveUploadsEnabled')::boolean,false)=false or nullif(row_payload->>'operator','') is null or nullif(row_payload->>'legalBasis','') is null or nullif(row_payload->>'healthLegalBasis','') is null or nullif(row_payload->>'retentionPolicyNote','')is null or not coalesce((row_payload->'recordRetentionDays')?&array['attendance','absences','letters','notifications','progress','audit'],false)or not coalesce((row_payload->'retentionByCategory')?&array['general','medical','jobcenter','signed_letter'],false)or row_payload->>'chatRetentionDays'is null then raise exception 'SCHOOL_POLICY_REQUIRED';end if;
 end if;
 -- Changes are produced only by the trusted strict domain service. Check every touched revision
 -- inside this transaction so snapshot races cannot overwrite unrelated student writes.
 for change in select value from jsonb_array_elements(p_changes) order by value->>'kind',value->>'id' loop
  k:=change->>'kind';tbl:=case k when 'documentRequests' then 'document_requests' when 'chatMessages' then 'chat_messages' when 'chatReads' then 'chat_reads' when 'deletionRequests' then 'deletion_requests' else k end;
  if tbl not in('settings','members','classes','attendance','absences','documents','document_requests','letters','chat_messages','chat_reads','notifications','devices','progress','audit','invites','deletion_requests','cleanup') then raise exception 'SCHOOL_INVALID_KIND';end if;
  if k='attendance'and act='absence.review'then continue;end if;
  if k='letters'and act in('letter.read','letter.acknowledge','document.scan')then
   target:=case when act='document.scan'then(select student_id from school_documents where school_id=p_school and id=p_action->>'documentId')else uid end;
   if not exists(select 1 from school_letter_recipients where school_id=p_school and id=(change->>'id')||':'||target)then raise exception 'SCHOOL_FORBIDDEN';end if;
   update school_letter_recipients set payload=payload||case when act in('letter.read','letter.acknowledge')then jsonb_build_object('readAt',coalesce(payload->'readAt',to_jsonb(now())))else'{}'::jsonb end||case when act='letter.acknowledge'then jsonb_build_object('acknowledgedAt',coalesce(payload->'acknowledgedAt',to_jsonb(now())))else'{}'::jsonb end||case when act='document.scan'then jsonb_build_object('returnedDocumentId',p_action->>'documentId')else'{}'::jsonb end,revision=nextval('school_event_sequence')where school_id=p_school and id=(change->>'id')||':'||target;
   continue;
  end if;
  execute format('select revision,payload from school_%I where school_id=$1 and id=$2 for update',tbl) into old_revision,prior_payload using p_school,change->>'id';
  if k='notifications'and change->'payload'<>'null'::jsonb and change->'payload'->>'readAt'is null and old_revision is not null and prior_payload->>'userId'=change->'payload'->>'userId'and(change->>'id'like'classchat:%'or change->>'id'like'absenceupdate:%'or change->>'id'like'absencereport:%')then
   if prior_payload->>'readAt'is null then continue;end if;
   change:=jsonb_set(change,'{expected}',to_jsonb(old_revision));
  end if;
  if k<>'progress' and old_revision is distinct from (change->>'expected')::bigint then raise exception 'SCHOOL_CONFLICT' using errcode='40001';end if;
  if change->'payload'='null'::jsonb then
   execute format('delete from school_%I where school_id=$1 and id=$2',tbl) using p_school,change->>'id';
  else
   row_payload:=change->'payload';
   if k='letters'then row_payload:=row_payload-'readBy'-'acknowledgements'-'returnedDocuments';end if;
   if k='attendance' and act='attendance.set' and row_payload->>'status' in('absent','late')then
    select id into target from school_absences where school_id=p_school and student_id=row_payload->>'studentId'and payload->>'status'='approved'and row_payload->>'date' between payload->>'from'and payload->>'to'order by created_at,id limit 1;
    if target is not null then row_payload:=row_payload||jsonb_build_object('status','excused','statusBeforeExcuse',row_payload->>'status','excusedByAbsenceId',target);end if;
   end if;

   anchor_at:=case k when'attendance'then(row_payload->>'date')::date::timestamptz when'absences'then(row_payload->>'to')::date::timestamptz when'letters'then(row_payload->>'dueDate')::date::timestamptz when'progress'then coalesce((row_payload->>'updatedAt')::timestamptz,now())when'notifications'then coalesce((row_payload->>'createdAt')::timestamptz,now())when'audit'then coalesce((row_payload->>'at')::timestamptz,now())else now()end;
   if k='progress' then
    if row_payload->>'studentId'<>uid or change->>'id'<>uid||':'||(row_payload->>'lessonId')then raise exception 'SCHOOL_FORBIDDEN';end if;
    insert into school_progress(school_id,id,payload,retention_at)values(p_school,change->>'id',row_payload,anchor_at)
    on conflict(school_id,id)do update set payload=excluded.payload||jsonb_build_object('completed',coalesce((school_progress.payload->>'completed')::boolean,false)or(excluded.payload->>'completed')::boolean,'score',greatest(coalesce((school_progress.payload->>'score')::numeric,0),(excluded.payload->>'score')::numeric)),retention_at=excluded.retention_at,revision=nextval('school_event_sequence') returning revision into next_revision;
   else
   execute format('insert into school_%I(school_id,id,payload,retention_at)values($1,$2,$3,$5) on conflict(school_id,id)do update set payload=excluded.payload,retention_at=excluded.retention_at,revision=nextval(''school_event_sequence'') where school_%I.revision=$4 returning revision',tbl,tbl) into next_revision using p_school,change->>'id',row_payload,(change->>'expected')::bigint,anchor_at;
   if next_revision is null then raise exception 'SCHOOL_CONFLICT' using errcode='40001';end if;
   end if;
   if k='chatMessages'and old_revision is null then chat_inserted:=true;end if;
   if k='classes' then
    delete from school_assignments where school_id=p_school and class_id=change->>'id';
    insert into school_assignments(school_id,class_id,user_id,role)select p_school,change->>'id',value,'teacher' from jsonb_array_elements_text(row_payload->'teacherIds');
    insert into school_assignments(school_id,class_id,user_id,role)select p_school,change->>'id',value,'student' from jsonb_array_elements_text(row_payload->'studentIds');
   end if;
   if k='notifications' and row_payload->>'readAt' is null and(old_revision is null or prior_payload->>'readAt' is not null) then
    insert into school_outbox(school_id,id,payload)
    select p_school,(change->>'id')||':'||encode(digest(row_payload->>'createdAt','sha256'),'hex')||':'||d.id,jsonb_build_object('id',(change->>'id')||':'||encode(digest(row_payload->>'createdAt','sha256'),'hex')||':'||d.id,'notificationId',change->>'id','userId',row_payload->>'userId','token',d.payload->>'token','status','pending','attempts',0,'updatedAt',now())
    from school_devices d join school_members recipient on recipient.school_id=d.school_id and recipient.id=d.student_id
    where d.school_id=p_school and d.student_id=row_payload->>'userId' and (recipient.payload->>'active')::boolean
    on conflict do nothing;
   end if;
   if k='letters' then
    delete from school_letter_recipients where school_id=p_school and payload->>'letterId'=change->>'id';
    insert into school_letter_recipients(school_id,id,payload)select p_school,(change->>'id')||':'||value,jsonb_build_object('letterId',change->>'id','studentId',value) from jsonb_array_elements_text(row_payload->'studentIds');
   end if;
  end if;
 end loop;
 if act='chat.send'and chat_inserted then
  for target in select a.user_id from school_assignments a where a.school_id=p_school and a.class_id=class_ref and a.user_id<>uid order by a.user_id loop perform school_notify_generic(p_school,target,'New class message','classchat:'||class_ref||':'||target);end loop;
 end if;
 if act='absence.report'then
  for target in select id from school_members where school_id=p_school and payload->>'role'in('owner','office')and(payload->>'active')::boolean order by id loop perform school_notify_generic(p_school,target,'New absence report','absencereport:'||coalesce((select value->>'id'from jsonb_array_elements(p_changes)where value->>'kind'='absences'limit 1),'')||':'||target);end loop;
 end if;
 if act='absence.review'then
  for target in select distinct t.user_id from school_assignments t join school_assignments st on st.school_id=t.school_id and st.class_id=t.class_id and st.role='student'join school_absences a on a.school_id=st.school_id and a.student_id=st.user_id where t.school_id=p_school and t.role='teacher'and a.id=p_action->>'absenceId'order by t.user_id loop perform school_notify_generic(p_school,target,'Class attendance information updated','absenceupdate:'||(p_action->>'absenceId')||':'||(p_action->>'status')||':'||target);end loop;
 end if;
 if act='absence.review' then
  select payload into row_payload from school_absences where school_id=p_school and id=p_action->>'absenceId';
  if p_action->>'status'='approved'then
   with changed as(update school_attendance set payload=payload||jsonb_build_object('status','excused','statusBeforeExcuse',payload->>'status','excusedByAbsenceId',p_action->>'absenceId','updatedBy',uid,'updatedAt',now()),revision=nextval('school_event_sequence')where school_id=p_school and student_id=row_payload->>'studentId'and payload->>'date'between row_payload->>'from'and row_payload->>'to'and payload->>'status'in('absent','late')returning id,payload)
   insert into school_audit(school_id,id,payload)select p_school,gen_random_uuid()::text,jsonb_build_object('id',gen_random_uuid(),'actorId',uid,'action','attendance.excused','target',id,'classId',payload->>'classId','date',payload->>'date','afterStatus','excused','at',now())from changed;
  else
   for cls in select jsonb_build_object('id',id,'payload',payload)from school_attendance where school_id=p_school and student_id=row_payload->>'studentId'and payload->>'excusedByAbsenceId'=p_action->>'absenceId'for update loop
    select id into target from school_absences where school_id=p_school and student_id=row_payload->>'studentId'and id<>p_action->>'absenceId'and payload->>'status'='approved'and cls->'payload'->>'date'between payload->>'from'and payload->>'to'order by created_at,id limit 1;
    if target is null then update school_attendance set payload=(payload-'excusedByAbsenceId'-'statusBeforeExcuse')||jsonb_build_object('status',coalesce(payload->>'statusBeforeExcuse','absent'),'updatedBy',uid,'updatedAt',now()),revision=nextval('school_event_sequence')where school_id=p_school and id=cls->>'id';
    else update school_attendance set payload=payload||jsonb_build_object('excusedByAbsenceId',target,'updatedBy',uid,'updatedAt',now()),revision=nextval('school_event_sequence')where school_id=p_school and id=cls->>'id';end if;
   end loop;
  end if;
 end if;
 if act='member.update' then
  target:=p_action->>'memberId';
  update school_classes c set payload=jsonb_set(jsonb_set(payload,'{studentIds}',case when p_action->>'role'='student'and(p_action->>'active')::boolean then payload->'studentIds'else coalesce((select jsonb_agg(value)from jsonb_array_elements_text(c.payload->'studentIds')where value<>target),'[]')end),'{teacherIds}',case when p_action->>'role'='teacher'and(p_action->>'active')::boolean then payload->'teacherIds'else coalesce((select jsonb_agg(value)from jsonb_array_elements_text(c.payload->'teacherIds')where value<>target),'[]')end),revision=nextval('school_event_sequence')where school_id=p_school and exists(select 1 from school_assignments a where a.school_id=p_school and a.class_id=c.id and a.user_id=target);
  delete from school_assignments where school_id=p_school and user_id=target and (role<>p_action->>'role' or not(p_action->>'active')::boolean);
 end if;
 return coalesce(next_revision,0);
end;$$;
create or replace function public.school_repository_history(p_school text,p_actor jsonb,p_kind text,p_class text default null,p_before text default null)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare uid text:=p_actor->>'id';role_name text; cursor_at timestamptz;cursor_id text;result jsonb;begin
 select payload->>'role' into role_name from school_members where school_id=p_school and id=uid and (payload->>'active')::boolean;
 if role_name is null or coalesce((p_actor->>'verified')::boolean,false)=false then raise exception 'SCHOOL_NOT_MEMBER';end if;
 if p_kind='chatMessages' then
  if role_name not in('owner','office') and not school_has_class(p_school,uid,p_class) then raise exception 'SCHOOL_FORBIDDEN';end if;
  if p_before is not null then select created_at,id into cursor_at,cursor_id from school_chat_messages where school_id=p_school and class_id=p_class and id=p_before;if cursor_at is null then raise exception 'SCHOOL_CURSOR';end if;end if;
  select coalesce(jsonb_agg(case when school_record_visible(p_school,'chatMessages',payload,created_at)then payload else payload||jsonb_build_object('body','','deletedAt',now(),'deletedBy','retention')end order by created_at,id),'[]') into result from(select payload,created_at,id from school_chat_messages where school_id=p_school and class_id=p_class and (p_before is null or (created_at,id)<(cursor_at,cursor_id)) order by created_at desc,id desc limit 100)x;
 elsif p_kind='audit' then
  if role_name<>'owner' then raise exception 'SCHOOL_FORBIDDEN';end if;
  if p_before is not null then select created_at,id into cursor_at,cursor_id from school_audit where school_id=p_school and id=p_before;if cursor_at is null then raise exception 'SCHOOL_CURSOR';end if;end if;
  select coalesce(jsonb_agg(payload order by created_at,id),'[]') into result from(select payload,created_at,id from school_audit where school_id=p_school and school_record_visible(p_school,'audit',payload,created_at)and (p_before is null or (created_at,id)<(cursor_at,cursor_id)) order by created_at desc,id desc limit 100)x;
 else raise exception 'SCHOOL_INVALID_ACTION';end if;
 return result;
end;$$;
create index if not exists school_chat_author_idx on public.school_chat_messages(school_id,actor_id,created_at,id);
create index if not exists school_audit_actor_idx on public.school_audit(school_id,actor_id);
create index if not exists school_letters_author_idx on public.school_letters(school_id,actor_id);
-- Indexed batch retention: durable object cleanup queue is committed BEFORE storage deletion.
create or replace function public.school_repository_retention(p_school text,p_actor jsonb)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare uid text:=p_actor->>'id';r text;d record;paths jsonb;days int;begin
 select payload->>'role' into r from school_members where school_id=p_school and id=uid and (payload->>'active')::boolean for share;
 if r not in('owner','office') or r is null then raise exception 'SCHOOL_FORBIDDEN';end if;
 for d in select * from school_documents where school_id=p_school and payload->>'expiresAt'<=to_char(now() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') and coalesce((payload->>'legalHold')::boolean,false)=false order by payload->>'expiresAt',id limit 100 for update skip locked loop
  insert into school_cleanup(school_id,id,payload)values(p_school,d.id,jsonb_build_object('path',d.payload->>'storagePath','studentId',d.student_id,'reason','retention'))on conflict do nothing;
  delete from school_documents where school_id=p_school and id=d.id;
 end loop;
 select (payload->>'chatRetentionDays')::int into days from school_settings where school_id=p_school and id='settings';
 if days is not null then
  with expired as(select id from school_chat_messages where school_id=p_school and created_at<now()-make_interval(days=>days) and not(payload ? 'deletedAt') order by created_at,id limit 500 for update skip locked)
  update school_chat_messages m set payload=m.payload||jsonb_build_object('body','','deletedAt',now(),'deletedBy','retention'),revision=nextval('school_event_sequence') from expired e where m.school_id=p_school and m.id=e.id;
 end if;
 insert into school_audit(school_id,id,payload)values(p_school,gen_random_uuid()::text,jsonb_build_object('id',gen_random_uuid(),'actorId',uid,'action','retention.run','target','batch','at',now()));
 select coalesce(jsonb_agg(payload->>'path'),'[]')into paths from(select payload from school_cleanup where school_id=p_school order by created_at,id limit 100)x;
 return paths;
end;$$;
create or replace function public.school_cleanup_ack(p_school text,p_paths jsonb)
returns void language sql security invoker set search_path=public as $$delete from school_cleanup where school_id=p_school and payload->>'path' in(select jsonb_array_elements_text(p_paths))$$;
create or replace function public.school_privacy_prepare(p_school text,p_actor jsonb)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare uid text:=p_actor->>'id';m jsonb;reason text;begin
 perform 1 from school_members where school_id=p_school and payload->>'role'='owner' order by id for update;
 select payload into m from school_members where school_id=p_school and id=uid for update;
 if m is null and not exists(select 1 from school_documents where school_id=p_school and student_id=uid)and not exists(select 1 from school_progress where school_id=p_school and student_id=uid)and not exists(select 1 from school_chat_messages where school_id=p_school and actor_id=uid)then return jsonb_build_object('blocked',false,'empty',true);end if;
 if coalesce((p_actor->>'verified')::boolean,false)=false then raise exception 'SCHOOL_UNAUTHENTICATED';end if;
 if m->>'role'='owner' and not exists(select 1 from school_members where school_id=p_school and id<>uid and payload->>'role'='owner' and (payload->>'active')::boolean)then reason:='Transfer ownership before deleting the last school owner.';end if;
 if exists(select 1 from school_documents where school_id=p_school and student_id=uid and coalesce((payload->>'legalHold')::boolean,false))then reason:='School records have an explicit legal hold. Contact the privacy office for review.';end if;
 insert into school_deletion_requests(school_id,id,payload)values(p_school,uid,jsonb_build_object('userId',uid,'requestedAt',now(),'status',case when reason is null then 'cleanup_pending' else 'pending_review' end,'reason',coalesce(reason,'Private file removal pending')))on conflict(school_id,id)do update set payload=excluded.payload,revision=nextval('school_event_sequence');
 if reason is not null then return jsonb_build_object('blocked',true,'reason',reason);end if;
 update school_members set payload=jsonb_set(payload,'{active}','false'),revision=nextval('school_event_sequence')where school_id=p_school and id=uid;
 insert into school_cleanup(school_id,id,payload)select p_school,id,jsonb_build_object('studentId',uid,'path',payload->>'storagePath','reason','deletion')from school_documents where school_id=p_school and student_id=uid on conflict(school_id,id)do nothing;
 return jsonb_build_object('blocked',false,'empty',false);
end;$$;
create or replace function public.school_privacy_cleanup_batch(p_school text,p_uid text)
returns jsonb language sql security invoker set search_path=public as $$select coalesce(jsonb_agg(payload->>'path'),'[]')from(select payload from school_cleanup where school_id=p_school and student_id=p_uid order by created_at,id limit 100)x$$;
create or replace function public.school_privacy_finalize(p_school text,p_actor jsonb)
returns void language plpgsql security invoker set search_path=public as $$
declare uid text:=p_actor->>'id'; pseudonym text:='deleted-'||gen_random_uuid()::text;email text;begin
 perform 1 from school_members where school_id=p_school and id=uid for update;
 if exists(select 1 from school_cleanup where school_id=p_school and student_id=uid)then raise exception 'SCHOOL_CLEANUP_PENDING';end if;
 if not exists(select 1 from school_deletion_requests where school_id=p_school and id=uid and payload->>'status'='cleanup_pending')then raise exception 'SCHOOL_DELETION_NOT_PREPARED';end if;
 select payload->>'email' into email from school_members where school_id=p_school and id=uid;
 -- Membership removal prevents all future class access. Rewrite only classes assigned to this user.
 update school_classes c set payload=jsonb_set(jsonb_set(payload,'{studentIds}',coalesce((select jsonb_agg(value)from jsonb_array_elements_text(c.payload->'studentIds')where value<>uid),'[]')),'{teacherIds}',coalesce((select jsonb_agg(value)from jsonb_array_elements_text(c.payload->'teacherIds')where value<>uid),'[]')),revision=nextval('school_event_sequence')where school_id=p_school and exists(select 1 from school_assignments a where a.school_id=p_school and a.class_id=c.id and a.user_id=uid);
 delete from school_assignments where school_id=p_school and user_id=uid;
 delete from school_documents where school_id=p_school and student_id=uid;
 delete from school_absences where school_id=p_school and student_id=uid;
 delete from school_attendance where school_id=p_school and student_id=uid;
 update school_attendance set payload=jsonb_set(payload,'{updatedBy}',to_jsonb(pseudonym)),revision=nextval('school_event_sequence')where school_id=p_school and payload->>'updatedBy'=uid;
 delete from school_document_requests where school_id=p_school and student_id=uid;
 update school_document_requests set payload=jsonb_set(payload,'{createdBy}',to_jsonb(pseudonym)),revision=nextval('school_event_sequence')where school_id=p_school and actor_id=uid;
 delete from school_progress where school_id=p_school and student_id=uid;
 delete from school_outbox where school_id=p_school and student_id=uid;
 delete from school_devices where school_id=p_school and student_id=uid;
 delete from school_notifications where school_id=p_school and student_id=uid;
 delete from school_chat_reads where school_id=p_school and student_id=uid;
 update school_chat_messages set payload=(payload-'clientMessageId')||jsonb_build_object('authorId',pseudonym,'authorName','Deleted member','body','','deletedAt',now(),'deletedBy','privacy'),revision=nextval('school_event_sequence')where school_id=p_school and actor_id=uid;
 update school_chat_messages set payload=jsonb_set(payload,'{deletedBy}',to_jsonb(pseudonym)),revision=nextval('school_event_sequence')where school_id=p_school and payload->>'deletedBy'=uid;
 update school_letters l set payload=jsonb_set(payload,'{studentIds}',coalesce((select jsonb_agg(value)from jsonb_array_elements_text(l.payload->'studentIds')where value<>uid),'[]')),revision=nextval('school_event_sequence')where school_id=p_school and exists(select 1 from school_letter_recipients x where x.school_id=p_school and x.student_id=uid and x.payload->>'letterId'=l.id);
 update school_letters set payload=jsonb_set(payload,'{createdBy}',to_jsonb(pseudonym)),revision=nextval('school_event_sequence')where school_id=p_school and actor_id=uid;
 delete from school_letter_recipients where school_id=p_school and student_id=uid;
 update school_audit set payload=payload||jsonb_build_object('actorId',case when actor_id=uid then pseudonym else payload->>'actorId'end,'target',case when (position(uid in(payload->>'target'))>0 or lower(payload->>'target')=lower(email))then 'redacted'else payload->>'target'end),revision=nextval('school_event_sequence')where school_id=p_school and (actor_id=uid or (position(uid in(payload->>'target'))>0 or lower(payload->>'target')=lower(email)));
 delete from school_invites where school_id=p_school and payload->>'email'=lower(email);
 delete from school_deletion_requests where school_id=p_school and id=uid;
 delete from school_members where school_id=p_school and id=uid;
end;$$;
create or replace function public.school_push_authorized(p_school text,p_id text)
returns boolean language sql stable security invoker set search_path=public as $$select exists(select 1 from school_outbox o join school_notifications n on n.school_id=o.school_id and n.id=o.payload->>'notificationId' join school_devices d on d.school_id=o.school_id and d.payload->>'token'=o.payload->>'token' join school_members m on m.school_id=d.school_id and m.id=d.student_id where o.school_id=p_school and o.id=p_id and n.student_id=d.student_id and n.payload->>'readAt' is null and o.student_id=d.student_id and(m.payload->>'active')::boolean)$$;
create or replace function public.school_push_claim(p_school text)
returns jsonb language plpgsql security invoker set search_path=public as $$declare result jsonb;begin
 update school_outbox set payload=payload||jsonb_build_object('status','unknown','updatedAt',now()),revision=nextval('school_event_sequence')where school_id=p_school and payload->>'status'='sending' and (payload->>'updatedAt')::timestamptz<now()-interval '60 seconds';
 with candidates as(select id from school_outbox where school_id=p_school and payload->>'status'='pending' order by created_at,id limit 50 for update skip locked),claimed as(update school_outbox o set payload=o.payload||jsonb_build_object('status',case when school_push_authorized(p_school,o.id)then 'sending'else 'failed'end,'lease',gen_random_uuid(),'updatedAt',now(),'attempts',coalesce((o.payload->>'attempts')::int,0)+1),revision=nextval('school_event_sequence')from candidates c where o.school_id=p_school and o.id=c.id returning o.payload)select coalesce(jsonb_agg(payload),'[]')into result from claimed where payload->>'status'='sending';return result;
end;$$;
create or replace function public.school_push_finish(p_school text,p_id text,p_lease text,p_result jsonb)
returns void language sql security invoker set search_path=public as $$update school_outbox set payload=payload||p_result||jsonb_build_object('updatedAt',now()),revision=nextval('school_event_sequence')where school_id=p_school and id=p_id and payload->>'lease'=p_lease and payload->>'status'='sending'$$;
create or replace function public.school_push_receipts(p_school text)
returns jsonb language sql security invoker set search_path=public as $$select coalesce(jsonb_agg(payload),'[]')from(select payload from school_outbox where school_id=p_school and payload->>'status'='ticket' and school_push_authorized(p_school,id)order by created_at,id limit 100)x$$;
create or replace function public.school_push_receipt_apply(p_school text,p_id text,p_status text)
returns void language plpgsql security invoker set search_path=public as $$begin if p_status not in('delivered','failed')then raise exception 'SCHOOL_INVALID_STATUS';end if;update school_outbox set payload=payload||jsonb_build_object('status',p_status,'updatedAt',now()),revision=nextval('school_event_sequence')where school_id=p_school and id=p_id and payload->>'status'='ticket';end;$$;
-- Direct access remains unavailable even in projects with unrelated permissive storage policies.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)values('school-private','school-private',false,10485760,array['application/pdf','image/jpeg','image/png'])on conflict(id)do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists school_private_deny_direct on storage.objects;
create policy school_private_deny_direct on storage.objects as restrictive for all to anon,authenticated using(bucket_id<>'school-private')with check(bucket_id<>'school-private');
-- No automatic import of an old aggregate: never silently drop or copy existing personal data.
-- If a pilot aggregate was activated elsewhere, stop writes, export encrypted backup, run the
-- guarded scripts/school-import-aggregate.ts manually, verify counts/permissions, then retire it.
create or replace function public.school_repository_export(p_school text,p_actor jsonb,p_before text default null)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare uid text:=p_actor->>'id';k text;tbl text;cond text;cursor jsonb:=coalesce(p_before,'{}')::jsonb;last_kind text:=cursor->>'kind';last_id text:=cursor->>'id';collect boolean:=last_kind is null; row_data record;result jsonb:='[]';next_cursor text;begin
 if coalesce((p_actor->>'verified')::boolean,false)=false or not exists(select 1 from school_members where school_id=p_school and id=uid)then raise exception 'SCHOOL_NOT_MEMBER';end if;
 for k,tbl in select*from(values('members','members'),('attendance','attendance'),('absences','absences'),('documents','documents'),('documentRequests','document_requests'),('letters','letters'),('chatMessages','chat_messages'),('notifications','notifications'),('progress','progress'),('devices','devices'),('deletionRequests','deletion_requests'))t(k,tbl)loop
  if k=last_kind then collect:=true;end if;if not collect then continue;end if;
  cond:=case when k='members'then format('id=%L',uid)when k='chatMessages'then format('actor_id=%L',uid)when k='letters'then format('exists(select 1 from school_letter_recipients x where x.school_id=%L and x.student_id=%L and x.payload->>''letterId''=school_letters.id)',p_school,uid)else format('student_id=%L',uid)end;
  for row_data in execute format('select id,payload from school_%I where school_id=$1 and(%s)and($2 is null or id>$2)order by id limit 1001',tbl,cond)using p_school,case when k=last_kind then last_id else null end loop
   if jsonb_array_length(result)>=1000 then return jsonb_build_object('records',result,'nextCursor',next_cursor);end if;
   if k='documents'then row_data.payload:=row_data.payload-'storagePath'-'sha256';end if;
   if k='letters'then row_data.payload:=school_letter_payload(p_school,row_data.id,row_data.payload);row_data.payload:=row_data.payload||jsonb_build_object('studentIds',jsonb_build_array(uid),'readBy',jsonb_build_object(uid,row_data.payload->'readBy'->uid),'acknowledgements',jsonb_build_object(uid,row_data.payload->'acknowledgements'->uid),'returnedDocuments',jsonb_build_object(uid,row_data.payload->'returnedDocuments'->uid));end if;
   result:=result||jsonb_build_array(jsonb_build_object('kind',k,'payload',row_data.payload));next_cursor:=jsonb_build_object('kind',k,'id',row_data.id)::text;
  end loop;
 end loop;return jsonb_build_object('records',result,'nextCursor',null);
end;$$;

-- Only the authenticated server service role can execute repository entry points.
do $$declare f record;begin for f in select p.oid::regprocedure signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and(p.proname like 'school_repository_%' or p.proname like 'school_privacy_%' or p.proname like 'school_push_%' or p.proname in('school_has_class','school_can_student','school_cleanup_ack'))loop execute 'revoke all on function '||f.signature||' from public,anon,authenticated';execute 'grant execute on function '||f.signature||' to service_role';end loop;end;$$;

create index if not exists school_attendance_export_idx on public.school_attendance(school_id,student_id,id);
create index if not exists school_absences_export_idx on public.school_absences(school_id,student_id,id);
create index if not exists school_documents_export_idx on public.school_documents(school_id,student_id,id);
create index if not exists school_document_requests_export_idx on public.school_document_requests(school_id,student_id,id);
create index if not exists school_notifications_export_idx on public.school_notifications(school_id,student_id,id);
create index if not exists school_progress_export_idx on public.school_progress(school_id,student_id,id);
create index if not exists school_devices_export_idx on public.school_devices(school_id,student_id,id);
create index if not exists school_deletion_requests_export_idx on public.school_deletion_requests(school_id,student_id,id);
create index if not exists school_chat_export_idx on public.school_chat_messages(school_id,actor_id,id);
create or replace function public.school_reminders(p_school text)
returns integer language plpgsql security invoker set search_path=public as $$declare pending record;nid text;n jsonb;inserted text;total int:=0;begin
 for pending in select*from(
  select 'request' kind,r.id,r.student_id from school_document_requests r where r.school_id=p_school and not(r.payload ? 'fulfilledBy')and r.payload->>'dueDate' between(current_date-30)::text and(current_date+2)::text
  union all
  select 'letter',l.id,recipient.student_id from school_letters l join school_letter_recipients recipient on recipient.school_id=l.school_id and recipient.payload->>'letterId'=l.id where l.school_id=p_school and recipient.payload->>'acknowledgedAt'is null and recipient.payload->>'returnedDocumentId'is null and l.payload->>'dueDate' between(current_date-30)::text and(current_date+2)::text
 )candidate where not exists(select 1 from school_notifications n where n.school_id=p_school and n.id='reminder:'||candidate.kind||':'||candidate.id||':'||candidate.student_id||':'||current_date::text)limit 500
 loop
  if not exists(select 1 from school_members where school_id=p_school and id=pending.student_id and(payload->>'active')::boolean)then continue;end if;
  nid:='reminder:'||pending.kind||':'||pending.id||':'||pending.student_id||':'||current_date::text;n:=jsonb_build_object('id',nid,'userId',pending.student_id,'title','School deadline reminder','body','Open your secure school dashboard for details.','createdAt',now(),'readAt',null,'delivery','in_app');
  insert into school_notifications(school_id,id,payload)values(p_school,nid,n)on conflict do nothing returning id into inserted;
  if inserted is not null then
   total:=total+1;
   insert into school_outbox(school_id,id,payload)select p_school,nid||':'||d.id,jsonb_build_object('id',nid||':'||d.id,'notificationId',nid,'userId',pending.student_id,'token',d.payload->>'token','status','pending','attempts',0,'updatedAt',now())from school_devices d where d.school_id=p_school and d.student_id=pending.student_id on conflict do nothing;
  end if;
 end loop;return total;
end;$$;
revoke all on function public.school_reminders(text)from public,anon,authenticated;
grant execute on function public.school_reminders(text)to service_role;
-- Deadline indexes for bounded reminder candidates.
create index if not exists school_request_due_idx on public.school_document_requests(school_id,((payload->>'dueDate')),id)where not(payload ? 'fulfilledBy');
create index if not exists school_letter_due_idx on public.school_letters(school_id,((payload->>'dueDate')),id);
create or replace function public.school_repository_page(p_school text,p_actor jsonb,p_section text,p_before text default null)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare uid text:=p_actor->>'id';r text;tbl text;cond text;cursor_at timestamptz;rows jsonb;count_rows int;begin
 select payload->>'role'into r from school_members where school_id=p_school and id=uid and(payload->>'active')::boolean;
 if r is null or coalesce((p_actor->>'verified')::boolean,false)=false then raise exception 'SCHOOL_NOT_MEMBER';end if;
 tbl:=case p_section when 'documentRequests'then'document_requests'when'absenceSummaries'then'absences'else p_section end;
 case p_section
 when'members'then cond:=case when r in('owner','office')then'true'else format('id=%L or exists(select 1 from school_assignments a join school_assignments b on b.school_id=a.school_id and b.class_id=a.class_id where a.school_id=%L and a.user_id=%L and b.user_id=school_members.id)',uid,p_school,uid)end;
 when'classes'then cond:=case when r in('owner','office')then'true'else format('school_has_class(%L,%L,id)',p_school,uid)end;
 when'attendance'then cond:=case when r in('owner','office')then'true'when r='teacher'then format('school_has_class(%L,%L,class_id)',p_school,uid)else format('student_id=%L',uid)end;
 when'absenceSummaries'then cond:=case when r='teacher'then format('school_can_student(%L,%L,student_id)',p_school,uid)else'false'end;
 when'absences','documents','documentRequests'then cond:=case when r in('owner','office')then'true'else format('student_id=%L',uid)end;
 when'letters'then cond:=case when r in('owner','office')then'true'else format('actor_id=%L or exists(select 1 from school_letter_recipients x where x.school_id=%L and x.student_id=%L and x.payload->>''letterId''=school_letters.id)',uid,p_school,uid)end;
 when'notifications'then cond:=format('student_id=%L',uid);
 when'progress'then cond:=case when r in('owner','office')then'true'else format('school_can_student(%L,%L,student_id)',p_school,uid)end;
 else raise exception 'SCHOOL_INVALID_SECTION';end case;
 if p_section in('attendance','absences','absenceSummaries','letters','notifications','progress')then cond:='('||cond||')and school_record_visible('||quote_literal(p_school)||','||quote_literal(case when p_section='absenceSummaries'then'absences'else p_section end)||',payload,created_at)';end if;
 if p_before is not null then execute format('select created_at from school_%I where school_id=$1 and id=$2 and(%s)',tbl,cond)into cursor_at using p_school,p_before;if cursor_at is null then raise exception 'SCHOOL_CURSOR';end if;end if;
 execute format('select coalesce(jsonb_agg(to_jsonb(x)order by created_at desc,id desc),''[]'')from(select id,payload,created_at from school_%I where school_id=$1 and(%s)and($2 is null or(created_at,id)<($3,$2))order by created_at desc,id desc limit 101)x',tbl,cond)into rows using p_school,p_before,cursor_at;
 if p_section='letters'then select coalesce(jsonb_agg(value||jsonb_build_object('payload',school_letter_payload(p_school,value->>'id',value->'payload'))),'[]')into rows from jsonb_array_elements(rows);end if;
 count_rows:=jsonb_array_length(rows);if count_rows>100 then rows:=rows-100;end if;
 return jsonb_build_object('items',(select coalesce(jsonb_agg(value->'payload'),'[]')from jsonb_array_elements(rows)),'nextCursor',case when count_rows>100 then rows->99->>'id'else null end);
end;$$;
revoke all on function public.school_repository_page(text,jsonb,text,text)from public,anon,authenticated;
grant execute on function public.school_repository_page(text,jsonb,text,text)to service_role;
create index if not exists school_members_recent_idx on public.school_members(school_id,created_at desc,id desc);
create index if not exists school_classes_recent_idx on public.school_classes(school_id,created_at desc,id desc);
create index if not exists school_attendance_recent_idx on public.school_attendance(school_id,created_at desc,id desc);
create index if not exists school_absences_recent_idx on public.school_absences(school_id,created_at desc,id desc);
create index if not exists school_documents_recent_idx on public.school_documents(school_id,created_at desc,id desc);
create index if not exists school_document_requests_recent_idx on public.school_document_requests(school_id,created_at desc,id desc);
create index if not exists school_letters_recent_idx on public.school_letters(school_id,created_at desc,id desc);
create index if not exists school_notifications_recent_idx on public.school_notifications(school_id,created_at desc,id desc);
create index if not exists school_progress_recent_idx on public.school_progress(school_id,created_at desc,id desc);
create index if not exists school_chat_reads_recent_idx on public.school_chat_reads(school_id,created_at desc,id desc);
create index if not exists school_deletion_requests_recent_idx on public.school_deletion_requests(school_id,created_at desc,id desc);
create index if not exists school_cleanup_recent_idx on public.school_cleanup(school_id,created_at desc,id desc);

create index if not exists school_attendance_date_idx on school_attendance(school_id,student_id,((payload->>'date')));
-- Explicit one-time offline migration helper. Never invoked by application routes.
create or replace function public.school_import_aggregate(p_school text,p_state jsonb,p_confirmation text)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare pair record;v jsonb;rid text;counts jsonb:='{}';inserted int;begin
 if p_confirmation<>'IMPORT SCHOOL BACKUP' or p_state->>'schoolId' is distinct from p_school or jsonb_typeof(p_state->'members')is distinct from'array'then raise exception 'SCHOOL_IMPORT_GUARD';end if;
 perform pg_advisory_xact_lock(hashtextextended('bootstrap:'||p_school,0));
 if exists(select 1 from school_orgs where id=p_school)then raise exception 'SCHOOL_IMPORT_TARGET_NOT_EMPTY';end if;
 insert into school_orgs(id)values(p_school);
 insert into school_settings(school_id,id,payload)values(p_school,'settings',p_state->'settings'||jsonb_build_object('sensitiveUploadsEnabled',false));
 for pair in select*from(values('members','members'),('classes','classes'),('attendance','attendance'),('absences','absences'),('documents','documents'),('documentRequests','document_requests'),('letters','letters'),('chatMessages','chat_messages'),('chatReads','chat_reads'),('notifications','notifications'),('progress','progress'),('audit','audit'),('invites','invites'),('devices','devices'),('deletionRequests','deletion_requests'))t(kind,tbl)loop
  inserted:=0;
  for v in select value from jsonb_array_elements(coalesce(p_state->pair.kind,'[]'))loop
   rid:=case pair.kind when'invites'then v->>'hash'when'chatReads'then(v->>'classId')||':'||(v->>'userId')when'devices'then encode(digest(v->>'token','sha256'),'hex')when'deletionRequests'then v->>'userId'else v->>'id'end;
   if rid is null or jsonb_typeof(v)<>'object'then raise exception 'SCHOOL_IMPORT_INVALID_RECORD';end if;
   execute format('insert into school_%I(school_id,id,payload,created_at)values($1,$2,$3,$4)',pair.tbl)using p_school,rid,v,coalesce((v->>'createdAt')::timestamptz,(v->>'at')::timestamptz,now());inserted:=inserted+1;
  end loop;counts:=counts||jsonb_build_object(pair.kind,inserted);
 end loop;
 insert into school_assignments(school_id,class_id,user_id,role)select p_school,c.id,j.value,'teacher'from school_classes c cross join lateral jsonb_array_elements_text(c.payload->'teacherIds')j where c.school_id=p_school;
 insert into school_assignments(school_id,class_id,user_id,role)select p_school,c.id,j.value,'student'from school_classes c cross join lateral jsonb_array_elements_text(c.payload->'studentIds')j where c.school_id=p_school;
 insert into school_letter_recipients(school_id,id,payload)select p_school,l.id||':'||j.value,jsonb_strip_nulls(jsonb_build_object('letterId',l.id,'studentId',j.value,'readAt',l.payload->'readBy'->j.value,'acknowledgedAt',l.payload->'acknowledgements'->j.value,'returnedDocumentId',l.payload->'returnedDocuments'->j.value))from school_letters l cross join lateral jsonb_array_elements_text(l.payload->'studentIds')j where l.school_id=p_school;
 insert into school_cleanup(school_id,id,payload)select p_school,encode(digest(value,'sha256'),'hex'),jsonb_build_object('path',value,'reason','imported-cleanup')from jsonb_array_elements_text(coalesce(p_state->'cleanupPaths','[]'));
 update school_letters set payload=payload-'readBy'-'acknowledgements'-'returnedDocuments'where school_id=p_school;
 for pair in select*from(values('attendance','date'),('absences','to'),('letters','dueDate'),('progress','updatedAt'),('notifications','createdAt'),('audit','at'))t(tbl,field)loop execute format('update school_%I set retention_at=coalesce((payload->>%L)::timestamptz,created_at)where school_id=$1',pair.tbl,pair.field)using p_school;end loop;
 -- Historical push attempts intentionally not replayed. In-app notifications remain in history.
 return counts;
end;$$;
revoke all on function public.school_import_aggregate(text,jsonb,text)from public,anon,authenticated;
grant execute on function public.school_import_aggregate(text,jsonb,text)to service_role;

create index if not exists school_absence_range_idx on school_absences(school_id,student_id,((payload->>'status')),((payload->>'from')),((payload->>'to')));
-- Generic, idempotent unread notification. Private content never copied into push payloads.
create or replace function public.school_notify_generic(p_school text,p_uid text,p_title text,p_key text)
returns void language plpgsql security invoker set search_path=public as $$declare prior jsonb;n jsonb;event_id text:=gen_random_uuid()::text;begin
 perform 1 from school_members where school_id=p_school and id=p_uid and(payload->>'active')::boolean for share;if not found then return;end if;
 select payload into prior from school_notifications where school_id=p_school and id=p_key for update;if prior is not null and prior->>'readAt'is null then return;end if;
 n:=jsonb_build_object('id',p_key,'userId',p_uid,'title',p_title,'body','Open your secure school dashboard for details.','createdAt',now(),'readAt',null,'delivery','in_app');
 insert into school_notifications(school_id,id,payload)values(p_school,p_key,n)on conflict(school_id,id)do update set payload=excluded.payload,retention_at=now(),revision=nextval('school_event_sequence');
 insert into school_outbox(school_id,id,payload)select p_school,event_id||':'||d.id,jsonb_build_object('id',event_id||':'||d.id,'notificationId',p_key,'userId',p_uid,'token',d.payload->>'token','status','pending','attempts',0,'updatedAt',now())from school_devices d where d.school_id=p_school and d.student_id=p_uid on conflict do nothing;
end;$$;
revoke all on function public.school_notify_generic(text,text,text,text)from public,anon,authenticated;
grant execute on function public.school_notify_generic(text,text,text,text)to service_role;
create index if not exists school_letter_members_idx on school_letter_recipients(school_id,((payload->>'letterId')),student_id);
create or replace function public.school_letter_payload(p_school text,p_id text,p_body jsonb)
returns jsonb language sql stable security invoker set search_path=public as $$select p_body||jsonb_build_object('readBy',coalesce(jsonb_object_agg(student_id,payload->'readAt')filter(where payload->>'readAt'is not null),'{}'),'acknowledgements',coalesce(jsonb_object_agg(student_id,payload->'acknowledgedAt')filter(where payload->>'acknowledgedAt'is not null),'{}'),'returnedDocuments',coalesce(jsonb_object_agg(student_id,payload->'returnedDocumentId')filter(where payload->>'returnedDocumentId'is not null),'{}'))from school_letter_recipients where school_id=p_school and payload->>'letterId'=p_id$$;
revoke all on function public.school_letter_payload(text,text,jsonb)from public,anon,authenticated;
grant execute on function public.school_letter_payload(text,text,jsonb)to service_role;
-- Operator-defined periods only. No period is inferred from a general German-law claim.
create or replace function public.school_record_visible(p_school text,p_kind text,p_payload jsonb,p_created timestamptz)
returns boolean language plpgsql stable security invoker set search_path=public as $$declare days int;anchor_at timestamptz;begin
 if p_kind='chatMessages'then select(payload->>'chatRetentionDays')::int into days from school_settings where school_id=p_school and id='settings';else
 select(payload->'recordRetentionDays'->>p_kind)::int into days from school_settings where school_id=p_school and id='settings';end if;if days is null then return true;end if;
 anchor_at:=case p_kind when'absences'then(p_payload->>'to')::date::timestamptz when'attendance'then(p_payload->>'date')::date::timestamptz when'letters'then(p_payload->>'dueDate')::date::timestamptz when'progress'then coalesce((p_payload->>'updatedAt')::timestamptz,p_created)else p_created end;
 if anchor_at+make_interval(days=>days)>now()then return true;end if;
 if p_kind='absences'and exists(select 1 from school_documents where school_id=p_school and payload->>'absenceId'=p_payload->>'id'and coalesce((payload->>'legalHold')::boolean,false))then return true;end if;
 if p_kind='letters'and exists(select 1 from school_documents where school_id=p_school and payload->>'letterId'=p_payload->>'id'and coalesce((payload->>'legalHold')::boolean,false))then return true;end if;
 if p_kind='attendance'and p_payload ? 'excusedByAbsenceId'and exists(select 1 from school_documents where school_id=p_school and payload->>'absenceId'=p_payload->>'excusedByAbsenceId'and coalesce((payload->>'legalHold')::boolean,false))then return true;end if;
 return false;
end;$$;
create or replace function public.school_record_linked_file(p_school text,p_kind text,p_payload jsonb)
returns boolean language sql stable security invoker set search_path=public as $$select exists(select 1 from school_documents where school_id=p_school and(coalesce((payload->>'legalHold')::boolean,false)or(payload->>'expiresAt')::timestamptz>now())and((p_kind='absences'and payload->>'absenceId'=p_payload->>'id')or(p_kind='letters'and payload->>'letterId'=p_payload->>'id')or(p_kind='attendance'and payload->>'absenceId'=p_payload->>'excusedByAbsenceId')))$$;
create index if not exists school_document_absence_link_idx on school_documents(school_id,((payload->>'absenceId')));
create index if not exists school_document_letter_link_idx on school_documents(school_id,((payload->>'letterId')));
create or replace function public.school_repository_record_retention(p_school text,p_actor jsonb,p_dry_run boolean default true)
returns jsonb language plpgsql security invoker set search_path=public as $$declare r text;k text;rows_found record;totals jsonb:='{}';n int;policies jsonb;days int;begin
 select payload->>'role'into r from school_members where school_id=p_school and id=p_actor->>'id'and(payload->>'active')::boolean for share;if r not in('owner','office')or r is null or coalesce((p_actor->>'verified')::boolean,false)=false then raise exception 'SCHOOL_FORBIDDEN';end if;
 select payload->'recordRetentionDays'into policies from school_settings where school_id=p_school and id='settings'for share;
 for k in select unnest(array['attendance','absences','letters','notifications','progress','audit'])loop
  n:=0;days:=(policies->>k)::int;if days is null then totals:=totals||jsonb_build_object(k,0);continue;end if;
  for rows_found in execute format('select id,payload from school_%I where school_id=$1 and retention_at<=now()-make_interval(days=>$3)and not school_record_linked_file($1,$2,payload)order by retention_at,id limit 100 for update skip locked',k)using p_school,k,days loop
   n:=n+1;if not p_dry_run then
    if k='letters'then delete from school_letter_recipients where school_id=p_school and payload->>'letterId'=rows_found.id;end if;
    if k='notifications'then delete from school_outbox where school_id=p_school and payload->>'notificationId'=rows_found.id;end if;
    execute format('delete from school_%I where school_id=$1 and id=$2',k)using p_school,rows_found.id;
   end if;
  end loop;totals:=totals||jsonb_build_object(k,n);
 end loop;
 return jsonb_build_object('dryRun',p_dry_run,'eligibleBatch',totals,'batchLimitPerType',100,'note','Counts are this bounded batch, not a total. Linked retained files and explicit holds are preserved.');
end;$$;
do $$declare f record;begin for f in select p.oid::regprocedure signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'and p.proname in('school_record_visible','school_record_linked_file','school_repository_record_retention')loop execute 'revoke all on function '||f.signature||' from public,anon,authenticated';execute 'grant execute on function '||f.signature||' to service_role';end loop;end;$$;

create index if not exists school_absence_end_idx on school_absences(school_id,((payload->>'to')),id);

create index if not exists school_attendance_retention_idx on school_attendance(school_id,retention_at,id);

create index if not exists school_absences_retention_idx on school_absences(school_id,retention_at,id);

create index if not exists school_letters_retention_idx on school_letters(school_id,retention_at,id);

create index if not exists school_notifications_retention_idx on school_notifications(school_id,retention_at,id);

create index if not exists school_progress_retention_idx on school_progress(school_id,retention_at,id);

create index if not exists school_audit_retention_idx on school_audit(school_id,retention_at,id);
