import { useState } from 'react'
import {
  useOrcamentos,
  useCreateOrcamento,
  useUpdateStatus,
  useDeleteOrcamento,
  useConverterOrcamento,
} from './queries'
import { OrcamentoForm } from './OrcamentoForm'
import { OrcamentoDetail } from './OrcamentoDetail'
import { StatusOrcamentoPill } from './status'
import { clientesResource } from '../clientes/resource'
import { produtosResource } from '../produtos/resource'
import { servicosResource } from '../servicos/resource'
import { Button, Card, DataTable, Drawer, Money, useToast, type Column } from '../../components/ui'
import { IconPlus } from '../../components/icons'
import { ApiError } from '../../lib/api'
import type { Orcamento, OrcamentoInput, StatusOrcamento } from '../../types/api'

function dataCurta(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function OrcamentosPage() {
  const list = useOrcamentos()
  const create = useCreateOrcamento()
  const updateStatus = useUpdateStatus()
  const remove = useDeleteOrcamento()
  const converter = useConverterOrcamento()
  const toast = useToast()

  const clientes = clientesResource.useList()
  const produtos = produtosResource.useList()
  const servicos = servicosResource.useList()

  const [createOpen, setCreateOpen] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const clienteNome = (id: number) =>
    clientes.data?.find((c) => c.id === id)?.nome ?? `Cliente #${id}`

  const detail = list.data?.find((o) => o.id === detailId) ?? null

  function handleCreate(input: OrcamentoInput) {
    setServerError(null)
    create.mutate(input, {
      onSuccess: () => {
        setCreateOpen(false)
        toast.success('Orçamento criado.')
      },
      onError: (e) =>
        setServerError(e instanceof ApiError ? e.message : 'Erro ao criar orçamento.'),
    })
  }

  function handleChangeStatus(status: StatusOrcamento) {
    if (detailId == null) return
    updateStatus.mutate(
      { id: detailId, status },
      {
        onSuccess: () => toast.success('Status atualizado.'),
        onError: () => toast.error('Não foi possível atualizar o status.'),
      },
    )
  }

  function handleConvert() {
    if (detailId == null) return
    converter.mutate(detailId, {
      onSuccess: () => toast.success('Orçamento convertido em atendimento.'),
      onError: (e) =>
        toast.error(e instanceof ApiError ? e.message : 'Não foi possível converter.'),
    })
  }

  function handleDelete() {
    if (detailId == null) return
    remove.mutate(detailId, {
      onSuccess: () => {
        toast.success('Orçamento removido.')
        setDetailId(null)
      },
      onError: () => toast.error('Não foi possível remover.'),
    })
  }

  const columns: Column<Orcamento>[] = [
    { header: 'Cliente', cell: (o) => <span className="font-medium text-ink">{clienteNome(o.clienteId)}</span> },
    { header: 'Itens', cell: (o) => <span className="text-ink-2">{o.itens.length}</span> },
    { header: 'Status', cell: (o) => <StatusOrcamentoPill status={o.status} /> },
    { header: 'Valor', align: 'right', cell: (o) => <Money value={o.valorTotal} cents /> },
    { header: 'Data', align: 'right', cell: (o) => <span className="text-ink-3">{dataCurta(o.dataRegistro)}</span> },
    {
      header: '',
      align: 'right',
      cell: (o) => (
        <button
          type="button"
          onClick={() => setDetailId(o.id)}
          className="rounded-[8px] px-2.5 py-1 text-[12px] font-semibold text-brand-ink transition hover:bg-brand-soft"
        >
          Ver
        </button>
      ),
    },
  ]

  return (
    <>
      <Card className="shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Orçamentos</h2>
            <p className="text-[12.5px] text-ink-3">{list.data?.length ?? 0} no total</p>
          </div>
          <Button onClick={() => { setServerError(null); setCreateOpen(true) }}>
            <IconPlus className="h-4 w-4" /> Novo
          </Button>
        </div>
        <DataTable
          columns={columns}
          rows={list.data}
          loading={list.isLoading}
          getKey={(o) => o.id}
          emptyLabel="Nenhum orçamento cadastrado."
        />
      </Card>

      {/* Criar */}
      <Drawer open={createOpen} onClose={() => setCreateOpen(false)} title="Novo orçamento">
        {createOpen && (
          <OrcamentoForm
            clientes={clientes.data ?? []}
            produtos={produtos.data ?? []}
            servicos={servicos.data ?? []}
            onSubmit={handleCreate}
            submitting={create.isPending}
            serverError={serverError}
            onCancel={() => setCreateOpen(false)}
          />
        )}
      </Drawer>

      {/* Detalhe */}
      <Drawer
        open={detail !== null}
        onClose={() => setDetailId(null)}
        title={detail ? `Orçamento #${detail.id}` : 'Orçamento'}
      >
        {detail && (
          <OrcamentoDetail
            orcamento={detail}
            clienteNome={clienteNome(detail.clienteId)}
            produtos={produtos.data ?? []}
            servicos={servicos.data ?? []}
            onChangeStatus={handleChangeStatus}
            onConvert={handleConvert}
            onDelete={handleDelete}
            busy={{
              status: updateStatus.isPending,
              convert: converter.isPending,
              delete: remove.isPending,
            }}
          />
        )}
      </Drawer>
    </>
  )
}
