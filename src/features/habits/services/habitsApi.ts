import { supabase } from '../../../lib/supabase'
import type { Habit, HabitInput, HabitLog } from '../types/habit'

type HabitLogRow = {
  count: number
  created_at: string
  habit_id: string
  id: string
  logged_on: string
  note: string | null
  user_id: string
}

type HabitRow = {
  color: string
  created_at: string
  description: string | null
  freeze_tokens: number | null
  frequency: Habit['frequency']
  habit_logs?: HabitLogRow[]
  id: string
  is_active: boolean
  name: string
  target_count: number
  updated_at: string
  user_id: string
}

const habitSelect = `
  id,
  user_id,
  name,
  description,
  frequency,
  target_count,
  color,
  freeze_tokens,
  is_active,
  created_at,
  updated_at,
  habit_logs (
    id,
    user_id,
    habit_id,
    logged_on,
    count,
    note,
    created_at
  )
`

function mapHabitLog(row: HabitLogRow): HabitLog {
  return {
    count: row.count,
    createdAt: row.created_at,
    habitId: row.habit_id,
    id: row.id,
    loggedOn: row.logged_on,
    note: row.note,
    userId: row.user_id,
  }
}

function mapHabit(row: HabitRow): Habit {
  return {
    color: row.color,
    createdAt: row.created_at,
    description: row.description,
    freezeTokens: row.freeze_tokens ?? 0,
    frequency: row.frequency,
    id: row.id,
    isActive: row.is_active,
    logs: (row.habit_logs ?? []).map(mapHabitLog),
    name: row.name,
    targetCount: row.target_count,
    updatedAt: row.updated_at,
    userId: row.user_id,
  }
}

export async function listHabits(userId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select(habitSelect)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .order('logged_on', { ascending: false, referencedTable: 'habit_logs' })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => mapHabit(row as HabitRow))
}

export async function createHabit(userId: string, input: HabitInput) {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      color: input.color,
      description: input.description || null,
      frequency: input.frequency,
      name: input.name,
      target_count: input.targetCount,
      user_id: userId,
    })
    .select(habitSelect)
    .single()

  if (error) {
    throw error
  }

  return mapHabit(data as HabitRow)
}

export async function toggleHabitCompletion(
  userId: string,
  habitId: string,
  completed: boolean,
  loggedOn: string,
) {
  if (!completed) {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('user_id', userId)
      .eq('habit_id', habitId)
      .eq('logged_on', loggedOn)

    if (error) {
      throw error
    }

    return
  }

  const { error } = await supabase.from('habit_logs').upsert(
    {
      count: 1,
      habit_id: habitId,
      logged_on: loggedOn,
      user_id: userId,
    },
    {
      onConflict: 'habit_id,logged_on',
    },
  )

  if (error) {
    throw error
  }
}

export async function useFreezeToken(userId: string, habit: Habit, loggedOn: string) {
  if (habit.freezeTokens <= 0) {
    throw new Error('No freeze tokens left for this habit.')
  }

  const { error: logError } = await supabase.from('habit_logs').upsert(
    {
      count: 0,
      habit_id: habit.id,
      logged_on: loggedOn,
      note: 'freeze',
      user_id: userId,
    },
    {
      onConflict: 'habit_id,logged_on',
    },
  )

  if (logError) {
    throw logError
  }

  const { error: habitError } = await supabase
    .from('habits')
    .update({ freeze_tokens: habit.freezeTokens - 1 })
    .eq('id', habit.id)
    .eq('user_id', userId)

  if (habitError) {
    throw habitError
  }
}
