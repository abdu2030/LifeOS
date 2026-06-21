import type { Habit, HabitStreak } from '../types/habit'

const dayMs = 24 * 60 * 60 * 1000

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function calculateHabitStreak(habit: Habit, todayKey = getTodayKey()): HabitStreak {
  const completionMap = new Map(habit.logs.map((log) => [log.loggedOn, log]))
  const today = parseDateKey(todayKey)
  let currentStreak = 0
  let longestStreak = 0
  let activeRun = 0
  let frozenDays = 0

  for (let index = 0; index < 365; index += 1) {
    const dateKey = formatDateKey(new Date(today.getTime() - index * dayMs))
    const log = completionMap.get(dateKey)

    if (log && (log.count > 0 || log.note === 'freeze')) {
      activeRun += 1
      longestStreak = Math.max(longestStreak, activeRun)

      if (log.note === 'freeze') {
        frozenDays += 1
      }

      if (index === currentStreak) {
        currentStreak += 1
      }
    } else {
      activeRun = 0

      if (index === currentStreak) {
        break
      }
    }
  }

  const todayLog = completionMap.get(todayKey)

  return {
    completedToday: Boolean(todayLog && todayLog.count > 0),
    currentStreak,
    frozenDays,
    longestStreak,
  }
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`)
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}
