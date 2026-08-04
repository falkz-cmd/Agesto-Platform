import type { Servico } from '../../types/api'
import { makeStore, crudHandlers, type Store } from '../lib/http'

const now = new Date().toISOString()

const seed: Servico[] = [
  { id: 1, uuid: crypto.randomUUID(), descricao: 'Instalação de AC', tipoCobranca: 'Empreitada', valorHora: null, valorEmpreitada: 350, createdAt: now, updatedAt: now },
  { id: 2, uuid: crypto.randomUUID(), descricao: 'Manutenção preventiva', tipoCobranca: 'PorHora', valorHora: 140, valorEmpreitada: null, createdAt: now, updatedAt: now },
  { id: 3, uuid: crypto.randomUUID(), descricao: 'Limpeza / higienização', tipoCobranca: 'PorHora', valorHora: 90, valorEmpreitada: null, createdAt: now, updatedAt: now },
]

const store: Store<Servico> = makeStore(seed)

export const servicoHandlers = crudHandlers('/api/servico', store)
