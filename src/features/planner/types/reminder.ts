import type { LucideIcon } from 'lucide-react'

export type ReminderTone = 'green' | 'amber' | 'purple'

export type Reminder = {
  title: string
  time: string
  icon: LucideIcon
  tone: ReminderTone
}

export type PlannerEvent = {
  allDay: boolean
  createdAt: string
  description: string | null
  endsAt: string | null
  id: string
  reminderMinutes: number | null
  startsAt: string
  title: string
  updatedAt: string
  userId: string
}

export type PlannerEventInput = {
  allDay: boolean
  description?: string
  endsAt?: string | null
  reminderMinutes?: number | null
  startsAt: string
  title: string
}
