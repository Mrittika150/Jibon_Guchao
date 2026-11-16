-- Jibon Guchao: journal (one entry per day)
-- The most private table in the app: RLS makes sure only you can read it.

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  entry_date date not null,
  mood text check (mood is null or mood in ('great', 'good', 'okay', 'low', 'rough')),
  body text not null default '' check (length(body) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

alter table public.journal_entries enable row level security;

create policy "own rows only" on public.journal_entries
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.journal_entries to authenticated;
revoke all on public.journal_entries from anon;
