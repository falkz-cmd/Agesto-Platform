import { describe, it, expect } from '@jest/globals'
import { api } from './api'
import type { AuthResponse } from '@/types/api'

describe('api (mock)', () => {
  it('login aceita a credencial demo e retorna token', async () => {
    const res = await api.post<AuthResponse>('/api/auth/login', {
      email: 'agente@agesto.app',
      senha: 'agesto123',
    })
    expect(res.token).toBeTruthy()
    expect(res.token.split('.')).toHaveLength(3)
  })

  it('login rejeita credencial inválida com 401', async () => {
    await expect(
      api.post('/api/auth/login', { email: 'x@x.com', senha: 'errada' }),
    ).rejects.toMatchObject({ status: 401 })
  })
})
