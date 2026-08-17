import type { LocalDb } from '@/db/types'
import type { ServicoSugerido } from '@/types/api'

const META_KEY = 'sugeridos'

/** Persiste os materiais sugeridos (kit) vindos da Carga. */
export async function saveSugeridos(db: LocalDb, itens: ServicoSugerido[]): Promise<void> {
  await db.setMeta(META_KEY, JSON.stringify(itens))
}

/** Lê os materiais sugeridos locais; lista vazia se ausente ou inválido. */
export async function getSugeridos(db: LocalDb): Promise<ServicoSugerido[]> {
  const raw = await db.getMeta(META_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ServicoSugerido[]
  } catch {
    return []
  }
}
