import { FinanceWidget } from '../../finance/components/FinanceWidget'
import { HabitWidget } from '../../habits/components/HabitWidget'
import {
  GoalsOverviewWidget,
  JournalMoodWidget,
  TodaysFocusWidget,
  UpcomingRemindersWidget,
  WeeklyExpensesWidget,
  WeeklyInsightsWidget,
} from '../components/WidgetCards'
import type { WidgetDefinition, WidgetId } from '../types/widget'

export const widgetRegistry: Record<WidgetId, WidgetDefinition> = {
  'finance-overview': {
    id: 'finance-overview',
    title: 'Finance Overview',
    description: 'Balance, income, expense, and spending category summary.',
    category: 'Finance',
    defaultLayout: { i: 'finance-overview', x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
    component: FinanceWidget,
  },
  'habit-tracker': {
    id: 'habit-tracker',
    title: 'Habit Tracker',
    description: 'Weekly habit score and streak momentum.',
    category: 'Habits',
    defaultLayout: { i: 'habit-tracker', x: 4, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
    component: HabitWidget,
  },
  'journal-mood': {
    id: 'journal-mood',
    title: 'Journal Mood',
    description: 'Mood trend and recent journal prompt.',
    category: 'Journal',
    defaultLayout: { i: 'journal-mood', x: 8, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
    component: JournalMoodWidget,
  },
  'goals-overview': {
    id: 'goals-overview',
    title: 'Goals Overview',
    description: 'Goal tree progress and risk status.',
    category: 'Goals',
    defaultLayout: { i: 'goals-overview', x: 0, y: 5, w: 6, h: 4, minW: 4, minH: 3 },
    component: GoalsOverviewWidget,
  },
  'weekly-insights': {
    id: 'weekly-insights',
    title: 'Weekly Insights',
    description: 'AI-generated weekly review and trend summary.',
    category: 'Insights',
    defaultLayout: { i: 'weekly-insights', x: 6, y: 5, w: 6, h: 4, minW: 4, minH: 3 },
    component: WeeklyInsightsWidget,
  },
  'todays-focus': {
    id: 'todays-focus',
    title: "Today's Focus",
    description: 'Priority task list for the day.',
    category: 'Planning',
    defaultLayout: { i: 'todays-focus', x: 0, y: 9, w: 4, h: 3, minW: 3, minH: 2 },
    component: TodaysFocusWidget,
  },
  'weekly-expenses': {
    id: 'weekly-expenses',
    title: 'Weekly Expenses',
    description: 'Expense bars and top spending categories.',
    category: 'Finance',
    defaultLayout: { i: 'weekly-expenses', x: 4, y: 9, w: 4, h: 3, minW: 3, minH: 2 },
    component: WeeklyExpensesWidget,
  },
  'upcoming-reminders': {
    id: 'upcoming-reminders',
    title: 'Upcoming Reminders',
    description: 'Calendar and reminder items coming soon.',
    category: 'Planning',
    defaultLayout: { i: 'upcoming-reminders', x: 8, y: 9, w: 4, h: 3, minW: 3, minH: 2 },
    component: UpcomingRemindersWidget,
  },
}

export const defaultWidgetIds = Object.keys(widgetRegistry) as WidgetId[]

export function getWidgetDefinition(widgetId: WidgetId) {
  return widgetRegistry[widgetId]
}

export function getDefaultWidgetLayouts() {
  return defaultWidgetIds.map((widgetId) => widgetRegistry[widgetId].defaultLayout)
}
