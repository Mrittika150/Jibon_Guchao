-- Jibon Guchao: skills, courses and deadlines (Phase 9)

-- 1. Skills you practise, each with an optional weekly goal (your study plan)
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 60),
  weekly_goal_minutes integer check (weekly_goal_minutes is null or weekly_goal_minutes between 1 and 10080),
  created_at timestamptz not null default now(),
  unique (user_id, name),
  unique (id, user_id)
);

-- 2. Practice sessions: several per day are fine
create table public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  skill_id uuid not null,
  log_date date not null,
  minutes integer not null check (minutes between 1 and 1440),
  note text check (note is null or length(note) <= 200),
  created_at timestamptz not null default now(),
  foreign key (skill_id, user_id) references public.skills (id, user_id) on delete cascade
);
create index practice_logs_user_date_idx on public.practice_logs (user_id, log_date);

-- 3. Courses, and 4. their lessons
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 100),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  course_id uuid not null,
  title text not null check (length(title) between 1 and 200),
  done boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (course_id, user_id) references public.courses (id, user_id) on delete cascade
);

-- 5. Deadlines (assignments, exams...), optionally linked to a course
create table public.deadlines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (length(title) between 1 and 200),
  due_date date not null,
  course_id uuid,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  -- if a course is chosen, it must be yours; deleting the course keeps the deadline
  foreign key (course_id, user_id) references public.courses (id, user_id) on delete set null (course_id)
);
create index deadlines_user_due_idx on public.deadlines (user_id, due_date);

alter table public.skills enable row level security;
alter table public.practice_logs enable row level security;
alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.deadlines enable row level security;

create policy "own rows only" on public.skills
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows only" on public.practice_logs
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows only" on public.courses
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows only" on public.course_lessons
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows only" on public.deadlines
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on
  public.skills, public.practice_logs, public.courses, public.course_lessons, public.deadlines
  to authenticated;
revoke all on
  public.skills, public.practice_logs, public.courses, public.course_lessons, public.deadlines
  from anon;
