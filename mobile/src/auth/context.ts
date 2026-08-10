import { createContext } from 'react'

export interface AuthValue {
  token: string | null
  ready: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthValue | null>(null)
