import { enqueueOfflineOperation } from '../services/offlineQueueService'
import { useOfflineStatus } from './useOfflineStatus'

export function useOfflineMutation() {
  const { isOnline, refreshQueue } = useOfflineStatus()

  async function runOrQueue<TInput, TResult>(
    operation: string,
    input: TInput,
    mutation: (input: TInput) => Promise<TResult>,
  ) {
    if (isOnline) {
      return mutation(input)
    }

    await enqueueOfflineOperation(operation, input)
    await refreshQueue()
    return undefined
  }

  return { isOnline, runOrQueue }
}
