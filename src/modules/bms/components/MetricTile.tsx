"use client"

import React from 'react'

type MetricTileProps = {
  label: string
  value: React.ReactNode
  unit?: string
  className?: string
  compact?: boolean
}
export default function MetricTile({ label, value, unit, className = '', compact = false }: MetricTileProps) {
  const padding = compact ? 'px-2 py-1' : 'px-4 py-3'
  const rounded = compact ? 'rounded-md' : 'rounded-[12px]'
  const labelClass = compact ? 'text-[12px] font-medium text-[#6b7280] mb-1' : 'text-[13px] font-medium text-[#6b7280] mb-2'
  const valueClass = compact ? 'text-[20px] font-semibold text-[#0f1724] leading-none' : 'text-[28px] font-semibold text-[#0f1724] leading-none'
  const unitClass = compact ? 'text-[12px] text-[#9aa4b2]' : 'text-[13px] text-[#9aa4b2]'

  return (
    <div className={`flex flex-col ${padding} ${rounded} border border-[#e6edf5] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.03)] ${className}`}>
      <div className={labelClass}>{label}</div>
      <div className="flex items-baseline gap-2">
        <div className={valueClass}>{value}</div>
        {unit ? <div className={unitClass}>{unit}</div> : null}
      </div>
    </div>
  )
}
