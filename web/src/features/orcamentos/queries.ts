import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { Orcamento, OrcamentoInput, StatusOrcamento } from '../../types/api'

const KEY = ['orcamento', 'list'] as const
const PATH = '/api/orcamento'

export function useOrcamentos() {
  return useQuery({ queryKey: KEY, queryFn: () => api.get<Orcamento[]>(PATH) })
}

export function useCreateOrcamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: OrcamentoInput) => api.post<Orcamento>(PATH, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

/** Backend: o update só altera o status (editar itens = novo orçamento). */
export function useUpdateStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusOrcamento }) =>
      api.put<Orcamento>(`${PATH}/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteOrcamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.del<null>(`${PATH}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

/** Conversão em atendimento (exige status Aprovado). */
export function useConverterOrcamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.post<{ id: number }>(`${PATH}/${id}/converter`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
