export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled'

export type Goal = {
  createdAt: string
  description: string | null
  id: string
  parentGoalId: string | null
  progress: number
  status: GoalStatus
  targetDate: string | null
  title: string
  updatedAt: string
  userId: string
}

export type GoalInput = {
  description?: string
  parentGoalId?: string | null
  progress: number
  status: GoalStatus
  targetDate?: string | null
  title: string
}

export type GoalTreeNode = Goal & {
  children: GoalTreeNode[]
}
