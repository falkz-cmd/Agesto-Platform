import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import { periodRange } from './period'
import type { Period } from '../layout/PeriodSwitch'
import type { DashboardResponse, AtendimentoResumo } from '../types/api'

/** Dashboard consolidado do período selecionado. */
export function useDashboard(period: Period) {
  const { de, ate } = periodRange(period)
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: () =>
      api.get<DashboardResponse>(
        `/api/metrics/dashboard?de=${encodeURIComponent(de)}&ate=${encodeURIComponent(ate)}`,
      ),
  })
}

/** Últimos atendimentos (formato-alvo; ver delta de backend nos types). */
export function useUltimosAtendimentos() {
  return useQuery({
    queryKey: ['atendimentos', 'ultimos'],
    queryFn: () => api.get<AtendimentoResumo[]>('/api/atendimento?limit=5'),
  })
}
