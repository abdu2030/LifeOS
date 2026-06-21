import { useState } from 'react'

import type { Goal, GoalInput, GoalStatus } from '../types/goal'

type GoalFormProps = {
  goals: Goal[]
  isSubmitting: boolean
  onSubmit: (input: GoalInput) => Promise<unknown>
}

const goalStatuses: GoalStatus[] = ['on_track', 'at_risk', 'off_track', 'not_started', 'complete']

export function GoalForm({ goals, isSubmitting, onSubmit }: GoalFormProps) {
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')
  const [parentGoalId, setParentGoalId] = useState('')
  const [progress, setProgress] = useState('0')
  const [status, setStatus] = useState<GoalStatus>('on_track')
  const [targetDate, setTargetDate] = useState('')
  const [title, setTitle] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const parsedProgress = Number(progress)

    if (!title.trim()) {
      setFormError('Name the goal before saving it.')
      return
    }

    if (!Number.isFinite(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
      setFormError('Progress must be between 0 and 100.')
      return
    }

    try {
      await onSubmit({
        description,
        parentGoalId: parentGoalId || null,
        progress: parsedProgress,
        status,
        targetDate: targetDate || null,
        title: title.trim(),
      })

      setDescription('')
      setParentGoalId('')
      setProgress('0')
      setStatus('on_track')
      setTargetDate('')
      setTitle('')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save goal.')
    }
  }

  return (
    <form className="finance-panel goal-form" onSubmit={handleSubmit}>
      <div>
        <span className="auth-eyebrow">New Goal</span>
        <h2>Map an outcome</h2>
        <p>Create a main goal or attach a smaller milestone to an existing goal.</p>
      </div>

      <label className="auth-field">
        Goal title
        <input
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Launch personal finance dashboard"
          required
          type="text"
          value={title}
        />
      </label>

      <label className="auth-field">
        Parent goal
        <select onChange={(event) => setParentGoalId(event.target.value)} value={parentGoalId}>
          <option value="">Top-level goal</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </label>

      <label className="auth-field">
        Description
        <textarea
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What does success look like?"
          rows={3}
          value={description}
        />
      </label>

      <div className="goal-form-grid">
        <label className="auth-field">
          Status
          <select onChange={(event) => setStatus(event.target.value as GoalStatus)} value={status}>
            {goalStatuses.map((goalStatus) => (
              <option key={goalStatus} value={goalStatus}>
                {formatStatus(goalStatus)}
              </option>
            ))}
          </select>
        </label>

        <label className="auth-field">
          Progress
          <input
            max="100"
            min="0"
            onChange={(event) => setProgress(event.target.value)}
            step="1"
            type="number"
            value={progress}
          />
        </label>
      </div>

      <label className="auth-field">
        Target date
        <input onChange={(event) => setTargetDate(event.target.value)} type="date" value={targetDate} />
      </label>

      {formError ? <p className="auth-error">{formError}</p> : null}

      <button className="auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving...' : 'Save goal'}
      </button>
    </form>
  )
}

function formatStatus(status: GoalStatus) {
  return status.replace(/_/g, ' ')
}
