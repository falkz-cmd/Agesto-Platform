import { useOutletContext } from 'react-router-dom'
import type { ShellContext } from '../layout/AppShell'
import { Card } from '../components/ui'

const PERIOD_LABEL = { '7d': 'últimos 7 dias', mes: 'mês', ano: 'ano' } as const

/**
 * Visão geral (painel do Dono). Placeholder na web-02 — prova que o período
 * da topbar chega até a página via contexto do Outlet. O conteúdo real (KPIs,
 * gráfico, rankings, alertas) é montado na web-05 sobre o mock/endpoint.
 */
export function Dashboard() {
  const { period } = useOutletContext<ShellContext>()
  return (
    <Card className="shadow-card">
      <div className="flex flex-col items-start gap-2 py-6">
        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-4">
          Em construção
        </span>
        <h2 className="text-[16px] font-semibold text-ink">Visão geral</h2>
        <p className="max-w-prose text-[13px] text-ink-3">
          O painel consolidado é montado na próxima fatia. Período selecionado:{' '}
          <span className="font-semibold text-ink-2">{PERIOD_LABEL[period]}</span>.
        </p>
      </div>
    </Card>
  )
}
