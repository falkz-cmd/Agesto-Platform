import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import { periodRange, agendaRange } from './period'
import type { Period } from '../layout/PeriodSwitch'
import type {
  DashboardResponse,
  AtendimentoResumo,
  AgendaItem,
} from '../types/api'

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

/** Agenda de atendimentos agendados no período (enriquecida). */
export function useAgenda(period: Period) {
  const { de, ate } = agendaRange(period)
  return useQuery({
    queryKey: ['agenda', period],
    queryFn: () =>
      api.get<AgendaItem[]>(
        `/api/atendimento/agenda?de=${encodeURIComponent(de)}&ate=${encodeURIComponent(ate)}`,
      ),
  })
}
