import { api } from '@/lib/api'
import { db } from '@/db/instance'
import type { LocalDb } from '@/db/types'
import type { SyncCargaResponse } from '@/types/api'

export interface CargaResult {
  clientes: number
  produtos: number
  servicos: number
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
