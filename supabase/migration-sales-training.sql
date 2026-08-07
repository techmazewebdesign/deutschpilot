alter table public.profiles
  add column if not exists sales_team boolean not null default false;

create table if not exists public.sales_training_progress (
  firebase_uid text not null,
  user_email text not null,
  video_id text not null,
  position_seconds double precision not null default 0 check (position_seconds >= 0),
  percent integer not null default 0 check (percent between 0 and 100),
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'completed')),
  opened_at timestamptz not null default now(),
  last_viewed_at timestamptz not null default now(),
  dismissed_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (firebase_uid, video_id)
);

alter table public.sales_training_progress enable row level security;

comment on table public.sales_training_progress is
  'Server-managed watch history for authenticated DeutschPilot sales presentation videos.';
