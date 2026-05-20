"use client"

import React from 'react'
import type { Metric } from '@/modules/pv-details/utils/telemetry'

export default function MetricsPanel({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-6 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <h3 className="mb-7 text-[22px] font-semibold tracking-tight text-[#101828]">Real-time Data</h3>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-baseline gap-4 text-[14px] text-[#737b89]">
            <span>{metric.label}:</span>
            <span className="text-[16px] font-semibold text-[#3b3f46]">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
