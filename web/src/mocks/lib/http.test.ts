import { describe, it, expect } from 'vitest'
import { makeStore, type Entity } from './http'

interface Foo extends Entity {
  nome: string
}
type FooData = Omit<Foo, keyof Entity>

describe('makeStore (mock stateful)', () => {
  it('cria com id incremental, uuid e timestamps', () => {
    const s = makeStore<Foo>([])
    const a = s.create({ nome: 'A' } as FooData)
    expect(a.id).toBe(1)
    expect(a.nome).toBe('A')
    expect(a.uuid).toBeTruthy()
    expect(a.createdAt).toBeTruthy()
    const b = s.create({ nome: 'B' } as FooData)
    expect(b.id).toBe(2)
    expect(s.list()).toHaveLength(2)
  })

  it('continua os ids a partir do maior id do seed', () => {
    const s = makeStore<Foo>([
      { id: 5, uuid: 'x', nome: 'seed', createdAt: '', updatedAt: '' },
    ])
    expect(s.create({ nome: 'novo' } as FooData).id).toBe(6)
  })

  it('update mescla campos e remove funciona', () => {
    const s = makeStore<Foo>([])
    const a = s.create({ nome: 'A' } as FooData)
    expect(s.update(a.id, { nome: 'A2' })?.nome).toBe('A2')
    expect(s.get(a.id)?.nome).toBe('A2')
    expect(s.remove(a.id)).toBe(true)
    expect(s.list()).toHaveLength(0)
    expect(s.remove(999)).toBe(false)
  })
})
