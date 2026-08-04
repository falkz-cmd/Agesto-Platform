import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { NAV_TITLES } from './nav'
import type { Period } from './PeriodSwitch'

/** Contexto exposto às páginas via <Outlet>: período selecionado na topbar. */
export type ShellContext = { period: Period }

export function AppShell() {
  const [period, setPeriod] = useState<Period>('mes')
  const { pathname } = useLocation()
  const title = NAV_TITLES[pathname] ?? 'Agesto'

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} period={period} onPeriodChange={setPeriod} />
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-[26px] pb-10 pt-[22px]">
          <Outlet context={{ period } satisfies ShellContext} />
        </div>
      </div>
    </div>
  )
}
