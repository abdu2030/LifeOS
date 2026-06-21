-- LifeOS initial Supabase schema.
-- Apply this migration in a Supabase project before connecting the app.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

create type public.task_status as enum ('todo', 'in_progress', 'done', 'archived');
create type public.priority_level as enum ('low', 'medium', 'high');
create type public.habit_frequency as enum ('daily', 'weekly', 'custom');
create type public.finance_record_type as enum ('income', 'expense', 'transfer');
create type public.goal_status as enum ('on_track', 'at_risk', 'off_track', 'not_started', 'complete');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  timezone text not null default 'UTC',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  priority public.priority_level not null default 'medium',
  due_at timestamptz,
  completed_at timestamptz,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  frequency public.habit_frequency not null default 'daily',
  target_count integer not null default 1 check (target_count > 0),
  color text not null default '#21d07a',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  logged_on date not null,
  count integer not null default 1 check (count >= 0),
  note text,
  created_at timestamptz not null default now(),
  unique (habit_id, logged_on)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  body text not null,
  mood_score numeric(3, 1) check (mood_score >= 0 and mood_score <= 10),
  tags text[] not null default '{}',
  is_encrypted boolean not null default false,
  entry_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_goal_id uuid references public.goals(id) on delete cascade,
  title text not null,
  description text,
  status public.goal_status not null default 'not_started',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.finance_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  account_type text not null default 'cash',
  currency text not null default 'USD',
  balance numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.finance_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.finance_accounts(id) on delete set null,
  record_type public.finance_record_type not null,
  category text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  description text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.planner_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  reminder_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.weekly_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  summary text not null,
  finance_delta numeric(8, 2),
  habit_score integer check (habit_score >= 0 and habit_score <= 100),
  mood_average numeric(3, 1) check (mood_average >= 0 and mood_average <= 10),
  goal_progress_delta integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create index tasks_user_status_idx on public.tasks (user_id, status);
create index habits_user_active_idx on public.habits (user_id, is_active);
create index habit_logs_user_date_idx on public.habit_logs (user_id, logged_on desc);
create index journal_entries_user_entry_at_idx on public.journal_entries (user_id, entry_at desc);
create index goals_user_status_idx on public.goals (user_id, status);
create index finance_records_user_date_idx on public.finance_records (user_id, occurred_on desc);
create index planner_events_user_start_idx on public.planner_events (user_id, starts_at);
create index weekly_insights_user_week_idx on public.weekly_insights (user_id, week_start desc);

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_tasks_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();
create trigger set_habits_updated_at before update on public.habits
  for each row execute function public.set_updated_at();
create trigger set_journal_entries_updated_at before update on public.journal_entries
  for each row execute function public.set_updated_at();
create trigger set_goals_updated_at before update on public.goals
  for each row execute function public.set_updated_at();
create trigger set_finance_accounts_updated_at before update on public.finance_accounts
  for each row execute function public.set_updated_at();
create trigger set_finance_records_updated_at before update on public.finance_records
  for each row execute function public.set_updated_at();
create trigger set_planner_events_updated_at before update on public.planner_events
  for each row execute function public.set_updated_at();
create trigger set_weekly_insights_updated_at before update on public.weekly_insights
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.goals enable row level security;
alter table public.finance_accounts enable row level security;
alter table public.finance_records enable row level security;
alter table public.planner_events enable row level security;
alter table public.weekly_insights enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users manage own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own habits" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own habit logs" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own journal entries" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own goals" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own finance accounts" on public.finance_accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own finance records" on public.finance_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own planner events" on public.planner_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own weekly insights" on public.weekly_insights
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email, ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
