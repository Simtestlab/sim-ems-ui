import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import MicrogridDiagram from '@/modules/system/components/MicrogridDiagram'

export default function Page() {
  return (
    <DashboardLayout initialActiveTab="System" visitedRoute="/system">
      {/* Use div, not main – avoids global `main { max-width:1200px }` in globals.css */}
      <div className="flex-1 overflow-hidden bg-white min-h-0">
        {/* Station status */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2">
          <span className="text-[13px] text-[#64748b]">Station Status:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"/>
            <span className="text-[13px] font-semibold text-[#22c55e]">Normal</span>
          </span>
        </div>
        {/* Constrain diagram to viewport height and center it to avoid page scroll */}
        <div className="px-4 pb-6 flex justify-center">
          <div className="w-full max-w-[1200px] h-[calc(100vh-120px)] overflow-hidden">
            <MicrogridDiagram />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
