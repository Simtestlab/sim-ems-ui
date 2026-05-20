"use client"

import React from 'react'
import { Zap, Battery } from 'lucide-react'
import DashboardCard from '@/modules/dashboard/components/DashboardCard'
import ChartPlaceholder from '@/modules/dashboard/components/ChartPlaceholder'
import PlantOverview from '@/modules/pv-monitoring/components/PlantOverview'

function CapacityKpiCard({
  icon,
  label,
  value,
  unit,
  subLabel,
  subValue,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  subLabel?: string
  subValue?: string
}) {
  return (
    <div className="flex items-center gap-5 bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm">
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-50 shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[13px] font-medium text-slate-500 mb-0.5">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[28px] font-bold text-emerald-600 leading-none">{value}</span>
          <span className="text-[13px] font-semibold text-slate-400">{unit}</span>
        </div>
        {subLabel && subValue && (
          <span className="text-[12px] text-slate-400 mt-1">{subLabel}: <span className="font-semibold text-slate-600">{subValue}</span></span>
        )}
      </div>
    </div>
  )
}

export default function OverviewPage() {
  return (
    <div className="w-full max-h-screen overflow-auto p-2">
      {/* KPI Capacity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CapacityKpiCard
          icon={<Zap className="w-7 h-7 text-emerald-600" />}
          label="PV Capacity"
          value="200"
          unit="kWp"
          subLabel="Inverters"
          subValue="2 units"
        />
        <CapacityKpiCard
          icon={<Battery className="w-7 h-7 text-emerald-600" />}
          label="BESS Capacity"
          value="250 / 514"
          unit="kW / kWh"
          subLabel="PCS units"
          subValue="2 units"
        />
      </div>

      <PlantOverview />

      <div className="grid grid-cols-12 gap-5 mt-5">
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
  )
}
