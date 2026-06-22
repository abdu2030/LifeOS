import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/hooks/useAuth'
import { buildWeeklyMetrics } from '../services/weeklyInsightsEngine'
import {
  generateWeeklyReport,
  listWeeklyInsights,
  upsertWeeklyInsight,
} from '../services/weeklyInsightsApi'

const weeklyInsightsQueryKey = ['weekly-insights']
const weeklyMetricsQueryKey = ['weekly-insights', 'metrics']

export function useWeeklyInsights() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const weeklyInsightsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => listWeeklyInsights(user!.id),
    queryKey: [...weeklyInsightsQueryKey, user?.id],
  })
  const weeklyMetricsQuery = useQuery({
    enabled: Boolean(user),
    queryFn: () => buildWeeklyMetrics(user!.id),
    queryKey: [...weeklyMetricsQueryKey, user?.id],
  })

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const metrics = weeklyMetricsQuery.data ?? (await buildWeeklyMetrics(user!.id))
      const reportMarkdown = await generateWeeklyReport(metrics)
      return upsertWeeklyInsight(user!.id, metrics, reportMarkdown)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...weeklyInsightsQueryKey, user?.id] })
      void queryClient.invalidateQueries({ queryKey: [...weeklyMetricsQueryKey, user?.id] })
    },
  })

  return {
    error: weeklyInsightsQuery.error ?? weeklyMetricsQuery.error,
    generateReport: generateReportMutation.mutateAsync,
    insights: weeklyInsightsQuery.data ?? [],
    isGenerating: generateReportMutation.isPending,
    isLoading: weeklyInsightsQuery.isLoading || weeklyMetricsQuery.isLoading,
    metrics: weeklyMetricsQuery.data,
  }
}
