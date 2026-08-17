import type { ServicoSugerido } from '@/types/api'
import type { QtyMap } from './buildAtendimento'

/**
 * Materiais sugeridos (produtoId → quantidade) para os serviços atualmente
 * selecionados. Se dois serviços sugerem o mesmo produto, vale a maior qtd.
 */
export function materiaisSugeridos(
  sugeridos: ServicoSugerido[],
  servicoQty: QtyMap,
): { produtoId: number; quantidade: number }[] {
  const selecionados = new Set(
    Object.entries(servicoQty)
      .filter(([, q]) => q > 0)
      .map(([id]) => Number(id)),
  )
  const acc = new Map<number, number>()
  for (const s of sugeridos) {
    if (!selecionados.has(s.servicoId)) continue
    acc.set(s.produtoId, Math.max(acc.get(s.produtoId) ?? 0, s.quantidadePadrao))
  }
  return [...acc].map(([produtoId, quantidade]) => ({ produtoId, quantidade }))
}
