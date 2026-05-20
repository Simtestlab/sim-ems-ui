"use client"

export type StrategyRow = {
  asset: string
  startTime: string
  endTime: string
  operationMode: string
  powerLimit: string
  minSOC: string
  maxSOC: string
  colorIndicator?: string
}

type StrategyTableProps = {
  rows: StrategyRow[]
}

export default function StrategyTable({ rows }: StrategyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-[#e6edf5] bg-[#f8f9fc]">
            <th className="px-4 py-3 text-left font-semibold text-[#6b7280]">Asset</th>
            <th className="px-4 py-3 text-left font-semibold text-[#6b7280]">Start Time</th>
            <th className="px-4 py-3 text-left font-semibold text-[#6b7280]">End Time</th>
            <th className="px-4 py-3 text-left font-semibold text-[#6b7280]">Operation Mode</th>
            <th className="px-4 py-3 text-left font-semibold text-[#6b7280]">Power / Load Limit</th>
            <th className="px-4 py-3 text-left font-semibold text-[#6b7280]">Minimum SOC</th>
            <th className="px-4 py-3 text-left font-semibold text-[#6b7280]">Maximum SOC</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-[#e6edf5] hover:bg-[#f8f9fc] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {row.colorIndicator && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: row.colorIndicator }}
                    />
                  )}
                  <span className="text-[#0f1724]">{row.asset}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {row.colorIndicator && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: row.colorIndicator }}
                    />
                  )}
                  <span className="text-[#0f1724]">{row.startTime}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-[#0f1724]">{row.endTime}</td>
              <td className="px-4 py-3 text-[#0f1724]">{row.operationMode}</td>
              <td className="px-4 py-3 text-[#0f1724]">{row.powerLimit}</td>
              <td className="px-4 py-3 text-[#0f1724]">{row.minSOC}</td>
              <td className="px-4 py-3 text-[#0f1724]">{row.maxSOC}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
