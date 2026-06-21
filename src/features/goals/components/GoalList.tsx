import { Trash2 } from 'lucide-react'

import type { Goal, GoalInput, GoalStatus } from '../types/goal'

type GoalListProps = {
  error?: Error | null
  goals: Goal[]
  isDeleting: boolean
  isLoading: boolean
  isUpdating: boolean
  onDelete: (goalId: string) => Promise<unknown>
  onUpdate: (goalId: string, input: GoalInput) => Promise<unknown>
}

const goalStatuses: GoalStatus[] = ['on_track', 'at_risk', 'off_track', 'not_started', 'complete']

export function GoalList({
  error,
  goals,
  isDeleting,
  isLoading,
  isUpdating,
  onDelete,
  onUpdate,
}: GoalListProps) {
  return (
    <section className="finance-panel goal-list-panel">
      <div>
        <span className="auth-eyebrow">Goal Stack</span>
        <h2>Active outcomes</h2>
        <p>Adjust progress, change status, and remove goals that no longer belong.</p>
      </div>

      {isLoading ? <p className="finance-empty">Loading goals...</p> : null}
      {error ? <p className="auth-error">{error.message}</p> : null}

      {!isLoading && !goals.length ? (
        <p className="finance-empty">No goals yet. Create a top-level outcome to start the tree.</p>
      ) : null}

      <div className="goal-list">
        {goals.map((goal) => (
          <article className="goal-row" key={goal.id}>
            <div className="goal-row-copy">
              <strong>{goal.title}</strong>
              <p>{goal.description || 'No description added.'}</p>
              {goal.targetDate ? <time>Target {new Date(goal.targetDate).toLocaleDateString()}</time> : null}
            </div>

            <label className="goal-progress-control">
              <span>{goal.progress}%</span>
              <input
                disabled={isUpdating}
                max="100"
                min="0"
                onChange={(event) =>
                  onUpdate(goal.id, {
                    description: goal.description ?? '',
                    parentGoalId: goal.parentGoalId,
                    progress: Number(event.target.value),
                    status: goal.status,
                    targetDate: goal.targetDate,
                    title: goal.title,
                  })
                }
                step="5"
                type="range"
                value={goal.progress}
              />
            </label>

            <select
              className="goal-status-select"
              disabled={isUpdating}
              onChange={(event) =>
                onUpdate(goal.id, {
                  description: goal.description ?? '',
                  parentGoalId: goal.parentGoalId,
                  progress: event.target.value === 'complete' ? 100 : goal.progress,
                  status: event.target.value as GoalStatus,
                  targetDate: goal.targetDate,
                  title: goal.title,
                })
              }
              value={goal.status}
            >
              {goalStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            <button
              aria-label={`Delete ${goal.title}`}
              className="icon-action"
              disabled={isDeleting}
              onClick={() => onDelete(goal.id)}
              type="button"
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function formatStatus(status: GoalStatus) {
  return status.replace(/_/g, ' ')
}
