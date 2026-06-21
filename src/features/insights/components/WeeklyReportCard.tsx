import { Sparkles } from 'lucide-react'

import type { WeeklyInsight } from '../types/weeklyInsight'
import { ReportMarkdownRenderer } from './ReportMarkdownRenderer'

type WeeklyReportCardProps = {
  insight: WeeklyInsight
}

export function WeeklyReportCard({ insight }: WeeklyReportCardProps) {
  return (
    <article className="weekly-report-card">
      <header>
        <div>
          <span className="auth-eyebrow">Week of {new Date(insight.weekStart).toLocaleDateString()}</span>
          <h2>Weekly AI report</h2>
        </div>
        <Sparkles size={22} />
      </header>

      <div className="weekly-report-metrics">
        <Metric label="Finance" value={formatMoney(insight.financeDelta)} />
        <Metric label="Habits" value={`${insight.habitScore ?? 0}%`} />
        <Metric label="Mood" value={insight.moodAverage === null ? 'No data' : `${insight.moodAverage}/10`} />
        <Metric label="Goals" value={`${insight.goalProgressDelta ?? 0}%`} />
      </div>

      <ReportMarkdownRenderer markdown={insight.reportMarkdown || insight.summary} />
    </article>
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

function formatMoney(value: number | null) {
  const amount = value ?? 0
  return `${amount < 0 ? '-' : ''}$${Math.abs(amount).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`
}
