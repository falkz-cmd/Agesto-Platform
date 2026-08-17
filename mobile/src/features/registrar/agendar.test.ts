import { describe, it, expect } from '@jest/globals'
import { isoAgendada, diaLabel } from './agendar'

const base = new Date('2026-08-17T08:00:00.000Z')

describe('isoAgendada', () => {
  it('compõe um ISO a partir de offset de dias + hora', () => {
    const iso = isoAgendada(1, '14:30', base)
    expect(iso).not.toBeNull()
    const d = new Date(iso!)
    expect(d.getHours()).toBe(14)
    expect(d.getMinutes()).toBe(30)
  })

  it('retorna null para hora inválida', () => {
    expect(isoAgendada(0, '99:99', base)).toBeNull()
    expect(isoAgendada(0, 'abc', base)).toBeNull()
    expect(isoAgendada(0, '', base)).toBeNull()
  })
})

describe('diaLabel', () => {
  it('rotula hoje/amanhã e um dia futuro', () => {
    expect(diaLabel(0, base)).toBe('Hoje')
    expect(diaLabel(1, base)).toBe('Amanhã')
    expect(diaLabel(3, base)).toBeTruthy()
  })
})
