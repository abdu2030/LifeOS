create table if not exists public.goal_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goal_habit_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (goal_id, habit_id)
);

create index if not exists goal_milestones_goal_idx on public.goal_milestones (goal_id, completed);
create index if not exists goal_habit_links_goal_idx on public.goal_habit_links (goal_id);

drop trigger if exists set_goal_milestones_updated_at on public.goal_milestones;
create trigger set_goal_milestones_updated_at before update on public.goal_milestones
  for each row execute function public.set_updated_at();

alter table public.goal_milestones enable row level security;
alter table public.goal_habit_links enable row level security;

drop policy if exists "Users manage own goal milestones" on public.goal_milestones;
create policy "Users manage own goal milestones" on public.goal_milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own goal habit links" on public.goal_habit_links;
create policy "Users manage own goal habit links" on public.goal_habit_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
