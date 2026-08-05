import { Pill } from '../../components/ui'
import type { StatusAtendimento } from '../../types/api'

const MAP: Record<StatusAtendimento, { tone: 'ok' | 'pend' | 'bad'; label: string }> = {
  Concluido: { tone: 'ok', label: 'Concluído' },
  Pendente: { tone: 'pend', label: 'Pendente' },
  Cancelado: { tone: 'bad', label: 'Cancelado' },
}

export function StatusAtendimentoPill({ status }: { status: StatusAtendimento }) {
  const s = MAP[status]
  return <Pill tone={s.tone}>{s.label}</Pill>
}
