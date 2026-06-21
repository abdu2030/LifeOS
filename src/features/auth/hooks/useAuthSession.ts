import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import { getCurrentSession } from '../services/authService'

type AuthSessionState = {
  isLoading: boolean
  session: Session | null
}

export function useAuthSession(): AuthSessionState {
  const [state, setState] = useState<AuthSessionState>({
    isLoading: true,
    session: null,
  })

  useEffect(() => {
    let isMounted = true

    getCurrentSession().then(({ data }) => {
      if (!isMounted) {
        return
      }

      setState({
        isLoading: false,
        session: data.session,
      })
    })

    return () => {
      isMounted = false
    }
  }, [])

  return state
}
