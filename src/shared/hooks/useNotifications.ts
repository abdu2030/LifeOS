import { useCallback, useMemo, useState } from 'react'

type NotificationSupport = {
  hasNotificationApi: boolean
  hasServiceWorker: boolean
}

export function useNotifications() {
  const support = useMemo<NotificationSupport>(
    () => ({
      hasNotificationApi: typeof window !== 'undefined' && 'Notification' in window,
      hasServiceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    }),
    [],
  )
  const [permission, setPermission] = useState<NotificationPermission>(
    support.hasNotificationApi ? Notification.permission : 'denied',
  )
  const [isRegistering, setIsRegistering] = useState(false)
  const isSupported = support.hasNotificationApi && support.hasServiceWorker

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return 'denied' as NotificationPermission
    }

    setIsRegistering(true)

    try {
      const nextPermission = await Notification.requestPermission()
      setPermission(nextPermission)

      if (nextPermission === 'granted') {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification('LifeOS notifications ready', {
          body: 'Habit reminders are enabled for this device.',
          icon: '/favicon.svg',
          tag: 'lifeos-notification-test',
        })
      }

      return nextPermission
    } finally {
      setIsRegistering(false)
    }
  }, [isSupported])

  return {
    isEnabled: permission === 'granted',
    isRegistering,
    isSupported,
    permission,
    requestPermission,
  }
}
