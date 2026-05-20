"use client"

import React from 'react'
import type { LineSeries } from '@/modules/pv-details/utils/telemetry'

export default function ChartLegend({
  series,
  visibleMap,
  onToggle,
  onHover,
}: {
  series: LineSeries[]
  visibleMap?: Record<string, boolean>
  onToggle?: (label: string) => void
  onHover?: (label: string | null) => void
}) {
  return (
    <div className="flex items-center gap-6 whitespace-nowrap overflow-hidden text-[13px] text-[#31445f]">
      {series.map((item) => {
        const visible = visibleMap ? visibleMap[item.label] !== false : true

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onToggle?.(item.label)}
            onMouseEnter={() => onHover?.(item.label)}
            onMouseLeave={() => onHover?.(null)}
            className={`flex items-center gap-2 focus:outline-none ${!visible ? 'opacity-40' : ''}`}
            style={{ flex: '0 0 auto' }}
          >
            <span className="relative inline-flex h-4 w-8 items-center justify-center">
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full" style={{ backgroundColor: item.color, opacity: visible ? 1 : 0.45 }} />
              <span className="relative h-4 w-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.color, opacity: visible ? 1 : 0.45 }} />
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
