"use client"

import { ReactNode } from 'react'

type RevenueKpiCardProps = {
  icon: ReactNode
  title: string
  value: string
  percentageChange: string
  totalLabel: string
  totalValue: string
}

export default function RevenueKpiCard({
  icon,
  title,
  value,
  percentageChange,
  totalLabel,
  totalValue,
}: RevenueKpiCardProps) {
  const isPositive = percentageChange.startsWith('+')
  const isNeutral = percentageChange === '+0.00%' || percentageChange === '0.00%'

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] p-5 flex-1">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">{icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="text-[13px] text-[#6b7280] mb-2">{title}</div>

          {/* Value and Percentage */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[28px] font-semibold text-[#0f1724]">{value}</span>
            <span
              className={`text-[13px] ${
                isNeutral ? 'text-[#6b7280]' : isPositive ? 'text-[#52c41a]' : 'text-[#ff4d4f]'
              }`}
            >
              {percentageChange}
            </span>
          </div>

          {/* Total */}
          <div className="text-[12px] text-[#6b7280]">
            {totalLabel} {totalValue}
          </div>
        </div>
      </div>
    </div>
  )
}
