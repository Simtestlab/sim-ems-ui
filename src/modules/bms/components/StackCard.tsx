"use client"

import StatusBadge from '@/shared/components/pv/StatusBadge'
import DashboardCard from '@/modules/dashboard/components/DashboardCard'
import { ChevronRight } from 'lucide-react'
import FaultAlertCard from './FaultAlertCard'
import RealtimeMetrics from './RealtimeMetrics'

export default function StackCard() {
  return (
    <DashboardCard className="rounded-lg" title={null} settings={false}>
      <div className="flex gap-6 min-h-[480px]">
        {/* LEFT STACK PANEL */}
        <div className="w-[360px] flex-shrink-0 flex flex-col bg-white rounded-[10px] border border-[#eef3f7] p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h4 className="text-[20px] font-semibold text-[#111827]">1#Stack</h4>
              <button className="text-[#9aa4b2] hover:text-[#111827]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="ml-auto">
              <StatusBadge status="normal" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-6">
            {/* BESS illustration (simple rack SVG) */}
            <svg width="280" height="160" viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="10" width="280" height="120" rx="12" fill="#fbfdff" stroke="#e6edf5" />
              <g transform="translate(20,24)">
                <rect x="0" y="0" width="52" height="96" rx="6" fill="#f7f9fc" stroke="#e6edf5" />
                <rect x="62" y="0" width="52" height="96" rx="6" fill="#f7f9fc" stroke="#e6edf5" />
                <rect x="124" y="0" width="52" height="96" rx="6" fill="#f7f9fc" stroke="#e6edf5" />
                <rect x="186" y="0" width="52" height="96" rx="6" fill="#f7f9fc" stroke="#e6edf5" />
              </g>
            </svg>
          </div>

          <div className="mt-4 flex gap-4">
            <FaultAlertCard label="Total Faults" value={0} icon="fault" />
            <FaultAlertCard label="Total Alerts" value={0} icon="alert" />
          </div>
        </div>

        {/* RIGHT REALTIME PANEL */}
        <div className="flex-1 bg-white rounded-[10px] border border-[#eef3f7] p-6">
          <header className="mb-4">
            <h3 className="text-[28px] font-semibold text-[#0f1724]">Real-time Data</h3>
          </header>

          <RealtimeMetrics />
        </div>
      </div>
    </DashboardCard>
  )
}
