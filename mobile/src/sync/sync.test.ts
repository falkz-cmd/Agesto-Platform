import { describe, it, expect } from '@jest/globals'
import { carga, initialSync, descarga } from './sync'
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

  it('descarga empurra pendentes e marca como sincronizado', async () => {
    const mem = createMemoryDb()
    await mem.addCliente({
      uuid: 'c1', nome: 'Novo', cpf: '11122233344', telefone: null,
      logradouro: null, numero: null, bairro: null, cidade: null, cep: null, syncedAt: null,
    })
    await mem.addAtendimento({
      uuid: 'a1', clienteId: 1, status: 'Concluido', dataRegistro: '2026-08-11',
      itensProduto: [{ produtoId: 1, quantidade: 2 }], itensServico: [], syncedAt: null,
    })

    const r = await descarga(mem)
    expect(r.clientesImportados).toBe(1)
    expect(r.atendimentosImportados).toBe(1)
    expect(await mem.getPendingAtendimentos()).toHaveLength(0)
    expect((await mem.getPendingClientes())[0].syncedAt).not.toBeNull()
  })

  it('descarga sem pendências retorna zeros', async () => {
    const mem = createMemoryDb()
    const r = await descarga(mem)
    expect(r.atendimentosImportados).toBe(0)
    expect(r.clientesImportados).toBe(0)
  })
})
