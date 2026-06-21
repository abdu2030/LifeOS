import { supabase, supabaseAnonKey, supabaseUrl } from '../../../lib/supabase'
import type { WeeklyInsight, WeeklyMetrics } from '../types/weeklyInsight'

type WeeklyInsightRow = {
  created_at: string
  finance_delta: number | string | null
  generated_at: string | null
  goal_progress_delta: number | null
  habit_score: number | null
  id: string
  mood_average: number | string | null
  report_markdown: string | null
  summary: string
  updated_at: string
  user_id: string
  week_start: string
}

const weeklyInsightSelect =
  'id,user_id,week_start,summary,finance_delta,habit_score,mood_average,goal_progress_delta,report_markdown,generated_at,created_at,updated_at'

function mapWeeklyInsight(row: WeeklyInsightRow): WeeklyInsight {
  return {
    createdAt: row.created_at,
    financeDelta: row.finance_delta === null ? null : Number(row.finance_delta),
    generatedAt: row.generated_at,
    goalProgressDelta: row.goal_progress_delta,
    habitScore: row.habit_score,
    id: row.id,
    moodAverage: row.mood_average === null ? null : Number(row.mood_average),
    reportMarkdown: row.report_markdown,
    summary: row.summary,
    updatedAt: row.updated_at,
    userId: row.user_id,
    weekStart: row.week_start,
  }
}

export async function listWeeklyInsights(userId: string) {
  const { data, error } = await supabase
    .from('weekly_insights')
    .select(weeklyInsightSelect)
    .eq('user_id', userId)
    .order('week_start', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => mapWeeklyInsight(row as WeeklyInsightRow))
}

export async function generateWeeklyReport(metrics: WeeklyMetrics) {
  const { data, error } = await supabase.functions.invoke<{ reportMarkdown: string }>(
    'generate-weekly-report',
    {
      body: { metrics },
    },
  )

  if (error) {
    return invokeWeeklyReportDirectly(metrics)
  }

  if (!data?.reportMarkdown) {
    throw new Error('Weekly report returned no content.')
  }

  return data.reportMarkdown
}

export async function upsertWeeklyInsight(
  userId: string,
  metrics: WeeklyMetrics,
  reportMarkdown: string,
) {
  const summary = getReportSummary(reportMarkdown)
  const { data, error } = await supabase
    .from('weekly_insights')
    .upsert(
      {
        finance_delta: metrics.financeDelta,
        generated_at: new Date().toISOString(),
        goal_progress_delta: metrics.goalProgressDelta,
        habit_score: metrics.habitScore,
        mood_average: metrics.moodAverage,
        report_markdown: reportMarkdown,
        summary,
        user_id: userId,
        week_start: metrics.weekStart,
      },
      { onConflict: 'user_id,week_start' },
    )
    .select(weeklyInsightSelect)
    .single()

  if (error) {
    throw error
  }

  return mapWeeklyInsight(data as WeeklyInsightRow)
}

async function invokeWeeklyReportDirectly(metrics: WeeklyMetrics) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const response = await fetch(`${supabaseUrl}/functions/v1/generate-weekly-report`, {
    body: JSON.stringify({ metrics }),
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session?.access_token ?? supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const payload = (await response.json()) as {
    detail?: string
    error?: string
    reportMarkdown?: string
  }

  if (!response.ok || !payload.reportMarkdown) {
    throw new Error(payload.detail || payload.error || 'Weekly report generation failed.')
  }

  return payload.reportMarkdown
}

function getReportSummary(markdown: string) {
  return (
    markdown
      .replace(/^#+\s+/gm, '')
      .replace(/[*_`>-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 220) || 'Weekly report generated.'
  )
}
