'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi } from '@/lib/api/auth'
import { LoginFormResponse } from '@/types/login'

type User = LoginFormResponse['user']

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (err) {
      setUser(null)
      // Don't set error for 401 (not authenticated) - it's expected
      if (err instanceof Error && !err.message.includes('401')) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      refreshUser: fetchUser,
      logout
    }}>
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
