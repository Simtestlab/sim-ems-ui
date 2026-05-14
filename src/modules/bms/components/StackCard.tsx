"use client"

import StatusBadge from '@/shared/components/pv/StatusBadge'
import DashboardCard from '@/modules/dashboard/components/DashboardCard'
import { ChevronRight } from 'lucide-react'
import FaultAlertCard from './FaultAlertCard'
import RealtimeMetrics from './RealtimeMetrics'

export default function StackCard() {
  return (
    <DashboardCard className="rounded-lg p-4 w-full" title={null} settings={false}>
      <div className="flex gap-4 min-h-[380px]">
        {/* LEFT STACK PANEL */}
        <div className="w-[320px] flex-shrink-0 flex flex-col rounded-[12px] border border-[#e6edf5] bg-white p-4">
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

          <div className="flex-1 flex items-center justify-center py-4">
            {/* BESS illustration (simple rack SVG) */}
            <svg width="200" height="120" viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="10" width="280" height="120" rx="12" fill="#fbfdff" stroke="#e6edf5" />
              <g transform="translate(28,30)">
                <rect x="0" y="0" width="48" height="88" rx="6" fill="#f7f9fc" stroke="#e6edf5" />
                <rect x="58" y="0" width="48" height="88" rx="6" fill="#f7f9fc" stroke="#e6edf5" />
                <rect x="116" y="0" width="48" height="88" rx="6" fill="#f7f9fc" stroke="#e6edf5" />
                <rect x="174" y="0" width="48" height="88" rx="6" fill="#f7f9fc" stroke="#e6edf5" />
              </g>
            </svg>
          </div>

          <div className="mt-4 flex gap-4">
            <FaultAlertCard label="Total Faults" value={0} icon="fault" />
            <FaultAlertCard label="Total Alerts" value={0} icon="alert" />
          </div>
        </div>

        {/* RIGHT REALTIME PANEL */}
        <div className="flex-1 rounded-[12px] border border-[#e6edf5] bg-white p-4">
          <header className="mb-3">
            <h3 className="text-[20px] font-semibold text-[#0f1724]">Real-time Data</h3>
          </header>

          <RealtimeMetrics />
        </div>
      </div>
    </DashboardCard>
  )
}
