import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
}

export type FocusTask = {
  label: string
  tag: string
  done: boolean
  time: string
}

export type Reminder = {
  title: string
  time: string
  icon: LucideIcon
  tone: 'green' | 'amber' | 'purple'
}
