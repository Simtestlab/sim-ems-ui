"use client"

import React from 'react'

export default function ChartPlaceholder({ height = 480 }: { height?: number }) {
  const hours = Array.from({ length: 13 }).map((_, i) => String(i * 2).padStart(2, '0') + ':00')

  return (
    <div className="w-full h-full" style={{ minHeight: height }}>
      <div className="relative h-full w-full rounded-md border border-[#eef4fb] bg-white p-4">
        {/* Legend (top center) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-3 flex items-center gap-4 text-[13px] text-[#4b5563]">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#2563eb]" />BESS Power</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#16a34a]" />PV Power</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#f59e0b]" />Grid Power</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#ef4444]" />Load Power</div>
        </div>

        {/* Chart area */}
        <div className="absolute inset-4">
          <svg className="w-full h-full" viewBox="0 0 1000 420" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="areaBlue" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="areaGreen" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* horizontal grid lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 60 + i * 60
              return <line key={i} x1={60} x2={940} y1={y} y2={y} stroke="#eef6fb" strokeWidth={1} />
            })}

            {/* left axis labels */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 60 + i * 60
              const val = (100 - i * 20).toString()
              return <text key={i} x={36} y={y + 4} fontSize={12} fill="#9aa6b8" textAnchor="end">{val}</text>
            })}

            {/* sample area curves */}
            <path d="M60,300 C150,260 250,220 350,180 C450,140 550,120 650,110 C750,105 850,120 940,140 L940,360 L60,360 Z" fill="url(#areaGreen)" stroke="#16a34a" strokeWidth={2} opacity={0.95} />
            <path d="M60,340 C150,320 250,300 350,280 C450,260 550,260 650,260 C750,260 850,250 940,240 L940,360 L60,360 Z" fill="url(#areaBlue)" stroke="#2563eb" strokeWidth={2} opacity={0.95} />

            {/* x axis labels */}
            {hours.map((h, i) => {
              const x = 60 + (i / (hours.length - 1)) * (940 - 60)
              return <text key={i} x={x} y={390} fontSize={11} fill="#9aa6b8" textAnchor="middle">{h}</text>
            })}
          </svg>
        </div>

      </div>
    </div>
  )
}
