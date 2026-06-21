import { useState } from 'react'

import { CheckCircle2, Circle, Trash2 } from 'lucide-react'

import type { GoalMilestone, GoalMilestoneInput } from '../types/goal'

type MilestoneListProps = {
  goalId: string
  isUpdating: boolean
  milestones: GoalMilestone[]
  onCreate: (input: GoalMilestoneInput) => Promise<unknown>
  onDelete: (milestone: GoalMilestone) => Promise<unknown>
  onToggle: (milestone: GoalMilestone) => Promise<unknown>
}

export function MilestoneList({
  goalId,
  isUpdating,
  milestones,
  onCreate,
  onDelete,
  onToggle,
}: MilestoneListProps) {
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Name the milestone before adding it.')
      return
    }

    try {
      await onCreate({ dueDate: dueDate || null, goalId, title: title.trim() })
      setDueDate('')
      setTitle('')
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to add milestone.')
    }
  }

  return (
    <section className="goal-detail-section">
      <div>
        <h3>Milestones</h3>
        <p>Completed milestones feed the goal progress automatically.</p>
      </div>

      <form className="milestone-form" onSubmit={handleSubmit}>
        <input
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Define the next milestone"
          type="text"
          value={title}
        />
        <input onChange={(event) => setDueDate(event.target.value)} type="date" value={dueDate} />
        <button disabled={isUpdating} type="submit">
          Add
        </button>
      </form>

      {error ? <p className="auth-error">{error}</p> : null}

      <div className="milestone-list">
        {!milestones.length ? <p className="finance-empty">No milestones yet.</p> : null}
        {milestones.map((milestone) => (
          <article className={milestone.completed ? 'milestone-row complete' : 'milestone-row'} key={milestone.id}>
            <button disabled={isUpdating} onClick={() => onToggle(milestone)} type="button">
              {milestone.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>
            <div>
              <strong>{milestone.title}</strong>
              {milestone.dueDate ? <span>Due {new Date(milestone.dueDate).toLocaleDateString()}</span> : null}
            </div>
            <button
              aria-label={`Delete ${milestone.title}`}
              disabled={isUpdating}
              onClick={() => onDelete(milestone)}
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
