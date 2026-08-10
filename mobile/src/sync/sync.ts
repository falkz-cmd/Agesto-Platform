import { api } from '@/lib/api'
import { db } from '@/db/instance'
import type { LocalDb } from '@/db/types'
import type { AgendaItem, SyncCargaResponse } from '@/types/api'

export interface CargaResult {
  clientes: number
  produtos: number
  servicos: number
}

export interface SyncResult extends CargaResult {
  agenda: number
}

/**
 * Carga: puxa dados de referência do servidor e grava no banco local.
 * `database` é injetável (default = singleton por plataforma) — testes passam
 * o adapter de memória diretamente.
 */
export async function carga(database: LocalDb = db): Promise<CargaResult> {
  const last = await database.getMeta('lastSync')
  const qs = last ? `?ultimaSincronizacao=${encodeURIComponent(last)}` : ''
  const data = await api.get<SyncCargaResponse>(`/api/sync/carga${qs}`)

  await database.saveClientes(data.clientes)
  await database.saveProdutos(data.produtos)
  await database.saveServicos(data.servicos)
  await database.setMeta('lastSync', data.sincronizadoEm)

  return {
    clientes: data.clientes.length,
    produtos: data.produtos.length,
    servicos: data.servicos.length,
  }
}

/**
 * Busca a agenda do dia (GET /api/atendimento/agenda) e cacheia local.
 * NB: a Carga não inclui a agenda hoje — este passo cobre isso (delta de
 * backend: idealmente a agenda entraria na Carga para ficar 100% offline).
 */
export async function syncAgenda(database: LocalDb = db): Promise<number> {
  const items = await api.get<AgendaItem[]>('/api/atendimento/agenda')
  await database.saveAgenda(items)
  return items.length
}

/** Sincronização inicial (login): dados de referência + agenda do dia. */
export async function initialSync(database: LocalDb = db): Promise<SyncResult> {
  const c = await carga(database)
  const agenda = await syncAgenda(database)
  return { ...c, agenda }
}
