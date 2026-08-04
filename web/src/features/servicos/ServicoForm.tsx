import { useState, type FormEvent } from 'react'
import type { Servico, ServicoInput, TipoCobranca } from '../../types/api'
import { Button, TextField, NumberField, SelectField } from '../../components/ui'

interface FormState {
  descricao: string
  tipoCobranca: TipoCobranca
  valor: number | undefined
}

function toState(s: Servico | null): FormState {
  if (!s) return { descricao: '', tipoCobranca: 'PorHora', valor: undefined }
  return {
    descricao: s.descricao,
    tipoCobranca: s.tipoCobranca,
    valor: (s.tipoCobranca === 'PorHora' ? s.valorHora : s.valorEmpreitada) ?? undefined,
  }
}

export function ServicoForm({
  initial,
  onSubmit,
  submitting,
  serverError,
  onCancel,
}: {
  initial: Servico | null
  onSubmit: (input: ServicoInput) => void
  submitting: boolean
  serverError?: string | null
  onCancel: () => void
}) {
  const [form, setForm] = useState<FormState>(() => toState(initial))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const porHora = form.tipoCobranca === 'PorHora'

  function validate(): boolean {
    const e: Record<string, string> = {}
    const d = form.descricao.trim()
    if (d.length < 2) e.descricao = 'Descrição deve ter no mínimo 2 caracteres.'
    else if (d.length > 200) e.descricao = 'Descrição deve ter no máximo 200 caracteres.'
    if (form.valor === undefined || form.valor < 0.01)
      e.valor = 'Informe um valor maior que zero.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({
      descricao: form.descricao.trim(),
      tipoCobranca: form.tipoCobranca,
      valorHora: porHora ? form.valor : null,
      valorEmpreitada: porHora ? null : form.valor,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex flex-col gap-4 px-5 py-4">
        {serverError && (
          <p className="rounded-sm bg-bad-soft px-3 py-2 text-[12.5px] font-medium text-bad">
            {serverError}
          </p>
        )}

        <TextField
          label="Descrição"
          value={form.descricao}
          onChange={(v) => setForm((f) => ({ ...f, descricao: v }))}
          error={errors.descricao}
          required
          maxLength={200}
        />
        <SelectField<TipoCobranca>
          label="Cobrança"
          value={form.tipoCobranca}
          onChange={(v) => setForm((f) => ({ ...f, tipoCobranca: v }))}
          options={[
            { value: 'PorHora', label: 'Por hora' },
            { value: 'Empreitada', label: 'Empreitada' },
          ]}
          required
        />
        <NumberField
          label={porHora ? 'Valor por hora' : 'Valor da empreitada'}
          prefix="R$"
          step={0.01}
          value={form.valor}
          onChange={(v) => setForm((f) => ({ ...f, valor: v }))}
          error={errors.valor}
          required
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
