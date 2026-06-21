import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '../layout/AppLayout'
import { AuthCallbackPage } from '../../features/auth/pages/AuthCallbackPage'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterPage } from '../../features/auth/pages/RegisterPage'
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<AuthCallbackPage />} path="/auth/callback" />
      <Route element={<AppLayout />}>
        <Route element={<DashboardPage />} index />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
