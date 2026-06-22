import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { useOfflineMutation } from '../../offline/hooks/useOfflineMutation'
import {
  createHabit,
  listHabits,
  spendFreezeToken,
  toggleHabitCompletion,
} from '../services/habitsApi'
import type { Habit, HabitInput } from '../types/habit'
import { getTodayKey } from '../utils/streaks'

const habitsQueryKey = ['habits']

export function useHabits() {
  const { user } = useAuth()
  const { runOrQueue } = useOfflineMutation()
  const queryClient = useQueryClient()
  const todayKey = getTodayKey()

  const habitsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listHabits(user!.id),
    queryKey: [...habitsQueryKey, user?.id],
  })

  const createHabitMutation = useMutation({
    mutationFn: (input: HabitInput) =>
      runOrQueue('habits.createHabit', input, (nextInput) => createHabit(user!.id, nextInput)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...habitsQueryKey, user?.id] })
    },
  })

  const toggleCompletionMutation = useMutation({
    mutationFn: ({ completed, habitId }: { completed: boolean; habitId: string }) =>
      runOrQueue(
        'habits.toggleCompletion',
        { completed, habitId, loggedOn: todayKey },
        (nextInput) =>
          toggleHabitCompletion(user!.id, nextInput.habitId, nextInput.completed, nextInput.loggedOn),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...habitsQueryKey, user?.id] })
    },
  })

  const freezeTokenMutation = useMutation({
    mutationFn: (habit: Habit) => spendFreezeToken(user!.id, habit, todayKey),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...habitsQueryKey, user?.id] })
    },
  })

  return {
    createHabit: createHabitMutation.mutateAsync,
    error: habitsQuery.error,
    habits: habitsQuery.data ?? [],
    isCreating: createHabitMutation.isPending,
    isLoading: habitsQuery.isLoading,
    isUpdating: toggleCompletionMutation.isPending || freezeTokenMutation.isPending,
    todayKey,
    toggleCompletion: toggleCompletionMutation.mutateAsync,
    useFreeze: freezeTokenMutation.mutateAsync,
  }
}
