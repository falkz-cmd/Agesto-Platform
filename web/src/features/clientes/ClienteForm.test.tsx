import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClienteForm } from './ClienteForm'

function setup() {
  const onSubmit = vi.fn()
  render(
    <ClienteForm initial={null} onSubmit={onSubmit} submitting={false} onCancel={vi.fn()} />,
  )
  return { onSubmit }
}

describe('ClienteForm', () => {
  it('bloqueia envio com CPF inválido e mostra o erro', async () => {
    const { onSubmit } = setup()
    await userEvent.type(screen.getByLabelText(/Nome/i), 'João Silva')
    await userEvent.click(screen.getByRole('button', { name: /Salvar/i }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/CPF inválido/i)).toBeInTheDocument()
  })

  it('envia dados válidos, mascara o CPF e normaliza opcionais para null', async () => {
    const { onSubmit } = setup()
    await userEvent.type(screen.getByLabelText(/Nome/i), 'João Silva')
    await userEvent.type(screen.getByLabelText(/CPF/i), '12345678901')
    await userEvent.click(screen.getByRole('button', { name: /Salvar/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const arg = onSubmit.mock.calls[0][0]
    expect(arg.nome).toBe('João Silva')
    expect(arg.cpf).toBe('123.456.789-01')
    expect(arg.telefone).toBeNull()
    expect(arg.cidade).toBeNull()
  })
})
