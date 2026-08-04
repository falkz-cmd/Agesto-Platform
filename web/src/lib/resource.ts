import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'

/**
 * Fábrica de hooks de CRUD para um recurso REST no padrão do backend
 * (GET lista, POST, PUT/{id}, DELETE/{id}). Reusa o cliente de API e
 * invalida a lista após cada mutação.
 */
export function createResource<TResp, TInput>(path: string, key: string) {
  const listKey = [key, 'list'] as const

  function useList() {
    return useQuery({ queryKey: listKey, queryFn: () => api.get<TResp[]>(path) })
  }

  function useCreate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (body: TInput) => api.post<TResp>(path, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    })
  }

  function useUpdate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: ({ id, body }: { id: number; body: TInput }) =>
        api.put<TResp>(`${path}/${id}`, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    })
  }

  function useRemove() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id: number) => api.del<null>(`${path}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    })
  }

  return { useList, useCreate, useUpdate, useRemove }
}
