import { useCallback } from 'react'

import {
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
} from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import type { EmailPasswordCredentials, SignUpCredentials } from '../types/auth'

export function useAuth() {
  const isLoading = useAuthStore((state) => state.isLoading)
  const session = useAuthStore((state) => state.session)
  const user = useAuthStore((state) => state.user)

  const login = useCallback((credentials: EmailPasswordCredentials) => {
    return signInWithEmail(credentials)
  }, [])

  const register = useCallback((credentials: SignUpCredentials) => {
    return signUpWithEmail(credentials)
  }, [])

  const loginWithGoogle = useCallback(() => {
    return signInWithGoogle()
  }, [])

  const logout = useCallback(() => {
    return signOut()
  }, [])

  return {
    isAuthenticated: Boolean(session),
    isLoading,
    login,
    loginWithGoogle,
    logout,
    register,
    session,
    user,
  }
}
