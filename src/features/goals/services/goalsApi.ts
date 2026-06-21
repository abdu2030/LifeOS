import { supabase } from '../../../lib/supabase'
import type {
  Goal,
  GoalHabitLink,
  GoalInput,
  GoalMilestone,
  GoalMilestoneInput,
  GoalTreeNode,
} from '../types/goal'

type GoalRow = {
  created_at: string
  description: string | null
  id: string
  parent_goal_id: string | null
  progress: number
  status: Goal['status']
  target_date: string | null
  title: string
  updated_at: string
  user_id: string
}

type GoalMilestoneRow = {
  completed: boolean
  created_at: string
  due_date: string | null
  goal_id: string
  id: string
  title: string
  updated_at: string
  user_id: string
}

type GoalHabitLinkRow = {
  created_at: string
  goal_id: string
  habit_id: string
  habits?:
    | {
        color: string
        id: string
        name: string
      }
    | Array<{
        color: string
        id: string
        name: string
      }>
    | null
  id: string
  user_id: string
}

const goalSelect =
  'id,user_id,parent_goal_id,title,description,status,progress,target_date,created_at,updated_at'
const milestoneSelect = 'id,user_id,goal_id,title,completed,due_date,created_at,updated_at'
const habitLinkSelect = 'id,user_id,goal_id,habit_id,created_at,habits(id,name,color)'

function mapGoal(row: GoalRow): Goal {
  return {
    createdAt: row.created_at,
    description: row.description,
    id: row.id,
    parentGoalId: row.parent_goal_id,
    progress: row.progress,
    status: row.status,
    targetDate: row.target_date,
    title: row.title,
    updatedAt: row.updated_at,
    userId: row.user_id,
  }
}

function mapGoalMilestone(row: GoalMilestoneRow): GoalMilestone {
  return {
    completed: row.completed,
    createdAt: row.created_at,
    dueDate: row.due_date,
    goalId: row.goal_id,
    id: row.id,
    title: row.title,
    updatedAt: row.updated_at,
    userId: row.user_id,
  }
}

function mapGoalHabitLink(row: GoalHabitLinkRow): GoalHabitLink {
  const habit = Array.isArray(row.habits) ? (row.habits[0] ?? null) : (row.habits ?? null)

  return {
    createdAt: row.created_at,
    goalId: row.goal_id,
    habit,
    habitId: row.habit_id,
    id: row.id,
    userId: row.user_id,
  }
}

export function buildGoalTree(goals: Goal[]): GoalTreeNode[] {
  const nodes = new Map<string, GoalTreeNode>()

  goals.forEach((goal) => {
    nodes.set(goal.id, { ...goal, children: [] })
  })

  const roots: GoalTreeNode[] = []

  nodes.forEach((node) => {
    if (node.parentGoalId && nodes.has(node.parentGoalId)) {
      nodes.get(node.parentGoalId)!.children.push(node)
      return
    }

    roots.push(node)
  })

  return roots
}

export function calculateGoalProgress(goalId: string, milestones: GoalMilestone[], links: GoalHabitLink[]) {
  const goalMilestones = milestones.filter((milestone) => milestone.goalId === goalId)
  const goalLinks = links.filter((link) => link.goalId === goalId)
  const signals: number[] = []

  if (goalMilestones.length) {
    const completed = goalMilestones.filter((milestone) => milestone.completed).length
    signals.push(Math.round((completed / goalMilestones.length) * 100))
  }

  if (goalLinks.length) {
    signals.push(Math.round((goalLinks.filter((link) => Boolean(link.habit)).length / goalLinks.length) * 100))
  }

  if (!signals.length) {
    return null
  }

  return Math.round(signals.reduce((sum, score) => sum + score, 0) / signals.length)
}

export async function listGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select(goalSelect)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => mapGoal(row as GoalRow))
}

export async function listGoalMilestones(userId: string) {
  const { data, error } = await supabase
    .from('goal_milestones')
    .select(milestoneSelect)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => mapGoalMilestone(row as GoalMilestoneRow))
}

export async function listGoalHabitLinks(userId: string) {
  const { data, error } = await supabase
    .from('goal_habit_links')
    .select(habitLinkSelect)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => mapGoalHabitLink(row as GoalHabitLinkRow))
}

export async function createGoal(userId: string, input: GoalInput) {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      description: input.description || null,
      parent_goal_id: input.parentGoalId || null,
      progress: input.progress,
      status: input.status,
      target_date: input.targetDate || null,
      title: input.title,
      user_id: userId,
    })
    .select(goalSelect)
    .single()

  if (error) {
    throw error
  }

  return mapGoal(data as GoalRow)
}

export async function updateGoal(userId: string, goalId: string, input: GoalInput) {
  const { data, error } = await supabase
    .from('goals')
    .update({
      description: input.description || null,
      parent_goal_id: input.parentGoalId || null,
      progress: input.progress,
      status: input.status,
      target_date: input.targetDate || null,
      title: input.title,
    })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select(goalSelect)
    .single()

  if (error) {
    throw error
  }

  return mapGoal(data as GoalRow)
}

export async function deleteGoal(userId: string, goalId: string) {
  const { error } = await supabase.from('goals').delete().eq('id', goalId).eq('user_id', userId)

  if (error) {
    throw error
  }
}

export async function createGoalMilestone(userId: string, input: GoalMilestoneInput) {
  const { data, error } = await supabase
    .from('goal_milestones')
    .insert({
      due_date: input.dueDate || null,
      goal_id: input.goalId,
      title: input.title,
      user_id: userId,
    })
    .select(milestoneSelect)
    .single()

  if (error) {
    throw error
  }

  return mapGoalMilestone(data as GoalMilestoneRow)
}

export async function toggleGoalMilestone(userId: string, milestone: GoalMilestone) {
  const { data, error } = await supabase
    .from('goal_milestones')
    .update({ completed: !milestone.completed })
    .eq('id', milestone.id)
    .eq('user_id', userId)
    .select(milestoneSelect)
    .single()

  if (error) {
    throw error
  }

  return mapGoalMilestone(data as GoalMilestoneRow)
}

export async function deleteGoalMilestone(userId: string, milestoneId: string) {
  const { error } = await supabase
    .from('goal_milestones')
    .delete()
    .eq('id', milestoneId)
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}

export async function linkGoalHabit(userId: string, goalId: string, habitId: string) {
  const { data, error } = await supabase
    .from('goal_habit_links')
    .upsert(
      {
        goal_id: goalId,
        habit_id: habitId,
        user_id: userId,
      },
      { onConflict: 'goal_id,habit_id' },
    )
    .select(habitLinkSelect)
    .single()

  if (error) {
    throw error
  }

  return mapGoalHabitLink(data as GoalHabitLinkRow)
}

export async function unlinkGoalHabit(userId: string, linkId: string) {
  const { error } = await supabase.from('goal_habit_links').delete().eq('id', linkId).eq('user_id', userId)

  if (error) {
    throw error
  }
}
