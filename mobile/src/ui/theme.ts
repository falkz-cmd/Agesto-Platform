/**
 * Design tokens do app do agente (mobile) — portados do protótipo aprovado
 * (dashboard-campo.html). Tema claro fixo. Paleta azul + verde (sem laranja).
 */
export const colors = {
  bg: '#F1F3F6',
  surface: '#FFFFFF',
  surface2: '#F4F6F9',

  ink: '#1E2733',
  ink2: '#3E4A5A',
  ink3: '#6B7684',
  ink4: '#99A2AE',

  line: '#E6E9EE',
  line2: '#EEF1F5',

  brand: '#243FA6',
  brandSoft: '#E7EBF8',
  brandInk: '#1E3690',

  good: '#12B886',
  goodSoft: '#D6F1E7',
  warn: '#C98325',
  warnSoft: '#F7EEDC',
  bad: '#D5433C',
} as const

export const radius = {
  card: 18,
  sm: 13,
  pill: 999,
} as const

/** Escala de espaçamento base 4. */
export const space = (n: number): number => n * 4
