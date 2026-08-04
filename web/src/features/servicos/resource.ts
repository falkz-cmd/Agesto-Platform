import { createResource } from '../../lib/resource'
import type { Servico, ServicoInput } from '../../types/api'

export const servicosResource = createResource<Servico, ServicoInput>(
  '/api/servico',
  'servico',
)
