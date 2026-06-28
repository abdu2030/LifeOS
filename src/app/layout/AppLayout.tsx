import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../../features/auth/hooks/useAuth'
import { DashboardSidebar } from '../../features/dashboard/components/DashboardSidebar'
import { DashboardTopbar } from '../../features/dashboard/components/DashboardTopbar'
import { navItems } from '../../features/dashboard/data/dashboardData'

export function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('nav-drawer-open', isSidebarOpen)

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.classList.remove('nav-drawer-open')
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isSidebarOpen])

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
      <button
        aria-label="Close navigation menu"
        className={isSidebarOpen ? 'sidebar-scrim visible' : 'sidebar-scrim'}
        onClick={() => setIsSidebarOpen(false)}
        type="button"
      />
      <DashboardSidebar
        isOpen={isSidebarOpen}
        navItems={navItems}
        onNavigate={() => setIsSidebarOpen(false)}
      />
      <section className="workspace">
        <DashboardTopbar onMenuClick={() => setIsSidebarOpen(true)} />
        <Outlet />
      </section>
    </main>
  )
}
