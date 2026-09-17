import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { getForceError, resetProducts, setForceError } from '../mock/products'
import { delay } from '../mock/delay'
import { Button } from '../components/Button'
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/States'

export function SettingsPage() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const [forceError, setForceErrorState] = useState(getForceError())
  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'empty' | 'error'>('idle')

  useEffect(() => {
    setForceError(forceError)
  }, [forceError])

  async function simulateLoading() {
    setDemoState('loading')
    await delay(1200)
    setDemoState('idle')
    showToast('Loading simulation finished', 'info')
  }

  return (
    <div data-testid="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Theme, mock API failure mode, and async UI demos.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Appearance</h2>
        <p>Current theme: <strong data-testid="settings-theme-value">{theme}</strong></p>
        <div className="btn-row">
          <Button
            variant={theme === 'light' ? 'primary' : 'ghost'}
            onClick={() => setTheme('light')}
            data-testid="theme-light"
          >
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'primary' : 'ghost'}
            onClick={() => setTheme('dark')}
            data-testid="theme-dark"
          >
            Dark
          </Button>
          <Button variant="ghost" onClick={toggleTheme} data-testid="theme-toggle-settings">
            Toggle
          </Button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Mock API</h2>
        <p>When enabled, product list/create/update/delete calls fail after the simulated delay.</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={forceError}
            onChange={(e) => {
              setForceErrorState(e.target.checked)
              showToast(
                e.target.checked ? 'Force error enabled' : 'Force error disabled',
                'info',
              )
            }}
            data-testid="force-error-toggle"
          />
          Force API error
        </label>
        <div className="btn-row" style={{ marginTop: '1rem' }}>
          <Button
            variant="ghost"
            onClick={() => {
              resetProducts()
              showToast('Product data reset to seed', 'success')
            }}
            data-testid="reset-products"
          >
            Reset product seed
          </Button>
        </div>
      </div>

      <div className="card">
        <h2>Async UI playground</h2>
        <div className="btn-row" style={{ marginBottom: '1rem' }}>
          <Button variant="primary" onClick={() => void simulateLoading()} data-testid="simulate-loading">
            Simulate loading
          </Button>
          <Button variant="ghost" onClick={() => setDemoState('empty')} data-testid="simulate-empty">
            Show empty
          </Button>
          <Button
            variant="danger"
            onClick={() => setDemoState('error')}
            data-testid="simulate-error"
          >
            Show error
          </Button>
          <Button variant="ghost" onClick={() => setDemoState('idle')} data-testid="simulate-idle">
            Clear
          </Button>
        </div>

        {demoState === 'loading' ? <LoadingSkeleton rows={3} /> : null}
        {demoState === 'empty' ? <EmptyState /> : null}
        {demoState === 'error' ? (
          <ErrorState
            message="Simulated failure from Settings playground."
            onRetry={() => setDemoState('idle')}
          />
        ) : null}
        {demoState === 'idle' ? (
          <p className="field-hint" data-testid="settings-playground-idle">
            Idle — pick a simulation above.
          </p>
        ) : null}
      </div>
    </div>
  )
}
