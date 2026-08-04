import type { ReactNode } from 'react'
import { Delta } from './Pill'

type KpiProps = {
  label: ReactNode
  value: ReactNode
  icon?: ReactNode
  delta?: { dir: 'up' | 'down'; text: string }
  /** Destaca o KPI principal (margem) com fundo verde. */
  hero?: boolean
}

export function Kpi({ label, value, icon, delta, hero = false }: KpiProps) {
  return (
    <div
      className={
        hero
          ? 'flex flex-col gap-[9px] rounded-card border border-transparent bg-gradient-to-br from-good to-brand-ink p-[17px] text-white shadow-card'
          : 'flex flex-col gap-[9px] rounded-card border border-line bg-surface p-[17px]'
      }
    >
      <div className="flex items-center justify-between">
        <span
          className={`grid h-8 w-8 place-items-center rounded-[9px] ${
            hero ? 'bg-white/20 text-white' : 'bg-brand-soft text-brand-ink'
          }`}
        >
          {icon}
        </span>
        {delta && <Delta dir={delta.dir}>{delta.text}</Delta>}
      </div>
      <div
        className={`money text-[29px] leading-none ${hero ? 'text-white' : 'text-ink'}`}
      >
        {value}
      </div>
      <div className={`text-[12.5px] ${hero ? 'text-white/90' : 'text-ink-3'}`}>
        {label}
      </div>
    </div>
  )
}
