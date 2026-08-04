import { useState } from 'react'
import { clientesResource } from './resource'
import { ClienteForm } from './ClienteForm'
import {
  Button,
  Card,
  DataTable,
  Drawer,
  ConfirmDialog,
  useToast,
  type Column,
} from '../../components/ui'
import { IconPlus, IconPencil, IconTrash } from '../../components/icons'
import { ApiError } from '../../lib/api'
import type { Cliente, ClienteInput } from '../../types/api'

const iconBtn =
  'grid h-8 w-8 place-items-center rounded-[9px] text-ink-3 transition hover:bg-surface-2'

export function ClientesPage() {
  const list = clientesResource.useList()
  const create = clientesResource.useCreate()
  const update = clientesResource.useUpdate()
  const remove = clientesResource.useRemove()
  const toast = useToast()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<Cliente | null>(null)

  function openCreate() {
    setEditing(null)
    setServerError(null)
    setDrawerOpen(true)
  }
  function openEdit(c: Cliente) {
    setEditing(c)
    setServerError(null)
    setDrawerOpen(true)
  }

  function handleSubmit(input: ClienteInput) {
    setServerError(null)
    const onSuccess = () => {
      setDrawerOpen(false)
      toast.success(editing ? 'Cliente atualizado.' : 'Cliente criado.')
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
        toast.success('Cliente removido.')
        setToDelete(null)
      },
      onError: () => {
        toast.error('Não foi possível remover.')
        setToDelete(null)
      },
    })
  }

  const columns: Column<Cliente>[] = [
    { header: 'Nome', cell: (c) => <span className="font-medium text-ink">{c.nome}</span> },
    { header: 'CPF', cell: (c) => <span className="text-ink-2">{c.cpf}</span> },
    { header: 'Telefone', cell: (c) => <span className="text-ink-2">{c.telefone ?? '—'}</span> },
    { header: 'Cidade', cell: (c) => <span className="text-ink-2">{c.cidade ?? '—'}</span> },
    {
      header: 'Ações',
      align: 'right',
      cell: (c) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => openEdit(c)}
            aria-label="Editar"
            className={`${iconBtn} hover:text-brand-ink`}
          >
            <IconPencil className="h-[16px] w-[16px]" />
          </button>
          <button
            type="button"
            onClick={() => setToDelete(c)}
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
            <h2 className="text-[15px] font-semibold text-ink">Clientes</h2>
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
          getKey={(c) => c.id}
          emptyLabel="Nenhum cliente cadastrado."
        />
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Editar cliente' : 'Novo cliente'}
      >
        <ClienteForm
          key={editing?.id ?? 'new'}
          initial={editing}
          onSubmit={handleSubmit}
          submitting={create.isPending || update.isPending}
          serverError={serverError}
          onCancel={() => setDrawerOpen(false)}
        />
      </Drawer>

      <ConfirmDialog
        open={toDelete !== null}
        title="Excluir cliente"
        message={`Remover "${toDelete?.nome}"? Esta ação não pode ser desfeita.`}
        loading={remove.isPending}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
