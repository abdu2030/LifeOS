import { useQuery } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { getProfile } from '../services/settingsApi'

export const profileQueryKey = ['settings', 'profile']

export function useUserProfile() {
  const { user } = useAuth()

  return useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => getProfile(user!.id),
    queryKey: [...profileQueryKey, user?.id],
  })
}
