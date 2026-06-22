import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { PlannerEvent } from '../types/reminder'

type CalendarMonthViewProps = {
  events: PlannerEvent[]
  monthDate: Date
  onMonthChange: (date: Date) => void
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarMonthView({ events, monthDate, onMonthChange }: CalendarMonthViewProps) {
  const cells = buildMonthCells(monthDate)
  const eventsByDate = groupEventsByDate(events)

  return (
    <section className="finance-panel calendar-month-panel">
      <div className="calendar-month-header">
        <div>
          <span className="auth-eyebrow">Calendar</span>
          <h2>
            {monthDate.toLocaleString(undefined, { month: 'long' })} {monthDate.getFullYear()}
          </h2>
        </div>
        <div className="calendar-month-actions">
          <button onClick={() => onMonthChange(addMonths(monthDate, -1))} type="button">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => onMonthChange(new Date())} type="button">
            Today
          </button>
          <button onClick={() => onMonthChange(addMonths(monthDate, 1))} type="button">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map((day) => (
          <span className="calendar-weekday" key={day}>
            {day}
          </span>
        ))}

        {cells.map((cell) => {
          const dayEvents = eventsByDate.get(toDateKey(cell.date)) ?? []

          return (
            <article
              className={cell.inMonth ? 'calendar-day' : 'calendar-day muted-day'}
              key={cell.date.toISOString()}
            >
              <strong>{cell.date.getDate()}</strong>
              <div>
                {dayEvents.slice(0, 3).map((event) => (
                  <span key={event.id}>{event.title}</span>
                ))}
                {dayEvents.length > 3 ? <small>+{dayEvents.length - 3} more</small> : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function buildMonthCells(monthDate: Date) {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7
  const start = new Date(firstOfMonth)
  start.setDate(firstOfMonth.getDate() - firstWeekday)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)

    return {
      date,
      inMonth: date.getMonth() === monthDate.getMonth(),
    }
  })
}

function groupEventsByDate(events: PlannerEvent[]) {
  return events.reduce<Map<string, PlannerEvent[]>>((groups, event) => {
    const key = toDateKey(new Date(event.startsAt))
    groups.set(key, [...(groups.get(key) ?? []), event])
    return groups
  }, new Map())
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
