import { supabase } from '../../../lib/supabase'
import type { Goal, GoalInput, GoalTreeNode } from '../types/goal'

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

const goalSelect =
  'id,user_id,parent_goal_id,title,description,status,progress,target_date,created_at,updated_at'

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
