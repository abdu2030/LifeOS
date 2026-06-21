import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '../layout/AppLayout'
import { AuthCallbackPage } from '../../features/auth/pages/AuthCallbackPage'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterPage } from '../../features/auth/pages/RegisterPage'
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage'
import { FinancePage } from '../../features/finance/pages/FinancePage'
import { GoalsPage } from '../../features/goals/pages/GoalsPage'
import { HabitsPage } from '../../features/habits/pages/HabitsPage'
import { WeeklyInsightsPage } from '../../features/insights/pages/WeeklyInsightsPage'
import { JournalPage } from '../../features/journal/pages/JournalPage'
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
        <Route element={<WidgetsPage />} path="/widgets" />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
