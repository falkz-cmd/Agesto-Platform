import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

/** Tabela genérica dirigida por config de colunas, com loading e vazio. */
export function DataTable<T>({
  columns,
  rows,
  getKey,
  loading = false,
  emptyLabel = 'Nada por aqui ainda.',
}: {
  columns: Column<T>[]
  rows: T[] | undefined
  getKey: (row: T) => string | number
  loading?: boolean
  emptyLabel?: string
}) {
  const alignClass = (a?: 'left' | 'right' | 'center') =>
    a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-line-2 text-[10.5px] uppercase tracking-[0.06em] text-ink-4">
            {columns.map((c, i) => (
              <th key={i} className={`pb-2.5 font-bold ${alignClass(c.align)}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="py-6 text-center text-ink-3">
                Carregando…
              </td>
            </tr>
          )}
          {!loading && rows && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-ink-3">
                {emptyLabel}
              </td>
            </tr>
          )}
          {!loading &&
            rows?.map((row) => (
              <tr key={getKey(row)} className="border-b border-line-2 last:border-0">
                {columns.map((c, i) => (
                  <td
                    key={i}
                    className={`py-[11px] ${alignClass(c.align)} ${c.className ?? ''}`}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
