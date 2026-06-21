import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { getCurrentSession, subscribeToAuthChanges } from '../services/authService'
import { useAuthStore } from '../stores/authStore'

export function AuthProvider({ children }: PropsWithChildren) {
  const setLoading = useAuthStore((state) => state.setLoading)
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    let isMounted = true

    getCurrentSession()
      .then(({ data }) => {
        if (!isMounted) {
          return
        }

        setSession(data.session)
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    const {
      data: { subscription },
    } = subscribeToAuthChanges(async (_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [setLoading, setSession])

  return children
}
