import {
  Activity,
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  Folder,
  Goal,
  LayoutDashboard,
  LineChart,
  ListTodo,
  Plug,
  Settings,
} from 'lucide-react'

import type { NavItem } from '../types/dashboard'

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
