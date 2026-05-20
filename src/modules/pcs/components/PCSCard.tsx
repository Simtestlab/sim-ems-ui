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
      leading={
        <div className="h-9 w-9 rounded-md bg-[#f0f4f8] flex items-center justify-center overflow-hidden shrink-0">
          <svg width="34" height="34" viewBox="0 0 60 68">
            <polygon points="30,4 50,13 30,24 10,15" fill="#64748b"/>
            <polygon points="10,15 30,24 30,58 10,49" fill="#334155"/>
            <polygon points="30,24 50,13 50,47 30,58" fill="#475569"/>
            <rect x="14" y="28" width="10" height="16" rx="1" fill="#475569"/>
            <rect x="15" y="29" width="7" height="8" rx="1" fill="#94a3b8"/>
            <circle cx="17" cy="44" r="2.5" fill="#22c55e"/>
            <polygon points="10,15 30,4 50,13 30,24" fill="#60a5fa" opacity="0.25"/>
            <ellipse cx="30" cy="60" rx="24" ry="3" fill="#e2e8f0" opacity="0.6"/>
          </svg>
        </div>
      }
      statusLabel={statusLabel}
      metrics={metrics}
      footer={<div className="h-7 border-t border-[#eef6f2]" />}
    />
  )
}
