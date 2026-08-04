import { IconButton } from '../components/ui'
import { IconSearch, IconDownload } from '../components/icons'
import { PeriodSwitch, type Period } from './PeriodSwitch'

export function Topbar({
  title,
  subtitle,
  period,
  onPeriodChange,
}: {
  title: string
  subtitle?: string
  period: Period
  onPeriodChange: (p: Period) => void
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-line bg-surface/80 px-[26px] py-4 backdrop-blur">
      <div>
        <h1 className="m-0 text-[19px] tracking-tight text-ink">{title}</h1>
        {subtitle && <div className="mt-0.5 text-[12.5px] text-ink-3">{subtitle}</div>}
      </div>
      <PeriodSwitch value={period} onChange={onPeriodChange} />
      <IconButton aria-label="Buscar">
        <IconSearch className="h-[18px] w-[18px]" />
      </IconButton>
      <IconButton aria-label="Exportar">
        <IconDownload className="h-[18px] w-[18px]" />
      </IconButton>
    </div>
  )
}
