import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/Button'

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [name, setName] = useState(user?.name ?? '')
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Display name is required')
      return
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      return
    }
    setError(null)
    updateProfile(name.trim())
    showToast('Profile updated', 'success')
  }

  return (
    <div data-testid="profile-page">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Update display name with client-side validation.</p>
        </div>
      </div>

      <form className="form card" onSubmit={onSubmit} noValidate data-testid="profile-form">
        <div className="field">
          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            value={user?.email ?? ''}
            disabled
            data-testid="profile-email"
          />
          <span className="field-hint">Email is fixed for the demo account.</span>
        </div>
        <div className="field">
          <label htmlFor="profile-name">Display name</label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="profile-name"
            aria-invalid={Boolean(error)}
          />
          {error ? (
            <span className="field-error" role="alert" data-testid="profile-name-error">
              {error}
            </span>
          ) : null}
        </div>
        <Button type="submit" variant="primary" data-testid="profile-save">
          Save profile
        </Button>
      </form>
    </div>
  )
}
