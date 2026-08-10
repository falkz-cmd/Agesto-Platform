/**
 * Tipos espelhando os DTOs do backend (MicroERP.Api). camelCase; enums string.
 * São os dados de referência que a Carga traz para o device.
 */

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  errors: string[]
}

export type StatusAtendimento = 'Pendente' | 'Concluido' | 'Cancelado'
export type TipoCobranca = 'PorHora' | 'Empreitada'
export type StatusOrcamento = 'Rascunho' | 'Enviado' | 'Aprovado' | 'Recusado'

export interface Cliente {
  id: number
  uuid: string
  nome: string
  telefone: string | null
  cpf: string
  logradouro: string | null
  numero: string | null
  bairro: string | null
  cidade: string | null
  cep: string | null
}

export interface Produto {
  id: number
  uuid: string
  nome: string
  preco: number
  quantidadeEstoque: number
}

export interface Servico {
  id: number
  uuid: string
  descricao: string
  tipoCobranca: TipoCobranca
  valorHora: number | null
  valorEmpreitada: number | null
}

/* ---- Sincronização (Carga/Descarga) ---- */

export interface SyncCargaResponse {
  clientes: Cliente[]
  produtos: Produto[]
  servicos: Servico[]
  sincronizadoEm: string
}

/** Payload de atendimento offline (AtendimentoSyncRequest) — enxuto. */
export interface AtendimentoSyncRequest {
  uuid: string
  dataRegistro: string
  status: StatusAtendimento
  clienteId: number
  itensProduto: { produtoId: number; quantidade: number }[]
  itensServico: { servicoId: number; quantidade: number }[]
}
