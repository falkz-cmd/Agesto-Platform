const CPF_RE = /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/

export interface ClienteFormErrors {
  nome?: string
  cpf?: string
}

/** Validação do cadastro rápido de cliente (espelha as regras do backend). */
export function validateCliente(input: { nome: string; cpf: string }): ClienteFormErrors {
  const e: ClienteFormErrors = {}
  const nome = input.nome.trim()
  if (nome.length < 2) e.nome = 'Nome deve ter no mínimo 2 caracteres.'
  else if (nome.length > 120) e.nome = 'Nome deve ter no máximo 120 caracteres.'
  if (!CPF_RE.test(input.cpf.trim())) e.cpf = 'CPF inválido.'
  return e
}

export const isValid = (e: ClienteFormErrors): boolean => Object.keys(e).length === 0
