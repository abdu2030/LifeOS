import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { AuthLayout } from '../components/AuthLayout'
import { useAuth } from '../hooks/useAuth'
import { getFriendlyAuthErrorMessage } from '../services/authService'
import { getSupabaseConfigurationError } from '../../../lib/supabase'

type LocationState = {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  const { isAuthenticated, isLoading, login, loginWithGoogle } = useAuth()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'
  const configurationError = getSupabaseConfigurationError()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isLoading && isAuthenticated) {
    return <Navigate replace to={from} />
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (configurationError) {
      setFormError(configurationError)
      return
    }

    setIsSubmitting(true)

    const { error } = await login({ email, password })

    if (error) {
      setFormError(getFriendlyAuthErrorMessage(error))
    }

    setIsSubmitting(false)
  }

  async function handleGoogleLogin() {
    setFormError('')

    if (configurationError) {
      setFormError(configurationError)
      return
    }

    const { error } = await loginWithGoogle()

    if (error) {
      setFormError(getFriendlyAuthErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      subtitle="Sign in to keep your plans, habits, journal, and insights in one calm command center."
      title="Run your day with clarity."
    >
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-card-header">
          <h2>Sign in</h2>
          <p>Use your LifeOS account to continue.</p>
        </div>

        <label className="auth-field">
          Email address
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </label>

        <label className="auth-field">
          Password
          <input
            autoComplete="current-password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            type="password"
            value={password}
          />
        </label>

        {formError ? <p className="auth-error">{formError}</p> : null}

        <button className="auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <button className="auth-secondary" onClick={handleGoogleLogin} type="button">
          Continue with Google
        </button>

        <p className="auth-switch">
          New to LifeOS? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
