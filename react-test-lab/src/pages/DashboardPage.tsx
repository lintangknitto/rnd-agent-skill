import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductStatsSync, listProducts } from '../mock/products'
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/States'

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState(getProductStatsSync())

  async function load() {
    setLoading(true)
    setError(null)
    try {
      await listProducts()
      setStats(getProductStatsSync())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div data-testid="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of mock product catalog.</p>
        </div>
        <Link to="/products/new" className="btn btn-primary" data-testid="dashboard-add-product">
          Add product
        </Link>
      </div>

      {loading ? <LoadingSkeleton rows={3} /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}

      {!loading && !error ? (
        <>
          <div className="stats-grid" data-testid="dashboard-stats">
            <div className="stat-card" data-testid="stat-total">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total products</div>
            </div>
            <div className="stat-card" data-testid="stat-active">
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card" data-testid="stat-draft">
              <div className="stat-value">{stats.draft}</div>
              <div className="stat-label">Draft</div>
            </div>
            <div className="stat-card" data-testid="stat-archived">
              <div className="stat-value">{stats.archived}</div>
              <div className="stat-label">Archived</div>
            </div>
          </div>
          {stats.total === 0 ? (
            <EmptyState title="No products yet" description="Create your first product to begin." />
          ) : (
            <div className="card">
              <p>
                Use <Link to="/products">Products</Link> for search, filter, sort, pagination, and
                CRUD. Toggle theme or force API errors in <Link to="/settings">Settings</Link>.
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
