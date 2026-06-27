export type UserProfile = {
  avatarUrl: string | null
  displayName: string
  id: string
  onboardingCompleted: boolean
  timezone: string
}

export type ProfileInput = {
  avatarUrl?: string | null
  displayName: string
  timezone: string
}

export type DataExportBundle = {
  exportedAt: string
  financeRecords: unknown[]
  goals: unknown[]
  habits: unknown[]
  journalEntries: unknown[]
  plannerEvents: unknown[]
  profile: UserProfile | null
  weeklyInsights: unknown[]
}
