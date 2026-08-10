// Default (web + type-check): adapter em memória.
// O Metro resolve `index.native.ts` no device (expo-sqlite).
export { createMemoryDb as createDb } from './memoryDb'
export type { LocalDb, LocalAtendimento } from './types'
