import { supabase } from '../../../lib/supabase'
import { upcomingReminders } from '../data/upcomingReminders'
import type { PlannerEvent, PlannerEventInput } from '../types/reminder'

type PlannerEventRow = {
  all_day: boolean
  created_at: string
  description: string | null
  ends_at: string | null
  id: string
  reminder_minutes: number | null
  starts_at: string
  title: string
  updated_at: string
  user_id: string
}

const plannerEventSelect =
  'id,user_id,title,description,starts_at,ends_at,all_day,reminder_minutes,created_at,updated_at'

function mapPlannerEvent(row: PlannerEventRow): PlannerEvent {
  return {
    allDay: row.all_day,
    createdAt: row.created_at,
    description: row.description,
    endsAt: row.ends_at,
    id: row.id,
    reminderMinutes: row.reminder_minutes,
    startsAt: row.starts_at,
    title: row.title,
    updatedAt: row.updated_at,
    userId: row.user_id,
  }
}

export function getUpcomingReminders() {
  return upcomingReminders
}

export async function listPlannerEvents(userId: string) {
  const { data, error } = await supabase
    .from('planner_events')
    .select(plannerEventSelect)
    .eq('user_id', userId)
    .order('starts_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => mapPlannerEvent(row as PlannerEventRow))
}

export async function createPlannerEvent(userId: string, input: PlannerEventInput) {
  const { data, error } = await supabase
    .from('planner_events')
    .insert({
      all_day: input.allDay,
      description: input.description || null,
      ends_at: input.endsAt || null,
      reminder_minutes: input.reminderMinutes ?? null,
      starts_at: input.startsAt,
      title: input.title,
      user_id: userId,
    })
    .select(plannerEventSelect)
    .single()

  if (error) {
    throw error
  }

  return mapPlannerEvent(data as PlannerEventRow)
}

export async function deletePlannerEvent(userId: string, eventId: string) {
  const { error } = await supabase
    .from('planner_events')
    .delete()
    .eq('id', eventId)
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}
