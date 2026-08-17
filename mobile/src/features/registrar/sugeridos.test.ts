import { describe, it, expect } from '@jest/globals'
import { materiaisSugeridos } from './sugeridos'

const sug = [
  { servicoId: 1, produtoId: 10, quantidadePadrao: 2 },
  { servicoId: 1, produtoId: 11, quantidadePadrao: 1 },
  { servicoId: 2, produtoId: 10, quantidadePadrao: 5 },
]

describe('materiaisSugeridos', () => {
  it('sem serviço selecionado retorna vazio', () => {
    expect(materiaisSugeridos(sug, {})).toEqual([])
    expect(materiaisSugeridos(sug, { 1: 0 })).toEqual([])
  })

  it('junta os materiais dos serviços selecionados', () => {
    expect(materiaisSugeridos(sug, { 1: 1 })).toEqual([
      { produtoId: 10, quantidade: 2 },
      { produtoId: 11, quantidade: 1 },
    ])
  })

  it('mesma peça em dois serviços: maior quantidade vence', () => {
    const r = materiaisSugeridos(sug, { 1: 1, 2: 1 })
    expect(r.find((x) => x.produtoId === 10)?.quantidade).toBe(5)
  })
})
