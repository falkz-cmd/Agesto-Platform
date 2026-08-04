import { Card } from '../components/ui'

/** Página em construção — usada nas rotas ainda não implementadas. */
export function Placeholder({ title }: { title: string }) {
  return (
    <Card className="shadow-card">
      <div className="flex flex-col items-start gap-2 py-6">
        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-4">
          Em construção
        </span>
        <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
        <p className="max-w-prose text-[13px] text-ink-3">
          Esta seção ainda não foi implementada. O layout, a navegação e o design
          system já estão de pé — as telas de dados chegam nas próximas tarefas.
        </p>
      </div>
    </Card>
  )
}
