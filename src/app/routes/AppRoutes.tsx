import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '../layout/AppLayout'
import { AuthCallbackPage } from '../../features/auth/pages/AuthCallbackPage'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterPage } from '../../features/auth/pages/RegisterPage'
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage'
import { FilesPage } from '../../features/files/pages/FilesPage'
import { FinancePage } from '../../features/finance/pages/FinancePage'
import { GoalsPage } from '../../features/goals/pages/GoalsPage'
import { HabitsPage } from '../../features/habits/pages/HabitsPage'
import { WeeklyInsightsPage } from '../../features/insights/pages/WeeklyInsightsPage'
import { JournalPage } from '../../features/journal/pages/JournalPage'
import { CalendarPage } from '../../features/planner/pages/CalendarPage'
import { PluginsPage } from '../../features/plugins/pages/PluginsPage'
import { SettingsPage } from '../../features/settings/pages/SettingsPage'
import { TasksPage } from '../../features/tasks/pages/TasksPage'
import { WidgetsPage } from '../../features/widgets/pages/WidgetsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<AuthCallbackPage />} path="/auth/callback" />
      <Route element={<AppLayout />}>
        <Route element={<DashboardPage />} index />
        <Route element={<FinancePage />} path="/finance" />
        <Route element={<GoalsPage />} path="/goals" />
        <Route element={<HabitsPage />} path="/habits" />
        <Route element={<WeeklyInsightsPage />} path="/insights" />
        <Route element={<JournalPage />} path="/journal" />
        <Route element={<CalendarPage />} path="/calendar" />
        <Route element={<TasksPage />} path="/tasks" />
        <Route element={<FilesPage />} path="/files" />
        <Route element={<PluginsPage />} path="/plugins" />
        <Route element={<SettingsPage />} path="/settings" />
        <Route element={<WidgetsPage />} path="/widgets" />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
