export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div data-testid="loading-skeleton" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  )
}

export function EmptyState({
  title = 'No results',
  description = 'Try adjusting search or filters.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="state-box card" data-testid="empty-state" role="status">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="state-box card" data-testid="error-state" role="alert">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="btn btn-primary" onClick={onRetry} data-testid="error-retry">
          Retry
        </button>
      ) : null}
    </div>
  )
}
