import { Bell, CalendarDays, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { getFinanceTotals } from '../../finance/utils/financeChartData'
import type { Transaction } from '../../finance/types/finance'
import { listTransactions } from '../../finance/services/financeApi'
import { buildGoalTree, listGoals } from '../../goals/services/goalsApi'
import type { GoalTreeNode } from '../../goals/types/goal'
import { listHabits } from '../../habits/services/habitsApi'
import type { Habit, HabitHeatmapLevel } from '../../habits/types/habit'
import { calculateHabitStreak } from '../../habits/utils/streaks'
import { listWeeklyInsights } from '../../insights/services/weeklyInsightsApi'
import type { WeeklyInsight } from '../../insights/types/weeklyInsight'
import { listJournalEntries } from '../../journal/services/journalApi'
import type { JournalEntry } from '../../journal/types/journal'
import { listPlannerEvents } from '../../planner/services/plannerService'
import type { PlannerEvent } from '../../planner/types/reminder'
import { getProfile } from '../../settings/services/settingsApi'
import type { UserProfile } from '../../settings/types/settings'
import { navItems } from '../data/dashboardData'

export type DashboardReminder = {
  detail: string
  icon: LucideIcon
  id: string
  time: string
  title: string
  tone: 'amber' | 'green' | 'purple'
}

export type DashboardStreakSummary = {
  color: string
  id: string
  label: string
  value: number
}

export type DashboardExpenseDay = {
  amount: number
  day: string
  height: number
}

export type DashboardCategoryShare = {
  category: string
  percent: number
  total: number
}

export type DashboardGoalBranch = {
  id: string
  progress: number
  status: string
  title: string
}

export type DashboardOverview = {
  activeHabitCount: number
  averageMood: number | null
  categoryShares: DashboardCategoryShare[]
  currentInsight: WeeklyInsight | null
  displayName: string
  expenseDays: DashboardExpenseDay[]
  finance: {
    balance: number
    expense: number
    income: number
    transfers: number
  }
  goalBranches: DashboardGoalBranch[]
  goalProgress: number
  habitDays: string[]
  habitHeatmap: HabitHeatmapLevel[]
  habitScore: number
  latestJournalEntry: JournalEntry | null
  moodDelta: number | null
  navItems: typeof navItems
  profile: UserProfile | null
  reminders: DashboardReminder[]
  streaks: DashboardStreakSummary[]
  topGoal: GoalTreeNode | null
  transactionCount: number
}

const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const timeFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  month: 'short',
})

export async function getDashboardOverview(
  userId: string,
  fallbackEmail?: string | null,
): Promise<DashboardOverview> {
  const [profile, transactions, habits, journalEntries, goals, plannerEvents, insights] =
    await Promise.all([
      getProfile(userId),
      listTransactions(userId),
      listHabits(userId),
      listJournalEntries(userId),
      listGoals(userId),
      listPlannerEvents(userId),
      listWeeklyInsights(userId),
    ])

  const todayKey = new Date().toISOString().slice(0, 10)
  const activeHabits = habits.filter((habit) => habit.isActive)
  const moodScores = journalEntries
    .map((entry) => entry.moodScore)
    .filter((score): score is number => score !== null)
  const goalTree = buildGoalTree(goals)
  const finance = getFinanceTotals(transactions)
  const habitScore = getHabitScore(activeHabits, todayKey)

  return {
    activeHabitCount: activeHabits.length,
    averageMood: moodScores.length ? round(moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length, 1) : null,
    categoryShares: getCategoryShares(transactions),
    currentInsight: insights[0] ?? null,
    displayName: profile?.displayName || getEmailName(fallbackEmail) || 'there',
    expenseDays: getExpenseDays(transactions),
    finance,
    goalBranches: getGoalBranches(goalTree),
    goalProgress: getGoalProgress(goals),
    habitDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    habitHeatmap: getHabitHeatmap(activeHabits),
    habitScore,
    latestJournalEntry: journalEntries[0] ?? null,
    moodDelta: getMoodDelta(moodScores),
    navItems,
    profile,
    reminders: getReminders(plannerEvents),
    streaks: getStreaks(activeHabits, todayKey),
    topGoal: goalTree[0] ?? null,
    transactionCount: transactions.length,
  } satisfies DashboardOverview
}

