import { Link2, X } from 'lucide-react'

import type { Habit } from '../../habits/types/habit'
import type { GoalHabitLink } from '../types/goal'

type GoalHabitLinkerProps = {
  goalId: string
  habits: Habit[]
  isUpdating: boolean
  links: GoalHabitLink[]
  onLink: (input: { goalId: string; habitId: string }) => Promise<unknown>
  onUnlink: (linkId: string) => Promise<unknown>
}

export function GoalHabitLinker({
  goalId,
  habits,
  isUpdating,
  links,
  onLink,
  onUnlink,
}: GoalHabitLinkerProps) {
  const linkedHabitIds = new Set(links.map((link) => link.habitId))
  const availableHabits = habits.filter((habit) => !linkedHabitIds.has(habit.id))

  return (
    <section className="goal-detail-section">
      <div>
        <h3>Linked habits</h3>
        <p>Connect daily habits that support this outcome.</p>
      </div>

      <div className="goal-habit-linker">
        <select
          disabled={isUpdating || !availableHabits.length}
          onChange={(event) => {
            if (event.target.value) {
              void onLink({ goalId, habitId: event.target.value })
              event.target.value = ''
            }
          }}
          value=""
        >
          <option value="">Link a habit</option>
          {availableHabits.map((habit) => (
            <option key={habit.id} value={habit.id}>
              {habit.name}
            </option>
          ))}
        </select>
      </div>

      <div className="goal-linked-habits">
        {!links.length ? <p className="finance-empty">No supporting habits linked yet.</p> : null}
        {links.map((link) => (
          <article className="goal-linked-habit" key={link.id}>
            <span style={{ background: link.habit?.color ?? 'var(--blue)' }} />
            <Link2 size={15} />
            <strong>{link.habit?.name ?? 'Deleted habit'}</strong>
            <button aria-label="Remove habit link" disabled={isUpdating} onClick={() => onUnlink(link.id)} type="button">
              <X size={15} />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
