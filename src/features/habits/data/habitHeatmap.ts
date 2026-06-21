import type { HabitHeatmapLevel } from '../types/habit'

export const habitDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const habitHeatmap: HabitHeatmapLevel[] = Array.from({ length: 91 }, (_, index) => {
  const pattern: HabitHeatmapLevel[] = [0, 2, 3, 1, 4, 2, 0, 3, 4, 2, 1, 3, 4]
  return pattern[index % pattern.length]
})
