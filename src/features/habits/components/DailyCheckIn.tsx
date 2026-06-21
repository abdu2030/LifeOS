import { CheckCircle2, Snowflake } from 'lucide-react'

import type { Habit } from '../types/habit'
import { calculateHabitStreak } from '../utils/streaks'
import { StreakDisplay } from './StreakDisplay'

type DailyCheckInProps = {
  habit: Habit
  isUpdating: boolean
  onFreeze: (habit: Habit) => Promise<unknown>
  onToggle: (habitId: string, completed: boolean) => Promise<unknown>
  todayKey: string
}

export function DailyCheckIn({
  habit,
  isUpdating,
  onFreeze,
  onToggle,
  todayKey,
}: DailyCheckInProps) {
  const streak = calculateHabitStreak(habit, todayKey)
  const hasFrozenToday = habit.logs.some(
    (log) => log.loggedOn === todayKey && log.note === 'freeze',
  )

  return (
    <div className="daily-check-in">
      <StreakDisplay streak={streak} />
      <div className="habit-actions">
        <button
          className={streak.completedToday ? 'habit-check-button complete' : 'habit-check-button'}
          disabled={isUpdating}
          onClick={() => onToggle(habit.id, !streak.completedToday)}
          type="button"
        >
          <CheckCircle2 size={17} />
          {streak.completedToday ? 'Done today' : 'Check in'}
        </button>
        <button
          className="habit-freeze-button"
          disabled={
            isUpdating || habit.freezeTokens <= 0 || hasFrozenToday || streak.completedToday
          }
          onClick={() => onFreeze(habit)}
          type="button"
        >
          <Snowflake size={17} />
          Freeze · {habit.freezeTokens}
        </button>
      </div>
    </div>
  )
}
