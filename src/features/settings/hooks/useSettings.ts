import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { buildDataExport, getProfile, updateProfile } from '../services/settingsApi'
import type { ProfileInput } from '../types/settings'

const settingsQueryKey = ['settings', 'profile']

export function useSettings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => getProfile(user!.id),
    queryKey: [...settingsQueryKey, user?.id],
  })

  const updateProfileMutation = useMutation({
    mutationFn: (input: ProfileInput) => updateProfile(user!.id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...settingsQueryKey, user?.id] })
    },
  })

  const exportDataMutation = useMutation({
    mutationFn: () => buildDataExport(user!.id),
  })

  return {
    exportData: exportDataMutation.mutateAsync,
    isExporting: exportDataMutation.isPending,
    isLoading: profileQuery.isLoading,
    isSavingProfile: updateProfileMutation.isPending,
    profile: profileQuery.data ?? null,
    profileError: profileQuery.error,
    updateProfile: updateProfileMutation.mutateAsync,
    user,
  }
}
