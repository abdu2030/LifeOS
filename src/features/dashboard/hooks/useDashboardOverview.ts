import { useMemo } from 'react'

import { getDashboardOverview } from '../services/dashboardService'

export function useDashboardOverview() {
  return useMemo(() => getDashboardOverview(), [])
}
