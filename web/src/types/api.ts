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

/* ---------- Cadastros (CRUD) ---------- */

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
  createdAt: string
  updatedAt: string
}

export interface ClienteInput {
  nome: string
  telefone?: string | null
  cpf: string
  logradouro?: string | null
  numero?: string | null
  bairro?: string | null
  cidade?: string | null
  cep?: string | null
}

export interface Produto {
  id: number
  uuid: string
  nome: string
  preco: number
  quantidadeEstoque: number
  createdAt: string
  updatedAt: string
}

export interface ProdutoInput {
  nome: string
  preco: number
  quantidadeEstoque: number
}

export type TipoCobranca = 'PorHora' | 'Empreitada'

export interface Servico {
  id: number
  uuid: string
  descricao: string
  tipoCobranca: TipoCobranca
  valorHora: number | null
  valorEmpreitada: number | null
  createdAt: string
  updatedAt: string
}

export interface ServicoInput {
  descricao: string
  tipoCobranca: TipoCobranca
  valorHora?: number | null
  valorEmpreitada?: number | null
}

/* ---------- Orçamento ---------- */

export type StatusOrcamento = 'Rascunho' | 'Enviado' | 'Aprovado' | 'Recusado'

export interface ItemOrcamento {
  id: number
  produtoId: number | null
  servicoId: number | null
  descricao: string | null
  quantidade: number
  precoUnitario: number
  subtotal: number
  custo: number | null
}

export interface Orcamento {
  id: number
  uuid: string
  clienteId: number
  status: StatusOrcamento
  valorTotal: number
  dataRegistro: string
  atendimentoConvertidoId: number | null
  createdAt: string
  updatedAt: string
  itens: ItemOrcamento[]
}

export interface ItemOrcamentoInput {
  produtoId?: number | null
  servicoId?: number | null
  descricao?: string | null
  quantidade: number
  precoUnitario: number
  custo?: number | null
}

export interface OrcamentoInput {
  clienteId: number
  status: StatusOrcamento
  itens: ItemOrcamentoInput[]
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

/* ---------- Configuração (parametrização da empresa) ---------- */

export type TipoOperacao = 'Venda' | 'Servico' | 'Hibrido'

export interface Configuracao {
  id: number
  tipoOperacao: TipoOperacao
  empresaId: number
  createdAt: string
  updatedAt: string
}

/* ---------- Atendimento (execução) ---------- */

export interface Atendimento {
  id: number
  uuid: string
  dataRegistro: string
  dataAgendada: string | null
  status: StatusAtendimento
  valorTotal: number
  custoTotal: number
  margem: number
  clienteId: number
  createdAt: string
  updatedAt: string
}

export interface AtendimentoInput {
  clienteId: number
  status: StatusAtendimento
  dataAgendada?: string | null
}

export interface AtendimentoUpdate {
  status: StatusAtendimento
  dataAgendada?: string | null
}

export interface ItemProdutoResp {
  id: number
  uuid: string
  quantidade: number
  precoUnitario: number
  subtotal: number
  custo: number | null
  descricao: string | null
  atendimentoId: number
  produtoId: number | null
  createdAt: string
  updatedAt: string
}

export interface ItemProdutoInput {
  atendimentoId: number
  produtoId?: number | null
  descricao?: string | null
  precoUnitario?: number | null
  custo?: number | null
  quantidade: number
}

export interface ItemServicoResp {
  id: number
  uuid: string
  quantidade: number
  precoUnitario: number
  subtotal: number
  atendimentoId: number
  servicoId: number
  createdAt: string
  updatedAt: string
}

export interface ItemServicoInput {
  atendimentoId: number
  servicoId: number
  precoUnitario?: number | null
  quantidade: number
}

/** Item de agenda enriquecido (GET /api/atendimento/agenda). */
export interface AgendaItem {
  id: number
  uuid: string
  dataAgendada: string | null
  status: StatusAtendimento
  valorTotal: number
  clienteId: number
  clienteNome: string
  clienteTelefone: string | null
  enderecoResumo: string | null
  resumo: string
}
