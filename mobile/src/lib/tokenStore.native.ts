import * as SecureStore from 'expo-secure-store'

/** Storage do JWT no device — expo-secure-store (keychain/keystore). */
const KEY = 'agesto_token'

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY)
}
export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEY, token)
}
export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY)
}
