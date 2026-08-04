import type { ReactNode } from 'react'

type AlertTone = 'crit' | 'warn'

const TONES: Record<AlertTone, { box: string; icon: string }> = {
  crit: { box: 'bg-bad-soft', icon: 'bg-bad' },
  warn: { box: 'bg-warn-soft', icon: 'bg-warn' },
}

/** Alerta compacto (estoque em atenção): ícone + título + subtítulo. */
export function Alert({
  tone,
  icon,
  title,
  subtitle,
}: {
  tone: AlertTone
  icon: ReactNode
  title: string
  subtitle?: string
}) {
  const t = TONES[tone]
  return (
    <div className={`flex items-start gap-[11px] rounded-sm p-3 ${t.box}`}>
      <span
        className={`grid h-7 w-7 flex-none place-items-center rounded-lg text-white ${t.icon}`}
      >
        {icon}
      </span>
      <div>
        <div className="text-[13px] font-semibold text-ink">{title}</div>
        {subtitle && (
          <div className="mt-px text-[11.5px] text-ink-3">{subtitle}</div>
        )}
      </div>
    </div>
  )
}
