import { useState, type ReactNode } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { ShellContext } from '../../layout/AppShell'
import { Card, CardHead, DataTable, Money, type Column } from '../../components/ui'
import { useDashboard } from '../../lib/queries'
import { ApiError } from '../../lib/api'
import type {
  ServicoReceitaItem,
  ProdutoRankingItem,
  ProdutoGiroItem,
  ProdutoParadoItem,
  RupturaIminenteItem,
} from '../../types/api'

type Aba = 'rentabilidade' | 'servicos' | 'produtos' | 'estoque'

const ABAS: { value: Aba; label: string }[] = [
  { value: 'rentabilidade', label: 'Rentabilidade' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'produtos', label: 'Produtos' },
  { value: 'estoque', label: 'Estoque' },
]

function dataCurta(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '—'
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-4">{label}</div>
      <div className="mt-1 text-[20px]">{children}</div>
    </div>
  )
}

export function RelatoriosPage() {
  const { period } = useOutletContext<ShellContext>()
  const { data, isLoading, isError, error } = useDashboard(period)
  const [aba, setAba] = useState<Aba>('rentabilidade')

  const servicoCols: Column<ServicoReceitaItem>[] = [
    { header: 'Serviço', cell: (s) => <span className="font-medium text-ink">{s.descricao}</span> },
    { header: 'Cobrança', cell: (s) => <span className="text-ink-2">{s.tipoCobranca === 'PorHora' ? 'Por hora' : 'Empreitada'}</span> },
    { header: 'Qtd', align: 'right', cell: (s) => <span className="tabular-nums text-ink-2">{s.quantidade}</span> },
    { header: 'Receita', align: 'right', cell: (s) => <Money value={s.receita} cents /> },
  ]
  const produtoCols: Column<ProdutoRankingItem>[] = [
    { header: 'Produto', cell: (p) => <span className="font-medium text-ink">{p.nome}</span> },
    { header: 'Vendidos', align: 'right', cell: (p) => <span className="tabular-nums text-ink-2">{p.quantidade}</span> },
    { header: 'Receita', align: 'right', cell: (p) => <Money value={p.receita} cents /> },
  ]
  const giroCols: Column<ProdutoGiroItem>[] = [
    { header: 'Produto', cell: (g) => <span className="font-medium text-ink">{g.nome}</span> },
    { header: 'Estoque', align: 'right', cell: (g) => <span className="tabular-nums text-ink-2">{g.quantidadeEstoque}</span> },
    { header: 'Vendidos', align: 'right', cell: (g) => <span className="tabular-nums text-ink-2">{g.unidadesVendidas}</span> },
  ]
  const paradoCols: Column<ProdutoParadoItem>[] = [
    { header: 'Produto', cell: (p) => <span className="font-medium text-ink">{p.nome}</span> },
    { header: 'Estoque', align: 'right', cell: (p) => <span className="tabular-nums text-ink-2">{p.quantidadeEstoque}</span> },
    { header: 'Última venda', align: 'right', cell: (p) => <span className="text-ink-3">{dataCurta(p.ultimaVenda)}</span> },
  ]
  const rupturaCols: Column<RupturaIminenteItem>[] = [
    { header: 'Produto', cell: (r) => <span className="font-medium text-ink">{r.nome}</span> },
    { header: 'Estoque', align: 'right', cell: (r) => <span className="tabular-nums text-ink-2">{r.quantidadeEstoque}</span> },
    { header: 'Consumo/dia', align: 'right', cell: (r) => <span className="tabular-nums text-ink-2">{r.consumoDiarioMedio}</span> },
    { header: 'Dias p/ ruptura', align: 'right', cell: (r) => <span className="tabular-nums font-semibold text-bad">{Math.round(r.diasAteRuptura)}</span> },
  ]

  return (
    <>
      <Card className="shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Relatórios</h2>
            <p className="text-[12.5px] text-ink-3">Detalhamento das métricas do período.</p>
          </div>
          <div className="flex flex-wrap justify-end rounded-[10px] border border-line bg-surface-2 p-[3px]">
            {ABAS.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setAba(a.value)}
                className={`rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold transition ${
                  aba === a.value ? 'bg-surface text-ink shadow-sm' : 'text-ink-3 hover:text-ink-2'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading && (
        <Card className="shadow-card">
          <p className="py-6 text-center text-[13px] text-ink-3">Carregando relatório…</p>
        </Card>
      )}
      {isError && (
        <Card className="shadow-card">
          <p className="py-6 text-center text-[13px] text-bad">
            Não foi possível carregar
            {error instanceof ApiError ? `: ${error.message}` : '.'}
          </p>
        </Card>
      )}

      {data && aba === 'rentabilidade' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Faturamento"><Money value={data.rentabilidade.faturamento} className="text-ink" /></Stat>
          <Stat label="Custo total"><Money value={data.rentabilidade.custoTotal} className="text-ink-2" /></Stat>
          <Stat label="Margem"><Money value={data.rentabilidade.margem} className="font-semibold text-brand-ink" /></Stat>
          <Stat label="Margem %"><span className="money text-ink">{data.rentabilidade.margemPercentual.toFixed(1)}%</span></Stat>
          <Stat label="Ticket médio"><Money value={data.rentabilidade.ticketMedio} className="text-ink" /></Stat>
          <Stat label="Atendimentos"><span className="money text-ink">{data.rentabilidade.atendimentos}</span></Stat>
        </div>
      )}

      {data && aba === 'servicos' && (
        <Card className="shadow-card">
          <CardHead title="Receita por serviço" subtitle={`Total ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.servicos.receitaTotal)}`} />
          <DataTable columns={servicoCols} rows={data.servicos.receitaPorServico} getKey={(s) => s.servicoId} emptyLabel="Sem serviços no período." />
        </Card>
      )}

      {data && aba === 'produtos' && (
        <Card className="shadow-card">
          <CardHead title="Produtos mais vendidos" subtitle={`Receita ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.vendas.receitaTotal)}`} />
          <DataTable columns={produtoCols} rows={data.vendas.topProdutos} getKey={(p) => p.produtoId} emptyLabel="Sem vendas no período." />
        </Card>
      )}

      {data && aba === 'estoque' && (
        <>
          <Card className="shadow-card">
            <CardHead title="Giro de estoque" />
            <DataTable columns={giroCols} rows={data.estoque.giro} getKey={(g) => g.produtoId} emptyLabel="Sem dados de giro." />
          </Card>
          <Card className="shadow-card">
            <CardHead title="Produtos parados" />
            <DataTable columns={paradoCols} rows={data.estoque.produtosParados} getKey={(p) => p.produtoId} emptyLabel="Nenhum produto parado." />
          </Card>
          <Card className="shadow-card">
            <CardHead title="Ruptura iminente" />
            <DataTable columns={rupturaCols} rows={data.estoque.rupturaIminente} getKey={(r) => r.produtoId} emptyLabel="Nada em risco de ruptura." />
          </Card>
        </>
      )}
    </>
  )
}
