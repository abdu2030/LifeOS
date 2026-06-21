import { habitDays, habitHeatmap } from '../data/habitHeatmap'
import type { HabitHeatmapSummary } from '../types/habit'

export function getHabitHeatmapSummary(): HabitHeatmapSummary {
  return {
    days: habitDays,
    heatmap: habitHeatmap,
  }
}
