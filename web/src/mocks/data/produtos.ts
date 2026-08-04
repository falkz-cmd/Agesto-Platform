import type { Produto } from '../../types/api'
import { makeStore, crudHandlers, type Store } from '../lib/http'

const now = new Date().toISOString()

const seed: Produto[] = [
  { id: 1, uuid: crypto.randomUUID(), nome: 'Suporte universal', preco: 70, quantidadeEstoque: 16, createdAt: now, updatedAt: now },
  { id: 2, uuid: crypto.randomUUID(), nome: 'Gás R-410a (kg)', preco: 68, quantidadeEstoque: 3, createdAt: now, updatedAt: now },
  { id: 3, uuid: crypto.randomUUID(), nome: 'Cano de dreno (m)', preco: 22, quantidadeEstoque: 40, createdAt: now, updatedAt: now },
  { id: 4, uuid: crypto.randomUUID(), nome: 'Fita PVC', preco: 15, quantidadeEstoque: 31, createdAt: now, updatedAt: now },
]

const store: Store<Produto> = makeStore(seed)

export const produtoHandlers = crudHandlers('/api/produto', store)
