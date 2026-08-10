import { config } from './config'
import { ApiError } from './errors'
import { getToken, clearToken } from './tokenStore'
import { mockFetch } from '@/mocks/handlers'
import type { ApiResponse } from '@/types/api'

type Method = 'GET' | 'POST'

async function apiFetch<T>(method: Method, path: string, body?: unknown): Promise<T> {
  if (config.useMocks) return mockFetch<T>(method, path, body)

  const token = await getToken()
  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  let env: ApiResponse<T> | null = null
  try {
    env = (await res.json()) as ApiResponse<T>
  } catch {
    env = null
  }

  // 401 com token = sessão expirada -> limpa (login trata o 401 sem token).
  if (res.status === 401 && token) await clearToken()

  if (!res.ok || !env?.success) {
    throw new ApiError(res.status, env?.message ?? `Erro ${res.status}`)
  }
  return env.data as T
}

export const api = {
  get: <T>(path: string) => apiFetch<T>('GET', path),
  post: <T>(path: string, body: unknown) => apiFetch<T>('POST', path, body),
}
