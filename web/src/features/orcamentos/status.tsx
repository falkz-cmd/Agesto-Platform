import { Pill } from '../../components/ui'
import type { StatusOrcamento } from '../../types/api'

const STATUS_ORCAMENTO: Record<
  StatusOrcamento,
  { tone?: 'ok' | 'pend' | 'brand' | 'bad'; label: string }
> = {
  Rascunho: { label: 'Rascunho' },
  Enviado: { tone: 'brand', label: 'Enviado' },
  Aprovado: { tone: 'ok', label: 'Aprovado' },
  Recusado: { tone: 'bad', label: 'Recusado' },
}

export function StatusOrcamentoPill({ status }: { status: StatusOrcamento }) {
  const s = STATUS_ORCAMENTO[status]
  if (!s.tone) {
    return (
      <span className="inline-block rounded-full bg-surface-2 px-[9px] py-[3px] text-[11px] font-bold text-ink-3">
        {s.label}
      </span>
    )
  }
  return <Pill tone={s.tone}>{s.label}</Pill>
}
