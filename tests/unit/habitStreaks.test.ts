import { describe, expect, it } from 'vitest'

import type { Habit, HabitLog } from '../../src/features/habits/types/habit'
import { calculateHabitStreak } from '../../src/features/habits/utils/streaks'

function createHabit(logs: Array<Pick<HabitLog, 'count' | 'loggedOn' | 'note'>>): Habit {
  return {
    color: '#22c55e',
    createdAt: '2026-06-01T00:00:00.000Z',
    description: null,
    freezeTokens: 2,
    frequency: 'daily',
    id: 'habit-1',
    isActive: true,
    logs: logs.map((log, index) => ({
      count: log.count,
      createdAt: `2026-06-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
      habitId: 'habit-1',
      id: `log-${index}`,
      loggedOn: log.loggedOn,
      note: log.note,
      userId: 'user-1',
    })),
    name: 'Morning planning',
    targetCount: 1,
    updatedAt: '2026-06-01T00:00:00.000Z',
    userId: 'user-1',
  }
}

describe('calculateHabitStreak', () => {
  it('counts a current streak through consecutive completed days', () => {
    const habit = createHabit([
      { count: 1, loggedOn: '2026-06-25', note: null },
      { count: 1, loggedOn: '2026-06-26', note: null },
      { count: 1, loggedOn: '2026-06-27', note: null },
    ])

    expect(calculateHabitStreak(habit, '2026-06-27')).toEqual({
      completedToday: true,
      currentStreak: 3,
      frozenDays: 0,
      longestStreak: 3,
    })
  })

  it('keeps a streak alive when a freeze token was used yesterday', () => {
    const habit = createHabit([
      { count: 1, loggedOn: '2026-06-25', note: null },
      { count: 0, loggedOn: '2026-06-26', note: 'freeze' },
      { count: 1, loggedOn: '2026-06-27', note: null },
    ])

    expect(calculateHabitStreak(habit, '2026-06-27')).toMatchObject({
      completedToday: true,
      currentStreak: 3,
      frozenDays: 1,
      longestStreak: 3,
    })
  })

  it('stops the current streak at the first missed day but preserves the best run', () => {
    const habit = createHabit([
      { count: 1, loggedOn: '2026-06-22', note: null },
      { count: 1, loggedOn: '2026-06-23', note: null },
      { count: 1, loggedOn: '2026-06-24', note: null },
      { count: 1, loggedOn: '2026-06-27', note: null },
    ])

    expect(calculateHabitStreak(habit, '2026-06-27')).toEqual({
      completedToday: true,
      currentStreak: 1,
      frozenDays: 0,
      longestStreak: 3,
    })
  })
})
