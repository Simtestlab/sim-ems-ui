import { BarChart2, CheckCircle2, Clock, Lightbulb, LucideIcon, Zap } from 'lucide-react'
import BranchIcon from '@/shared/components/pv/BranchIcon'
import SolarPanelIcon from '@/shared/components/pv/SolarPanelIcon'
import MonitoringCard from '@/shared/components/monitoring/Card'
import { cn } from '@/shared/utils/cn'
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
  const dimClass = isDimmed ? 'opacity-50 scale-98' : 'opacity-100 transition-transform duration-150'

  const isSomeMetricHovered = hoveredMetric !== null && hoveredMetric !== undefined

  const metrics = METRIC_ICONS.map((metric) => {
    const metricKey = metric.valueKey as string
    const isMetricHighlighted = hoveredMetric === metricKey

    return {
      key: metricKey,
      label: metric.label,
      value: inverter[metric.valueKey],
      unit: metric.unit,
      icon: <metric.icon className="h-6 w-6" />,
      highlighted: isMetricHighlighted,
      dimmed: isSomeMetricHovered && !isMetricHighlighted,
      onMouseEnter: () => onHoverMetric?.(metricKey),
      onMouseLeave: () => onHoverMetric?.(null),
    }
  })

  const footer = (
    <div className="flex gap-1.5 flex-wrap">
      {branchTooltips.map((tip, idx) => (
        <Tooltip key={idx} content={tip}>
          <div className="cursor-default">
            <BranchIcon className="text-[#84a8d6]" />
          </div>
        </Tooltip>
      ))}
    </div>
  )

  function goToDetails() {
    const pvId = inverterTitleToPV(inverter.title)
    const route = `/monitor/pv/details?id=${encodeURIComponent(pvId)}`
    if (onNavigate) {
      onNavigate(route)
    }
    router.push(route)
  }

  return (
    <MonitoringCard
      theme="pv"
      onMouseEnter={() => onHoverCard?.(inverter.id)}
      onMouseLeave={() => onHoverCard?.(null)}
      onClick={goToDetails}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDetails() } }}
      role="button"
      tabIndex={0}
      className={cn(dimClass, isDimmed ? '' : 'hover:-translate-y-0.5')}
      title={
        <Tooltip content={tooltipTitle} className="mb-1">
          <span>{inverter.title}</span>
        </Tooltip>
      }
      subtitle={
        <Tooltip content={ratedPowerLabel}>
          <span className="flex items-center cursor-default">
            <CheckCircle2 className="mr-1 h-3 w-3 text-[#c7d8ee]" />
            {ratedPowerLabel}
          </span>
        </Tooltip>
      }
      leading={<SolarPanelIcon className="h-8 w-8" />}
      statusLabel={statusLabel}
      metrics={metrics}
      footer={footer}
    />
  )
}
