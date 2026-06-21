import { getTodayFocusTasks } from '../../tasks/services/taskService'
import { getHabitHeatmapSummary } from '../../habits/services/habitService'
import { navItems, reminders } from '../data/dashboardData'

export function getDashboardOverview() {
  const habitSummary = getHabitHeatmapSummary()

  return {
    focusTasks: getTodayFocusTasks(),
    habitDays: habitSummary.days,
    habitHeatmap: habitSummary.heatmap,
    navItems,
    reminders,
  }
}
