"use client"

import { X, Plus } from 'lucide-react'

export type EditableStrategyRow = {
  id: string
  asset: string
  startTime: string
  endTime: string
  operationMode: string
  powerLimit: string
  minSOC: string
  maxSOC: string
  colorIndicator?: string
}

type StrategyEditableTableProps = {
  rows: EditableStrategyRow[]
  onUpdateRow: (id: string, field: keyof EditableStrategyRow, value: string) => void
  onRemoveRow: (id: string) => void
  onAddRow: (asset: string) => void
  availableAssets?: string[]
}

export default function StrategyEditableTable({
  rows,
  onUpdateRow,
  onRemoveRow,
  onAddRow,
  availableAssets = ['BESS', 'PV', 'Diesel Generator', 'Charging Point'],
}: StrategyEditableTableProps) {
  return (
    <div className="space-y-4">
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
              <th className="px-4 py-3 text-left font-semibold text-[#6b7280]">Operation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#e6edf5]">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {row.colorIndicator && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: row.colorIndicator }}
                      />
                    )}
                    <span className="text-[#0f1724]">{row.asset}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {row.colorIndicator && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: row.colorIndicator }}
                      />
                    )}
                    <input
                      type="time"
                      value={row.startTime}
                      onChange={(e) => onUpdateRow(row.id, 'startTime', e.target.value)}
                      className="h-8 px-2 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="time"
                    value={row.endTime}
                    onChange={(e) => onUpdateRow(row.id, 'endTime', e.target.value)}
                    className="h-8 px-2 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.operationMode}
                    onChange={(e) => onUpdateRow(row.id, 'operationMode', e.target.value)}
                    className="h-8 px-2 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
                  >
                    <option value="Charge">Charge</option>
                    <option value="Discharge">Discharge</option>
                    <option value="Power Limit">Power Limit</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={row.powerLimit}
                      onChange={(e) => onUpdateRow(row.id, 'powerLimit', e.target.value)}
                      className="w-20 h-8 px-2 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
                    />
                    <span className="text-[11px] text-[#9aa4b2]">kW</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={row.minSOC}
                      onChange={(e) => onUpdateRow(row.id, 'minSOC', e.target.value)}
                      className="w-16 h-8 px-2 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
                    />
                    <span className="text-[11px] text-[#9aa4b2]">%</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={row.maxSOC}
                      onChange={(e) => onUpdateRow(row.id, 'maxSOC', e.target.value)}
                      className="w-16 h-8 px-2 rounded border border-[#dce4ee] text-[13px] focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
                    />
                    <span className="text-[11px] text-[#9aa4b2]">%</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemoveRow(row.id)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#fee] text-[#dc2626] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row buttons */}
      <div className="flex flex-wrap gap-2">
        {availableAssets.map((asset) => (
          <button
            key={asset}
            onClick={() => onAddRow(asset)}
            className="flex items-center gap-1 h-8 px-3 rounded border border-[#dce4ee] bg-white text-[13px] text-[#0f1724] hover:bg-[#f8f9fc] transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add {asset}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
