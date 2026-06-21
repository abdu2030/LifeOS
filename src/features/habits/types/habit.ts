export type HabitHeatmapLevel = 0 | 1 | 2 | 3 | 4

export type HabitHeatmapSummary = {
  days: string[]
  heatmap: HabitHeatmapLevel[]
}

export type HabitFrequency = 'daily' | 'weekly' | 'custom'

export type HabitLog = {
  count: number
  createdAt: string
  habitId: string
  id: string
  loggedOn: string
  note: string | null
  userId: string
}

export type Habit = {
  color: string
  createdAt: string
  description: string | null
  freezeTokens: number
  frequency: HabitFrequency
  id: string
  isActive: boolean
  logs: HabitLog[]
  name: string
  targetCount: number
  updatedAt: string
  userId: string
}

export type HabitInput = {
  color: string
  description?: string
  frequency: HabitFrequency
  name: string
  targetCount: number
}

export type HabitStreak = {
  currentStreak: number
  frozenDays: number
  longestStreak: number
  completedToday: boolean
}
