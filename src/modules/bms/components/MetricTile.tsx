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
    <div className={`flex flex-col px-4 py-3 rounded-md border border-[#eef3f8] bg-white ${className}`}>
      <div className="text-[14px] text-[#6b7280] mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-[36px] font-semibold text-[#0f1724] leading-none">{value}</div>
        {unit ? <div className="text-[14px] text-[#9aa4b2]">{unit}</div> : null}
      </div>
    </div>
  )
}
