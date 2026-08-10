import { describe, it, expect } from '@jest/globals'
import { carga, initialSync } from './sync'
import { createMemoryDb } from '@/db/memoryDb'

describe('sync.carga (mock)', () => {
  it('popula o banco injetado com os dados de referência e marca lastSync', async () => {
    const mem = createMemoryDb()
    await mem.init()

    const r = await carga(mem)
    expect(r.clientes).toBe(3)
    expect(r.produtos).toBe(3)
    expect(r.servicos).toBe(3)

    const clientes = await mem.getClientes()
    expect(clientes[0].nome).toBe('Vó Joana')
    expect(await mem.getMeta('lastSync')).not.toBeNull()
  })

  it('initialSync popula referência e agenda do dia', async () => {
    const mem = createMemoryDb()
    await mem.init()

    const r = await initialSync(mem)
    expect(r.clientes).toBe(3)
    expect(r.agenda).toBe(3)

    const agenda = await mem.getAgenda()
    expect(agenda).toHaveLength(3)
    expect(agenda[0].clienteNome).toBeTruthy()
  })
})
