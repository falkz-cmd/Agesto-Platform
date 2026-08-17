/**
 * Helpers puros para o agendamento em campo (modo Flexível). Sem dependência
 * nativa: compõe um ISO a partir de um dia (offset) + hora 'HH:MM' — funciona
 * igual em device e no Expo Web.
 */

/** Compõe uma data ISO a partir de um offset de dias (0 = hoje) e hora 'HH:MM'. Null se hora inválida. */
export function isoAgendada(diaOffset: number, hora: string, base: Date = new Date()): string | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hora.trim())
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h > 23 || min > 59) return null
  const d = new Date(base)
  d.setDate(d.getDate() + diaOffset)
  d.setHours(h, min, 0, 0)
  return d.toISOString()
}

/** Rótulo curto do dia: Hoje / Amanhã / 'Qua 20'. */
export function diaLabel(diaOffset: number, base: Date = new Date()): string {
  if (diaOffset === 0) return 'Hoje'
  if (diaOffset === 1) return 'Amanhã'
  const d = new Date(base)
  d.setDate(d.getDate() + diaOffset)
  const s = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}
