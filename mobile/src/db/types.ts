import type { Cliente, Produto, Servico, StatusAtendimento } from '@/types/api'

/**
 * Atendimento criado no device (offline-first). `syncedAt` null = pendente de
 * envio. Itens só de catálogo por quantidade (contrato enxuto da Descarga).
 */
export interface LocalAtendimento {
  uuid: string
  clienteId: number
  status: StatusAtendimento
  dataRegistro: string
  itensProduto: { produtoId: number; quantidade: number }[]
  itensServico: { servicoId: number; quantidade: number }[]
  syncedAt: string | null
}

/**
 * Banco local offline-first. Dois adapters (expo-sqlite no device / memória no
 * web e testes) implementam esta interface — a app não sabe qual está usando.
 */
export interface LocalDb {
  init(): Promise<void>

  // dados de referência (substituídos em bloco pela Carga)
  saveClientes(items: Cliente[]): Promise<void>
  saveProdutos(items: Produto[]): Promise<void>
  saveServicos(items: Servico[]): Promise<void>
  getClientes(): Promise<Cliente[]>
  getProdutos(): Promise<Produto[]>
  getServicos(): Promise<Servico[]>

  // atendimentos criados offline
  addAtendimento(a: LocalAtendimento): Promise<void>
  getAtendimentos(): Promise<LocalAtendimento[]>
  getPendingAtendimentos(): Promise<LocalAtendimento[]>
  markSynced(uuids: string[], syncedAt: string): Promise<void>

  // metadados (ex.: última sincronização)
  getMeta(key: string): Promise<string | null>
  setMeta(key: string, value: string): Promise<void>

  reset(): Promise<void>
}
