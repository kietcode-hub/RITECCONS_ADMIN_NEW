import type { User } from '@rmc-ms/shared-types'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, ApiError } from './api'

interface LoginResponse {
  accessToken: string
  user: Omit<User, 'passwordHash'>
}

interface AuthState {
  user: Omit<User, 'passwordHash'> | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('rmcms_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get<Omit<User, 'passwordHash'>>('/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('rmcms_token')
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post<LoginResponse>('/auth/login', { email, password })
    localStorage.setItem('rmcms_token', res.accessToken)
    setUser(res.user)
  }

  function logout() {
    localStorage.removeItem('rmcms_token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ApiError }
