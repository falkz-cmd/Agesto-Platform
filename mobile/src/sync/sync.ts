import { api } from '@/lib/api'
import { db } from '@/db/instance'
import { saveConfig } from '@/lib/appConfig'
import type { LocalDb } from '@/db/types'
import type {
  AgendaItem,
  SyncCargaResponse,
  SyncDescargaRequest,
  SyncDescargaResponse,
} from '@/types/api'

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
  if (data.configuracao) {
    await saveConfig(database, data.configuracao)
  }
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

export interface DescargaResult {
  clientesImportados: number
  atendimentosImportados: number
  erros: string[]
}

/** Descarga: empurra clientes e atendimentos criados offline e marca sincronizado. */
export async function descarga(database: LocalDb = db): Promise<DescargaResult> {
  const clientesPend = (await database.getPendingClientes()).filter((c) => c.syncedAt === null)
  const atendPend = await database.getPendingAtendimentos()

  if (clientesPend.length === 0 && atendPend.length === 0) {
    return { clientesImportados: 0, atendimentosImportados: 0, erros: [] }
  }

  const body: SyncDescargaRequest = {
    clientes: clientesPend.map((c) => ({
      nome: c.nome, telefone: c.telefone, cpf: c.cpf, logradouro: c.logradouro,
      numero: c.numero, bairro: c.bairro, cidade: c.cidade, cep: c.cep,
    })),
    atendimentos: atendPend.map((a) => ({
      uuid: a.uuid, dataRegistro: a.dataRegistro, dataAgendada: a.dataAgendada,
      status: a.status, clienteId: a.clienteId,
      itensProduto: a.itensProduto, itensServico: a.itensServico,
    })),
  }

  const res = await api.post<SyncDescargaResponse>('/api/sync/descarga', body)

  await database.markClientesSynced(clientesPend.map((c) => c.uuid), res.sincronizadoEm)
  await database.markSynced(atendPend.map((a) => a.uuid), res.sincronizadoEm)
  await database.setMeta('lastSync', res.sincronizadoEm)

  return {
    clientesImportados: res.clientesImportados,
    atendimentosImportados: res.atendimentosImportados,
    erros: res.erros,
  }
}
