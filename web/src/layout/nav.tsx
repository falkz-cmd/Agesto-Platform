import type { FC } from 'react'
import {
  IconGrid,
  IconFile,
  IconList,
  IconCalendar,
  IconUsers,
  IconBox,
  IconWrench,
  IconChart,
  IconSettings,
  type IconProps,
} from '../components/icons'

export type NavItem = {
  to: string
  label: string
  icon: FC<IconProps>
  count?: number
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

/** Estrutura de navegação do painel do Dono (portada do protótipo). */
export const NAV: NavGroup[] = [
  {
    label: 'Operação',
    items: [
      { to: '/', label: 'Visão geral', icon: IconGrid },
      { to: '/atendimentos', label: 'Atendimentos', icon: IconFile },
      { to: '/orcamentos', label: 'Orçamentos', icon: IconList },
      { to: '/agenda', label: 'Agenda', icon: IconCalendar },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { to: '/clientes', label: 'Clientes', icon: IconUsers },
      { to: '/produtos', label: 'Produtos', icon: IconBox },
      { to: '/servicos', label: 'Serviços', icon: IconWrench },
    ],
  },
  {
    label: 'Análise',
    items: [
      { to: '/relatorios', label: 'Relatórios', icon: IconChart },
      { to: '/parametrizacao', label: 'Parametrização', icon: IconSettings },
    ],
  },
]

/** Lookup plano rota -> rótulo, para o título da topbar. */
export const NAV_TITLES: Record<string, string> = Object.fromEntries(
  NAV.flatMap((g) => g.items).map((i) => [i.to, i.label]),
)
