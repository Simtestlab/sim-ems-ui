"use client"

import React, { useState } from 'react'
import { ArrowDownToLine, BatteryCharging, BatteryMedium, CheckCircle2, LucideIcon, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import MonitoringCard from '@/shared/components/monitoring/Card'
import Tooltip from '@/shared/components/ui/Tooltip'
import { usePVMonitoringStore } from '@/modules/pv-monitoring/store/pvMonitoringStore'

type PCSData = {
  id: number
  title: string
  status: string
  realTimePower: string | number
  dailyCharge: string | number
  dailyDischarge: string | number
  soc: string | number
  ratedPower?: string
}

type PCSCardProps = {
  pcs?: PCSData
  id?: number
}

const PCS_METRIC_ICONS: Array<{
  key: keyof Pick<PCSData, 'realTimePower' | 'dailyCharge' | 'dailyDischarge' | 'soc'>
  label: string
  unit: string
  icon: LucideIcon
}> = [
  { key: 'realTimePower', label: 'REAL-TIME POWER', unit: 'kW', icon: Zap },
  { key: 'dailyCharge', label: 'DAILY CHARGE', unit: 'kWh', icon: BatteryCharging },
  { key: 'dailyDischarge', label: 'DAILY DISCHARGE', unit: 'kWh', icon: ArrowDownToLine },
  { key: 'soc', label: 'SOC', unit: '%', icon: BatteryMedium },
]

export default function PCSCard({ pcs, id = 1 }: PCSCardProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)
  const router = useRouter()
  const addVisitedTab = usePVMonitoringStore((s) => s.addVisitedTab)
  const cardData: PCSData = pcs ?? {
    id,
    title: `${id}#PCS`,
    status: 'normal',
    realTimePower: '0',
    dailyCharge: '0',
    dailyDischarge: '0',
    soc: '0',
    ratedPower: '125kW',
  }

  const statusLabel = cardData.status.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
  const ratedPowerLabel = `Rated Power: ${cardData.ratedPower ?? '125kW'}`

  function handleCardClick() {
    const route = `/monitor/pcs/details?id=${encodeURIComponent(cardData.title)}`
    addVisitedTab(route)
    router.push(route)
  }
  const metrics = PCS_METRIC_ICONS.map((metric) => {
    const key = metric.key as string
    const isHighlighted = hoveredMetric === key
    return {
      key,
      label: metric.label,
      value: cardData[metric.key],
      unit: metric.unit,
      icon: <metric.icon className="h-7 w-7" strokeWidth={2.2} />,
      highlighted: isHighlighted,
      dimmed: hoveredMetric !== null && !isHighlighted,
      onMouseEnter: () => setHoveredMetric(key),
      onMouseLeave: () => setHoveredMetric(null),
    }
  })

  return (
    <MonitoringCard
      theme="pcs"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick() }}
      title={
        <Tooltip content={cardData.title} className="mb-1">
          <span>{cardData.title}</span>
        </Tooltip>
      }
      subtitle={
        <Tooltip content={ratedPowerLabel}>
          <span className="flex items-center cursor-default">
            <CheckCircle2 className="mr-1 h-3 w-3 text-[#b7c7d7]" />
            {ratedPowerLabel}
          </span>
        </Tooltip>
      }
      leading={<div className="h-9 w-9 rounded-md bg-[#eef9f3]" />}
      statusLabel={statusLabel}
      metrics={metrics}
      footer={<div className="h-7 border-t border-[#eef6f2]" />}
    />
  )
}
