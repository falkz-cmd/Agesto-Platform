/**
 * Ponte desacoplada entre o cliente de API e o AuthProvider: em 401 de sessão
 * expirada, o api chama notifySessionExpired() e o AuthProvider (registrado via
 * setOnSessionExpired) limpa o estado de auth, disparando o redirect da guarda.
 */
let handler: (() => void) | null = null

export function setOnSessionExpired(fn: (() => void) | null): void {
  handler = fn
}

export function notifySessionExpired(): void {
  handler?.()
}
