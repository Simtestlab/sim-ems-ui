"use client"

import React from 'react'

type MetricTileProps = {
  label: string
  value: React.ReactNode
  unit?: string
  className?: string
}

export default function MetricTile({ label, value, unit, className = '' }: MetricTileProps) {
  return (
    <div className={`flex flex-col px-4 py-3 rounded-[12px] border border-[#e6edf5] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.03)] ${className}`}>
      <div className="text-[13px] font-medium text-[#6b7280] mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-[28px] font-semibold text-[#0f1724] leading-none">{value}</div>
        {unit ? <div className="text-[13px] text-[#9aa4b2]">{unit}</div> : null}
      </div>
    </div>
  )
}
