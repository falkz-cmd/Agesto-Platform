import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { FaturamentoPontoPeriodo } from '../types/api'

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/** Área de "Receita por dia" — cores derivadas dos tokens do tema. */
export function ReceitaChart({ pontos }: { pontos: FaturamentoPontoPeriodo[] }) {
  const data = pontos.map((p) => ({ ...p, dia: new Date(p.data).getDate() }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="receitaArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-line-2)" />
        <XAxis
          dataKey="dia"
          tickLine={false}
          axisLine={false}
          minTickGap={22}
          tick={{ fontSize: 11, fill: 'var(--color-ink-4)' }}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ stroke: 'var(--color-line)' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const p = payload[0].payload as FaturamentoPontoPeriodo
            const dia = new Date(p.data).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            })
            return (
              <div className="rounded-sm border border-line bg-surface px-3 py-2 shadow-card">
                <div className="text-[11px] text-ink-4">{dia}</div>
                <div className="money text-[14px] text-ink">{BRL.format(p.valor)}</div>
              </div>
            )
          }}
        />
        <Area
          type="monotone"
          dataKey="valor"
          stroke="var(--color-brand)"
          strokeWidth={2.4}
          fill="url(#receitaArea)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
