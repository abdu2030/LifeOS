import {
  Activity,
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  Folder,
  Goal,
  Grid3X3,
  LayoutDashboard,
  LineChart,
  ListTodo,
  Plug,
  Settings,
} from 'lucide-react'

import type { NavItem } from '../types/dashboard'

export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Widgets', icon: Grid3X3, path: '/widgets' },
  { label: 'Finance', icon: CircleDollarSign, path: '/finance' },
  { label: 'Habits', icon: Activity, path: '/habits' },
  { label: 'Journal', icon: BookOpen },
  { label: 'Goals', icon: Goal },
  { label: 'Weekly Insights', icon: LineChart },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Tasks', icon: ListTodo },
  { label: 'Files', icon: Folder },
  { label: 'Settings', icon: Settings },
  { label: 'Plugins', icon: Plug },
]
