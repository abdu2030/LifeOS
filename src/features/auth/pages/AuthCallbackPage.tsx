import { Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function AuthCallbackPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="route-loading">
        <span className="brand-mark">
          <svg viewBox="0 0 48 32" aria-hidden="true">
            <path d="M4 18 H12 L17 7 L25 27 L32 12 L37 18 H44" />
          </svg>
        </span>
        Finishing sign in...
      </main>
    )
  }

  return <Navigate replace to={isAuthenticated ? '/' : '/login'} />
}
