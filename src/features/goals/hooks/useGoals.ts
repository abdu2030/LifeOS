import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { useOfflineMutation } from '../../offline/hooks/useOfflineMutation'
import {
  buildGoalTree,
  calculateGoalProgress,
  createGoal,
  createGoalMilestone,
  deleteGoal,
  deleteGoalMilestone,
  linkGoalHabit,
  listGoalHabitLinks,
  listGoalMilestones,
  listGoals,
  toggleGoalMilestone,
  unlinkGoalHabit,
  updateGoal,
} from '../services/goalsApi'
import type { Goal, GoalHabitLink, GoalInput, GoalMilestone, GoalMilestoneInput } from '../types/goal'

const goalsQueryKey = ['goals']
const goalMilestonesQueryKey = ['goals', 'milestones']
const goalHabitLinksQueryKey = ['goals', 'habit-links']
const emptyGoals: Goal[] = []
const emptyMilestones: GoalMilestone[] = []
const emptyHabitLinks: GoalHabitLink[] = []

export function useGoals() {
  const { user } = useAuth()
  const { runOrQueue } = useOfflineMutation()
  const queryClient = useQueryClient()

  const goalsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listGoals(user!.id),
    queryKey: [...goalsQueryKey, user?.id],
  })

  const milestonesQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listGoalMilestones(user!.id),
    queryKey: [...goalMilestonesQueryKey, user?.id],
  })

  const habitLinksQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listGoalHabitLinks(user!.id),
    queryKey: [...goalHabitLinksQueryKey, user?.id],
  })

  const invalidateGoals = () =>
    queryClient.invalidateQueries({ queryKey: [...goalsQueryKey, user?.id] })
  const invalidateMilestones = () =>
    queryClient.invalidateQueries({ queryKey: [...goalMilestonesQueryKey, user?.id] })
  const invalidateHabitLinks = () =>
    queryClient.invalidateQueries({ queryKey: [...goalHabitLinksQueryKey, user?.id] })

  async function syncGoalProgress(goalId: string, nextMilestones = milestones, nextLinks = habitLinks) {
    const goal = goals.find((item) => item.id === goalId)
    const progress = calculateGoalProgress(goalId, nextMilestones, nextLinks)

    if (!goal || progress === null || progress === goal.progress) {
      return
    }

    await updateGoal(user!.id, goalId, {
      description: goal.description ?? '',
      parentGoalId: goal.parentGoalId,
      progress,
      status: progress === 100 ? 'complete' : goal.status === 'complete' ? 'on_track' : goal.status,
      targetDate: goal.targetDate,
      title: goal.title,
    })
  }

  const createGoalMutation = useMutation({
    mutationFn: (input: GoalInput) =>
      runOrQueue('goals.createGoal', input, (nextInput) => createGoal(user!.id, nextInput)),
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

  const createMilestoneMutation = useMutation({
    mutationFn: (input: GoalMilestoneInput) =>
      runOrQueue('goals.createMilestone', input, (nextInput) =>
        createGoalMilestone(user!.id, nextInput),
      ),
    onSuccess: async (milestone) => {
      if (!milestone) {
        await invalidateMilestones()
        return
      }

      await invalidateMilestones()
      await syncGoalProgress(milestone.goalId, [...milestones, milestone])
      await invalidateGoals()
    },
  })

  const toggleMilestoneMutation = useMutation({
    mutationFn: (milestone: GoalMilestone) => toggleGoalMilestone(user!.id, milestone),
    onSuccess: async (milestone) => {
      const nextMilestones = milestones.map((item) => (item.id === milestone.id ? milestone : item))
      await invalidateMilestones()
      await syncGoalProgress(milestone.goalId, nextMilestones)
      await invalidateGoals()
    },
  })

  const deleteMilestoneMutation = useMutation({
    mutationFn: (milestone: GoalMilestone) => deleteGoalMilestone(user!.id, milestone.id).then(() => milestone),
    onSuccess: async (milestone) => {
      const nextMilestones = milestones.filter((item) => item.id !== milestone.id)
      await invalidateMilestones()
      await syncGoalProgress(milestone.goalId, nextMilestones)
      await invalidateGoals()
    },
  })

  const linkHabitMutation = useMutation({
    mutationFn: ({ goalId, habitId }: { goalId: string; habitId: string }) =>
      linkGoalHabit(user!.id, goalId, habitId),
    onSuccess: async (link) => {
      await invalidateHabitLinks()
      await syncGoalProgress(link.goalId, milestones, [...habitLinks, link])
      await invalidateGoals()
    },
  })

  const unlinkHabitMutation = useMutation({
    mutationFn: (linkId: string) => unlinkGoalHabit(user!.id, linkId).then(() => linkId),
    onSuccess: async (linkId) => {
      const link = habitLinks.find((item) => item.id === linkId)
      const nextLinks = habitLinks.filter((item) => item.id !== linkId)
      await invalidateHabitLinks()

      if (link) {
        await syncGoalProgress(link.goalId, milestones, nextLinks)
        await invalidateGoals()
      }
    },
  })

  const goals = goalsQuery.data ?? emptyGoals
  const milestones = milestonesQuery.data ?? emptyMilestones
  const habitLinks = habitLinksQuery.data ?? emptyHabitLinks
  const goalTree = useMemo(() => buildGoalTree(goals), [goals])
  const progressByGoalId = useMemo(
    () =>
      goals.reduce<Record<string, number | null>>((scores, goal) => {
        scores[goal.id] = calculateGoalProgress(goal.id, milestones, habitLinks)
        return scores
      }, {}),
    [goals, habitLinks, milestones],
  )

  return {
    createMilestone: createMilestoneMutation.mutateAsync,
    createGoal: createGoalMutation.mutateAsync,
    deleteGoal: deleteGoalMutation.mutateAsync,
    deleteMilestone: deleteMilestoneMutation.mutateAsync,
    error: goalsQuery.error,
    goalTree,
    goals,
    habitLinks,
    isCreating: createGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
    isLoading: goalsQuery.isLoading || milestonesQuery.isLoading || habitLinksQuery.isLoading,
    isUpdating:
      updateGoalMutation.isPending ||
      createMilestoneMutation.isPending ||
      toggleMilestoneMutation.isPending ||
      deleteMilestoneMutation.isPending ||
      linkHabitMutation.isPending ||
      unlinkHabitMutation.isPending,
    linkHabit: linkHabitMutation.mutateAsync,
    milestones,
    progressByGoalId,
    toggleMilestone: toggleMilestoneMutation.mutateAsync,
    unlinkHabit: unlinkHabitMutation.mutateAsync,
    updateGoal: updateGoalMutation.mutateAsync,
  }
}
