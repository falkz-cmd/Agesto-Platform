/**
 * Configuração de runtime. Enquanto não há backend/DB no ar, `useMocks` fica
 * ligado (camada de mock em código). Trocar via env EXPO_PUBLIC_* quando subir.
 */
export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000',
  useMocks: process.env.EXPO_PUBLIC_USE_MOCKS !== 'false',
}
