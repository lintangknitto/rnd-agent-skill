import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from './Button'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
]

export function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app-shell" data-testid="app-shell">
      <aside className="sidebar" data-testid="sidebar">
        <div className="sidebar-brand" data-testid="sidebar-brand">
          React Test Lab
        </div>
        <nav className="sidebar-nav" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
              data-testid={`nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span data-testid="sidebar-user" className="field-hint">
            {user?.name} ({user?.email})
          </span>
          <Button
            variant="ghost"
            onClick={toggleTheme}
            data-testid="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            Theme: {theme}
          </Button>
          <Button variant="danger" onClick={logout} data-testid="logout-button">
            Log out
          </Button>
        </div>
      </aside>
      <main className="main" data-testid="main-content">
        <Outlet />
      </main>
    </div>
  )
}
