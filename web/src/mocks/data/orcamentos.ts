import { http, HttpResponse } from 'msw'
import type {
  Orcamento,
  ItemOrcamento,
  ItemOrcamentoInput,
  OrcamentoInput,
  StatusOrcamento,
} from '../../types/api'
import { ok, fail } from '../lib/http'

let nextId = 1
let nextItemId = 1
let nextAtendId = 500

function buildItens(itens: ItemOrcamentoInput[]): ItemOrcamento[] {
  return itens.map((it) => ({
    id: nextItemId++,
    produtoId: it.produtoId ?? null,
    servicoId: it.servicoId ?? null,
    descricao: it.descricao ?? null,
    quantidade: it.quantidade,
    precoUnitario: it.precoUnitario,
    subtotal: it.quantidade * it.precoUnitario,
    custo: it.custo ?? null,
  }))
}

function makeOrcamento(body: OrcamentoInput): Orcamento {
  const itens = buildItens(body.itens)
  const now = new Date().toISOString()
  return {
    id: nextId++,
    uuid: crypto.randomUUID(),
    clienteId: body.clienteId,
    status: body.status ?? 'Rascunho',
    valorTotal: itens.reduce((s, i) => s + i.subtotal, 0),
    dataRegistro: now,
    atendimentoConvertidoId: null,
    createdAt: now,
    updatedAt: now,
    itens,
  }
}

let orcamentos: Orcamento[] = [
  makeOrcamento({
    clienteId: 1,
    status: 'Enviado',
    itens: [
      { servicoId: 1, quantidade: 1, precoUnitario: 350 },
      { produtoId: 1, quantidade: 2, precoUnitario: 70 },
    ],
  }),
  makeOrcamento({
    clienteId: 2,
    status: 'Aprovado',
    itens: [{ servicoId: 2, quantidade: 3, precoUnitario: 140 }],
  }),
  makeOrcamento({
    clienteId: 3,
    status: 'Rascunho',
    itens: [{ descricao: 'Vistoria técnica', quantidade: 1, precoUnitario: 120 }],
  }),
]

export const orcamentoHandlers = [
  http.get('*/api/orcamento', () => HttpResponse.json(ok(orcamentos))),

  // Conversão (path específico antes do :id genérico)
  http.post('*/api/orcamento/:id/converter', ({ params }) => {
    const o = orcamentos.find((x) => x.id === Number(params.id))
    if (!o) return fail(404, 'Orçamento não encontrado.')
    if (o.status !== 'Aprovado')
      return fail(422, 'Somente orçamentos aprovados podem ser convertidos.')
    if (o.atendimentoConvertidoId) return fail(422, 'Orçamento já convertido.')
    o.atendimentoConvertidoId = nextAtendId++
    o.updatedAt = new Date().toISOString()
    return HttpResponse.json(ok({ id: o.atendimentoConvertidoId }, 'Convertido em atendimento.'))
  }),

  http.post('*/api/orcamento', async ({ request }) => {
    const body = (await request.json()) as OrcamentoInput
    if (!body.itens || body.itens.length === 0)
      return fail(422, 'Informe ao menos um item.')
    const o = makeOrcamento(body)
    orcamentos = [...orcamentos, o]
    return HttpResponse.json(ok(o, 'Orçamento criado.'))
  }),

  http.put('*/api/orcamento/:id', async ({ request, params }) => {
    const body = (await request.json()) as { status: StatusOrcamento }
    const o = orcamentos.find((x) => x.id === Number(params.id))
    if (!o) return fail(404, 'Orçamento não encontrado.')
    o.status = body.status
    o.updatedAt = new Date().toISOString()
    return HttpResponse.json(ok(o, 'Status atualizado.'))
  }),

  http.delete('*/api/orcamento/:id', ({ params }) => {
    const before = orcamentos.length
    orcamentos = orcamentos.filter((x) => x.id !== Number(params.id))
    if (orcamentos.length === before) return fail(404, 'Orçamento não encontrado.')
    return HttpResponse.json(ok(null, 'Orçamento removido.'))
  }),
]
