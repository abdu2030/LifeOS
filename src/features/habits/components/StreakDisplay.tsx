import { Flame } from 'lucide-react'

import type { HabitStreak } from '../types/habit'

type StreakDisplayProps = {
  streak: HabitStreak
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="streak-display">
      <span className={streak.currentStreak > 0 ? 'flame-icon active' : 'flame-icon'}>
        <Flame size={20} />
      </span>
      <div>
        <strong>{streak.currentStreak} day streak</strong>
        <small>
          Best {streak.longestStreak} days · {streak.frozenDays} frozen
        </small>
      </div>
    </div>
  )
}
