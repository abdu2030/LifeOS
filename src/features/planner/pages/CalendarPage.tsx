import { useState } from 'react'

import { CalendarMonthView } from '../components/CalendarMonthView'
import { EventForm } from '../components/EventForm'
import { EventList } from '../components/EventList'
import { usePlannerEvents } from '../hooks/usePlannerEvents'

export function CalendarPage() {
  const [monthDate, setMonthDate] = useState(() => new Date())
  const { createEvent, deleteEvent, error, events, isCreating, isDeleting, isLoading } =
    usePlannerEvents()

  return (
    <section className="calendar-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Calendar</span>
          <h2>Plan the shape of your week</h2>
          <p>Create real planner events, review the month, and keep your agenda in LifeOS.</p>
        </div>
      </div>

      <CalendarMonthView events={events} monthDate={monthDate} onMonthChange={setMonthDate} />

      <div className="calendar-layout-grid">
        <EventForm isSubmitting={isCreating} onSubmit={createEvent} />
        <EventList
          error={error}
          events={events}
          isDeleting={isDeleting}
          isLoading={isLoading}
          onDelete={deleteEvent}
        />
      </div>
    </section>
  )
}
