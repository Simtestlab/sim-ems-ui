import { BarChart2, CheckCircle2, Clock, Lightbulb, LucideIcon, Zap } from 'lucide-react'
import BranchIcon from '@/shared/components/pv/BranchIcon'
import SolarPanelIcon from '@/shared/components/pv/SolarPanelIcon'
import { inverterTitleToPV } from '@/modules/pv-monitoring/utils/format'
import { useRouter } from 'next/navigation'

type InverterData = {
  id: number
  title: string
  status: string
  activePower: string | number
  dailyEnergy: string | number
  loadRatio: string | number
  dailyEffective: string | number
}

const METRIC_ICONS: Array<{ 
  label: string
  valueKey: keyof Pick<InverterData, 'activePower' | 'dailyEnergy' | 'loadRatio' | 'dailyEffective'>
  unit: string
  icon: LucideIcon 
}> = [
  { label: 'Active Power', valueKey: 'activePower', unit: 'kW', icon: Zap },
  { label: 'Daily Energy', valueKey: 'dailyEnergy', unit: 'kWh', icon: Lightbulb },
  { label: 'Load Ratio', valueKey: 'loadRatio', unit: '%', icon: BarChart2 },
  { label: 'Daily Duration', valueKey: 'dailyEffective', unit: 'h', icon: Clock },
]

type InverterCardProps = {
  inverter: InverterData
  hoveredId?: number | null
  hoveredMetric?: string | null
  onHoverCard?: (id: number | null) => void
  onHoverMetric?: (key: string | null) => void
  onNavigate?: (route: string) => void
  Tooltip?: React.ComponentType<{ content: string; children: React.ReactNode; className?: string }>
}

export default function InverterCard({ 
  inverter, 
  hoveredId = null,
  hoveredMetric = null,
  onHoverCard,
  onHoverMetric,
  onNavigate,
  Tooltip = ({ children }) => <>{children}</>
}: InverterCardProps) {
  const router = useRouter()
  const statusLabel = inverter.status.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
  const ratedPowerLabel = 'Rated Power: 125kW'
  const tooltipTitle = inverterTitleToPV(inverter.title)
  
  const branchTooltips = Array.from({ length: 11 }, (_, index) => {
    const channelNumber = String(index + 1).padStart(2, '0')
    return `MPPT${channelNumber}: Normal (${(5.2 + index * 0.17).toFixed(2)}A) , Average (${(7.1 + index * 0.11).toFixed(2)}A) , Total Current (${(78.2 + index * 0.37).toFixed(2)}A)`
  })

  const isDimmed = hoveredId !== null && hoveredId !== inverter.id
  const dimClass = isDimmed ? 'opacity-50 scale-98' : 'opacity-100'
  const highlightClass = !isDimmed ? 'transition-transform duration-150' : ''

  function goToDetails() {
    const pvId = inverterTitleToPV(inverter.title)
    const route = `/pv/details?id=${encodeURIComponent(pvId)}`
    if (onNavigate) {
      onNavigate(route)
    }
    router.push(route)
  }

  return (
    <article
      onMouseEnter={() => onHoverCard?.(inverter.id)}
      onMouseLeave={() => onHoverCard?.(null)}
      onClick={goToDetails}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDetails() } }}
      role="button"
      tabIndex={0}
      className={`relative border transition-all w-full max-w-[380px] ${dimClass} ${highlightClass} cursor-pointer`}
      style={{ 
        padding: 16, 
        borderRadius: 20, 
        borderColor: '#dfeaf8', 
        boxShadow: isDimmed ? 'none' : '0 8px 22px rgba(15,23,42,0.05)', 
        background: 'linear-gradient(180deg, #fbfdff 0%, #ffffff 100%)' 
      }}
    >
      <header className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-[56px] h-[56px] bg-white rounded-[18px] border border-[#eef4fb] flex items-center justify-center p-2 shadow-[0_6px_16px_rgba(15,23,42,0.05)]">
            <SolarPanelIcon className="w-8 h-8" />
          </div>
          <div>
            <Tooltip content={tooltipTitle} className="mb-1">
              <h3 className="text-[16px] font-semibold text-[#2c3b52] leading-tight">{inverter.title}</h3>
            </Tooltip>
            <Tooltip content={ratedPowerLabel}>
              <div className="flex items-center text-[12px] text-[#9fb0c9] font-medium cursor-default">
                <CheckCircle2 className="w-3 h-3 mr-1 text-[#c7d8ee]" />
                {ratedPowerLabel}
              </div>
            </Tooltip>
          </div>
        </div>
        <div style={{ height: 24 }} className="flex items-center gap-1 bg-[#effcf5] border border-[#bcefcf] text-[#29c77c] px-2.5 rounded-full text-[11px] font-semibold tracking-[0.02em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#26c281]" />
          {statusLabel}
        </div>
      </header>

      <div className="border-t border-[#edf3fb] pt-3" />

      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {METRIC_ICONS.map(metric => {
          const metricKey = metric.valueKey as string
          const isMetricHighlighted = hoveredMetric === metricKey
          const isSomeMetricHovered = hoveredMetric !== null && hoveredMetric !== undefined
          const metricDimClass = isSomeMetricHovered && !isMetricHighlighted ? 'opacity-50' : 'opacity-100'
          const metricHighlightClass = isMetricHighlighted ? 'transform scale-102 ring-1 ring-[#dceffd] shadow-[0_8px_20px_rgba(28,106,255,0.06)]' : ''

          return (
            <div
              key={metric.label}
              onMouseEnter={() => onHoverMetric?.(metricKey)}
              onMouseLeave={() => onHoverMetric?.(null)}
              className={`relative bg-white rounded-[16px] p-3.5 border border-[#eff4fb] overflow-hidden min-h-[84px] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-150 ${metricDimClass} ${metricHighlightClass}`}
            >
              <div className="text-[11px] text-[#9cb0cb] font-semibold mb-2 uppercase tracking-wide leading-tight">{metric.label}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-[#2c3b52]">{inverter[metric.valueKey]}</span>
                <span className="text-[12px] text-[#9cb0cb] font-semibold">{metric.unit}</span>
              </div>
              <metric.icon className="absolute bottom-2.5 right-2.5 w-6 h-6 text-[#d9e9ff] opacity-80" />
            </div>
          )
        })}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {branchTooltips.map((tip, idx) => (
          <Tooltip key={idx} content={tip}>
            <div className="cursor-default">
              <BranchIcon className="text-[#84a8d6]" />
            </div>
          </Tooltip>
        ))}
      </div>
    </article>
  )
}
