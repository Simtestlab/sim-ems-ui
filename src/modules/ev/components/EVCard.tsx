"use client"

import { useState } from 'react'
import { ArrowDownToLine, LucideIcon, TrendingUp, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePVMonitoringStore } from '@/modules/pv-monitoring/store/pvMonitoringStore'
import MonitoringCard from '@/shared/components/monitoring/Card'
import Tooltip from '@/shared/components/ui/Tooltip'

export type EVData = {
  id: number
  title: string
  status: string
  realTimePower: string | number
  dailyChargeEnergy: string | number
  dailyDischarge: string | number
  todayPeakPower: string | number | null
  ratedPower?: string
  v2gSupport?: boolean
}

type EVCardProps = {
  ev?: EVData
  id?: number
}

const EV_METRIC_ICONS: Array<{
  key: keyof Pick<EVData, 'realTimePower' | 'dailyChargeEnergy' | 'dailyDischarge' | 'todayPeakPower'>
  label: string
  unit: string
  icon: LucideIcon
}> = [
  { key: 'realTimePower', label: 'REAL-TIME POWER', unit: 'kW', icon: Zap },
  { key: 'dailyChargeEnergy', label: 'DAILY CHARGE ENERGY', unit: 'kWh', icon: EVPlugIcon as unknown as LucideIcon },
  { key: 'dailyDischarge', label: 'DAILY DISCHARGE', unit: 'kWh', icon: ArrowDownToLine },
  { key: 'todayPeakPower', label: 'TODAY PEAK POWER', unit: 'kW', icon: TrendingUp },
]

function EVPlugIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 22V12" />
      <path d="M19 22V12" />
      <path d="M3 9h18" />
      <path d="M3 12h18" />
      <rect x="5" y="2" width="4" height="7" rx="1" />
      <rect x="15" y="2" width="4" height="7" rx="1" />
      <path d="M12 12v4" />
      <path d="M10 16h4" />
    </svg>
  )
}

function EVChargerIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9">
      {/* Body */}
      <rect x="7" y="4" width="22" height="30" rx="4" fill="#e0f7ee" stroke="#5ecfa0" strokeWidth="1.5" />
      {/* Screen panel */}
      <rect x="11" y="8" width="14" height="9" rx="2" fill="#b5edd4" />
      {/* Lightning on screen */}
      <path d="M18 10l-2.5 4 2.5-.5-2 4" stroke="#0a7855" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Connector slot */}
      <rect x="13" y="21" width="10" height="5" rx="2" fill="#9ce4c6" />
      {/* Indicator dots */}
      <circle cx="13" cy="30" r="1.5" fill="#5ecfa0" />
      <circle cx="20" cy="30" r="1.5" fill="#0a7855" />
      <circle cx="27" cy="30" r="1.5" fill="#d1d5db" />
      {/* Cable */}
      <path d="M29 22 Q34 22 34 28 L34 36" stroke="#5ecfa0" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="31" y="35" width="6" height="4" rx="1.5" fill="#5ecfa0" />
    </svg>
  )
}

export default function EVCard({ ev, id = 1 }: EVCardProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)
  const router = useRouter()
  const addVisitedTab = usePVMonitoringStore((s) => s.addVisitedTab)

  const cardData: EVData = ev ?? {
    id,
    title: `${id}#EV`,
    status: 'idle',
    realTimePower: '0',
    dailyChargeEnergy: '0',
    dailyDischarge: '0',
    todayPeakPower: null,
    ratedPower: '100kW',
  }

  const statusRaw = cardData.status.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
  function handleCardClick() {
    const route = `/monitor/ev/details?id=${encodeURIComponent(cardData.title)}`
    addVisitedTab(route)
    router.push(route)
  }

  const ratedPowerLabel = `Rated Power: ${cardData.ratedPower ?? '100kW'}`

  const metrics = EV_METRIC_ICONS.map((metric) => {
    const key = metric.key as string
    const isHighlighted = hoveredMetric === key
    const rawValue = cardData[metric.key]
    const displayValue = rawValue === null || rawValue === undefined ? 'N/A' : rawValue
    const displayUnit = (rawValue === null || rawValue === undefined || displayValue === 'N/A') ? '' : metric.unit

    const IconComponent = metric.icon
    return {
      key,
      label: metric.label,
      value: displayValue,
      unit: displayUnit,
      icon: <IconComponent className="h-7 w-7" strokeWidth={2.2} />,
      highlighted: isHighlighted,
      dimmed: hoveredMetric !== null && !isHighlighted,
      onMouseEnter: () => setHoveredMetric(key),
      onMouseLeave: () => setHoveredMetric(null),
    }
  })

  return (
    <MonitoringCard
      theme="ev"
      title={
        <Tooltip content={cardData.title} className="mb-1">
          <span>{cardData.title}</span>
        </Tooltip>
      }
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick() }}
      subtitle={
        <Tooltip content={ratedPowerLabel}>
          <span className="flex cursor-default items-center gap-1">
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 flex-shrink-0 text-[#9ad4bc]" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 7v4M8 5.5v.5" strokeLinecap="round" />
            </svg>
            {ratedPowerLabel}
          </span>
        </Tooltip>
      }
      leading={<EVChargerIcon />}
      statusLabel={statusRaw}
      metrics={metrics}
      footer={<div className="h-7 border-t border-[#ddf0e8]" />}
    />
  )
}