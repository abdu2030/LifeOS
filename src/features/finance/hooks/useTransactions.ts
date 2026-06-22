import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { useOfflineMutation } from '../../offline/hooks/useOfflineMutation'
import { createTransaction, deleteTransaction, listTransactions } from '../services/financeApi'
import type { TransactionInput } from '../types/finance'

const transactionsQueryKey = ['finance', 'transactions']

export function useTransactions() {
  const { user } = useAuth()
  const { runOrQueue } = useOfflineMutation()
  const queryClient = useQueryClient()

  const transactionsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listTransactions(user!.id),
    queryKey: [...transactionsQueryKey, user?.id],
  })

  const createTransactionMutation = useMutation({
    mutationFn: (input: TransactionInput) =>
      runOrQueue('finance.createTransaction', input, (nextInput) =>
        createTransaction(user!.id, nextInput),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...transactionsQueryKey, user?.id] })
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...transactionsQueryKey, user?.id] })
    },
  })

  return {
    createTransaction: createTransactionMutation.mutateAsync,
    deleteTransaction: deleteTransactionMutation.mutateAsync,
    error: transactionsQuery.error,
    isCreating: createTransactionMutation.isPending,
    isDeleting: deleteTransactionMutation.isPending,
    isLoading: transactionsQuery.isLoading,
    transactions: transactionsQuery.data ?? [],
  }
}
