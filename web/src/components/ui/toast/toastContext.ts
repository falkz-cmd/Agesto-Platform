import { createContext } from 'react'

export type ToastTone = 'success' | 'error'

export interface ToastApi {
  show: (tone: ToastTone, message: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)
