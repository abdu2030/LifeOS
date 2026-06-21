export type GoalStatus = 'at_risk' | 'complete' | 'not_started' | 'off_track' | 'on_track'

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

export type GoalMilestone = {
  completed: boolean
  createdAt: string
  dueDate: string | null
  goalId: string
  id: string
  title: string
  updatedAt: string
  userId: string
}

export type GoalMilestoneInput = {
  dueDate?: string | null
  goalId: string
  title: string
}

export type GoalHabitLink = {
  createdAt: string
  goalId: string
  habit: {
    color: string
    id: string
    name: string
  } | null
  habitId: string
  id: string
  userId: string
}
