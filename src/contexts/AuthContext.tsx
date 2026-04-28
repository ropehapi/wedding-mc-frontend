import { createContext, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { publicClient } from '@/api/client'
import type { LoginResponse, User } from '@/types/api'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

function hasValidToken() {
  return !!localStorage.getItem('access_token')
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (hasValidToken()) {
      setIsAuthenticated(true)
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          setUser(JSON.parse(stored) as User)
        } catch {
          localStorage.removeItem('user')
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await publicClient.post<LoginResponse>('/v1/auth/login', { email, password })
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    }
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        await publicClient.post(
          '/v1/auth/logout',
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
      }
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
