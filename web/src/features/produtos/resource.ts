import { createResource } from '../../lib/resource'
import type { Produto, ProdutoInput } from '../../types/api'

export const produtosResource = createResource<Produto, ProdutoInput>(
  '/api/produto',
  'produto',
)
