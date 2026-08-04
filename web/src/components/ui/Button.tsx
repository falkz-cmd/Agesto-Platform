import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:brightness-95',
  ghost: 'border border-line bg-surface text-ink-2 hover:bg-surface-2',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/** Botão quadrado só-ícone, usado na topbar. */
export function IconButton({
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-line bg-surface text-ink-2 transition hover:bg-surface-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
