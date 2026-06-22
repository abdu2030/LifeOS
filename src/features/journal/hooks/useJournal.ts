import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { useOfflineMutation } from '../../offline/hooks/useOfflineMutation'
import { listJournalEntries, upsertEntry } from '../services/journalApi'
import type { JournalEntryInput } from '../types/journal'

const journalQueryKey = ['journal', 'entries']

export function useJournal() {
  const { user } = useAuth()
  const { runOrQueue } = useOfflineMutation()
  const queryClient = useQueryClient()

  const entriesQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listJournalEntries(user!.id),
    queryKey: [...journalQueryKey, user?.id],
  })

  const upsertEntryMutation = useMutation({
    mutationFn: (input: JournalEntryInput) =>
      runOrQueue('journal.upsertEntry', input, (nextInput) => upsertEntry(user!.id, nextInput)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...journalQueryKey, user?.id] })
    },
  })

  return {
    entries: entriesQuery.data ?? [],
    error: entriesQuery.error,
    isLoading: entriesQuery.isLoading,
    isSaving: upsertEntryMutation.isPending,
    upsertEntry: upsertEntryMutation.mutateAsync,
  }
}
