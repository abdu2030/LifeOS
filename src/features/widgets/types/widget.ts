import type { ComponentType } from 'react'

export type WidgetId =
  | 'finance-overview'
  | 'habit-tracker'
  | 'journal-mood'
  | 'goals-overview'
  | 'weekly-insights'
  | 'todays-focus'
  | 'weekly-expenses'
  | 'upcoming-reminders'

export type WidgetLayoutItem = {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

export type WidgetDefinition = {
  id: WidgetId
  title: string
  description: string
  category: 'Finance' | 'Habits' | 'Journal' | 'Goals' | 'Planning' | 'Insights'
  defaultLayout: WidgetLayoutItem
  component: ComponentType
}

export type PersistedWidgetLayout = WidgetLayoutItem & {
  i: WidgetId
}
