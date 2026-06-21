import { getTodayFocusTasks } from '../../tasks/services/taskService'
import { getHabitHeatmapSummary } from '../../habits/services/habitService'
import { getUpcomingReminders } from '../../planner/services/plannerService'
import { navItems } from '../data/dashboardData'

export function getDashboardOverview() {
  const habitSummary = getHabitHeatmapSummary()

  return {
    focusTasks: getTodayFocusTasks(),
    habitDays: habitSummary.days,
    habitHeatmap: habitSummary.heatmap,
    navItems,
    reminders: getUpcomingReminders(),
  }
}
