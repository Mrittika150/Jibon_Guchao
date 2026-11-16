-- Journal entries are now saved as formatted text (HTML), like <p>Hello <strong>you</strong></p>.
-- The tags take extra characters, so the database limit grows.
-- The editor still stops you at 20,000 characters of actual writing.

alter table public.journal_entries drop constraint journal_entries_body_check;
alter table public.journal_entries
  add constraint journal_entries_body_check check (length(body) <= 100000);
