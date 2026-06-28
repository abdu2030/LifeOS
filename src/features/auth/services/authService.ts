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

export function subscribeToAuthChanges(
  onChange: Parameters<typeof supabase.auth.onAuthStateChange>[0],
) {
  return supabase.auth.onAuthStateChange(onChange)
}

export function getFriendlyAuthErrorMessage(error: { message?: string } | null | undefined) {
  if (!error?.message) {
    return ''
  }

  if (error.message.toLowerCase().includes('invalid api key')) {
    return 'Supabase rejected the API key. Use the anon public key or publishable key from the same Supabase project as VITE_SUPABASE_URL, then restart the dev server.'
  }

  return error.message
}
