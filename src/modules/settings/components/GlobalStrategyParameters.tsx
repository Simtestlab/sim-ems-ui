"use client"

type GlobalStrategyParametersProps = {
  globalMinSOC: string
  globalMaxSOC: string
  backflowControl: string
  bessPowerLimit: string
  onUpdateGlobalMinSOC: (value: string) => void
  onUpdateGlobalMaxSOC: (value: string) => void
  onUpdateBackflowControl: (value: string) => void
  onUpdateBessPowerLimit: (value: string) => void
}

export default function GlobalStrategyParameters({
  globalMinSOC,
  globalMaxSOC,
  backflowControl,
  bessPowerLimit,
  onUpdateGlobalMinSOC,
  onUpdateGlobalMaxSOC,
  onUpdateBackflowControl,
  onUpdateBessPowerLimit,
}: GlobalStrategyParametersProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] p-6">
      <h3 className="text-[16px] font-semibold text-[#0f1724] mb-4">Global Strategy Parameters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#6b7280]">Global Minimum SOC</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={globalMinSOC}
              onChange={(e) => onUpdateGlobalMinSOC(e.target.value)}
              className="flex-1 h-9 px-3 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
            />
            <span className="text-[13px] text-[#9aa4b2]">%</span>
          </div>
          <div className="text-[11px] text-[#6b7280]">Current: 10%</div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#6b7280]">Global Maximum SOC</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={globalMaxSOC}
              onChange={(e) => onUpdateGlobalMaxSOC(e.target.value)}
              className="flex-1 h-9 px-3 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
            />
            <span className="text-[13px] text-[#9aa4b2]">%</span>
          </div>
          <div className="text-[11px] text-[#6b7280]">Current: 100%</div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#6b7280]">Backflow Control</label>
          <select
            value={backflowControl}
            onChange={(e) => onUpdateBackflowControl(e.target.value)}
            className="w-full h-9 px-3 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
          >
            <option value="Disable">Disable</option>
            <option value="Enable">Enable</option>
          </select>
          <div className="text-[11px] text-[#6b7280]">Current: Disable</div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#6b7280]">BESS Power Limit</label>
          <select
            value={bessPowerLimit}
            onChange={(e) => onUpdateBessPowerLimit(e.target.value)}
            className="w-full h-9 px-3 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
          >
            <option value="">Please Select</option>
            <option value="50kW">50 kW</option>
            <option value="100kW">100 kW</option>
            <option value="150kW">150 kW</option>
            <option value="200kW">200 kW</option>
          </select>
        </div>
      </div>
    </div>
  )
}
