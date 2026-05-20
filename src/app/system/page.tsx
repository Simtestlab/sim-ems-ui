import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import MicrogridDiagram from '@/modules/system/components/MicrogridDiagram'
import { Zap, Battery } from 'lucide-react'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="System" visitedRoute="/system">
      {/* Use div, not main – avoids global `main { max-width:1200px }` in globals.css */}
      <div className="flex-1 overflow-hidden bg-white min-h-0 flex flex-col">

        {/* Header Area: Status on left, Capacity Cards on right */}
        <div className="px-6 pt-4 pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Station status */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#64748b]">Station Status:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]"/>
              <span className="text-[13px] font-semibold text-[#22c55e]">Normal</span>
            </span>
          </div>

          {/* Capacity Summary Cards */}
          <div className="flex items-center gap-4">
            {/* PV Capacity Card */}
            <div className="bg-white rounded-xl border border-slate-100 py-2 px-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center gap-4 min-w-[200px] justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 mb-0.5">PV Capacity</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-800">100</span>
                  <span className="text-xs font-semibold text-slate-400">kW</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Zap className="w-4 h-4" />
              </div>
            </div>

            {/* BESS Capacity Card */}
            <div className="bg-white rounded-xl border border-slate-100 py-2 px-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center gap-4 min-w-[200px] justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 mb-0.5">BESS Capacity</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-800">215</span>
                  <span className="text-xs font-semibold text-slate-400">kWh</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Battery className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Diagram Container */}
        <div className="px-4 pb-6 flex-1 flex justify-center items-center min-h-0">
          <div className="w-full max-w-[1200px] h-full overflow-hidden">
            <MicrogridDiagram />
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
