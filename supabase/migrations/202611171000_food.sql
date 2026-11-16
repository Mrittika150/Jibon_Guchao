-- Jibon Guchao: food (Phase 8)
-- These tables start EMPTY. Your real meal plan and food list are typed into the app,
-- so they live only in your database (protected by RLS), never in the code.

-- 1. Your meal plan: one row per planned meal, separately for normal days and fast days.
create table public.meal_plan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day_type text not null check (day_type in ('normal', 'fast')),
  meal_time time not null,
  name text not null check (length(name) between 1 and 40),
  food text not null default '' check (length(food) <= 300),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);
create index meal_plan_user_type_idx on public.meal_plan (user_id, day_type, meal_time);

-- 2. Which planned meals you actually had, per date (tick = row exists)
create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  log_date date not null,
  meal_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, log_date, meal_id),
  -- the meal must belong to the same user
  foreign key (meal_id, user_id) references public.meal_plan (id, user_id) on delete cascade
);

-- 3. Your food list: foods you love, foods to avoid, and foods to ask your dietitian about
create table public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 60),
  status text not null check (status in ('love', 'avoid', 'ask')),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

alter table public.meal_plan enable row level security;
alter table public.meal_logs enable row level security;
alter table public.foods enable row level security;

create policy "own rows only" on public.meal_plan
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own rows only" on public.meal_logs
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own rows only" on public.foods
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.meal_plan, public.meal_logs, public.foods to authenticated;
revoke all on public.meal_plan, public.meal_logs, public.foods from anon;
