import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type User = {
  email: string
  name: string
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (name: string) => void
}

const AUTH_KEY = 'rtl-auth'
const DEMO_EMAIL = 'admin@demo.test'
const DEMO_PASSWORD = 'password123'

const AuthContext = createContext<AuthContextValue | null>(null)

function readUser(): User | null {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readUser())

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400))
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error('Invalid email or password')
    }
    const next: User = { email: DEMO_EMAIL, name: 'Demo Admin' }
    localStorage.setItem(AUTH_KEY, JSON.stringify(next))
    setUser(next)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback((name: string) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, name }
      localStorage.setItem(AUTH_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateProfile,
    }),
    [user, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const DEMO_CREDENTIALS = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
}
