import type { HTMLInputTypeAttribute } from 'react'

export function TextField({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required = false,
  maxLength,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  required?: boolean
  maxLength?: number
  autoComplete?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-ink-2">
        {label}
        {required && <span className="text-bad"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`rounded-[10px] border bg-surface px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand ${
          error ? 'border-bad' : 'border-line'
        }`}
      />
      {error && <span className="text-[12px] text-bad">{error}</span>}
    </label>
  )
}
