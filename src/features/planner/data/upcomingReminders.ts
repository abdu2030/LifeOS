import { BriefcaseBusiness, CalendarDays, Gift } from 'lucide-react'

import type { Reminder } from '../types/reminder'

export const upcomingReminders: Reminder[] = [
  {
    title: 'Doctor Appointment',
    time: 'May 26, 2026 - 10:30 AM',
    icon: CalendarDays,
    tone: 'green',
  },
  {
    title: "Mom's Birthday",
    time: 'May 28, 2026 - All Day',
    icon: Gift,
    tone: 'amber',
  },
  {
    title: 'Project Deadline',
    time: 'May 30, 2026 - 11:59 PM',
    icon: BriefcaseBusiness,
    tone: 'purple',
  },
]
