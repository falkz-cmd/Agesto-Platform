import type { ReactNode } from 'react'

export function Card({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-card border border-line bg-surface p-[18px] ${className}`}
    >
      {children}
    </div>
  )
}

/** Cabeçalho de card: título, subtítulo opcional e ação (link) opcional. */
export function CardHead({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-[14px] flex items-start justify-between">
      <div>
        <div className="text-[14.5px] font-semibold text-ink">{title}</div>
        {subtitle && (
          <div className="mt-0.5 text-[12px] text-ink-3">{subtitle}</div>
        )}
      </div>
      {action}
    </div>
  )
}
