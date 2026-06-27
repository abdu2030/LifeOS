import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = PropsWithChildren<{
  eyebrow: string
  subtitle: string
  title: string
}>

export function AuthLayout({ children, eyebrow, subtitle, title }: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <section className="auth-hero" aria-label="LifeOS authentication overview">
        <div className="auth-hero-top">
          <Link className="auth-brand" to="/">
            <span className="brand-mark">
              <svg viewBox="0 0 48 32" aria-hidden="true">
                <path d="M4 18 H12 L17 7 L25 27 L32 12 L37 18 H44" />
              </svg>
            </span>
            <span>
              <strong>LifeOS</strong>
              <small>Your life. Organized.</small>
            </span>
          </Link>
          <nav className="auth-nav" aria-label="Authentication">
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
          </nav>
        </div>
        <div>
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="auth-proof-grid">
          <span>Encrypted journal</span>
          <span>Private goals</span>
          <span>Habit intelligence</span>
        </div>
      </section>

      <section className="auth-panel">{children}</section>
    </main>
  )
}
