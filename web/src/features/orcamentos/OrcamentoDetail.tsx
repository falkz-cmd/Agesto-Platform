import { Button, Money } from '../../components/ui'
import { itemLabel } from './labels'
import { StatusOrcamentoPill } from './status'
import type { Orcamento, Produto, Servico, StatusOrcamento } from '../../types/api'

const selectCls =
  'rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand'

const STATUSES: StatusOrcamento[] = ['Rascunho', 'Enviado', 'Aprovado', 'Recusado']

function dataLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function OrcamentoDetail({
  orcamento,
  clienteNome,
  produtos,
  servicos,
  onChangeStatus,
  onConvert,
  onDelete,
  busy,
}: {
  orcamento: Orcamento
  clienteNome: string
  produtos: Produto[]
  servicos: Servico[]
  onChangeStatus: (status: StatusOrcamento) => void
  onConvert: () => void
  onDelete: () => void
  busy: { status: boolean; convert: boolean; delete: boolean }
}) {
  const convertido = orcamento.atendimentoConvertidoId != null

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[15px] font-semibold text-ink">{clienteNome}</div>
            <div className="text-[12.5px] text-ink-3">
              Orçamento #{orcamento.id} · {dataLabel(orcamento.dataRegistro)}
            </div>
          </div>
          <StatusOrcamentoPill status={orcamento.status} />
        </div>

        {/* Itens */}
        <div className="overflow-hidden rounded-sm border border-line-2">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface-2 text-[10.5px] uppercase tracking-[0.06em] text-ink-4">
                <th className="px-3 py-2 text-left font-bold">Item</th>
                <th className="px-3 py-2 text-right font-bold">Qtd</th>
                <th className="px-3 py-2 text-right font-bold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.itens.map((it) => (
                <tr key={it.id} className="border-t border-line-2">
                  <td className="px-3 py-2 text-ink">
                    {itemLabel(it, produtos, servicos)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink-2">
                    {it.quantidade}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Money value={it.subtotal} cents />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">Total</span>
          <Money value={orcamento.valorTotal} cents className="text-[18px] text-brand-ink" />
        </div>

        {/* Status */}
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-ink-2">Status</span>
          <select
            value={orcamento.status}
            disabled={busy.status || convertido}
            onChange={(e) => onChangeStatus(e.target.value as StatusOrcamento)}
            className={`${selectCls} disabled:opacity-60`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {/* Conversão */}
        {convertido ? (
          <div className="rounded-sm bg-good-soft px-3 py-2.5 text-[12.5px] font-medium text-good">
            Convertido em atendimento #{orcamento.atendimentoConvertidoId}.
          </div>
        ) : (
          <div>
            <Button
              type="button"
              onClick={onConvert}
              disabled={orcamento.status !== 'Aprovado' || busy.convert}
              className="w-full"
            >
              {busy.convert ? 'Convertendo…' : 'Converter em atendimento'}
            </Button>
            {orcamento.status !== 'Aprovado' && (
              <p className="mt-1.5 text-center text-[11.5px] text-ink-4">
                Apenas orçamentos aprovados podem ser convertidos.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between border-t border-line px-5 py-4">
        <button
          type="button"
          onClick={onDelete}
          disabled={busy.delete}
          className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-semibold text-bad transition hover:bg-bad-soft disabled:opacity-60"
        >
          {busy.delete ? 'Excluindo…' : 'Excluir orçamento'}
        </button>
      </div>
    </div>
  )
}
