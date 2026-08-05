import { useState, type FC } from 'react'
import { useConfiguracao, useUpdateConfiguracao } from './queries'
import { Card, Button, useToast } from '../../components/ui'
import { IconWrench, IconBox, IconGrid, type IconProps } from '../../components/icons'
import { ApiError } from '../../lib/api'
import type { TipoOperacao } from '../../types/api'

const OPCOES: { value: TipoOperacao; titulo: string; desc: string; icon: FC<IconProps> }[] = [
  {
    value: 'Servico',
    titulo: 'Serviço',
    desc: 'Prestação de serviços — o foco do produto. Orçamento, agenda e atendimentos.',
    icon: IconWrench,
  },
  {
    value: 'Venda',
    titulo: 'Venda',
    desc: 'Venda de produtos com controle de estoque.',
    icon: IconBox,
  },
  {
    value: 'Hibrido',
    titulo: 'Híbrido',
    desc: 'Serviços e vendas juntos, no mesmo negócio.',
    icon: IconGrid,
  },
]

export function ParametrizacaoPage() {
  const config = useConfiguracao()
  const update = useUpdateConfiguracao()
  const toast = useToast()
  const [selected, setSelected] = useState<TipoOperacao | null>(null)

  const atual = config.data?.tipoOperacao
  const ativo = selected ?? atual
  const podeSalvar = ativo != null && ativo !== atual && !update.isPending

  function salvar() {
    if (ativo == null) return
    update.mutate(ativo, {
      onSuccess: () => {
        setSelected(null)
        toast.success('Modo de operação atualizado.')
      },
      onError: (e) =>
        toast.error(e instanceof ApiError ? e.message : 'Não foi possível salvar.'),
    })
  }

  return (
    <Card className="shadow-card">
      <div className="mb-1 text-[15px] font-semibold text-ink">Parametrização</div>
      <p className="mb-5 text-[12.5px] text-ink-3">
        Configure como o seu negócio opera. Isso define quais recursos ficam ativos.
      </p>

      {config.isLoading && (
        <p className="py-6 text-center text-[13px] text-ink-3">Carregando…</p>
      )}
      {config.isError && (
        <p className="py-6 text-center text-[13px] text-bad">
          Não foi possível carregar a configuração.
        </p>
      )}

      {config.data && (
        <>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-4">
            Modo de operação
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {OPCOES.map((o) => {
              const on = ativo === o.value
              const Icon = o.icon
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setSelected(o.value)}
                  className={`flex flex-col items-start gap-2 rounded-card border p-4 text-left transition ${
                    on
                      ? 'border-brand bg-brand-soft'
                      : 'border-line bg-surface hover:border-ink-4'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-[10px] ${
                      on ? 'bg-brand text-white' : 'bg-surface-2 text-ink-3'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className={`text-[14px] font-semibold ${on ? 'text-brand-ink' : 'text-ink'}`}>
                    {o.titulo}
                  </span>
                  <span className="text-[12px] text-ink-3">{o.desc}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
            <Button onClick={salvar} disabled={!podeSalvar}>
              {update.isPending ? 'Salvando…' : 'Salvar alterações'}
            </Button>
            {ativo === atual && (
              <span className="text-[12px] text-ink-4">Nenhuma alteração pendente.</span>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
