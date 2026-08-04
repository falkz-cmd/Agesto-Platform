/**
 * Liga o MSW quando VITE_USE_MOCKS === 'true'. Import dinâmico para o worker
 * (e os dados de mock) não entrarem no bundle de produção sem mocks.
 */
export async function enableMocking(): Promise<void> {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return

  const { worker } = await import('./browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
