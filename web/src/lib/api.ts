import { getToken, clearToken } from './token'
import type { ApiResponse } from '../types/api'

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

/** Erro de API com status HTTP e mensagens do envelope. */
export class ApiError extends Error {
  status: number
  errors: string[]

  constructor(status: number, message: string, errors: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

/**
 * Faz a chamada, injeta o Bearer, desembrulha o { success, data } e normaliza
 * erros. Em 401, limpa o token e redireciona pro login.
 */
async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${BASE}${path}`, { ...init, headers })

  let body: ApiResponse<T> | null = null
  try {
    body = (await res.json()) as ApiResponse<T>
  } catch {
    body = null
  }

  // 401 com token = sessão expirada -> limpa e volta pro login.
  // No login não há token; ali 401 significa credenciais inválidas (mensagem do corpo).
  if (res.status === 401 && token) {
    clearToken()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(
      res.status,
      body?.message ?? `Erro ${res.status}`,
      body?.errors ?? [],
    )
  }

  return body.data as T
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, data: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  del: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
}
