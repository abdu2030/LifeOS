-- Persist per-user dashboard widget layouts.

create table public.widget_layouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  layout_key text not null default 'dashboard',
  widgets jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, layout_key)
);

create index widget_layouts_user_key_idx on public.widget_layouts (user_id, layout_key);

create trigger set_widget_layouts_updated_at before update on public.widget_layouts
  for each row execute function public.set_updated_at();

alter table public.widget_layouts enable row level security;

create policy "Users manage own widget layouts" on public.widget_layouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
