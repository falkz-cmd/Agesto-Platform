import { useState } from 'react'
import { produtosResource } from './resource'
import { ProdutoForm } from './ProdutoForm'
import {
  Button,
  Card,
  DataTable,
  Drawer,
  ConfirmDialog,
  Money,
  Pill,
  useToast,
  type Column,
} from '../../components/ui'
import { IconPlus, IconPencil, IconTrash } from '../../components/icons'
import { ApiError } from '../../lib/api'
import { useConfiguracao } from '../parametrizacao/queries'
import type { Produto, ProdutoInput } from '../../types/api'

const iconBtn =
  'grid h-8 w-8 place-items-center rounded-[9px] text-ink-3 transition hover:bg-surface-2'

export function ProdutosPage() {
  const list = produtosResource.useList()
  const create = produtosResource.useCreate()
  const update = produtosResource.useUpdate()
  const remove = produtosResource.useRemove()
  const toast = useToast()
  const config = useConfiguracao()
  const controlaEstoque = config.data?.controlaEstoque ?? true

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Produto | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<Produto | null>(null)

  function openCreate() {
    setEditing(null)
    setServerError(null)
    setDrawerOpen(true)
  }
  function openEdit(p: Produto) {
    setEditing(p)
    setServerError(null)
    setDrawerOpen(true)
  }

  function handleSubmit(input: ProdutoInput) {
    setServerError(null)
    const onSuccess = () => {
      setDrawerOpen(false)
      toast.success(editing ? 'Produto atualizado.' : 'Produto criado.')
    }
    const onError = (e: unknown) =>
      setServerError(e instanceof ApiError ? e.message : 'Erro ao salvar.')

    if (editing) update.mutate({ id: editing.id, body: input }, { onSuccess, onError })
    else create.mutate(input, { onSuccess, onError })
  }

  function handleDelete() {
    if (!toDelete) return
    remove.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success('Produto removido.')
        setToDelete(null)
      },
      onError: () => {
        toast.error('Não foi possível remover.')
        setToDelete(null)
      },
    })
  }

  const columns: Column<Produto>[] = [
    { header: 'Nome', cell: (p) => <span className="font-medium text-ink">{p.nome}</span> },
    { header: 'Preço', align: 'right', cell: (p) => <Money value={p.preco} cents /> },
    ...(controlaEstoque
      ? [
          {
            header: 'Estoque',
            align: 'right',
            cell: (p: Produto) =>
              p.quantidadeEstoque <= 3 ? (
                <Pill tone="pend">{p.quantidadeEstoque} un</Pill>
              ) : (
                <span className="tabular-nums text-ink-2">{p.quantidadeEstoque} un</span>
              ),
          } satisfies Column<Produto>,
        ]
      : []),
    {
      header: 'Ações',
      align: 'right',
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => openEdit(p)}
            aria-label="Editar"
            className={`${iconBtn} hover:text-brand-ink`}
          >
            <IconPencil className="h-[16px] w-[16px]" />
          </button>
          <button
            type="button"
            onClick={() => setToDelete(p)}
            aria-label="Excluir"
            className={`${iconBtn} hover:text-bad`}
          >
            <IconTrash className="h-[16px] w-[16px]" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Card className="shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Produtos</h2>
            <p className="text-[12.5px] text-ink-3">
              {list.data?.length ?? 0} cadastrados
            </p>
          </div>
          <Button onClick={openCreate}>
            <IconPlus className="h-4 w-4" /> Novo
          </Button>
        </div>
        <DataTable
          columns={columns}
          rows={list.data}
          loading={list.isLoading}
          getKey={(p) => p.id}
          emptyLabel="Nenhum produto cadastrado."
        />
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Editar produto' : 'Novo produto'}
      >
        <ProdutoForm
          key={editing?.id ?? 'new'}
          initial={editing}
          onSubmit={handleSubmit}
          submitting={create.isPending || update.isPending}
          serverError={serverError}
          onCancel={() => setDrawerOpen(false)}
          controlaEstoque={controlaEstoque}
        />
      </Drawer>

      <ConfirmDialog
        open={toDelete !== null}
        title="Excluir produto"
        message={`Remover "${toDelete?.nome}"? Esta ação não pode ser desfeita.`}
        loading={remove.isPending}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
