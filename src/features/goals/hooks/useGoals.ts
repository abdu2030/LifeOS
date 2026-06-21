import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { buildGoalTree, createGoal, deleteGoal, listGoals, updateGoal } from '../services/goalsApi'
import type { GoalInput } from '../types/goal'

const goalsQueryKey = ['goals']

export function useGoals() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const goalsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listGoals(user!.id),
    queryKey: [...goalsQueryKey, user?.id],
  })

  const invalidateGoals = () =>
    queryClient.invalidateQueries({ queryKey: [...goalsQueryKey, user?.id] })

  const createGoalMutation = useMutation({
    mutationFn: (input: GoalInput) => createGoal(user!.id, input),
    onSuccess: () => {
      void invalidateGoals()
    },
  })

  const updateGoalMutation = useMutation({
    mutationFn: ({ goalId, input }: { goalId: string; input: GoalInput }) =>
      updateGoal(user!.id, goalId, input),
    onSuccess: () => {
      void invalidateGoals()
    },
  })

  const deleteGoalMutation = useMutation({
    mutationFn: (goalId: string) => deleteGoal(user!.id, goalId),
    onSuccess: () => {
      void invalidateGoals()
    },
  })

  const goals = useMemo(() => goalsQuery.data ?? [], [goalsQuery.data])
  const goalTree = useMemo(() => buildGoalTree(goals), [goals])

  return {
    createGoal: createGoalMutation.mutateAsync,
    deleteGoal: deleteGoalMutation.mutateAsync,
    error: goalsQuery.error,
    goalTree,
    goals,
    isCreating: createGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
    isLoading: goalsQuery.isLoading,
    isUpdating: updateGoalMutation.isPending,
    updateGoal: updateGoalMutation.mutateAsync,
  }
}
