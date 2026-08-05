import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { Configuracao, TipoOperacao } from '../../types/api'

const KEY = ['configuracao'] as const

export function useConfiguracao() {
  return useQuery({ queryKey: KEY, queryFn: () => api.get<Configuracao>('/api/configuracao') })
}

export function useUpdateConfiguracao() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (tipoOperacao: TipoOperacao) =>
      api.put<Configuracao>('/api/configuracao', { tipoOperacao }),
    onSuccess: (data) => qc.setQueryData(KEY, data),
  })
}
