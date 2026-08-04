import { createResource } from '../../lib/resource'
import type { Cliente, ClienteInput } from '../../types/api'

export const clientesResource = createResource<Cliente, ClienteInput>(
  '/api/cliente',
  'cliente',
)
