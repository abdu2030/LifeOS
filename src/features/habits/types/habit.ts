export type HabitHeatmapLevel = 0 | 1 | 2 | 3 | 4

export type HabitHeatmapSummary = {
  days: string[]
  heatmap: HabitHeatmapLevel[]
}
