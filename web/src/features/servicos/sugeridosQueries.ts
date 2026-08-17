import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ServicoSugerido, ServicoSugeridoInput } from '../../types/api'

const key = (servicoId: number) => ['servico-sugeridos', servicoId] as const

export function useServicoSugeridos(servicoId: number) {
  return useQuery({
    queryKey: key(servicoId),
    queryFn: () => api.get<ServicoSugerido[]>(`/api/servico/${servicoId}/sugeridos`),
    enabled: servicoId > 0,
  })
}

export function useUpdateServicoSugeridos(servicoId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itens: ServicoSugeridoInput[]) =>
      api.put<ServicoSugerido[]>(`/api/servico/${servicoId}/sugeridos`, itens),
    onSuccess: (data) => qc.setQueryData(key(servicoId), data),
  })
}
