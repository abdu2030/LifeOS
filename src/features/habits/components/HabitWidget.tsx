import { CheckCircle2, Flame } from 'lucide-react'

import { useHabits } from '../hooks/useHabits'
import { calculateHabitStreak } from '../utils/streaks'

export function HabitWidget() {
  const { error, habits, isLoading, todayKey } = useHabits()
  const activeHabits = habits.filter((habit) => habit.isActive)
  const completedToday = activeHabits.filter(
    (habit) => calculateHabitStreak(habit, todayKey).completedToday,
  ).length
  const bestStreak = activeHabits.reduce(
    (best, habit) => Math.max(best, calculateHabitStreak(habit, todayKey).currentStreak),
    0,
  )
  const completionRate = activeHabits.length
    ? Math.round((completedToday / activeHabits.length) * 100)
    : 0

  if (isLoading) {
    return <p className="finance-empty">Loading habits...</p>
  }

  if (error) {
    return <p className="auth-error">{error.message}</p>
  }

  if (!activeHabits.length) {
    return (
      <div className="habit-widget-empty">
        <Flame size={28} />
        <strong>No habits yet</strong>
        <span>Create habits to track daily momentum here.</span>
      </div>
    )
  }

  return (
    <div className="habit-widget">
      <div className="habit-widget-score">
        <span>Today complete</span>
        <strong>{completionRate}%</strong>
        <small>
          {completedToday} of {activeHabits.length} habits
        </small>
      </div>

      <div className="habit-widget-stat-row">
        <span>
          <CheckCircle2 size={16} />
          Check-ins
          <strong>{completedToday}</strong>
        </span>
        <span>
          <Flame size={16} />
          Best streak
          <strong>{bestStreak}d</strong>
        </span>
      </div>
    </div>
  )
}
