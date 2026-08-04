export function NumberField({
  label,
  value,
  onChange,
  error,
  prefix,
  step = 1,
  min = 0,
  required = false,
  placeholder,
}: {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  error?: string
  prefix?: string
  step?: number
  min?: number
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-ink-2">
        {label}
        {required && <span className="text-bad"> *</span>}
      </span>
      <div
        className={`flex items-center rounded-[10px] border bg-surface focus-within:border-brand ${
          error ? 'border-bad' : 'border-line'
        }`}
      >
        {prefix && <span className="pl-3 text-[13px] text-ink-3">{prefix}</span>}
        <input
          type="number"
          step={step}
          min={min}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(e.target.value === '' ? undefined : Number(e.target.value))
          }
          className="w-full bg-transparent px-3 py-2.5 text-[14px] text-ink outline-none"
        />
      </div>
      {error && <span className="text-[12px] text-bad">{error}</span>}
    </label>
  )
}
