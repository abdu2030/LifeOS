import { Trash2 } from 'lucide-react'

import type { PlannerEvent } from '../types/reminder'

type EventListProps = {
  error?: Error | null
  events: PlannerEvent[]
  isDeleting: boolean
  isLoading: boolean
  onDelete: (eventId: string) => Promise<unknown>
}

export function EventList({ error, events, isDeleting, isLoading, onDelete }: EventListProps) {
  return (
    <section className="finance-panel calendar-event-list-panel">
      <div>
        <span className="auth-eyebrow">Agenda</span>
        <h2>Upcoming events</h2>
        <p>These events are loaded from your Supabase planner calendar.</p>
      </div>

      {isLoading ? <p className="finance-empty">Loading calendar events...</p> : null}
      {error ? <p className="auth-error">{error.message}</p> : null}
      {!isLoading && !events.length ? <p className="finance-empty">No calendar events yet.</p> : null}

      <div className="calendar-event-list">
        {events.map((event) => (
          <article className="calendar-event-row" key={event.id}>
            <time>{formatEventTime(event)}</time>
            <div>
              <strong>{event.title}</strong>
              <p>{event.description || 'No notes added.'}</p>
            </div>
            <button
              aria-label={`Delete ${event.title}`}
              disabled={isDeleting}
              onClick={() => onDelete(event.id)}
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

function formatEventTime(event: PlannerEvent) {
  const date = new Date(event.startsAt)

  if (event.allDay) {
    return `${date.toLocaleDateString()} · All day`
  }

  return `${date.toLocaleDateString()} · ${date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })}`
}
