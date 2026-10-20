create role anon;
create role authenticated;
create role service_role bypassrls;
create schema storage;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id text primary key,bucket_id text not null);
alter table storage.objects enable row level security;
grant usage on schema storage,public to anon,authenticated,service_role;
grant all on storage.objects,storage.buckets to service_role;
grant select,insert on storage.objects to anon,authenticated;
-- Deliberately broad legacy policy: migration's restrictive guard must still block school files.
create policy broad_legacy_policy on storage.objects for all to anon,authenticated using(true) with check(true);
insert into storage.objects values('private-object','school-private'),('public-object','other-bucket');
