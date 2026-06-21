alter table public.weekly_insights
  add column if not exists report_markdown text,
  add column if not exists generated_at timestamptz;
