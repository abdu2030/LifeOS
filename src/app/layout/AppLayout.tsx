import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../../features/auth/hooks/useAuth'
import { DashboardSidebar } from '../../features/dashboard/components/DashboardSidebar'
import { DashboardTopbar } from '../../features/dashboard/components/DashboardTopbar'
import { useDashboardOverview } from '../../features/dashboard/hooks/useDashboardOverview'

export function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  const { navItems } = useDashboardOverview()
  const location = useLocation()

  if (isLoading) {
    return (
      <main className="route-loading">
        <span className="brand-mark">
          <svg viewBox="0 0 48 32" aria-hidden="true">
            <path d="M4 18 H12 L17 7 L25 27 L32 12 L37 18 H44" />
          </svg>
        </span>
        Loading LifeOS...
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return (
    <main className="app-shell">
      <DashboardSidebar navItems={navItems} />
      <section className="workspace">
        <DashboardTopbar />
        <Outlet />
      </section>
    </main>
  )
}
