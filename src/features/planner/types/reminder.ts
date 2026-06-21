import type { LucideIcon } from 'lucide-react'

export type ReminderTone = 'green' | 'amber' | 'purple'

export type Reminder = {
  title: string
  time: string
  icon: LucideIcon
  tone: ReminderTone
}
