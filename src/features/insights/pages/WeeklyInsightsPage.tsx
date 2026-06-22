import { Sparkles } from 'lucide-react'

import { WeeklyReportCard } from '../components/WeeklyReportCard'
import { useWeeklyInsights } from '../hooks/useWeeklyInsights'
import type { WeeklyMetrics } from '../types/weeklyInsight'
import { formatDateOnly } from '../utils/dateFormat'

export function WeeklyInsightsPage() {
  const { error, generateReport, insights, isGenerating, isLoading, metrics } = useWeeklyInsights()
  const currentWeekInsight = metrics
    ? insights.find((insight) => insight.weekStart === metrics.weekStart)
    : null

  return (
    <section className="weekly-insights-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Weekly Insights</span>
          <h2>Review the whole system</h2>
          <p>Generate a weekly report from goals, habits, finances, and journal mood.</p>
        </div>
        <button className="primary-action compact-action" disabled={isGenerating} onClick={() => generateReport()} type="button">
          <Sparkles size={17} />
          {isGenerating ? 'Generating...' : 'Generate report'}
        </button>
      </div>

      {isLoading ? <p className="finance-empty">Loading weekly insights...</p> : null}
      {error ? <p className="auth-error">{error.message}</p> : null}

      {metrics ? <CurrentWeekMetrics metrics={metrics} /> : null}

      {!isLoading && !currentWeekInsight ? (
        <section className="finance-panel weekly-insights-empty">
          <Sparkles size={28} />
          <strong>No current week report yet</strong>
          <span>Generate a report after the Current Data card shows the real records you want included.</span>
        </section>
      ) : null}

      {currentWeekInsight ? <WeeklyReportCard insight={currentWeekInsight} /> : null}
    </section>
  )
}

function CurrentWeekMetrics({ metrics }: { metrics: WeeklyMetrics }) {
  return (
    <section className="finance-panel current-week-metrics">
      <div>
        <span className="auth-eyebrow">Current Data</span>
        <h2>Week of {formatDateOnly(metrics.weekStart)}</h2>
        <p>These live numbers are what the next generated AI report will use.</p>
      </div>

      <div className="weekly-report-metrics">
        <Metric label="Finance" value={formatMoney(metrics.financeDelta)} />
        <Metric label="Habits" value={`${metrics.habitScore}%`} />
        <Metric label="Mood" value={metrics.moodAverage === null ? 'No data' : `${metrics.moodAverage}/10`} />
        <Metric label="Goals" value={`${metrics.goalProgress}%`} />
      </div>

      <div className="weekly-data-sources">
        <span>{metrics.financeRecordCount} finance records this week</span>
        <span>{metrics.habitLogCount} habit check-ins this week</span>
        <span>{metrics.moodEntryCount} mood-scored journal entries this week</span>
        <span>{metrics.goalCount} goals in your workspace</span>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  )
}

function formatMoney(value: number) {
  return `${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`
}
