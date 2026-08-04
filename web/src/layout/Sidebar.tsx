import { NavLink } from 'react-router-dom'
import { NAV } from './nav'

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[238px] flex-none flex-col gap-[5px] border-r border-line bg-surface px-[14px] py-[18px] max-[820px]:hidden">
      {/* Marca */}
      <div className="flex items-center gap-[11px] px-2 pb-4 pt-1">
        <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-brand to-brand-ink text-base font-extrabold text-white">
          A
        </div>
        <div>
          <b className="block text-base tracking-tight text-ink">Agesto</b>
          <span className="block text-[11px] font-medium text-ink-4">
            Painel do Dono
          </span>
        </div>
      </div>

      {NAV.map((group) => (
        <div key={group.label}>
          <div className="px-2.5 pb-[5px] pt-3.5 text-[10px] font-bold uppercase tracking-[0.09em] text-ink-4">
            {group.label}
          </div>
          {group.items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-[11px] rounded-[10px] px-[11px] py-[9px] text-[13.5px] font-medium transition ${
                    isActive
                      ? 'bg-brand-soft font-semibold text-brand-ink'
                      : 'text-ink-2 hover:bg-surface-2'
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px] opacity-85" />
                <span>{item.label}</span>
                {item.count != null && (
                  <span className="ml-auto rounded-full bg-brand px-[7px] py-px text-[11px] font-bold text-white">
                    {item.count}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      ))}

      {/* Rodapé — conta (será ligada à autenticação na web-04) */}
      <div className="mt-auto flex items-center gap-2.5 border-t border-line-2 p-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-[9px] bg-ink-3 text-[12px] font-bold text-white">
          —
        </div>
        <div>
          <div className="text-[13px] font-semibold text-ink">Minha conta</div>
          <div className="text-[11px] text-ink-4">Dono</div>
        </div>
      </div>
    </aside>
  )
}
