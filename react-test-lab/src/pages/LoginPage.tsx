import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { DEMO_CREDENTIALS, useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/Button'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email'
    if (!password) next.password = 'Password is required'
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    try {
      await login(email, password)
      showToast('Signed in successfully', 'success')
      navigate(from, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setErrors({ form: message })
      showToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page" data-testid="login-page">
      <div className="card auth-card">
        <h1>React Test Lab</h1>
        <p>Sign in to exercise auth, CRUD, and UI flows.</p>
        <form className="form" onSubmit={onSubmit} noValidate data-testid="login-form">
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="login-email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
            {errors.email ? (
              <span id="login-email-error" className="field-error" role="alert" data-testid="login-email-error">
                {errors.email}
              </span>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="login-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            {errors.password ? (
              <span
                id="login-password-error"
                className="field-error"
                role="alert"
                data-testid="login-password-error"
              >
                {errors.password}
              </span>
            ) : null}
          </div>
          {errors.form ? (
            <p className="field-error" role="alert" data-testid="login-form-error">
              {errors.form}
            </p>
          ) : null}
          <Button type="submit" variant="primary" disabled={submitting} data-testid="login-submit">
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="field-hint" data-testid="login-hint" style={{ marginTop: '1rem' }}>
          Demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
        </p>
      </div>
    </div>
  )
}
