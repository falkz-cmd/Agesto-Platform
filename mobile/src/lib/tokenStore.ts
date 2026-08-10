/**
 * Storage do JWT — default (web + testes). No device, o Metro usa
 * `tokenStore.native.ts` (expo-secure-store). Aqui: localStorage se houver,
 * senão memória (ambiente de teste).
 */
const KEY = 'agesto_token'
let mem: string | null = null

function ls(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null
  } catch {
    return null
  }
}

export async function getToken(): Promise<string | null> {
  return ls()?.getItem(KEY) ?? mem
}
export async function setToken(token: string): Promise<void> {
  const s = ls()
  if (s) s.setItem(KEY, token)
  else mem = token
}
export async function clearToken(): Promise<void> {
  ls()?.removeItem(KEY)
  mem = null
}
