'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminUser {
  id: number
  email: string
  fullName: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: AdminUser | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const STORAGE_KEY = 'admin_session'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AdminUser
        if (parsed?.id && parsed?.email) {
          setUser(parsed)
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }

      const adminUser: AdminUser = { id: data.id, email: data.email, fullName: data.fullName }
      setUser(adminUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser))
      return { success: true }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
