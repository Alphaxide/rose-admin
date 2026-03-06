'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  // Initialize from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('auth')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setIsAuthenticated(data.isAuthenticated)
        setUser(data.user)
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password) {
      const userData = {
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      }
      setIsAuthenticated(true)
      setUser(userData)
      sessionStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: userData }))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    sessionStorage.removeItem('auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
