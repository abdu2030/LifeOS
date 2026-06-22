import { useState } from 'react'

import type { PlannerEventInput } from '../types/reminder'

type EventFormProps = {
  isSubmitting: boolean
  onSubmit: (input: PlannerEventInput) => Promise<unknown>
}

const now = new Date()
const today = now.toISOString().slice(0, 10)

export function EventForm({ isSubmitting, onSubmit }: EventFormProps) {
  const [allDay, setAllDay] = useState(false)
  const [date, setDate] = useState(today)
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')
  const [time, setTime] = useState('09:00')
  const [title, setTitle] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!title.trim()) {
      setFormError('Name the calendar event before saving.')
      return
    }

    const startsAt = allDay ? `${date}T00:00:00` : `${date}T${time}:00`

    try {
      await onSubmit({
        allDay,
        description,
        startsAt: new Date(startsAt).toISOString(),
        title: title.trim(),
      })
      setDescription('')
      setTitle('')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save event.')
    }
  }

  return (
    <form className="finance-panel calendar-event-form" onSubmit={handleSubmit}>
      <div>
        <span className="auth-eyebrow">New Event</span>
        <h2>Schedule time</h2>
        <p>Add appointments, focus blocks, and important dates to your LifeOS calendar.</p>
      </div>

      <label className="auth-field">
        Title
        <input
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Deep work block"
          required
          type="text"
          value={title}
        />
      </label>

      <div className="calendar-form-grid">
        <label className="auth-field">
          Date
          <input onChange={(event) => setDate(event.target.value)} required type="date" value={date} />
        </label>

        <label className="auth-field">
          Time
          <input
            disabled={allDay}
            onChange={(event) => setTime(event.target.value)}
            required={!allDay}
            type="time"
            value={time}
          />
        </label>
      </div>

      <label className="auth-field checkbox-field">
        <input checked={allDay} onChange={(event) => setAllDay(event.target.checked)} type="checkbox" />
        All-day event
      </label>

      <label className="auth-field">
        Description
        <textarea
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional notes"
          rows={3}
          value={description}
        />
      </label>

      {formError ? <p className="auth-error">{formError}</p> : null}

      <button className="auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving...' : 'Save event'}
      </button>
    </form>
  )
}
