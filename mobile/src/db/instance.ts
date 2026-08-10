import { createDb } from './'

/** Instância única do banco local (memória no web, SQLite no device). */
export const db = createDb()
