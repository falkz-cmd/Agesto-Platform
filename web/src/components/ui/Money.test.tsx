import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Money } from './Money'

describe('Money', () => {
  it('formata BRL sem centavos por padrão', () => {
    render(<Money value={18420} />)
    expect(screen.getByText(/R\$\s?18\.420$/)).toBeInTheDocument()
  })

  it('mostra centavos quando cents=true', () => {
    render(<Money value={512.5} cents />)
    expect(screen.getByText(/R\$\s?512,50$/)).toBeInTheDocument()
  })
})
