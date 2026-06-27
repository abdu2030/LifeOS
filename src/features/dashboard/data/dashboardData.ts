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
  { label: 'Journal', icon: BookOpen, path: '/journal' },
  { label: 'Goals', icon: Goal, path: '/goals' },
  { label: 'Weekly Insights', icon: LineChart, path: '/insights' },
  { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { label: 'Tasks', icon: ListTodo, path: '/tasks' },
  { label: 'Files', icon: Folder, path: '/files' },
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Plugins', icon: Plug, path: '/plugins' },
]
