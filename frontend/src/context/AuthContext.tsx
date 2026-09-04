import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, _password: string) => Promise<void>
  register: (name: string, email: string, _password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'abn_user'

/**
 * MOCK AUTH — for the Phase-1 frontend only.
 * In production this calls POST /api/auth/login and /api/auth/register
 * (see backend/src/routes/auth.routes.ts) and stores the returned JWT,
 * not the user object itself, in memory (not localStorage).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const login: AuthContextValue['login'] = async (email) => {
    await new Promise((r) => setTimeout(r, 400))
    setUser({
      id: 'demo-user-1',
      name: email.split('@')[0] || 'User',
      email,
      profileCompletion: 0,
      verifications: [
        { label: 'Aadhaar Verified', verified: false },
        { label: 'Mobile Verified', verified: false },
        { label: 'Email Verified', verified: false },
        { label: 'Address Proof', verified: false },
      ],
    })
  }

  const register: AuthContextValue['register'] = async (name, email) => {
    await new Promise((r) => setTimeout(r, 400))
    setUser({
      id: 'demo-user-1',
      name,
      email,
      profileCompletion: 40,
      verifications: [
        { label: 'Aadhaar Verified', verified: false },
        { label: 'Mobile Verified', verified: false },
        { label: 'Email Verified', verified: true },
        { label: 'Address Proof', verified: false },
      ],
    })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
