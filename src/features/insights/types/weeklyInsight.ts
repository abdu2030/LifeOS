export type WeeklyMetrics = {
  financeRecordCount: number
  financeDelta: number
  goalCount: number
  goalProgress: number
  goalProgressDelta: number
  habitLogCount: number
  habitScore: number
  moodEntryCount: number
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
