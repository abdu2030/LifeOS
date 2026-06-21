import { useAuthStore } from '../stores/authStore'

export function useAuthSession() {
  return useAuthStore((state) => ({
    isLoading: state.isLoading,
    session: state.session,
  }))
}
