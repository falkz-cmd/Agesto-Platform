import { useEffect, useMemo, useState } from 'react'
import { produtosResource } from '../produtos/resource'
import { useServicoSugeridos, useUpdateServicoSugeridos } from './sugeridosQueries'
import { Button, NumberField, SelectField, useToast } from '../../components/ui'
import { IconTrash } from '../../components/icons'
import { ApiError } from '../../lib/api'
import type { ServicoSugeridoInput } from '../../types/api'

function norm(rows: ServicoSugeridoInput[]): string {
  return JSON.stringify([...rows].sort((a, b) => a.produtoId - b.produtoId))
}

/** Editor do kit de materiais de um serviço (só ao editar um serviço existente). */
export function ServicoSugeridosEditor({ servicoId }: { servicoId: number }) {
  const produtos = produtosResource.useList()
  const sugeridos = useServicoSugeridos(servicoId)
  const update = useUpdateServicoSugeridos(servicoId)
  const toast = useToast()

  const [rows, setRows] = useState<ServicoSugeridoInput[]>([])
  const [addId, setAddId] = useState('')

  const serverRows = useMemo(
    () => (sugeridos.data ?? []).map((s) => ({ produtoId: s.produtoId, quantidadePadrao: s.quantidadePadrao })),
    [sugeridos.data],
  )

  useEffect(() => setRows(serverRows), [serverRows])

  const nomeDe = (id: number) => produtos.data?.find((p) => p.id === id)?.nome ?? `Produto #${id}`
  const disponiveis = (produtos.data ?? []).filter((p) => !rows.some((r) => r.produtoId === p.id))
  const dirty = norm(rows) !== norm(serverRows)

  function add(produtoId: number) {
    if (!produtoId || rows.some((r) => r.produtoId === produtoId)) return
    setRows((r) => [...r, { produtoId, quantidadePadrao: 1 }])
    setAddId('')
  }

  function setQtd(produtoId: number, quantidadePadrao: number) {
    setRows((r) => r.map((x) => (x.produtoId === produtoId ? { ...x, quantidadePadrao } : x)))
  }

  function remove(produtoId: number) {
    setRows((r) => r.filter((x) => x.produtoId !== produtoId))
  }

  function salvar() {
    update.mutate(
      rows.filter((r) => r.quantidadePadrao > 0),
      {
        onSuccess: () => toast.success('Materiais sugeridos salvos.'),
        onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Não foi possível salvar.'),
      },
    )
  }

  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-4">
      <div>
        <div className="text-[12.5px] font-semibold text-ink-2">Materiais que costuma usar</div>
        <p className="text-[11.5px] text-ink-4">
          Sugeridos com 1 toque ao lançar este serviço num orçamento ou atendimento.
        </p>
      </div>

      {sugeridos.isLoading && <p className="text-[12px] text-ink-3">Carregando…</p>}

      {rows.length > 0 && (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={r.produtoId} className="flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2">
              <span className="flex-1 text-[13px] text-ink">{nomeDe(r.produtoId)}</span>
              <div className="w-24">
                <NumberField
                  label=""
                  step={1}
                  value={r.quantidadePadrao}
                  onChange={(v) => setQtd(r.produtoId, v ?? 0)}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(r.produtoId)}
                aria-label="Remover"
                className="grid h-8 w-8 place-items-center rounded-[9px] text-ink-3 transition hover:bg-surface-2 hover:text-bad"
              >
                <IconTrash className="h-[16px] w-[16px]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {rows.length === 0 && !sugeridos.isLoading && (
        <p className="text-[12px] text-ink-4">Nenhum material sugerido ainda.</p>
      )}

      {disponiveis.length > 0 && (
        <SelectField<string>
          label="Adicionar material"
          value={addId}
          onChange={(v) => {
            setAddId(v)
            if (v) add(Number(v))
          }}
          options={[
            { value: '', label: 'Selecione um produto…' },
            ...disponiveis.map((p) => ({ value: String(p.id), label: p.nome })),
          ]}
        />
      )}

      <div className="flex justify-end">
        <Button type="button" onClick={salvar} disabled={!dirty || update.isPending}>
          {update.isPending ? 'Salvando…' : 'Salvar materiais'}
        </Button>
      </div>
    </div>
  )
}
