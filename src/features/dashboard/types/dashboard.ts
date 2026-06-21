import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
}

export type Reminder = {
  title: string
  time: string
  icon: LucideIcon
  tone: 'green' | 'amber' | 'purple'
}
