import { useOutletContext } from 'react-router-dom'
import type { ShellContext } from '../layout/AppShell'
import { Card, Money } from '../components/ui'
import { useDashboard } from '../lib/queries'
import { ApiError } from '../lib/api'

const PERIOD_LABEL = { '7d': 'últimos 7 dias', mes: 'mês', ano: 'ano' } as const

/**
 * Visão geral (painel do Dono). Na web-03 consome o /api/metrics/dashboard
 * (via MSW) e prova a pipeline de dados. A UI completa (KPIs, gráfico,
 * rankings, alertas, tabela) é montada na web-05.
 */
export function Dashboard() {
  const { period } = useOutletContext<ShellContext>()
  const { data, isLoading, isError, error } = useDashboard(period)

  return (
    <Card className="shadow-card">
      <div className="flex flex-col items-start gap-2 py-6">
        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-4">
          Em construção
        </span>
        <h2 className="text-[16px] font-semibold text-ink">Visão geral</h2>
        <p className="text-[13px] text-ink-3">
          Período: <span className="font-semibold text-ink-2">{PERIOD_LABEL[period]}</span>
        </p>

        {isLoading && (
          <p className="text-[13px] text-ink-3">Carregando dados…</p>
        )}
        {isError && (
          <p className="text-[13px] text-bad">
            Erro ao carregar:{' '}
            {error instanceof ApiError ? error.message : 'falha inesperada'}
          </p>
        )}
        {data && (
          <p className="text-[13px] text-ink-2">
            Pipeline OK (mock) — faturamento{' '}
            <Money value={data.rentabilidade.faturamento} className="font-semibold text-brand-ink" />{' '}
            · {data.rentabilidade.atendimentos} atendimentos · margem{' '}
            {data.rentabilidade.margemPercentual.toFixed(0)}%
          </p>
        )}
      </div>
    </Card>
  )
}
