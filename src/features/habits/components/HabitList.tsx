import type { Habit } from '../types/habit'
import { DailyCheckIn } from './DailyCheckIn'

type HabitListProps = {
  error?: Error | null
  habits: Habit[]
  isLoading: boolean
  isUpdating: boolean
  onFreeze: (habit: Habit) => Promise<unknown>
  onToggle: (habitId: string, completed: boolean) => Promise<unknown>
  todayKey: string
}

export function HabitList({
  error,
  habits,
  isLoading,
  isUpdating,
  onFreeze,
  onToggle,
  todayKey,
}: HabitListProps) {
  return (
    <section className="finance-panel habit-list-panel">
      <div>
        <span className="auth-eyebrow">Daily Check-in</span>
        <h2>Today's habits</h2>
        <p>Complete the day, protect streaks with freeze tokens, and keep momentum visible.</p>
      </div>

      {isLoading ? <p className="finance-empty">Loading habits...</p> : null}
      {error ? <p className="auth-error">{error.message}</p> : null}

      {!isLoading && !habits.length ? (
        <p className="finance-empty">No habits yet. Create your first daily rhythm to begin.</p>
      ) : null}

      <div className="habit-list">
        {habits.map((habit) => (
          <article className="habit-row" key={habit.id}>
            <span className="habit-color-dot" style={{ background: habit.color }} />
            <div className="habit-row-copy">
              <strong>{habit.name}</strong>
              <p>{habit.description || 'Daily habit'}</p>
            </div>
            <DailyCheckIn
              habit={habit}
              isUpdating={isUpdating}
              onFreeze={onFreeze}
              onToggle={onToggle}
              todayKey={todayKey}
            />
          </article>
        ))}
      </div>
    </section>
  )
}
