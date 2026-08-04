import type { ReactNode } from 'react'

/** Linha de ranking: nome, meta, barra proporcional e valor à direita. */
export function RankBar({
  name,
  meta,
  percent,
  amount,
}: {
  name: string
  meta?: string
  percent: number
  amount: ReactNode
}) {
  const width = Math.max(0, Math.min(100, percent))
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-ink">{name}</div>
        {meta && <div className="mt-0.5 text-[11.5px] text-ink-3">{meta}</div>}
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line-2">
          <span
            className="block h-full rounded-full bg-good"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
      <span className="whitespace-nowrap text-right text-[13px] font-semibold tabular-nums text-ink">
        {amount}
      </span>
    </div>
  )
}
