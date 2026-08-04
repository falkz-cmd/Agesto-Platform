import type { ReactNode } from 'react'

type PillTone = 'ok' | 'pend' | 'brand' | 'bad'

const TONES: Record<PillTone, string> = {
  ok: 'bg-good-soft text-good',
  pend: 'bg-warn-soft text-warn',
  brand: 'bg-brand-soft text-brand-ink',
  bad: 'bg-bad-soft text-bad',
}

export function Pill({
  tone = 'brand',
  children,
}: {
  tone?: PillTone
  children: ReactNode
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-[9px] py-[3px] text-[11px] font-bold ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}

/** Indicador de variação (delta) para os KPIs. */
export function Delta({
  dir,
  children,
}: {
  dir: 'up' | 'down'
  children: ReactNode
}) {
  const cls = dir === 'up' ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'
  return (
    <span
      className={`inline-flex items-center gap-[3px] rounded-full px-[7px] py-0.5 text-[11.5px] font-bold ${cls}`}
    >
      {dir === 'up' ? '▲' : '▼'} {children}
    </span>
  )
}
