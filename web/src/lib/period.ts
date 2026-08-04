import type { Period } from '../layout/PeriodSwitch'

/** Converte o período da topbar numa janela [de, ate] em ISO (UTC). */
export function periodRange(
  period: Period,
  now = new Date(),
): { de: string; ate: string } {
  const de = new Date(now)
  de.setHours(0, 0, 0, 0)

  if (period === '7d') {
    de.setDate(de.getDate() - 6)
  } else if (period === 'mes') {
    de.setDate(1)
  } else {
    de.setMonth(0, 1) // ano corrente, 1º de janeiro
  }

  return { de: de.toISOString(), ate: now.toISOString() }
}
