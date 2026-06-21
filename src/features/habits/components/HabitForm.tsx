import { useState } from 'react'

import type { HabitInput } from '../types/habit'

type HabitFormProps = {
  isSubmitting: boolean
  onSubmit: (input: HabitInput) => Promise<unknown>
}

const colors = ['#21d07a', '#3777ff', '#f8a831', '#ff4d6d', '#7c3cff']

export function HabitForm({ isSubmitting, onSubmit }: HabitFormProps) {
  const [color, setColor] = useState(colors[0])
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')
  const [name, setName] = useState('')
  const [targetCount, setTargetCount] = useState(1)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!name.trim()) {
      setFormError('Name your habit before saving.')
      return
    }

    await onSubmit({
      color,
      description,
      frequency: 'daily',
      name: name.trim(),
      targetCount,
    })

    setDescription('')
    setName('')
    setTargetCount(1)
  }

  return (
    <form className="finance-panel habit-form" onSubmit={handleSubmit}>
      <div>
        <span className="auth-eyebrow">New Habit</span>
        <h2>Build a daily rhythm</h2>
        <p>Create habits that can be checked in every day.</p>
      </div>

      <label className="auth-field">
        Habit name
        <input
          onChange={(event) => setName(event.target.value)}
          placeholder="Morning workout"
          value={name}
        />
      </label>

      <label className="auth-field">
        Description
        <input
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What makes this habit successful?"
          value={description}
        />
      </label>

      <label className="auth-field">
        Daily target
        <input
          min="1"
          onChange={(event) => setTargetCount(Number(event.target.value))}
          type="number"
          value={targetCount}
        />
      </label>

      <div className="habit-color-picker" aria-label="Habit color">
        {colors.map((nextColor) => (
          <button
            className={color === nextColor ? 'active' : ''}
            key={nextColor}
            onClick={() => setColor(nextColor)}
            style={{ background: nextColor }}
            type="button"
            aria-label={`Use ${nextColor} habit color`}
          />
        ))}
      </div>

      {formError ? <p className="auth-error">{formError}</p> : null}

      <button className="auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving...' : 'Create habit'}
      </button>
    </form>
  )
}
