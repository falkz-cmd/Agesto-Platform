import type { Cliente, Produto, Servico, SyncCargaResponse } from '@/types/api'

const clientes: Cliente[] = [
  { id: 1, uuid: 'c1', nome: 'Vó Joana', telefone: '(34) 99999-0000', cpf: '111.222.333-44', logradouro: 'R. das Acácias', numero: '120', bairro: 'Centro', cidade: 'Uberaba', cep: '38010-000' },
  { id: 2, uuid: 'c2', nome: 'Marina Alves', telefone: '(34) 98888-1010', cpf: '222.333.444-55', logradouro: 'Av. Leopoldino', numero: '45', bairro: 'Fabrício', cidade: 'Uberaba', cep: null },
  { id: 3, uuid: 'c3', nome: 'Renata Vieira', telefone: null, cpf: '333.444.555-66', logradouro: null, numero: null, bairro: null, cidade: 'Uberaba', cep: null },
]

const produtos: Produto[] = [
  { id: 1, uuid: 'p1', nome: 'Suporte universal', preco: 70, quantidadeEstoque: 16 },
  { id: 2, uuid: 'p2', nome: 'Gás R-410a (kg)', preco: 68, quantidadeEstoque: 3 },
  { id: 3, uuid: 'p3', nome: 'Cano de dreno (m)', preco: 22, quantidadeEstoque: 40 },
]

const servicos: Servico[] = [
  { id: 1, uuid: 's1', descricao: 'Instalação de AC', tipoCobranca: 'Empreitada', valorHora: null, valorEmpreitada: 350 },
  { id: 2, uuid: 's2', descricao: 'Manutenção preventiva', tipoCobranca: 'PorHora', valorHora: 140, valorEmpreitada: null },
  { id: 3, uuid: 's3', descricao: 'Limpeza / higienização', tipoCobranca: 'PorHora', valorHora: 90, valorEmpreitada: null },
]

export function seedCarga(): SyncCargaResponse {
  return { clientes, produtos, servicos, sincronizadoEm: new Date().toISOString() }
}
