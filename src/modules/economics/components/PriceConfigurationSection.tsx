"use client"

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import WeekdayTabs from './WeekdayTabs'
import PriceSchedulerTimeline from './PriceSchedulerTimeline'
import BatchAddDialog from './BatchAddDialog'

type PriceConfigRow = {
  id: string
  startTime: string
  endTime: string
  priceType: string
  unitPrice: string
}

type PriceConfigurationSectionProps = {
  title: string
  buttonLabel: string
  saveLabel: string
}

export default function PriceConfigurationSection({
  title,
  buttonLabel,
  saveLabel,
}: PriceConfigurationSectionProps) {
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [isBatchAddOpen, setIsBatchAddOpen] = useState(false)
  const [rows, setRows] = useState<PriceConfigRow[]>([
    {
      id: '1',
      startTime: '',
      endTime: '',
      priceType: 'Valley',
      unitPrice: '',
    },
  ])

  // Determine timeline color based on first row's price type
  const getPriceTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'peak':
        return '#f59e0b'
      case 'valley':
        return '#52c41a'
      case 'flat':
        return '#edc709'
      default:
        return '#52c41a'
    }
  }

  const schedule = {
    startHour: 0,
    endHour: 24,
    color: rows[0]?.priceType ? getPriceTypeColor(rows[0].priceType) : '#52c41a',
  }

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now().toString(),
        startTime: '',
        endTime: '',
        priceType: '',
        unitPrice: '',
      },
    ])
  }

  const handleRemoveRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id))
  }

  const handleUpdateRow = (id: string, field: keyof PriceConfigRow, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6edf5]">
        <h2 className="text-[16px] font-semibold text-[#0f1724]">{title}</h2>
        <button
          onClick={() => setIsBatchAddOpen(true)}
          className="h-9 px-4 rounded bg-[#1890ff] text-white text-[13px] font-medium hover:bg-[#0f7de0] transition-colors"
        >
          {buttonLabel}
        </button>
      </div>

      {/* Weekday Tabs */}
      <WeekdayTabs selectedDay={selectedDay} onSelectDay={setSelectedDay} />

      {/* Timeline */}
      <div className="p-6">
        <PriceSchedulerTimeline schedule={schedule} />

        {/* Configuration Form */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-12 gap-4 text-[12px] font-semibold text-[#0f1724] bg-[#f8f9fc] px-4 py-3 rounded mb-4">
            <div className="col-span-3">Start Time</div>
            <div className="col-span-3">End Time</div>
            <div className="col-span-3">Price Type</div>
            <div className="col-span-2">Unit Price (CNY)</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-4 px-4">
            {rows.map((row) => {
              const rowColor = row.priceType ? getPriceTypeColor(row.priceType) : '#52c41a'
              return (
                <div key={row.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rowColor }}></span>
                      <select
                        value={row.startTime}
                        onChange={(e) => handleUpdateRow(row.id, 'startTime', e.target.value)}
                        className="w-full h-9 pl-8 pr-3 rounded border border-[#d9d9d9] text-[13px] text-[#6b7280] focus:border-[#1890ff] focus:outline-none"
                      >
                        <option value="">Start Time</option>
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                            {String(i).padStart(2, '0')}:00
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rowColor }}></span>
                      <select
                        value={row.endTime}
                        onChange={(e) => handleUpdateRow(row.id, 'endTime', e.target.value)}
                        className="w-full h-9 pl-8 pr-3 rounded border border-[#d9d9d9] text-[13px] text-[#6b7280] focus:border-[#1890ff] focus:outline-none"
                      >
                        <option value="">End Time</option>
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                            {String(i).padStart(2, '0')}:00
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <select
                      value={row.priceType}
                      onChange={(e) => handleUpdateRow(row.id, 'priceType', e.target.value)}
                      className="w-full h-9 px-3 rounded border border-[#d9d9d9] text-[13px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none"
                    >
                      <option value="Peak">Peak</option>
                      <option value="Valley">Valley</option>
                      <option value="Flat">Flat</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      value={row.unitPrice}
                      onChange={(e) => handleUpdateRow(row.id, 'unitPrice', e.target.value)}
                      placeholder="Please Enter Unit Price"
                      className="w-full h-9 px-3 rounded border border-[#d9d9d9] text-[13px] text-[#0f1724] placeholder:text-[#bfbfbf] focus:border-[#1890ff] focus:outline-none"
                    />
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-3">
                    <button
                      onClick={handleAddRow}
                      className="text-[#8c8c8c] hover:text-[#1890ff] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveRow(row.id)}
                      aria-label="Delete row"
                      className="w-7 h-7 flex items-center justify-center rounded border border-[#d9d9d9] text-[#8c8c8c] hover:text-[#ff4d4f] hover:border-[#ff4d4f] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-center">
          <button className="h-10 px-8 rounded bg-[#1890ff] text-white text-[14px] font-medium hover:bg-[#0f7de0] transition-colors">
            {saveLabel}
          </button>
        </div>
      </div>

      <BatchAddDialog
        isOpen={isBatchAddOpen}
        onClose={() => setIsBatchAddOpen(false)}
        defaultSource={title.includes("PV") ? "PV" : "Grid"}
      />
    </div>
  )
}