function getEmailName(email?: string | null) {
  return email ? email.split('@')[0]?.replace(/[._-]+/g, ' ') : ''
}

function getHabitScore(habits: Habit[], todayKey: string) {
  if (!habits.length) {
    return 0
  }

  const completed = habits.filter((habit) => calculateHabitStreak(habit, todayKey).completedToday).length

  return Math.round((completed / habits.length) * 100)
}

function getHabitHeatmap(habits: Habit[]) {
  const days = getPastDateKeys(91)

  return days.map((dayKey) => {
    if (!habits.length) {
      return 0
    }

    const completed = habits.filter((habit) =>
      habit.logs.some((log) => log.loggedOn === dayKey && (log.count > 0 || log.note === 'freeze')),
    ).length
    const ratio = completed / habits.length

    if (ratio === 0) return 0
    if (ratio < 0.35) return 1
    if (ratio < 0.65) return 2
    if (ratio < 1) return 3
    return 4
  })
}

function getPastDateKeys(count: number) {
  const today = new Date()

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (count - 1 - index))

    return date.toISOString().slice(0, 10)
  })
}

function getStreaks(habits: Habit[], todayKey: string) {
  return habits
    .map((habit) => ({
      color: habit.color,
      id: habit.id,
      label: habit.name,
      value: calculateHabitStreak(habit, todayKey).currentStreak,
    }))
    .sort((first, second) => second.value - first.value)
    .slice(0, 5)
}

function getCategoryShares(transactions: Transaction[]) {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense')
  const expenseTotal = expenses.reduce((sum, transaction) => sum + transaction.amount, 0)
  const totals = new Map<string, number>()

  expenses.forEach((transaction) => {
    totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount)
  })

  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      percent: expenseTotal ? Math.round((total / expenseTotal) * 100) : 0,
      total,
    }))
    .sort((first, second) => second.total - first.total)
    .slice(0, 5)
}

function getExpenseDays(transactions: Transaction[]) {
  const start = new Date()
  start.setDate(start.getDate() - 6)
  const buckets = new Map<string, number>()

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    buckets.set(date.toISOString().slice(0, 10), 0)
  }

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      if (buckets.has(transaction.occurredOn)) {
        buckets.set(transaction.occurredOn, (buckets.get(transaction.occurredOn) ?? 0) + transaction.amount)
      }
    })

  const max = Math.max(...buckets.values(), 1)

  return Array.from(buckets.entries()).map(([dateKey, amount]) => ({
    amount,
    day: dayFormatter.format(new Date(`${dateKey}T00:00:00`)),
    height: amount ? Math.max(10, Math.round((amount / max) * 100)) : 4,
  }))
}

function getMoodDelta(scores: number[]) {
  if (scores.length < 2) {
    return null
  }

  return round(scores[0] - scores[1], 1)
}

function getGoalProgress(goals: Array<{ progress: number }>) {
  if (!goals.length) {
    return 0
  }

  return Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
}

function getGoalBranches(goalTree: GoalTreeNode[]) {
  const root = goalTree[0]
  const branches = root?.children.length ? root.children : goalTree

  return branches.slice(0, 3).map((goal) => ({
    id: goal.id,
    progress: goal.progress,
    status: goal.status,
    title: goal.title,
  }))
}

function getReminders(events: PlannerEvent[]): DashboardReminder[] {
  return events
    .filter((event) => new Date(event.startsAt).getTime() >= Date.now() - 60 * 60 * 1000)
    .slice(0, 3)
    .map((event, index) => {
      const tone: DashboardReminder['tone'] = index === 0 ? 'green' : index === 1 ? 'amber' : 'purple'

      return {
        detail: event.description || (event.allDay ? 'All day' : 'Scheduled event'),
        icon: index === 0 ? CalendarDays : index === 1 ? Bell : Target,
        id: event.id,
        time: timeFormatter.format(new Date(event.startsAt)),
        title: event.title,
        tone,
      }
    })
}

function round(value: number, precision: number) {
  const multiplier = 10 ** precision

  return Math.round(value * multiplier) / multiplier
}
