-- Jibon Guchao: first tables (Phase 3)
-- Every row belongs to one user. Row-level security (RLS) makes sure
-- each signed-in user can only see and change their own rows.

-- 1. Settings: one row per user. The schedule lives here, not in code.
create table public.user_settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  work_start time not null default '09:00',
  work_end time not null default '17:00',
  days_off smallint[] not null default '{}',   -- 0 = Sunday ... 6 = Saturday
  fast_days smallint[] not null default '{}',
  step_goal integer not null default 10000 check (step_goal > 0),
  water_goal_ml integer not null default 2000 check (water_goal_ml > 0),
  created_at timestamptz not null default now()
);

-- 2. One row per day: the numbers you type in.
create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  log_date date not null,
  weight_kg numeric(5, 2) check (weight_kg > 0),
  steps integer check (steps >= 0),
  water_ml integer check (water_ml >= 0),
  walk_minutes integer check (walk_minutes >= 0),
  is_fast_day boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

-- 3. Your list of exercises.
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 100),
  default_sets integer check (default_sets > 0),
  default_minutes integer check (default_minutes > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

-- 4. One row per exercise done on a date.
create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  log_date date not null,
  exercise_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, log_date, exercise_id),
  -- the exercise must belong to the same user
  foreign key (exercise_id, user_id) references public.exercises (id, user_id) on delete cascade
);

-- 5. To-dos.
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (length(title) between 1 and 200),
  due_date date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index todos_user_due_idx on public.todos (user_id, due_date);

-- Row-level security: switch it on, then allow "only my own rows".
alter table public.user_settings enable row level security;
alter table public.daily_logs enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.todos enable row level security;

create policy "own rows only" on public.user_settings
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own rows only" on public.daily_logs
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own rows only" on public.exercises
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own rows only" on public.exercise_logs
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own rows only" on public.todos
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Signed-in users may use these tables (RLS still filters the rows).
-- Signed-out visitors (the "anon" role) get nothing.
grant select, insert, update, delete on
  public.user_settings, public.daily_logs, public.exercises, public.exercise_logs, public.todos
  to authenticated;
revoke all on
  public.user_settings, public.daily_logs, public.exercises, public.exercise_logs, public.todos
  from anon;