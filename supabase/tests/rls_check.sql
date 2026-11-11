-- RLS check: proves user B cannot see or change user A's rows.
-- Paste into the Supabase SQL Editor, replace the two IDs, and click Run.
-- It ends with ROLLBACK, so the fake test rows are thrown away.

begin;

-- Pretend to be user A, and save a fake row
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"USER-A-ID","role":"authenticated"}', true);
insert into public.daily_logs (log_date, steps) values ('2000-01-01', 1234);
select 'A sees' as who, count(*) as rows from public.daily_logs where log_date = '2000-01-01';

-- Now pretend to be user B
select set_config('request.jwt.claims', '{"sub":"USER-B-ID","role":"authenticated"}', true);
select 'B sees' as who, count(*) as rows from public.daily_logs where log_date = '2000-01-01';
update public.daily_logs set steps = 0 where log_date = '2000-01-01';
delete from public.daily_logs where log_date = '2000-01-01';

-- Back to user A: the row should still be there, unchanged
select set_config('request.jwt.claims', '{"sub":"USER-A-ID","role":"authenticated"}', true);
select 'A still sees' as who, count(*) as rows, max(steps) as steps
  from public.daily_logs where log_date = '2000-01-01';

rollback;