import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { AuthLayout } from '../components/AuthLayout'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
  const { isAuthenticated, isLoading, loginWithGoogle, register } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isLoading && isAuthenticated) {
    return <Navigate replace to="/" />
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    const { error } = await register({ displayName, email, password })

    if (error) {
      setFormError(error.message)
    } else {
      setSuccessMessage('Account created. Check your email to confirm your LifeOS login.')
    }

    setIsSubmitting(false)
  }

  async function handleGoogleLogin() {
    setFormError('')
    const { error } = await loginWithGoogle()

    if (error) {
      setFormError(error.message)
    }
  }

  return (
    <AuthLayout
      eyebrow="Start your system"
      subtitle="Create your private workspace for goals, focus, reminders, money, mood, and momentum."
      title="Build your personal operating system."
    >
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-card-header">
          <h2>Create account</h2>
          <p>Set up your LifeOS profile.</p>
        </div>

        <label className="auth-field">
          Name
          <input
            autoComplete="name"
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Arjun Patel"
            type="text"
            value={displayName}
          />
        </label>

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
            autoComplete="new-password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            required
            type="password"
            value={password}
          />
        </label>

        {formError ? <p className="auth-error">{formError}</p> : null}
        {successMessage ? <p className="auth-success">{successMessage}</p> : null}

        <button className="auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <button className="auth-secondary" onClick={handleGoogleLogin} type="button">
          Continue with Google
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
