self.addEventListener('message', (event) => {
  if (event.data?.type !== 'LIFEOS_TEST_NOTIFICATION') {
    return
  }

  self.registration.showNotification(event.data.title, {
    body: event.data.body,
    icon: '/favicon.svg',
    tag: 'lifeos-notification-test',
  })
})

self.addEventListener('push', (event) => {
  const fallback = {
    body: 'You have a LifeOS reminder waiting.',
    title: 'LifeOS',
  }
  const payload = event.data ? event.data.json() : fallback

  event.waitUntil(
    self.registration.showNotification(payload.title || fallback.title, {
      body: payload.body || fallback.body,
      icon: '/favicon.svg',
      tag: payload.tag || 'lifeos-reminder',
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow('/habits'))
})
