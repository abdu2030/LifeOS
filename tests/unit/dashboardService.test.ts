import { describe, expect, it } from 'vitest'

import { getDashboardOverview } from '../../src/features/dashboard/services/dashboardService'

describe('getDashboardOverview', () => {
  it('combines dashboard, task, habit, and planner data for the overview', () => {
    const overview = getDashboardOverview()

    expect(overview.navItems.length).toBeGreaterThan(0)
    expect(overview.focusTasks).toHaveLength(4)
    expect(overview.habitDays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    expect(overview.habitHeatmap).toHaveLength(91)
    expect(overview.reminders.map((reminder) => reminder.title)).toContain('Doctor Appointment')
  })
})
