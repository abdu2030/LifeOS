import { createTransaction } from '../../finance/services/financeApi'
import { createGoal, createGoalMilestone } from '../../goals/services/goalsApi'
import { createHabit, toggleHabitCompletion } from '../../habits/services/habitsApi'
import { upsertEntry } from '../../journal/services/journalApi'
import { listQueuedOperations, removeQueuedOperation } from './offlineQueueService'

type OfflineSyncResult = {
  failed: number
  synced: number
}

export async function syncQueuedOperations(userId: string): Promise<OfflineSyncResult> {
  const operations = await listQueuedOperations()
  let synced = 0
  let failed = 0

  for (const operation of operations) {
    if (!operation.id) {
      continue
    }

    try {
      await runQueuedOperation(userId, operation.operation, operation.payload)
      await removeQueuedOperation(operation.id)
      synced += 1
    } catch (error) {
      console.error('Offline queue sync failed', error)
      failed += 1
    }
  }

  return { failed, synced }
}

async function runQueuedOperation(userId: string, operation: string, payload: unknown) {
  switch (operation) {
    case 'finance.createTransaction':
      return createTransaction(userId, payload as Parameters<typeof createTransaction>[1])
    case 'goals.createGoal':
      return createGoal(userId, payload as Parameters<typeof createGoal>[1])
    case 'goals.createMilestone':
      return createGoalMilestone(userId, payload as Parameters<typeof createGoalMilestone>[1])
    case 'habits.createHabit':
      return createHabit(userId, payload as Parameters<typeof createHabit>[1])
    case 'habits.toggleCompletion': {
      const input = payload as { completed: boolean; habitId: string; loggedOn: string }
      return toggleHabitCompletion(userId, input.habitId, input.completed, input.loggedOn)
    }
    case 'journal.upsertEntry':
      return upsertEntry(userId, payload as Parameters<typeof upsertEntry>[1])
    default:
      throw new Error(`Unsupported offline operation: ${operation}`)
  }
}
