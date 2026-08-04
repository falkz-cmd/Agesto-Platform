export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  error?: string
  required?: boolean
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-ink-2">
        {label}
        {required && <span className="text-bad"> *</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`rounded-[10px] border bg-surface px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand ${
          error ? 'border-bad' : 'border-line'
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[12px] text-bad">{error}</span>}
    </label>
  )
}
