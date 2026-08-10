/** Erro de API com status HTTP. Em arquivo próprio para evitar ciclo api↔mocks. */
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
