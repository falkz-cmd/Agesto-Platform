import { http, HttpResponse } from 'msw'
import type { ApiResponse, AuthResponse } from '../types/api'
import { dashboardMock, ultimosAtendimentosMock } from './data/dashboard'
import { DEMO_EMAIL, DEMO_SENHA, buildMockJwt } from './data/auth'

/** Envelopa no formato ApiResponse do backend. */
function ok<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { success: true, message, data, errors: [] }
}

/**
 * Handlers do MSW. O `*` casa com qualquer origem, então funciona
 * independentemente do VITE_API_BASE_URL. Handlers de auth entram na web-04.
 */
export const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; senha?: string }
    if (body.email === DEMO_EMAIL && body.senha === DEMO_SENHA) {
      const data: AuthResponse = {
        token: buildMockJwt(),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      }
      return HttpResponse.json(ok(data, 'Login realizado com sucesso.'))
    }
    return HttpResponse.json(
      { success: false, message: 'Credenciais inválidas.', data: null, errors: [] },
      { status: 401 },
    )
  }),

  http.get('*/api/metrics/dashboard', () =>
    HttpResponse.json(ok(dashboardMock, 'Dashboard consolidado.')),
  ),

  http.get('*/api/atendimento', () =>
    HttpResponse.json(ok(ultimosAtendimentosMock)),
  ),
]
