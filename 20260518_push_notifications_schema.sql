-- =============================================================================
-- Sirat Al Huda — Server-side push notifications schema
-- Adds: user_push_tokens, user_prayer_prefs, scheduled_notifications
-- Architecture: pre-scheduled queue (daily scheduler + per-minute dispatcher)
-- =============================================================================

-- =============================================================================
-- 1) user_push_tokens — APNs/FCM device tokens (a user may have many devices)
-- =============================================================================
create table if not exists public.user_push_tokens (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  device_token    text not null,
  platform        text not null check (platform in ('ios', 'android')),
  app_version     text,
  bundle_id       text,
  environment     text not null default 'production'
                    check (environment in ('production', 'sandbox')),
  last_seen_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (device_token)
);

create index if not exists idx_push_tokens_user
  on public.user_push_tokens(user_id);


-- =============================================================================
-- 2) user_prayer_prefs — location, calculation method, per-prayer toggles
-- =============================================================================
create table if not exists public.user_prayer_prefs (
  user_id          uuid primary key references auth.users(id) on delete cascade,

  -- Location & calculation
  latitude         double precision not null check (latitude between -90 and 90),
  longitude        double precision not null check (longitude between -180 and 180),
  timezone         text not null,                              -- IANA, e.g. 'America/Detroit'
  calculation_method text not null default 'Jafari',           -- adhan-lib method name
  madhab           text not null default 'shafi'
                     check (madhab in ('shafi', 'hanafi')),    -- governs Asr calc
  branch           text not null default 'shia'
                     check (branch in ('sunni', 'shia')),

  -- Per-prayer toggles
  fajr_enabled     boolean not null default true,
  dhuhr_enabled    boolean not null default true,
  asr_enabled      boolean not null default true,
  maghrib_enabled  boolean not null default true,
  isha_enabled     boolean not null default true,
  tahajjud_enabled boolean not null default false,             -- opt-in
  tahajjud_minutes_before_fajr integer not null default 60
                     check (tahajjud_minutes_before_fajr between 5 and 240),

  -- Per-prayer minute offsets (lets the user nudge times to match local masjid)
  fajr_offset_minutes    integer not null default 0,
  dhuhr_offset_minutes   integer not null default 0,
  asr_offset_minutes     integer not null default 0,
  maghrib_offset_minutes integer not null default 0,
  isha_offset_minutes    integer not null default 0,

  -- Scheduler bookkeeping
  last_scheduled_for date,                                     -- last local date queued

  updated_at       timestamptz not null default now()
);


-- =============================================================================
-- 3) scheduled_notifications — the queue
--    One row per (user, prayer, local_date). Dispatcher picks up rows where
--    send_at <= now() and sent_at is null. Unique constraint = idempotent scheduling.
-- =============================================================================
create table if not exists public.scheduled_notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  prayer_name   text not null
                  check (prayer_name in ('fajr','dhuhr','asr','maghrib','isha','tahajjud')),
  prayer_date   date not null,                                 -- user's local date
  send_at       timestamptz not null,

  sent_at       timestamptz,
  failed_at     timestamptz,
  fail_reason   text,
  attempts      integer not null default 0,

  created_at    timestamptz not null default now(),

  unique (user_id, prayer_name, prayer_date)
);

-- Partial index = tiny + fast lookup of due notifications
create index if not exists idx_scheduled_pending
  on public.scheduled_notifications(send_at)
  where sent_at is null and failed_at is null;

create index if not exists idx_scheduled_user_date
  on public.scheduled_notifications(user_id, prayer_date);


-- =============================================================================
-- 4) Row Level Security
--    Users read/write their own data. Edge Functions use the service_role key,
--    which bypasses RLS — so the dispatcher can read every row.
-- =============================================================================
alter table public.user_push_tokens         enable row level security;
alter table public.user_prayer_prefs        enable row level security;
alter table public.scheduled_notifications  enable row level security;

-- user_push_tokens ------------------------------------------------------------
drop policy if exists "push_tokens_select_own"  on public.user_push_tokens;
drop policy if exists "push_tokens_insert_own"  on public.user_push_tokens;
drop policy if exists "push_tokens_update_own"  on public.user_push_tokens;
drop policy if exists "push_tokens_delete_own"  on public.user_push_tokens;

create policy "push_tokens_select_own"
  on public.user_push_tokens for select  using (auth.uid() = user_id);
create policy "push_tokens_insert_own"
  on public.user_push_tokens for insert  with check (auth.uid() = user_id);
create policy "push_tokens_update_own"
  on public.user_push_tokens for update  using (auth.uid() = user_id);
create policy "push_tokens_delete_own"
  on public.user_push_tokens for delete  using (auth.uid() = user_id);

-- user_prayer_prefs -----------------------------------------------------------
drop policy if exists "prayer_prefs_select_own" on public.user_prayer_prefs;
drop policy if exists "prayer_prefs_insert_own" on public.user_prayer_prefs;
drop policy if exists "prayer_prefs_update_own" on public.user_prayer_prefs;

create policy "prayer_prefs_select_own"
  on public.user_prayer_prefs for select  using (auth.uid() = user_id);
create policy "prayer_prefs_insert_own"
  on public.user_prayer_prefs for insert  with check (auth.uid() = user_id);
create policy "prayer_prefs_update_own"
  on public.user_prayer_prefs for update  using (auth.uid() = user_id);

-- scheduled_notifications -----------------------------------------------------
-- Users get read-only access (audit trail). All writes go through edge fns.
drop policy if exists "scheduled_select_own" on public.scheduled_notifications;
create policy "scheduled_select_own"
  on public.scheduled_notifications for select using (auth.uid() = user_id);


-- =============================================================================
-- 5) updated_at trigger for user_prayer_prefs
-- =============================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tg_user_prayer_prefs_touch on public.user_prayer_prefs;
create trigger tg_user_prayer_prefs_touch
  before update on public.user_prayer_prefs
  for each row execute function public.touch_updated_at();


-- =============================================================================
-- 6) Maintenance: purge old sent/failed rows (call from a weekly cron)
-- =============================================================================
create or replace function public.purge_old_notifications()
returns integer
language plpgsql
security definer
as $$
declare
  n integer;
begin
  delete from public.scheduled_notifications
  where (sent_at   is not null and sent_at   < now() - interval '30 days')
     or (failed_at is not null and failed_at < now() - interval '14 days');
  get diagnostics n = row_count;
  return n;
end;
$$;


-- =============================================================================
-- 7) Helper view: due notifications (what the dispatcher will pick up)
--    Joins token + pref data so the dispatcher reads one row per send.
-- =============================================================================
create or replace view public.v_due_notifications as
select
  sn.id              as scheduled_id,
  sn.user_id,
  sn.prayer_name,
  sn.prayer_date,
  sn.send_at,
  sn.attempts,
  upt.id             as token_id,
  upt.device_token,
  upt.platform,
  upt.bundle_id,
  upt.environment,
  upp.branch,
  upp.timezone
from public.scheduled_notifications sn
join public.user_push_tokens   upt on upt.user_id = sn.user_id
left join public.user_prayer_prefs upp on upp.user_id = sn.user_id
where sn.sent_at   is null
  and sn.failed_at is null
  and sn.send_at  <= now()
  and sn.attempts <  5;

-- View inherits RLS from underlying tables — dispatcher uses service_role.
