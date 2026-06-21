import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  Folder,
  Gift,
  Goal,
  LayoutDashboard,
  LineChart,
  ListTodo,
  Plug,
  Settings,
} from 'lucide-react'

import type { NavItem, Reminder } from '../types/dashboard'

export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Finance', icon: CircleDollarSign },
  { label: 'Habits', icon: Activity },
  { label: 'Journal', icon: BookOpen },
  { label: 'Goals', icon: Goal },
  { label: 'Weekly Insights', icon: LineChart },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Tasks', icon: ListTodo },
  { label: 'Files', icon: Folder },
  { label: 'Settings', icon: Settings },
  { label: 'Plugins', icon: Plug },
]

export const reminders: Reminder[] = [
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

export const habitDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const habitHeatmap = Array.from({ length: 91 }, (_, index) => {
  const pattern = [0, 2, 3, 1, 4, 2, 0, 3, 4, 2, 1, 3, 4]
  return pattern[index % pattern.length]
})
