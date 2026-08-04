export type Period = '7d' | 'mes' | 'ano'

const OPTIONS: { value: Period; label: string }[] = [
  { value: '7d', label: '7 dias' },
  { value: 'mes', label: 'Mês' },
  { value: 'ano', label: 'Ano' },
]

/** Seletor de período (segmented control). Estado vive no AppShell. */
export function PeriodSwitch({
  value,
  onChange,
}: {
  value: Period
  onChange: (p: Period) => void
}) {
  return (
    <div className="ml-auto flex rounded-[10px] border border-line bg-surface-2 p-[3px]">
      {OPTIONS.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold transition ${
              active
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
