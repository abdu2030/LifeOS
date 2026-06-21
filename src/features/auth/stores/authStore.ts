import type { Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

type AuthState = {
  isLoading: boolean
  session: Session | null
  user: User | null
  setLoading: (isLoading: boolean) => void
  setSession: (session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  session: null,
  user: null,
  setLoading: (isLoading) => set({ isLoading }),
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
    }),
}))
