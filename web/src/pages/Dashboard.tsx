import { useOutletContext } from 'react-router-dom'
import type { ShellContext } from '../layout/AppShell'
import { Card, CardHead, Kpi, Money, Pill, RankBar, Alert } from '../components/ui'
import {
  IconDollar,
  IconTrendUp,
  IconCheck,
  IconLines,
  IconAlertTriangle,
  IconClock,
} from '../components/icons'
import { ReceitaChart } from '../components/ReceitaChart'
import { useDashboard } from '../lib/queries'
import { useAtendimentos } from '../features/atendimentos/queries'
import { clientesResource } from '../features/clientes/resource'
import { ApiError } from '../lib/api'
import type { StatusAtendimento } from '../types/api'

const STATUS: Record<StatusAtendimento, { tone: 'ok' | 'pend' | 'bad'; label: string }> = {
  Concluido: { tone: 'ok', label: 'Concluído' },
  Pendente: { tone: 'pend', label: 'Pendente' },
  Cancelado: { tone: 'bad', label: 'Cancelado' },
}

function pct(value: number, max: number): number {
  return max > 0 ? (value / max) * 100 : 0
}

function dataCurta(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function Dashboard() {
  const { period } = useOutletContext<ShellContext>()
  const { data, isLoading, isError, error } = useDashboard(period)
  const atend = useAtendimentos()
  const clientes = clientesResource.useList()
  const clienteNome = (id: number) =>
    clientes.data?.find((c) => c.id === id)?.nome ?? `Cliente #${id}`
  const ultimos = [...(atend.data ?? [])]
    .sort((a, b) => b.dataRegistro.localeCompare(a.dataRegistro))
    .slice(0, 5)

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <p className="py-8 text-center text-[13px] text-ink-3">Carregando painel…</p>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="shadow-card">
        <p className="py-8 text-center text-[13px] text-bad">
          Não foi possível carregar o painel
          {error instanceof ApiError ? `: ${error.message}` : '.'}
        </p>
      </Card>
    )
  }

  const { rentabilidade: r, vendas, servicos, estoque } = data
  const maxServico = Math.max(...servicos.receitaPorServico.map((s) => s.receita), 0)
  const maxProduto = Math.max(...vendas.topProdutos.map((p) => p.receita), 0)

  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1080px]:grid-cols-4">
        <Kpi
          label="Faturamento"
          value={<Money value={r.faturamento} />}
          icon={<IconDollar className="h-[17px] w-[17px]" />}
        />
        <Kpi
          hero
          label={
            <>
              Margem · <Money value={r.margem} /> de lucro
            </>
          }
          value={
            <>
              {r.margemPercentual.toFixed(0)}
              <span className="text-[17px]">%</span>
            </>
          }
          icon={<IconTrendUp className="h-[17px] w-[17px]" />}
        />
        <Kpi
          label="Atendimentos concluídos"
          value={r.atendimentos}
          icon={<IconCheck className="h-[17px] w-[17px]" />}
        />
        <Kpi
          label="Ticket médio"
          value={<Money value={r.ticketMedio} />}
          icon={<IconLines className="h-[17px] w-[17px]" />}
        />
      </div>

      {/* Gráfico + coluna lateral */}
      <div className="grid grid-cols-1 gap-4 min-[1080px]:grid-cols-[1.7fr_1fr]">
        <Card className="shadow-card">
          <CardHead title="Receita por dia" subtitle="No período selecionado" />
          <div className="mb-2 text-[11.5px] text-ink-3">
            Total <b className="text-ink"><Money value={r.faturamento} /></b>
          </div>
          <ReceitaChart pontos={vendas.receitaPorPeriodo} />
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="shadow-card">
            <CardHead title="Serviços que mais faturam" />
            <div className="flex flex-col gap-[13px]">
              {servicos.receitaPorServico.map((s) => (
                <RankBar
                  key={s.servicoId}
                  name={s.descricao}
                  meta={`${s.quantidade} atend. · ${s.tipoCobranca}`}
                  percent={pct(s.receita, maxServico)}
                  amount={<Money value={s.receita} />}
                />
              ))}
            </div>
          </Card>

          <Card className="shadow-card">
            <CardHead title="Estoque · atenção" />
            <div className="flex flex-col gap-[9px]">
              {estoque.rupturaIminente.map((p) => (
                <Alert
                  key={p.produtoId}
                  tone="crit"
                  icon={<IconAlertTriangle className="h-[15px] w-[15px]" />}
                  title={`${p.nome} · acaba em ~${Math.round(p.diasAteRuptura)} dias`}
                  subtitle={`${p.quantidadeEstoque} un · consumo ${p.consumoDiarioMedio}/dia`}
                />
              ))}
              {estoque.produtosParados.map((p) => (
                <Alert
                  key={p.produtoId}
                  tone="warn"
                  icon={<IconClock className="h-[15px] w-[15px]" />}
                  title={`${p.nome} · parado`}
                  subtitle={`${p.quantidadeEstoque} un sem saída`}
                />
              ))}
              {estoque.rupturaIminente.length === 0 &&
                estoque.produtosParados.length === 0 && (
                  <p className="text-[12.5px] text-ink-3">Nada a reportar.</p>
                )}
            </div>
          </Card>
        </div>
      </div>

      {/* Últimos atendimentos + produtos */}
      <div className="grid grid-cols-1 gap-4 min-[1080px]:grid-cols-2">
        <Card className="shadow-card">
          <CardHead title="Últimos atendimentos" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line-2 text-[10.5px] uppercase tracking-[0.06em] text-ink-4">
                <th className="pb-2.5 text-left font-bold">Cliente</th>
                <th className="pb-2.5 text-left font-bold">Data</th>
                <th className="pb-2.5 text-right font-bold">Total</th>
                <th className="pb-2.5 text-right font-bold">Margem</th>
                <th className="pb-2.5 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {atend.isLoading && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-ink-3">
                    Carregando…
                  </td>
                </tr>
              )}
              {ultimos.map((a) => (
                <tr key={a.id} className="border-b border-line-2 last:border-0">
                  <td className="py-[11px] text-ink">{clienteNome(a.clienteId)}</td>
                  <td className="py-[11px] text-ink-3">{dataCurta(a.dataRegistro)}</td>
                  <td className="py-[11px] text-right tabular-nums">
                    <Money value={a.valorTotal} />
                  </td>
                  <td className="py-[11px] text-right font-semibold tabular-nums text-good">
                    <Money value={a.margem} />
                  </td>
                  <td className="py-[11px] text-right">
                    <Pill tone={STATUS[a.status].tone}>{STATUS[a.status].label}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="shadow-card">
          <CardHead title="Produtos mais vendidos" subtitle="No período" />
          <div className="flex flex-col gap-[13px]">
            {vendas.topProdutos.map((p) => (
              <RankBar
                key={p.produtoId}
                name={p.nome}
                meta={`${p.quantidade} un`}
                percent={pct(p.receita, maxProduto)}
                amount={<Money value={p.receita} />}
              />
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
