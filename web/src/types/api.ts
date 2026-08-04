/**
 * Tipos espelhando os DTOs do backend (MicroERP.Api).
 * Serialização: camelCase nas chaves; enums como string (JsonStringEnumConverter).
 */

/** Envelope padrão de toda resposta da API. */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  errors: string[]
}

/* ---------- Auth ---------- */

export interface AuthResponse {
  token: string
  expiresAt: string // ISO
}

/* ---------- Métricas / Dashboard ---------- */

export interface MetricasRentabilidade {
  faturamento: number
  custoTotal: number
  margem: number
  margemPercentual: number
  atendimentos: number
  ticketMedio: number
}

export interface ProdutoRankingItem {
  produtoId: number
  nome: string
  quantidade: number
  receita: number
}

export interface FaturamentoPontoPeriodo {
  data: string // ISO
  valor: number
}

export interface MetricasVendas {
  receitaTotal: number
  ticketMedio: number
  totalAtendimentos: number
  topProdutos: ProdutoRankingItem[]
  receitaPorPeriodo: FaturamentoPontoPeriodo[]
}

export interface ServicoReceitaItem {
  servicoId: number
  descricao: string
  tipoCobranca: string
  quantidade: number
  receita: number
}

export interface MetricasServicos {
  receitaTotal: number
  receitaPorServico: ServicoReceitaItem[]
}

export interface ProdutoGiroItem {
  produtoId: number
  nome: string
  quantidadeEstoque: number
  unidadesVendidas: number
}

export interface ProdutoParadoItem {
  produtoId: number
  nome: string
  quantidadeEstoque: number
  ultimaVenda: string | null
}

export interface RupturaIminenteItem {
  produtoId: number
  nome: string
  quantidadeEstoque: number
  consumoDiarioMedio: number
  diasAteRuptura: number
}

export interface MetricasEstoque {
  giro: ProdutoGiroItem[]
  produtosParados: ProdutoParadoItem[]
  rupturaIminente: RupturaIminenteItem[]
}

export interface DashboardResponse {
  de: string
  ate: string
  rentabilidade: MetricasRentabilidade
  vendas: MetricasVendas
  servicos: MetricasServicos
  estoque: MetricasEstoque
}

/* ---------- Atendimento (para a tabela "últimos atendimentos") ---------- */

export type StatusAtendimento = 'Pendente' | 'Concluido' | 'Cancelado'

/**
 * Item enxuto para a lista de últimos atendimentos do painel.
 * NB: hoje nenhum endpoint devolve {resumo, clienteNome, margem} juntos —
 * este é o formato-alvo que o mock materializa; vira uma task de backend.
 */
export interface AtendimentoResumo {
  id: number
  resumo: string
  clienteNome: string
  valorTotal: number
  margem: number
  status: StatusAtendimento
}
