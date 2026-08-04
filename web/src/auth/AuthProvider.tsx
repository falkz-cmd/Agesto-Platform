import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../lib/api'
import { getToken, setToken, clearToken } from '../lib/token'
import { decodeJwt, isExpired, type JwtClaims } from './jwt'
import { AuthContext, type AuthContextValue } from './context'
import type { AuthResponse } from '../types/api'

/** Lê o token persistido no boot e descarta se inválido/expirado. */
function initialUser(): JwtClaims | null {
  const token = getToken()
  if (!token) return null
  const claims = decodeJwt(token)
  if (!claims || isExpired(claims)) {
    clearToken()
    return null
  }
  return claims
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtClaims | null>(initialUser)

  const login = useCallback(async (email: string, senha: string) => {
    const res = await api.post<AuthResponse>('/api/auth/login', { email, senha })
    setToken(res.token)
    setUser(decodeJwt(res.token))
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
