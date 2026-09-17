import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="auth-page" data-testid="not-found-page">
      <div className="card auth-card">
        <h1>404 — Not found</h1>
        <p>The page you requested does not exist.</p>
        <Link to="/" className="btn btn-primary" data-testid="not-found-home">
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
