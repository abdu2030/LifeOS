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
  Droplets,
  Flame,
  Heart,
  Lock,
  Maximize2,
  PenLine,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Target,
} from 'lucide-react'
import type { ComponentType } from 'react'

import { DashboardSidebar } from '../components/DashboardSidebar'
import { DashboardTopbar } from '../components/DashboardTopbar'
import { useDashboardOverview } from '../hooks/useDashboardOverview'
import { DashboardCardHeader as CardHeader } from '../../../shared/components/DashboardCardHeader'

export function DashboardPage() {
  const { focusTasks, habitDays, habitHeatmap, navItems, reminders } = useDashboardOverview()

  return (
    <main className="app-shell">
      <DashboardSidebar navItems={navItems} />

      <section className="workspace">
        <DashboardTopbar />

        <section className="greeting-row">
          <div>
            <h2>Good morning, Arjun! <span aria-hidden="true">{'\u{1F44B}'}</span></h2>
            <p>Here's what's happening in your life today.</p>
          </div>
          <button className="customize-button" type="button">
            <SlidersHorizontal size={18} />
            Customize Dashboard
          </button>
        </section>

        <section className="dashboard-grid" aria-label="LifeOS dashboard">
          <article className="card finance-card">
            <CardHeader icon={CircleDollarSign} label="Finance Overview" tone="green">
              <button className="ghost-select" type="button">
                This Month <ChevronDown size={14} />
              </button>
            </CardHeader>
            <div className="finance-layout">
              <div className="balance-block">
                <span>Total Balance</span>
                <strong>$5,742.18</strong>
                <small className="positive">12.5% vs last month</small>
                <MiniLineChart />
              </div>
              <div className="donut-block">
                <div className="donut finance-donut">
                  <span>Expenses</span>
                  <strong>$1,286</strong>
                </div>
                <ul className="legend-list">
                  <li><span className="blue" />Food & Dining <b>32%</b></li>
                  <li><span className="indigo" />Transportation <b>21%</b></li>
                  <li><span className="amber" />Shopping <b>18%</b></li>
                  <li><span className="orange" />Bills & Utilities <b>15%</b></li>
                  <li><span className="gray" />Others <b>14%</b></li>
                </ul>
              </div>
            </div>
            <div className="finance-summary">
              <MetricPill label="Income" value="$3,620.00" tone="green" />
              <MetricPill label="Expenses" value="$1,286.24" tone="red" />
            </div>
          </article>

          <article className="card habit-card">
            <CardHeader icon={Flame} label="Habit Tracker" tone="orange">
              <span className="muted">6 Active</span>
            </CardHeader>
            <div className="habit-main">
              <div className="progress-ring">
                <strong>87%</strong>
                <span>This Week</span>
              </div>
              <div>
                <h3>Great job!</h3>
                <p>You're building amazing habits.</p>
              </div>
            </div>
            <div className="heatmap-board">
              <div className="heatmap-days">
                {habitDays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="heatmap">
                {habitHeatmap.map((level, index) => (
                  <span className={`heat heat-${level}`} key={index} />
                ))}
              </div>
              <div className="heatmap-months">
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
            <div className="streak-heading">
              <strong>Current Streaks</strong>
              <button type="button">View All</button>
            </div>
            <div className="streak-row">
              <Streak icon={Activity} value="12" label="days" />
              <Streak icon={Target} value="7" label="days" />
              <Streak icon={BookOpen} value="15" label="days" />
              <Streak icon={Droplets} value="5" label="days" />
              <Streak icon={Flame} value="5" label="days" />
            </div>
          </article>

          <article className="card journal-card">
            <CardHeader icon={BookOpen} label="Journal Mood" tone="purple" />
            <div className="mood-layout">
              <div>
                <span className="muted">Average Mood</span>
                <strong className="score">7.4<small>/10</small></strong>
                <small className="positive pill">{'\u2191'} 0.8 vs last week</small>
              </div>
              <div className="mood-ring">
                <span className="mood-orbit orbit-one" />
                <span className="mood-orbit orbit-two" />
                <Smile size={34} />
              </div>
            </div>
            <div className="journal-entry">
              <div className="entry-header">
                <strong>Recent Entry</strong>
                <span><Lock size={12} /> Encrypted</span>
              </div>
              <small>May 24, 2026 - 8:30 AM</small>
              <p>Grateful for a peaceful morning. Feeling motivated to build and create today...</p>
            </div>
            <button className="primary-action" type="button">
              <PenLine size={17} />
              Write New Entry
            </button>
          </article>

          <article className="card goals-card">
            <CardHeader icon={Target} label="Goals Overview" tone="blue">
              <button className="ghost-select" type="button">
                <Maximize2 size={13} />
                View Full Tree
              </button>
            </CardHeader>
            <div className="goal-tree">
              <svg className="goal-lines" viewBox="0 0 720 246" aria-hidden="true">
                <path className="root-line" d="M360 36 V74" />
                <path className="root-line" d="M150 74 H570" />
                <path className="health-line" d="M150 74 V120" />
                <path className="career-line" d="M360 74 V120" />
                <path className="finance-line" d="M570 74 V120" />
                <path className="health-line" d="M150 158 V202" />
                <path className="career-line" d="M360 158 V202" />
                <path className="finance-line" d="M570 158 V202" />
              </svg>
              <GoalNode
                title="Healthy, wealthy and meaningful life"
                value="68%"
                center
              />
              <div className="goal-branches">
                <GoalBranch icon={Heart} title="Health" value="75%" tone="red" />
                <GoalBranch icon={BriefcaseBusiness} title="Career" value="80%" tone="blue" />
                <GoalBranch icon={CircleDollarSign} title="Finance" value="70%" tone="green" />
              </div>
              <div className="goal-leaves">
                <div className="goal-leaf-group health">
                  <span>Workout <b>86%</b></span>
                  <span>Eat Healthy <b>73%</b></span>
                </div>
                <div className="goal-leaf-group career">
                  <span>LifeOS <b>85%</b></span>
                  <span>Mentorship <b>95%</b></span>
                </div>
                <div className="goal-leaf-group finance">
                  <span>Budget <b>92%</b></span>
                  <span>Invest <b>80%</b></span>
                </div>
              </div>
            </div>
            <div className="goal-legend">
              <span><i className="green-dot" /> On Track</span>
              <span><i className="amber-dot" /> At Risk</span>
              <span><i className="red-dot" /> Off Track</span>
              <span><i className="gray-dot" /> Not Started</span>
            </div>
          </article>

          <article className="card insights-card">
            <CardHeader icon={Sparkles} label="Weekly Insights AI" tone="blue">
              <span className="ai-badge">AI Generated</span>
            </CardHeader>
            <div className="insight-hero">
              <div>
                <h3>Your Week in Review {'\u2728'}</h3>
                <p>You had a productive week. You saved more, stayed consistent with habits, and your mood improved.</p>
              </div>
              <div className="planet" />
            </div>
            <div className="insight-metrics">
              <MetricTile label="Spent" value="$1,286" detail="8% vs last week" />
              <MetricTile label="Habit Score" value="87%" detail="12%" />
              <MetricTile label="Avg Mood" value="7.4/10" detail="0.8" />
              <MetricTile label="Goal Progress" value="+6%" detail="vs last week" />
            </div>
            <button className="wide-action" type="button">
              View Full Report
              <ArrowRight size={17} />
            </button>
          </article>

          <article className="card compact-card">
            <CardHeader icon={CheckSquare} label="Today's Focus" tone="blue" />
            <div className="task-list">
              {focusTasks.map((task) => (
                <label className={task.done ? 'task-row done' : 'task-row'} key={task.label}>
                  <span className={task.done ? 'checkbox checked' : 'checkbox'}>
                    {task.done ? <Check size={13} /> : null}
                  </span>
                  <span className="task-copy">
                    <strong>{task.label}</strong>
                    <small>{task.time}</small>
                  </span>
                  <b className={`task-tag ${task.tag.toLowerCase()}`}>{task.tag}</b>
                </label>
              ))}
            </div>
          </article>

          <article className="card compact-card expenses-card">
            <CardHeader icon={BarChart3} label="Expenses This Week" tone="blue" />
            <div className="mini-stat-row">
              <span>Top day <strong>Tue</strong></span>
              <span>Avg/day <strong>$184</strong></span>
              <span className="positive">8% lower</span>
            </div>
            <div className="bar-chart">
              <div className="bar-axis">
                <span>$300</span>
                <span>$200</span>
                <span>$100</span>
                <span>$0</span>
              </div>
              {[72, 96, 64, 40, 58, 22, 36].map((height, index) => (
                <span className={`bar bar-${index}`} key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="chart-days">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
              <span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <div className="category-strip">
              <span>Food $420</span>
              <span>Travel $280</span>
              <span>Home $190</span>
            </div>
          </article>

          <article className="card compact-card reminders-card">
            <CardHeader icon={Bell} label="Upcoming Reminders" tone="blue" />
            <div className="reminder-list">
              {reminders.map((reminder) => (
                <div className="reminder-row" key={reminder.title}>
                  <span className={`reminder-icon ${reminder.tone}`}>
                    <reminder.icon size={18} />
                  </span>
                  <div>
                    <strong>{reminder.title}</strong>
                    <p>{reminder.time}</p>
                  </div>
                  <b className={`reminder-badge ${reminder.tone}`}>
                    {reminder.tone === 'green' ? 'Soon' : reminder.tone === 'amber' ? 'Gift' : 'Work'}
                  </b>
                </div>
              ))}
            </div>
            <div className="sync-footer">
              <span className="status-dot" />
              Calendar sync active
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

function MiniLineChart() {
  return (
    <div className="mini-chart" aria-label="Balance trend">
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
        <path
          className="chart-area"
          d="M0 106 L26 84 L52 50 L78 58 L104 82 L130 70 L156 48 L182 64 L208 36 L234 22 L260 0 L260 150 L0 150 Z"
        />
        <path
          className="chart-line"
          d="M0 106 L26 84 L52 50 L78 58 L104 82 L130 70 L156 48 L182 64 L208 36 L234 22 L260 0"
        />
      </svg>
      <div className="chart-axis">
        <span>$0</span>
        <span>$2k</span>
        <span>$4k</span>
        <span>$6k</span>
      </div>
      <div className="chart-dates">
        <span>Apr 24</span>
        <span>May 1</span>
        <span>May 8</span>
        <span>May 15</span>
        <span>May 22</span>
      </div>
    </div>
  )
}

function MetricPill({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`metric-pill ${tone}`}>
      <span><i />{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Streak({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ size?: number }>
  label: string
  value: string
}) {
  return (
    <div className="streak">
      <span><Icon size={15} /></span>
      <strong>{value}</strong>
      <small>{label}</small>
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
  icon: Icon,
  title,
  tone,
  value,
}: {
  icon: ComponentType<{ size?: number }>
  title: string
  tone: string
  value: string
}) {
  return (
    <div className={`goal-branch ${tone}`}>
      <Icon size={16} />
      <strong>{title}</strong>
      <span>{value}</span>
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
