import { useState, type FormEvent } from 'react'
import type {
  Cliente,
  Produto,
  Servico,
  OrcamentoInput,
  StatusOrcamento,
} from '../../types/api'
import { Button, NumberField, Money } from '../../components/ui'
import { IconPlus, IconTrash } from '../../components/icons'

const selectCls =
  'rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand'

type Tipo = 'produto' | 'servico' | 'avulso'

interface DraftItem {
  key: string
  produtoId: number | null
  servicoId: number | null
  descricao: string | null
  label: string
  quantidade: number
  precoUnitario: number
}

function servicoPreco(s: Servico): number | undefined {
  return s.valorHora ?? s.valorEmpreitada ?? undefined
}

export function OrcamentoForm({
  clientes,
  produtos,
  servicos,
  onSubmit,
  submitting,
  serverError,
  onCancel,
}: {
  clientes: Cliente[]
  produtos: Produto[]
  servicos: Servico[]
  onSubmit: (input: OrcamentoInput) => void
  submitting: boolean
  serverError?: string | null
  onCancel: () => void
}) {
  const [clienteId, setClienteId] = useState<number | undefined>(undefined)
  const [status, setStatus] = useState<StatusOrcamento>('Rascunho')
  const [itens, setItens] = useState<DraftItem[]>([])
  const [errors, setErrors] = useState<{ cliente?: string; itens?: string }>({})

  // rascunho do item em edição
  const [tipo, setTipo] = useState<Tipo>('produto')
  const [refId, setRefId] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState<number | undefined>(1)
  const [preco, setPreco] = useState<number | undefined>(undefined)
  const [draftError, setDraftError] = useState<string | null>(null)

  const total = itens.reduce((s, i) => s + i.quantidade * i.precoUnitario, 0)

  function changeTipo(t: Tipo) {
    setTipo(t)
    setRefId('')
    setDescricao('')
    setPreco(undefined)
    setDraftError(null)
  }

  function pickProduto(id: string) {
    setRefId(id)
    setPreco(produtos.find((p) => p.id === Number(id))?.preco)
  }
  function pickServico(id: string) {
    setRefId(id)
    const s = servicos.find((x) => x.id === Number(id))
    setPreco(s ? servicoPreco(s) : undefined)
  }

  function addItem() {
    setDraftError(null)
    if (!quantidade || quantidade < 1) return setDraftError('Quantidade inválida.')
    if (preco === undefined || preco < 0) return setDraftError('Preço inválido.')

    let produtoId: number | null = null
    let servicoId: number | null = null
    let desc: string | null = null
    let label = ''

    if (tipo === 'produto') {
      if (!refId) return setDraftError('Escolha um produto.')
      produtoId = Number(refId)
      label = produtos.find((p) => p.id === produtoId)?.nome ?? 'Produto'
    } else if (tipo === 'servico') {
      if (!refId) return setDraftError('Escolha um serviço.')
      servicoId = Number(refId)
      label = servicos.find((s) => s.id === servicoId)?.descricao ?? 'Serviço'
    } else {
      if (!descricao.trim()) return setDraftError('Descreva o item avulso.')
      desc = descricao.trim()
      label = desc
    }

    setItens((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        produtoId,
        servicoId,
        descricao: desc,
        label,
        quantidade,
        precoUnitario: preco,
      },
    ])
    setRefId('')
    setDescricao('')
    setQuantidade(1)
    setPreco(undefined)
  }

  function removeItem(key: string) {
    setItens((prev) => prev.filter((i) => i.key !== key))
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e: { cliente?: string; itens?: string } = {}
    if (clienteId === undefined) e.cliente = 'Selecione um cliente.'
    if (itens.length === 0) e.itens = 'Adicione ao menos um item.'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    onSubmit({
      clienteId: clienteId!,
      status,
      itens: itens.map((i) => ({
        produtoId: i.produtoId,
        servicoId: i.servicoId,
        descricao: i.descricao,
        quantidade: i.quantidade,
        precoUnitario: i.precoUnitario,
      })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex flex-col gap-4 px-5 py-4">
        {serverError && (
          <p className="rounded-sm bg-bad-soft px-3 py-2 text-[12.5px] font-medium text-bad">
            {serverError}
          </p>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-ink-2">
            Cliente<span className="text-bad"> *</span>
          </span>
          <select
            value={clienteId ?? ''}
            onChange={(e) =>
              setClienteId(e.target.value === '' ? undefined : Number(e.target.value))
            }
            className={`${selectCls} ${errors.cliente ? 'border-bad' : ''}`}
          >
            <option value="">Selecione…</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          {errors.cliente && <span className="text-[12px] text-bad">{errors.cliente}</span>}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-ink-2">Status inicial</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusOrcamento)}
            className={selectCls}
          >
            <option value="Rascunho">Rascunho</option>
            <option value="Enviado">Enviado</option>
          </select>
        </label>

        {/* Itens adicionados */}
        <div className="flex flex-col gap-2">
          <span className="text-[12.5px] font-semibold text-ink-2">Itens</span>
          {itens.length === 0 && (
            <p className="text-[12.5px] text-ink-3">Nenhum item ainda.</p>
          )}
          {itens.map((i) => (
            <div
              key={i.key}
              className="flex items-center gap-2 rounded-sm border border-line-2 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-ink">{i.label}</div>
                <div className="text-[11.5px] text-ink-3">
                  {i.quantidade} × <Money value={i.precoUnitario} cents />
                </div>
              </div>
              <Money value={i.quantidade * i.precoUnitario} cents className="text-[13px] font-semibold" />
              <button
                type="button"
                onClick={() => removeItem(i.key)}
                aria-label="Remover item"
                className="grid h-7 w-7 flex-none place-items-center rounded-[8px] text-ink-4 transition hover:bg-surface-2 hover:text-bad"
              >
                <IconTrash className="h-[15px] w-[15px]" />
              </button>
            </div>
          ))}
          {errors.itens && <span className="text-[12px] text-bad">{errors.itens}</span>}
        </div>

        {/* Adicionar item */}
        <div className="flex flex-col gap-3 rounded-sm border border-dashed border-line bg-surface-2 p-3">
          <select value={tipo} onChange={(e) => changeTipo(e.target.value as Tipo)} className={selectCls}>
            <option value="produto">Produto (catálogo)</option>
            <option value="servico">Serviço (catálogo)</option>
            <option value="avulso">Item avulso</option>
          </select>

          {tipo === 'produto' && (
            <select value={refId} onChange={(e) => pickProduto(e.target.value)} className={selectCls}>
              <option value="">Escolha o produto…</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          )}
          {tipo === 'servico' && (
            <select value={refId} onChange={(e) => pickServico(e.target.value)} className={selectCls}>
              <option value="">Escolha o serviço…</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.descricao}
                </option>
              ))}
            </select>
          )}
          {tipo === 'avulso' && (
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do item"
              maxLength={200}
              className={selectCls}
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Qtd."
              step={1}
              value={quantidade}
              onChange={setQuantidade}
            />
            <NumberField
              label="Preço unit."
              prefix="R$"
              step={0.01}
              value={preco}
              onChange={setPreco}
            />
          </div>

          {draftError && <span className="text-[12px] text-bad">{draftError}</span>}

          <Button type="button" variant="ghost" onClick={addItem} className="self-start">
            <IconPlus className="h-4 w-4" /> Adicionar item
          </Button>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="text-[13px] font-semibold text-ink">Total</span>
          <Money value={total} cents className="text-[18px] text-brand-ink" />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Criar orçamento'}
        </Button>
      </div>
    </form>
  )
}
