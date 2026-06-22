import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import {
  createPlannerEvent,
  deletePlannerEvent,
  listPlannerEvents,
} from '../services/plannerService'
import type { PlannerEventInput } from '../types/reminder'

const plannerEventsQueryKey = ['planner', 'events']

export function usePlannerEvents() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const eventsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listPlannerEvents(user!.id),
    queryKey: [...plannerEventsQueryKey, user?.id],
  })

  const createEventMutation = useMutation({
    mutationFn: (input: PlannerEventInput) => createPlannerEvent(user!.id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...plannerEventsQueryKey, user?.id] })
    },
  })

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => deletePlannerEvent(user!.id, eventId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...plannerEventsQueryKey, user?.id] })
    },
  })

  return {
    createEvent: createEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutateAsync,
    error: eventsQuery.error,
    events: eventsQuery.data ?? [],
    isCreating: createEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isLoading: eventsQuery.isLoading,
  }
}
