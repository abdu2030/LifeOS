import { listTransactions } from '../../finance/services/financeApi'
import { listGoals } from '../../goals/services/goalsApi'
import { listHabits } from '../../habits/services/habitsApi'
import { listJournalEntries } from '../../journal/services/journalApi'
import type { WeeklyMetrics } from '../types/weeklyInsight'

export async function buildWeeklyMetrics(userId: string): Promise<WeeklyMetrics> {
  const [transactions, goals, habits, journalEntries] = await Promise.all([
    listTransactions(userId),
    listGoals(userId),
    listHabits(userId),
    listJournalEntries(userId),
  ])
  const weekStart = getWeekStart()
  const weekEnd = addDays(weekStart, 7)
  const weekStartKey = toDateKey(weekStart)
  const weekTransactions = transactions.filter((transaction) =>
    isDateInRange(transaction.occurredOn, weekStart, weekEnd),
  )
  const financeDelta = weekTransactions.reduce((total, transaction) => {
    if (transaction.type === 'income') {
      return total + transaction.amount
    }

    if (transaction.type === 'expense') {
      return total - transaction.amount
    }

    return total
  }, 0)
  const activeHabits = habits.filter((habit) => habit.isActive)
  const weeklyHabitTarget = Math.max(1, activeHabits.length * 7)
  const completedHabitLogs = activeHabits.flatMap((habit) =>
    habit.logs.filter((log) => log.count > 0 && isDateInRange(log.loggedOn, weekStart, weekEnd)),
  ).length
  const moodEntries = journalEntries.filter(
    (entry) => entry.moodScore !== null && isDateInRange(entry.entryAt, weekStart, weekEnd),
  )
  const moodAverage = moodEntries.length
    ? roundToOne(moodEntries.reduce((sum, entry) => sum + (entry.moodScore ?? 0), 0) / moodEntries.length)
    : null
  const goalProgress = goals.length
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0

  return {
    financeRecordCount: weekTransactions.length,
    financeDelta: roundToTwo(financeDelta),
    goalCount: goals.length,
    goalProgress,
    goalProgressDelta: goalProgress,
    habitLogCount: completedHabitLogs,
    habitScore: Math.min(100, Math.round((completedHabitLogs / weeklyHabitTarget) * 100)),
    moodEntryCount: moodEntries.length,
    moodAverage,
    topGoals: goals
      .filter((goal) => goal.status !== 'complete')
      .sort((firstGoal, secondGoal) => secondGoal.progress - firstGoal.progress)
      .slice(0, 3)
      .map((goal) => goal.title),
    weekStart: weekStartKey,
  }
}

function getWeekStart(date = new Date()) {
  const nextDate = new Date(date)
  const day = nextDate.getDay()
  const diff = day === 0 ? -6 : 1 - day
  nextDate.setDate(nextDate.getDate() + diff)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function isDateInRange(value: string, start: Date, end: Date) {
  const date = parseInsightDate(value)
  return date >= start && date < end
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseInsightDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  return new Date(value)
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100
}
