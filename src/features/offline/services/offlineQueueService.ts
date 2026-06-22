import { openDB, type DBSchema } from 'idb'

import type { OfflineQueueItem } from '../types/offlineQueue'

type LifeOSOfflineDb = DBSchema & {
  queue: {
    key: number
    value: OfflineQueueItem
  }
}

const dbName = 'lifeos-offline'
const queueStore = 'queue'

async function getOfflineDb() {
  return openDB<LifeOSOfflineDb>(dbName, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(queueStore)) {
        database.createObjectStore(queueStore, {
          autoIncrement: true,
          keyPath: 'id',
        })
      }
    },
  })
}

export async function enqueueOfflineOperation(operation: string, payload: unknown) {
  const database = await getOfflineDb()

  await database.add(queueStore, {
    createdAt: new Date().toISOString(),
    operation,
    payload,
    status: 'queued',
  })
}

export async function listQueuedOperations() {
  const database = await getOfflineDb()
  return database.getAll(queueStore)
}

export async function removeQueuedOperation(id: number) {
  const database = await getOfflineDb()
  await database.delete(queueStore, id)
}

export async function getQueuedOperationCount() {
  const operations = await listQueuedOperations()
  return operations.length
}
