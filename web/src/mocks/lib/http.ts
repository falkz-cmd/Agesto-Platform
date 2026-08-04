import { http, HttpResponse } from 'msw'
import type { ApiResponse } from '../../types/api'

/** Envelopa no formato ApiResponse do backend. */
export function ok<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { success: true, message, data, errors: [] }
}

/** Resposta de erro no envelope, com status HTTP. */
export function fail(status: number, message: string) {
  return HttpResponse.json(
    { success: false, message, data: null, errors: [] },
    { status },
  )
}

export interface Entity {
  id: number
  uuid: string
  createdAt: string
  updatedAt: string
}

export interface Store<T extends Entity> {
  list: () => T[]
  get: (id: number) => T | undefined
  create: (data: Omit<T, keyof Entity>) => T
  update: (id: number, data: Partial<Omit<T, keyof Entity>>) => T | undefined
  remove: (id: number) => boolean
}

/** Loja em memória (mock stateful). Reseta no reload da página. */
export function makeStore<T extends Entity>(seed: T[]): Store<T> {
  let items = seed.map((s) => ({ ...s }))
  let nextId = items.reduce((max, i) => Math.max(max, i.id), 0) + 1

  return {
    list: () => items,
    get: (id) => items.find((i) => i.id === id),
    create: (data) => {
      const now = new Date().toISOString()
      const item = {
        ...data,
        id: nextId++,
        uuid: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as unknown as T
      items = [...items, item]
      return item
    },
    update: (id, data) => {
      const idx = items.findIndex((i) => i.id === id)
      if (idx < 0) return undefined
      const updated = { ...items[idx], ...data, updatedAt: new Date().toISOString() }
      items = items.map((i) => (i.id === id ? updated : i))
      return updated
    },
    remove: (id) => {
      const before = items.length
      items = items.filter((i) => i.id !== id)
      return items.length < before
    },
  }
}

/** Handlers CRUD genéricos para um recurso, mutando a store em memória. */
export function crudHandlers<T extends Entity>(
  path: string,
  store: Store<T>,
  validateCreate?: (body: Record<string, unknown>, store: Store<T>) => string | null,
) {
  return [
    http.get(`*${path}`, () => HttpResponse.json(ok(store.list()))),
    http.post(`*${path}`, async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>
      const err = validateCreate?.(body, store)
      if (err) return fail(409, err)
      return HttpResponse.json(
        ok(store.create(body as Omit<T, keyof Entity>), 'Criado com sucesso.'),
      )
    }),
    http.put(`*${path}/:id`, async ({ request, params }) => {
      const body = (await request.json()) as Partial<Omit<T, keyof Entity>>
      const updated = store.update(Number(params.id), body)
      if (!updated) return fail(404, 'Registro não encontrado.')
      return HttpResponse.json(ok(updated, 'Atualizado com sucesso.'))
    }),
    http.delete(`*${path}/:id`, ({ params }) => {
      const removed = store.remove(Number(params.id))
      if (!removed) return fail(404, 'Registro não encontrado.')
      return HttpResponse.json(ok(null, 'Removido com sucesso.'))
    }),
  ]
}
