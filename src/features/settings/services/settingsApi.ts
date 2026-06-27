import { listTransactions } from '../../finance/services/financeApi'
import { listGoals } from '../../goals/services/goalsApi'
import { listHabits } from '../../habits/services/habitsApi'
import { listWeeklyInsights } from '../../insights/services/weeklyInsightsApi'
import { listJournalEntries } from '../../journal/services/journalApi'
import { listPlannerEvents } from '../../planner/services/plannerService'
import { supabase } from '../../../lib/supabase'
import type { DataExportBundle, ProfileInput, UserProfile } from '../types/settings'

type ProfileRow = {
  avatar_url: string | null
  display_name: string
  id: string
  onboarding_completed: boolean
  timezone: string
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    avatarUrl: row.avatar_url,
    displayName: row.display_name,
    id: row.id,
    onboardingCompleted: row.onboarding_completed,
    timezone: row.timezone,
  }
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,display_name,avatar_url,timezone,onboarding_completed')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapProfile(data as ProfileRow) : null
}

export async function updateProfile(userId: string, input: ProfileInput) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      display_name: input.displayName,
      id: userId,
      timezone: input.timezone,
    })
    .select('id,display_name,avatar_url,timezone,onboarding_completed')
    .single()

  if (error) {
    throw error
  }

  return mapProfile(data as ProfileRow)
}

export async function buildDataExport(userId: string): Promise<DataExportBundle> {
  const [profile, financeRecords, goals, habits, journalEntries, plannerEvents, weeklyInsights] =
    await Promise.all([
      getProfile(userId),
      listTransactions(userId),
      listGoals(userId),
      listHabits(userId),
      listJournalEntries(userId),
      listPlannerEvents(userId),
      listWeeklyInsights(userId),
    ])

  return {
    exportedAt: new Date().toISOString(),
    financeRecords,
    goals,
    habits,
    journalEntries,
    plannerEvents,
    profile,
    weeklyInsights,
  }
}
