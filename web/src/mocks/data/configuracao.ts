import { http, HttpResponse } from 'msw'
import type { Configuracao, TipoOperacao } from '../../types/api'
import { ok } from '../lib/http'

const now = new Date().toISOString()

// Singleton por empresa. Seed em "Servico" (foco do produto).
let config: Configuracao = {
  id: 1,
  tipoOperacao: 'Servico',
  empresaId: 1,
  createdAt: now,
  updatedAt: now,
}

export const configuracaoHandlers = [
  http.get('*/api/configuracao', () => HttpResponse.json(ok(config, 'Configuração encontrada.'))),
  http.put('*/api/configuracao', async ({ request }) => {
    const body = (await request.json()) as { tipoOperacao: TipoOperacao }
    config = { ...config, tipoOperacao: body.tipoOperacao, updatedAt: new Date().toISOString() }
    return HttpResponse.json(ok(config, 'Configuração atualizada.'))
  }),
]
