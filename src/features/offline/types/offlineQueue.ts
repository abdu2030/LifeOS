export type OfflineQueueItem = {
  createdAt: string
  id?: number
  operation: string
  payload: unknown
  status: 'queued' | 'synced'
}

export type OfflineStatus = {
  isOnline: boolean
  pendingCount: number
  syncMessage: string
}
