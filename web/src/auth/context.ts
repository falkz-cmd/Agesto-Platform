import { createContext } from 'react'
import type { JwtClaims } from './jwt'

export interface AuthContextValue {
  user: JwtClaims | null
  isAuthenticated: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
