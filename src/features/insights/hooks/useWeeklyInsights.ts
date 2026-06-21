import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { buildWeeklyMetrics } from '../services/weeklyInsightsEngine'
import {
  generateWeeklyReport,
  listWeeklyInsights,
  upsertWeeklyInsight,
} from '../services/weeklyInsightsApi'

const weeklyInsightsQueryKey = ['weekly-insights']

export function useWeeklyInsights() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const weeklyInsightsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listWeeklyInsights(user!.id),
    queryKey: [...weeklyInsightsQueryKey, user?.id],
  })

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const metrics = await buildWeeklyMetrics(user!.id)
      const reportMarkdown = await generateWeeklyReport(metrics)
      return upsertWeeklyInsight(user!.id, metrics, reportMarkdown)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...weeklyInsightsQueryKey, user?.id] })
    },
  })

  return {
    error: weeklyInsightsQuery.error,
    generateReport: generateReportMutation.mutateAsync,
    insights: weeklyInsightsQuery.data ?? [],
    isGenerating: generateReportMutation.isPending,
    isLoading: weeklyInsightsQuery.isLoading,
  }
}
