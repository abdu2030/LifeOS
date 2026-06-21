export type WeeklyMetrics = {
  financeDelta: number
  goalProgress: number
  goalProgressDelta: number
  habitScore: number
  moodAverage: number | null
  topGoals: string[]
  weekStart: string
}

export type WeeklyInsight = {
  createdAt: string
  financeDelta: number | null
  generatedAt: string | null
  goalProgressDelta: number | null
  habitScore: number | null
  id: string
  moodAverage: number | null
  reportMarkdown: string | null
  summary: string
  updatedAt: string
  userId: string
  weekStart: string
}
