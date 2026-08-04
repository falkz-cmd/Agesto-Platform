import { http, HttpResponse } from 'msw'
import type { ApiResponse } from '../types/api'
import { dashboardMock, ultimosAtendimentosMock } from './data/dashboard'

/** Envelopa no formato ApiResponse do backend. */
function ok<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { success: true, message, data, errors: [] }
}

/**
 * Handlers do MSW. O `*` casa com qualquer origem, então funciona
 * independentemente do VITE_API_BASE_URL. Handlers de auth entram na web-04.
 */
export const handlers = [
  http.get('*/api/metrics/dashboard', () =>
    HttpResponse.json(ok(dashboardMock, 'Dashboard consolidado.')),
  ),

  http.get('*/api/atendimento', () =>
    HttpResponse.json(ok(ultimosAtendimentosMock)),
  ),
]
