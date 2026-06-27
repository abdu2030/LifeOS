import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const getProfileMock = vi.fn()
const listGoalsMock = vi.fn()
const listHabitsMock = vi.fn()
const listJournalEntriesMock = vi.fn()
const listPlannerEventsMock = vi.fn()
const listTransactionsMock = vi.fn()
const listWeeklyInsightsMock = vi.fn()

vi.mock('../../src/features/settings/services/settingsApi', () => ({
  getProfile: getProfileMock,
}))

vi.mock('../../src/features/finance/services/financeApi', () => ({
  listTransactions: listTransactionsMock,
}))

vi.mock('../../src/features/habits/services/habitsApi', () => ({
  listHabits: listHabitsMock,
}))

vi.mock('../../src/features/journal/services/journalApi', () => ({
  listJournalEntries: listJournalEntriesMock,
}))

vi.mock('../../src/features/goals/services/goalsApi', async () => {
  const actual = await vi.importActual<typeof import('../../src/features/goals/services/goalsApi')>(
    '../../src/features/goals/services/goalsApi',
  )

  return {
    ...actual,
    listGoals: listGoalsMock,
  }
})

vi.mock('../../src/features/planner/services/plannerService', () => ({
  listPlannerEvents: listPlannerEventsMock,
}))

vi.mock('../../src/features/insights/services/weeklyInsightsApi', () => ({
  listWeeklyInsights: listWeeklyInsightsMock,
}))

const { getDashboardOverview } = await import('../../src/features/dashboard/services/dashboardService')

describe('getDashboardOverview', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-27T08:00:00.000Z'))

    getProfileMock.mockResolvedValue({
      avatarUrl: null,
      displayName: 'Abdul',
      id: 'user-1',
      onboardingCompleted: true,
      timezone: 'Africa/Nairobi',
    })
    listTransactionsMock.mockResolvedValue([
      {
        accountId: null,
        amount: 1200,
        category: 'Salary',
        createdAt: '2026-06-26T08:00:00.000Z',
        description: null,
        id: 'income-1',
        occurredOn: '2026-06-26',
        type: 'income',
        userId: 'user-1',
      },
      {
        accountId: null,
        amount: 200,
        category: 'Food',
        createdAt: '2026-06-27T08:00:00.000Z',
        description: 'Dinner',
        id: 'expense-1',
        occurredOn: '2026-06-27',
        type: 'expense',
        userId: 'user-1',
      },
    ])
    listHabitsMock.mockResolvedValue([
      {
        color: '#22c55e',
        createdAt: '2026-06-01T00:00:00.000Z',
        description: null,
        freezeTokens: 1,
        frequency: 'daily',
        id: 'habit-1',
        isActive: true,
        logs: [
          {
            count: 1,
            createdAt: '2026-06-27T08:00:00.000Z',
            habitId: 'habit-1',
            id: 'log-1',
            loggedOn: '2026-06-27',
            note: null,
            userId: 'user-1',
          },
        ],
        name: 'Plan the day',
        targetCount: 1,
        updatedAt: '2026-06-27T08:00:00.000Z',
        userId: 'user-1',
      },
    ])
    listJournalEntriesMock.mockResolvedValue([
      {
        body: '<p>Feeling focused and calm.</p>',
        createdAt: '2026-06-27T08:00:00.000Z',
        entryAt: '2026-06-27T08:00:00.000Z',
        id: 'journal-1',
        isEncrypted: false,
        moodScore: 8,
        tags: ['focus'],
        title: 'Morning note',
        updatedAt: '2026-06-27T08:00:00.000Z',
        userId: 'user-1',
      },
      {
        body: '<p>Yesterday was slower.</p>',
        createdAt: '2026-06-26T08:00:00.000Z',
        entryAt: '2026-06-26T08:00:00.000Z',
        id: 'journal-2',
        isEncrypted: false,
        moodScore: 6,
        tags: [],
        title: 'Yesterday',
        updatedAt: '2026-06-26T08:00:00.000Z',
        userId: 'user-1',
      },
    ])
    listGoalsMock.mockResolvedValue([
      {
        createdAt: '2026-06-01T00:00:00.000Z',
        description: null,
        id: 'goal-1',
        parentGoalId: null,
        progress: 50,
        status: 'on_track',
        targetDate: null,
        title: 'Build LifeOS',
        updatedAt: '2026-06-27T08:00:00.000Z',
        userId: 'user-1',
      },
      {
        createdAt: '2026-06-02T00:00:00.000Z',
        description: null,
        id: 'goal-2',
        parentGoalId: 'goal-1',
        progress: 80,
        status: 'on_track',
        targetDate: null,
        title: 'Ship dashboard',
        updatedAt: '2026-06-27T08:00:00.000Z',
        userId: 'user-1',
      },
    ])
    listPlannerEventsMock.mockResolvedValue([
      {
        allDay: false,
        createdAt: '2026-06-27T08:00:00.000Z',
        description: 'Review progress',
        endsAt: null,
        id: 'event-1',
        reminderMinutes: 15,
        startsAt: '2026-06-27T10:00:00.000Z',
        title: 'LifeOS review',
        updatedAt: '2026-06-27T08:00:00.000Z',
        userId: 'user-1',
      },
    ])
    listWeeklyInsightsMock.mockResolvedValue([
      {
        createdAt: '2026-06-27T08:00:00.000Z',
        financeDelta: 1000,
        generatedAt: '2026-06-27T08:00:00.000Z',
        goalProgressDelta: 5,
        habitScore: 100,
        id: 'insight-1',
        moodAverage: 7,
        reportMarkdown: '# Great week',
        summary: 'You made visible progress this week.',
        updatedAt: '2026-06-27T08:00:00.000Z',
        userId: 'user-1',
        weekStart: '2026-06-21',
      },
    ])
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('builds the dashboard from live user records instead of demo data', async () => {
    const overview = await getDashboardOverview('user-1', 'abdul@example.com')

    expect(overview.displayName).toBe('Abdul')
    expect(overview.finance).toMatchObject({ balance: 1000, expense: 200, income: 1200 })
    expect(overview.habitScore).toBe(100)
    expect(overview.averageMood).toBe(7)
    expect(overview.moodDelta).toBe(2)
    expect(overview.goalProgress).toBe(65)
    expect(overview.topGoal?.title).toBe('Build LifeOS')
    expect(overview.goalBranches).toHaveLength(1)
    expect(overview.latestJournalEntry?.title).toBe('Morning note')
    expect(overview.reminders[0]?.title).toBe('LifeOS review')
    expect(overview.categoryShares[0]).toMatchObject({ category: 'Food', percent: 100, total: 200 })
    expect(overview.habitHeatmap).toHaveLength(91)
  })
})
