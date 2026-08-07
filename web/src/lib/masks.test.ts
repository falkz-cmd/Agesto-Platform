import { describe, it, expect } from 'vitest'
import { maskCpf, maskPhone, maskCep, onlyDigits } from './masks'

describe('masks', () => {
  it('maskCpf formata 11 dígitos', () => {
    expect(maskCpf('12345678901')).toBe('123.456.789-01')
  })
  it('maskCpf limita a 11 dígitos e ignora não-dígitos', () => {
    expect(maskCpf('123.456.789-0123')).toBe('123.456.789-01')
  })
  it('maskPhone celular (11 dígitos)', () => {
    expect(maskPhone('34999990000')).toBe('(34) 99999-0000')
  })
  it('maskPhone fixo (10 dígitos)', () => {
    expect(maskPhone('3433334444')).toBe('(34) 3333-4444')
  })
  it('maskCep formata 8 dígitos', () => {
    expect(maskCep('38010000')).toBe('38010-000')
  })
  it('onlyDigits remove tudo que não é dígito', () => {
    expect(onlyDigits('123.456.789-01')).toBe('12345678901')
  })
})
