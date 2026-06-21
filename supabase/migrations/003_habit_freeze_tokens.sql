alter table public.habits
  add column if not exists freeze_tokens integer not null default 2 check (freeze_tokens >= 0);
