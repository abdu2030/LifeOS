import { useQuery } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { getDashboardOverview } from '../services/dashboardService'

export function useDashboardOverview() {
  const { user } = useAuth()

  return useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => getDashboardOverview(user!.id, user?.email),
    queryKey: ['dashboard-overview', user?.id],
  })
}
