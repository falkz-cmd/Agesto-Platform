const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const BRL_CENTS = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Formata dinheiro em BRL, na fonte serifada da identidade do painel. */
export function Money({
  value,
  cents = false,
  className = '',
}: {
  value: number
  cents?: boolean
  className?: string
}) {
  const fmt = cents ? BRL_CENTS : BRL
  return <span className={`money ${className}`}>{fmt.format(value)}</span>
}
