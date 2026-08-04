/** Persistência do JWT (MVP em localStorage; ver nota de segurança no README). */
const KEY = 'agesto_token'

export const getToken = (): string | null => localStorage.getItem(KEY)
export const setToken = (token: string): void => localStorage.setItem(KEY, token)
export const clearToken = (): void => localStorage.removeItem(KEY)
