"use client"

import React from 'react'
import DashboardCard from '@/modules/dashboard/components/DashboardCard'
import ChartPlaceholder from '@/modules/dashboard/components/ChartPlaceholder'
import PlantOverview from '@/modules/pv-monitoring/components/PlantOverview'

export default function OverviewPage() {
  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-y-auto bg-transparent">
      <div className="flex-1 p-6 space-y-6">
        <PlantOverview />

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 xl:col-span-6">
            <DashboardCard
              title={<span>Power Curves</span>}
              headerRight={
                <div className="flex items-center gap-2">
                  <input type="date" className="h-9 rounded-md border border-[#e6edf5] px-3 text-[13px]" defaultValue="2026-05-13" />
                  <div className="inline-flex rounded-md bg-[#f3f6fb] p-1 text-[13px]"><button className="px-2">Day</button><button className="px-2">Month</button><button className="px-2">Year</button></div>
                </div>
              }
              className="h-[520px]"
            >
              <ChartPlaceholder height={520} />
            </DashboardCard>
          </div>

          <div className="col-span-12 xl:col-span-6">
            <DashboardCard
              title={<span>Power & Energy Statistics</span>}
              headerRight={
                <div className="flex items-center gap-2">
                  <input type="date" className="h-9 rounded-md border border-[#e6edf5] px-3 text-[13px]" defaultValue="2026-05-13" />
                  <div className="inline-flex rounded-md bg-[#f3f6fb] p-1 text-[13px]"><button className="px-2">Day</button><button className="px-2">Month</button><button className="px-2">Year</button></div>
                </div>
              }
              className="h-[520px]"
            >
              <ChartPlaceholder height={520} />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  )
}
