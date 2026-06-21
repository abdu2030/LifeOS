import { supabase } from '../../../lib/supabase'
import type { EmailPasswordCredentials, SignUpCredentials } from '../types/auth'

function getAuthRedirectUrl() {
  if (import.meta.env.VITE_AUTH_REDIRECT_URL) {
    return import.meta.env.VITE_AUTH_REDIRECT_URL
  }

  return globalThis.location?.origin ?? 'http://localhost:5173'
}

export function signUpWithEmail({ displayName, email, password }: SignUpCredentials) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName,
      },
      emailRedirectTo: getAuthRedirectUrl(),
    },
  })
}

export function signInWithEmail({ email, password }: EmailPasswordCredentials) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthRedirectUrl(),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
}

export function signOut() {
  return supabase.auth.signOut()
}

export function getCurrentSession() {
  return supabase.auth.getSession()
}
