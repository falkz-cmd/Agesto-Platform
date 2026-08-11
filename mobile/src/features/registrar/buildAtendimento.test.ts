import { describe, it, expect } from '@jest/globals'
import { buildAtendimento, hasItems } from './buildAtendimento'

describe('buildAtendimento', () => {
  it('hasItems detecta quantidades > 0', () => {
    expect(hasItems({}, {})).toBe(false)
    expect(hasItems({ 1: 0 }, { 2: 0 })).toBe(false)
    expect(hasItems({ 1: 2 }, {})).toBe(true)
    expect(hasItems({}, { 3: 1 })).toBe(true)
  })

  it('monta itens de catálogo por quantidade e marca como pendente', () => {
    const a = buildAtendimento({
      clienteId: 1,
      status: 'Concluido',
      servicoQty: { 2: 1, 3: 0 },
      produtoQty: { 5: 3 },
    })
    expect(a.clienteId).toBe(1)
    expect(a.status).toBe('Concluido')
    expect(a.itensServico).toEqual([{ servicoId: 2, quantidade: 1 }])
    expect(a.itensProduto).toEqual([{ produtoId: 5, quantidade: 3 }])
    expect(a.syncedAt).toBeNull()
    expect(a.uuid).toBeTruthy()
    expect(a.dataRegistro).toBeTruthy()
  })
})
