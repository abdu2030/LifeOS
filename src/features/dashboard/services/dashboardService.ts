import { getTodayFocusTasks } from '../../tasks/services/taskService'
import { habitDays, habitHeatmap, navItems, reminders } from '../data/dashboardData'

export function getDashboardOverview() {
  return {
    focusTasks: getTodayFocusTasks(),
    habitDays,
    habitHeatmap,
    navItems,
    reminders,
  }
}
