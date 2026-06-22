import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { OfflineContext } from '../contexts/OfflineContext'
import { checkConnection } from '../services/connectionService'
import { getQueuedOperationCount } from '../services/offlineQueueService'
import { syncQueuedOperations } from '../services/offlineSyncService'

export function OfflineProvider({ children }: React.PropsWithChildren) {
  const { user } = useAuth()
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )
  const [pendingCount, setPendingCount] = useState(0)
  const [lastSyncMessage, setLastSyncMessage] = useState('All changes synced')

  const refreshQueue = useCallback(async () => {
    setPendingCount(await getQueuedOperationCount())
  }, [])

  const refreshConnection = useCallback(async () => {
    const nextIsOnline = await checkConnection()
    setIsOnline(nextIsOnline)
    return nextIsOnline
  }, [])

  const flushQueue = useCallback(async () => {
    if (!user || !isOnline) {
      return
    }

    const queuedCount = await getQueuedOperationCount()

    if (!queuedCount) {
      setPendingCount(0)
      setLastSyncMessage('All changes synced')
      return
    }

    setPendingCount(queuedCount)
    setLastSyncMessage('Syncing offline changes...')

    const result = await syncQueuedOperations(user.id)
    const nextCount = await getQueuedOperationCount()
    setPendingCount(nextCount)

    if (result.synced > 0 && result.failed === 0) {
      setLastSyncMessage('Synced')
      await notifySynced(result.synced)
      return
    }

    if (nextCount > 0) {
      setLastSyncMessage(`${nextCount} changes waiting to sync`)
    }
  }, [isOnline, user])

  useEffect(() => {
    const handleOnline = () => {
      window.setTimeout(() => {
        void refreshConnection().then((nextIsOnline) => {
          if (nextIsOnline) {
            void flushQueue()
          }
        })
      }, 0)
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.setTimeout(() => {
      void refreshQueue()
      void refreshConnection()
    }, 0)
    const intervalId = window.setInterval(() => {
      void refreshConnection()
    }, 5000)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [flushQueue, refreshConnection, refreshQueue])

  const syncMessage = !isOnline
    ? pendingCount
      ? `${pendingCount} changes queued offline`
      : 'Offline mode active'
    : lastSyncMessage

  const value = useMemo(
    () => ({
      isOnline,
      pendingCount,
      refreshQueue,
      syncMessage,
    }),
    [isOnline, pendingCount, refreshQueue, syncMessage],
  )

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
}

async function notifySynced(count: number) {
  if (!('Notification' in window) || Notification.permission !== 'granted' || !('serviceWorker' in navigator)) {
    return
  }

  const registration = await navigator.serviceWorker.ready
  await registration.showNotification('Synced', {
    body: `${count} offline ${count === 1 ? 'change' : 'changes'} synced to LifeOS.`,
    icon: '/favicon.svg',
    tag: 'lifeos-offline-sync',
  })
}
