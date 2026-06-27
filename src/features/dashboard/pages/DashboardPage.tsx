import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckSquare,
  ChevronDown,
  CircleDollarSign,
  Flame,
  Heart,
  Lock,
  Maximize2,
  PenLine,
  Smile,
  Sparkles,
  Target,
} from 'lucide-react'
import type { ComponentType, CSSProperties, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { DashboardCardHeader as CardHeader } from '../../../shared/components/DashboardCardHeader'
import { formatCurrency } from '../../finance/utils/financeChartData'
import { DashboardGreeting } from '../components/DashboardGreeting'
import { useDashboardOverview } from '../hooks/useDashboardOverview'
import type {
  DashboardExpenseDay,
  DashboardGoalBranch,
  DashboardOverview,
  DashboardStreakSummary,
} from '../services/dashboardService'

export function DashboardPage() {
  const { data: overview, error, isLoading } = useDashboardOverview()

  return (
    <>
      <DashboardGreeting displayName={overview?.displayName ?? 'there'} isLoading={isLoading} />

      {error ? <p className="auth-error">Dashboard data could not be loaded. {error.message}</p> : null}
      {overview ? <DashboardGrid overview={overview} /> : <DashboardLoadingGrid />}
    </>
  )
}

function DashboardGrid({ overview }: { overview: DashboardOverview }) {
  const focusItems = getFocusItems(overview)
  const latestEntry = overview.latestJournalEntry
  const navigate = useNavigate()
  const topDay = getTopExpenseDay(overview.expenseDays)
  const goTo = (path: string) => navigate(path)

  return (
    <section className="dashboard-grid" aria-label="LifeOS dashboard">
      <article
        aria-label="Open Finance"
        className="card dashboard-link-card finance-card"
        onClick={() => goTo('/finance')}
        onKeyDown={(event) => handleCardKeyDown(event, () => goTo('/finance'))}
        role="link"
        tabIndex={0}
      >
        <CardHeader icon={CircleDollarSign} label="Finance Overview" tone="green">
          <button className="ghost-select" onClick={() => goTo('/finance')} type="button">
            Real records <ChevronDown size={14} />
          </button>
        </CardHeader>
        <div className="finance-layout">
          <div className="balance-block">
            <span>Current Balance</span>
            <strong>{formatCurrency(overview.finance.balance)}</strong>
            <small className={overview.finance.balance >= 0 ? 'positive' : 'negative'}>
              {overview.transactionCount} saved transaction{overview.transactionCount === 1 ? '' : 's'}
            </small>
            <MiniLineChart points={overview.expenseDays} />
          </div>
          <div className="donut-block">
            <div className="donut finance-donut">
              <span>Expenses</span>
              <strong>{formatCurrency(overview.finance.expense)}</strong>
            </div>
            {overview.categoryShares.length ? (
              <ul className="legend-list">
                {overview.categoryShares.map((category, index) => (
                  <li key={category.category}>
                    <span className={getLegendColor(index)} />
                    {category.category} <b>{category.percent}%</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="finance-empty">Add expense records to reveal spending categories.</p>
            )}
          </div>
        </div>
        <div className="finance-summary">
          <MetricPill label="Income" value={formatCurrency(overview.finance.income)} tone="green" />
          <MetricPill label="Expenses" value={formatCurrency(overview.finance.expense)} tone="red" />
        </div>
      </article>

      <article
        aria-label="Open Habits"
        className="card dashboard-link-card habit-card"
        onClick={() => goTo('/habits')}
        onKeyDown={(event) => handleCardKeyDown(event, () => goTo('/habits'))}
        role="link"
        tabIndex={0}
      >
        <CardHeader icon={Flame} label="Habit Tracker" tone="orange">
          <span className="muted">{overview.activeHabitCount} Active</span>
        </CardHeader>
        <div className="habit-main">
          <div
            className="progress-ring"
            style={{ '--ring-progress': `${clampPercent(overview.habitScore)}%` } as CSSProperties}
          >
            <span className="progress-ring-copy">
              <strong>{overview.habitScore}%</strong>
              <span>Today</span>
            </span>
          </div>
          <div>
            <h3>{overview.habitScore >= 80 ? 'Strong momentum' : 'Today is open'}</h3>
            <p>
              {overview.activeHabitCount
                ? `${overview.activeHabitCount} active habit${overview.activeHabitCount === 1 ? '' : 's'} are being tracked.`
                : 'Create habits to make this card personal.'}
            </p>
          </div>
        </div>
        <div className="heatmap-board">
          <div className="heatmap-days">
            {overview.habitDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="heatmap">
            {overview.habitHeatmap.map((level, index) => (
              <span className={`heat heat-${level}`} key={index} />
            ))}
          </div>
          <div className="heatmap-months">
            <span>Last</span>
            <span>91</span>
            <span>days</span>
          </div>
        </div>
        <div className="streak-heading">
          <strong>Current Streaks</strong>
          <button onClick={() => goTo('/habits')} type="button">
            Open
          </button>
        </div>
        {overview.streaks.length ? (
          <div className="streak-row">
            {overview.streaks.map((streak) => (
              <Streak key={streak.id} streak={streak} />
            ))}
          </div>
        ) : (
          <p className="finance-empty">Check in to habits to build streaks here.</p>
        )}
      </article>

      <article
        aria-label="Open Journal"
        className="card dashboard-link-card journal-card"
        onClick={() => goTo('/journal')}
        onKeyDown={(event) => handleCardKeyDown(event, () => goTo('/journal'))}
        role="link"
        tabIndex={0}
      >
        <CardHeader icon={BookOpen} label="Journal Mood" tone="purple" />
        <div className="mood-layout">
          <div>
            <span className="muted">Average Mood</span>
            <strong className="score">
              {overview.averageMood ?? 'No data'}
              {overview.averageMood === null ? null : <small>/10</small>}
            </strong>
            {overview.moodDelta === null ? (
              <small className="pill">Add two scored entries for trend</small>
            ) : (
              <small className={overview.moodDelta >= 0 ? 'positive pill' : 'negative pill'}>
                {overview.moodDelta >= 0 ? '\u2191' : '\u2193'} {Math.abs(overview.moodDelta)} vs previous
              </small>
            )}
          </div>
          <div
            className="mood-ring"
            style={
              {
                '--ring-progress': `${clampPercent((overview.averageMood ?? 0) * 10)}%`,
              } as CSSProperties
            }
          >
            <Smile size={34} />
          </div>
        </div>
        {latestEntry ? (
          <div className="journal-entry">
            <div className="entry-header">
              <strong>{latestEntry.title || 'Recent Entry'}</strong>
              <span>
                <Lock size={12} /> {latestEntry.isEncrypted ? 'Encrypted' : 'Saved'}
              </span>
            </div>
            <small>{formatDateTime(latestEntry.entryAt)}</small>
            <p>{latestEntry.isEncrypted ? 'Encrypted entry saved securely.' : summarizeText(latestEntry.body)}</p>
          </div>
        ) : (
          <p className="finance-empty">Write a journal entry to fill this card with your mood data.</p>
        )}
        <button className="primary-action" onClick={() => goTo('/journal')} type="button">
          <PenLine size={17} />
          Write New Entry
        </button>
      </article>

      <article
        aria-label="Open Goals"
        className="card dashboard-link-card goals-card"
        onClick={() => goTo('/goals')}
        onKeyDown={(event) => handleCardKeyDown(event, () => goTo('/goals'))}
        role="link"
        tabIndex={0}
      >
        <CardHeader icon={Target} label="Goals Overview" tone="blue">
          <button className="ghost-select" onClick={() => goTo('/goals')} type="button">
            <Maximize2 size={13} />
            View Full Tree
          </button>
        </CardHeader>
        <div className="goal-tree">
          <GoalNode
            center
            title={overview.topGoal?.title ?? 'Create your first goal'}
            value={`${overview.topGoal?.progress ?? overview.goalProgress}%`}
          />
          {overview.goalBranches.length ? (
            <div className="goal-branches">
              {overview.goalBranches.map((goal, index) => (
                <GoalBranch goal={goal} icon={getGoalIcon(index)} key={goal.id} tone={getGoalTone(index)} />
              ))}
            </div>
          ) : (
            <p className="finance-empty">Add goals to grow a real tree here.</p>
          )}
        </div>
        <div className="goal-legend">
          <span>
            <i className="green-dot" /> On Track
          </span>
          <span>
            <i className="amber-dot" /> At Risk
          </span>
          <span>
            <i className="red-dot" /> Off Track
          </span>
          <span>
            <i className="gray-dot" /> Not Started
          </span>
        </div>
      </article>

      <article
        aria-label="Open Weekly Insights"
        className="card dashboard-link-card insights-card"
        onClick={() => goTo('/insights')}
        onKeyDown={(event) => handleCardKeyDown(event, () => goTo('/insights'))}
        role="link"
        tabIndex={0}
      >
        <CardHeader icon={Sparkles} label="Weekly Insights AI" tone="blue">
          <span className="ai-badge">{overview.currentInsight ? 'Latest Report' : 'Needs Report'}</span>
        </CardHeader>
        <div className="insight-hero">
          <div>
            <h3>{overview.currentInsight ? 'Your saved weekly report' : 'No weekly report yet'}</h3>
            <p>
              {overview.currentInsight?.summary ||
                'Generate a weekly insight report to turn your finance, habit, mood, and goal data into a summary.'}
            </p>
          </div>
          <div className="planet" />
        </div>
        <div className="insight-metrics">
          <MetricTile label="Balance" value={formatCurrency(overview.finance.balance)} detail="all records" />
          <MetricTile label="Habit Score" value={`${overview.habitScore}%`} detail="today" />
          <MetricTile
            label="Avg Mood"
            value={overview.averageMood === null ? 'No data' : `${overview.averageMood}/10`}
            detail="journal"
          />
          <MetricTile label="Goal Progress" value={`${overview.goalProgress}%`} detail="average" />
        </div>
        <button className="wide-action" onClick={() => goTo('/insights')} type="button">
          View Full Report
          <ArrowRight size={17} />
        </button>
      </article>

      <article className="card compact-card">
        <CardHeader icon={CheckSquare} label="Today's Focus" tone="blue" />
        <div className="task-list">
          {focusItems.map((item) => (
            <button
              className={item.done ? 'task-row done' : 'task-row'}
              key={item.label}
              onClick={() => goTo(item.path)}
              type="button"
            >
              <span className={item.done ? 'checkbox checked' : 'checkbox'}>
                {item.done ? <Check size={13} /> : null}
              </span>
              <span className="task-copy">
                <strong>{item.label}</strong>
                <small>{item.time}</small>
              </span>
              <b className={`task-tag ${item.tag.toLowerCase()}`}>{item.tag}</b>
            </button>
          ))}
        </div>
      </article>

      <article
        aria-label="Open Finance expenses"
        className="card dashboard-link-card compact-card expenses-card"
        onClick={() => goTo('/finance')}
        onKeyDown={(event) => handleCardKeyDown(event, () => goTo('/finance'))}
        role="link"
        tabIndex={0}
      >
        <CardHeader icon={BarChart3} label="Expenses This Week" tone="blue" />
        <div className="mini-stat-row">
          <span>
            Top day <strong>{topDay?.day ?? 'None'}</strong>
          </span>
          <span>
            Total <strong>{formatCurrency(overview.finance.expense)}</strong>
          </span>
          <span className={overview.finance.expense ? 'negative' : 'positive'}>
            {overview.finance.expense ? 'Tracked' : 'No expenses'}
          </span>
        </div>
        <div className="bar-chart">
          <div className="bar-axis">
            <span>{formatCurrency(topDay?.amount ?? 0)}</span>
            <span>{formatCurrency((topDay?.amount ?? 0) / 2)}</span>
            <span>$0</span>
          </div>
          {overview.expenseDays.map((day, index) => (
            <span className={`bar bar-${index}`} key={day.day} style={{ height: `${day.height}%` }} />
          ))}
        </div>
        <div className="chart-days">
          {overview.expenseDays.map((day) => (
            <span key={day.day}>{day.day}</span>
          ))}
        </div>
        <div className="category-strip">
          {overview.categoryShares.slice(0, 3).map((category) => (
            <span key={category.category}>
              {category.category} {formatCurrency(category.total)}
            </span>
          ))}
        </div>
      </article>

      <article
        aria-label="Open Calendar"
        className="card dashboard-link-card compact-card reminders-card"
        onClick={() => goTo('/calendar')}
        onKeyDown={(event) => handleCardKeyDown(event, () => goTo('/calendar'))}
        role="link"
        tabIndex={0}
      >
        <CardHeader icon={Bell} label="Upcoming Reminders" tone="blue" />
        {overview.reminders.length ? (
          <div className="reminder-list">
            {overview.reminders.map((reminder) => (
              <button
                className="reminder-row"
                key={reminder.id}
                onClick={() => goTo('/calendar')}
                type="button"
              >
                <span className={`reminder-icon ${reminder.tone}`}>
                  <reminder.icon size={18} />
                </span>
                <div>
                  <strong>{reminder.title}</strong>
                  <p>{reminder.time}</p>
                </div>
                <b className={`reminder-badge ${reminder.tone}`}>{reminder.detail}</b>
              </button>
            ))}
          </div>
        ) : (
          <p className="finance-empty">Calendar events will appear here when you add them.</p>
        )}
        <div className="sync-footer">
          <span className="status-dot" />
          Calendar data live from Supabase
        </div>
      </article>
    </section>
  )
}

function DashboardLoadingGrid() {
  return (
    <section className="dashboard-grid" aria-label="Loading dashboard">
      <article className="card finance-card">
        <p className="finance-empty">Loading your dashboard data...</p>
      </article>
      <article className="card habit-card">
        <p className="finance-empty">Checking habits, journal, goals, finance, and calendar.</p>
      </article>
    </section>
  )
}

function handleCardKeyDown(event: KeyboardEvent<HTMLElement>, onNavigate: () => void) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  event.preventDefault()
  onNavigate()
}

function MiniLineChart({ points }: { points: DashboardExpenseDay[] }) {
  const path = getLinePath(points)

  return (
    <div className="mini-chart" aria-label="Expense trend">
      <svg viewBox="0 0 260 150" role="img">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="chart-grid">
          <path d="M0 116 H260" />
          <path d="M0 82 H260" />
          <path d="M0 48 H260" />
          <path d="M52 0 V132" />
          <path d="M104 0 V132" />
          <path d="M156 0 V132" />
          <path d="M208 0 V132" />
        </g>
        <path className="chart-area" d={`${path} L260 150 L0 150 Z`} />
        <path className="chart-line" d={path} />
      </svg>
      <div className="chart-axis">
        <span>$0</span>
        <span>Week</span>
        <span>Expenses</span>
      </div>
      <div className="chart-dates">
        {points.slice(0, 5).map((point) => (
          <span key={point.day}>{point.day}</span>
        ))}
      </div>
    </div>
  )
}

function MetricPill({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`metric-pill ${tone}`}>
      <span>
        <i />
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  )
}

function Streak({ streak }: { streak: DashboardStreakSummary }) {
  return (
    <div className="streak">
      <span style={{ color: streak.color }}>
        <Activity size={15} />
      </span>
      <strong>{streak.value}</strong>
      <small title={streak.label}>days</small>
    </div>
  )
}

function GoalNode({ center, title, value }: { center?: boolean; title: string; value: string }) {
  return (
    <div className={center ? 'goal-node center' : 'goal-node'}>
      <strong>{title}</strong>
      <span>{value}</span>
    </div>
  )
}

function GoalBranch({
  goal,
  icon: Icon,
  tone,
}: {
  goal: DashboardGoalBranch
  icon: ComponentType<{ size?: number }>
  tone: string
}) {
  return (
    <div className={`goal-branch ${tone}`}>
      <span className="goal-branch-icon">
        <Icon size={15} />
      </span>
      <span className="goal-branch-copy">
        <strong>{goal.title}</strong>
        <small>{goal.status.replace('_', ' ')}</small>
      </span>
      <span className="goal-progress-pill">{goal.progress}%</span>
    </div>
  )
}

function MetricTile({ detail, label, value }: { detail: string; label: string; value: string }) {
  return (
    <div className="metric-tile">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  )
}

function getLinePath(points: DashboardExpenseDay[]) {
  if (!points.length) {
    return 'M0 120 L260 120'
  }

  return points
    .map((point, index) => {
      const x = Math.round((index / Math.max(points.length - 1, 1)) * 260)
      const y = Math.round(132 - (point.height / 100) * 112)

      return `${index === 0 ? 'M' : 'L'}${x} ${y}`
    })
    .join(' ')
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function getLegendColor(index: number) {
  return ['blue', 'indigo', 'amber', 'orange', 'gray'][index] ?? 'blue'
}

function getGoalIcon(index: number) {
  return [Heart, BriefcaseBusiness, CircleDollarSign][index] ?? Target
}

function getGoalTone(index: number) {
  return ['red', 'blue', 'green'][index] ?? 'blue'
}

function getTopExpenseDay(days: DashboardExpenseDay[]) {
  return days.reduce<DashboardExpenseDay | null>(
    (topDay, day) => (!topDay || day.amount > topDay.amount ? day : topDay),
    null,
  )
}

function getFocusItems(overview: DashboardOverview) {
  const firstReminder = overview.reminders[0]
  const firstStreak = overview.streaks[0]
  const firstGoal = overview.goalBranches[0] ?? overview.topGoal

  return [
    {
      done: overview.habitScore >= 100,
      label: firstStreak ? `Keep ${firstStreak.label} alive` : 'Create your first habit',
      path: '/habits',
      tag: 'Habits',
      time: firstStreak ? `${firstStreak.value} day streak` : 'No habits yet',
    },
    {
      done: Boolean(firstReminder),
      label: firstReminder?.title ?? 'Add a calendar event',
      path: '/calendar',
      tag: 'Plan',
      time: firstReminder?.time ?? 'No upcoming events',
    },
    {
      done: (firstGoal?.progress ?? 0) >= 100,
      label: firstGoal?.title ?? 'Add a goal',
      path: '/goals',
      tag: 'Goals',
      time: `${firstGoal?.progress ?? 0}% progress`,
    },
  ]
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function summarizeText(value: string) {
  const text = value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  return text.length > 120 ? `${text.slice(0, 120)}...` : text || 'Journal entry saved.'
}
