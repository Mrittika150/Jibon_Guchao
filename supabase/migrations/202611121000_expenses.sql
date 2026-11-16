
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  spent_on date not null,
  amount_paisa bigint not null check (amount_paisa > 0 and amount_paisa <= 100000000000), -- up to 1,000,000,000 taka
  category text not null check (
    category in ('food', 'transport', 'health', 'study', 'shopping', 'bills', 'gifts', 'other')
  ),
  note text check (note is null or length(note) <= 200),
  created_at timestamptz not null default now()
);


create index expenses_user_spent_on_idx on public.expenses (user_id, spent_on);

alter table public.expenses enable row level security;

create policy "own rows only" on public.expenses
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.expenses to authenticated;
revoke all on public.expenses from anon;