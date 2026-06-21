import { Sparkles } from 'lucide-react'

import { WeeklyReportCard } from '../components/WeeklyReportCard'
import { useWeeklyInsights } from '../hooks/useWeeklyInsights'

export function WeeklyInsightsPage() {
  const { error, generateReport, insights, isGenerating, isLoading } = useWeeklyInsights()
  const latestInsight = insights[0]

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

      {!isLoading && !latestInsight ? (
        <section className="finance-panel weekly-insights-empty">
          <Sparkles size={28} />
          <strong>No report yet</strong>
          <span>Generate your first weekly insight after adding goals, habits, journal entries, or transactions.</span>
        </section>
      ) : null}

      {latestInsight ? <WeeklyReportCard insight={latestInsight} /> : null}

      {insights.length > 1 ? (
        <section className="finance-panel report-history-panel">
          <span className="auth-eyebrow">History</span>
          <h2>Past reports</h2>
          <div className="report-history-list">
            {insights.slice(1).map((insight) => (
              <article key={insight.id}>
                <strong>{new Date(insight.weekStart).toLocaleDateString()}</strong>
                <span>{insight.summary}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}
