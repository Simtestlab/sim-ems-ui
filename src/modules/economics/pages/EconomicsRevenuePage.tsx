"use client"

import { useState } from 'react'
import RevenueTabs from '../components/RevenueTabs'
import RevenueKpiCard from '../components/RevenueKpiCard'
import ElectricityUsagePanel from '../components/ElectricityUsagePanel'
import BatteryOperationChart from '../components/BatteryOperationChart'
import RevenueStatisticsChart from '../components/RevenueStatisticsChart'
import RevenueOverviewChart from '../components/RevenueOverviewChart'
import RevenueStatisticsPanel from '../components/RevenueStatisticsPanel'

export default function EconomicsRevenuePage() {
  const [selectedTab, setSelectedTab] = useState('Revenue Overview')

  return (
    <div className="flex-1 overflow-auto bg-[#f8f9fc]">
      {/* Revenue Tabs */}
      <RevenueTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />

      {/* Content */}
      <div className="p-6 space-y-6">
        {selectedTab === 'Revenue Overview' && (
          <>
            {/* KPI Cards Row */}
            <div className="grid grid-cols-3 gap-6">
              <RevenueKpiCard
                icon={
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#e6f7ff" />
                    <path
                      d="M24 14v20M14 24h20"
                      stroke="#1890ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                title="Today Income"
                value="0.00 CNY"
                percentageChange="+0.00%"
                totalLabel="Total Income:"
                totalValue="0.00 CNY"
              />

              <RevenueKpiCard
                icon={
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#fff7e6" />
                    <path
                      d="M24 14v20M34 24H14"
                      stroke="#faad14"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                title="Today Cost"
                value="0.00 CNY"
                percentageChange="+0.00%"
                totalLabel="Total Cost:"
                totalValue="0.00 CNY"
              />

              <RevenueKpiCard
                icon={
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#f6ffed" />
                    <path
                      d="M16 28l6-8 4 4 8-10"
                      stroke="#52c41a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M30 18h4v4"
                      stroke="#52c41a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                }
                title="Today Profit"
                value="0.00 CNY"
                percentageChange="+0.00%"
                totalLabel="Total Profit:"
                totalValue="0.00 CNY"
              />
            </div>

            {/* Middle Section: Electricity Usage + Battery Operation */}
            <div className="grid grid-cols-2 gap-6">
              <ElectricityUsagePanel />
              <BatteryOperationChart />
            </div>

            <RevenueOverviewChart />
          </>
        )}

        {selectedTab === 'Revenue Statistics' && (
          <RevenueStatisticsPanel />
        )}

        {selectedTab === 'Revenue Curve' && (
          <RevenueStatisticsChart />
        )}
      </div>
    </div>
  )
}
