import { focusTasks, habitDays, habitHeatmap, navItems, reminders } from '../data/dashboardData'

export function getDashboardOverview() {
  return {
    focusTasks,
    habitDays,
    habitHeatmap,
    navItems,
    reminders,
  }
}
