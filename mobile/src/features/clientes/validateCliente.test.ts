import { describe, it, expect } from '@jest/globals'
import { validateCliente, isValid } from './validateCliente'

describe('validateCliente', () => {
  it('rejeita nome curto e CPF inválido', () => {
    const e = validateCliente({ nome: 'A', cpf: '123' })
    expect(e.nome).toBeTruthy()
    expect(e.cpf).toBeTruthy()
    expect(isValid(e)).toBe(false)
  })

  it('aceita nome e CPF válidos (com ou sem máscara)', () => {
    expect(isValid(validateCliente({ nome: 'João Silva', cpf: '123.456.789-01' }))).toBe(true)
    expect(isValid(validateCliente({ nome: 'João Silva', cpf: '12345678901' }))).toBe(true)
  })
})
