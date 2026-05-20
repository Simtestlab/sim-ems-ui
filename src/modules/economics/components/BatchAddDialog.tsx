"use client"

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

type BatchAddRow = {
  id: string
  startTime: string
  endTime: string
  priceType: string
  unitPrice: string
}

type BatchAddDialogProps = {
  isOpen: boolean
  onClose: () => void
  defaultSource?: 'Grid' | 'PV'
}

export default function BatchAddDialog({ isOpen, onClose, defaultSource = 'Grid' }: BatchAddDialogProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [source, setSource] = useState<'Grid' | 'PV'>(defaultSource)
  const [rows, setRows] = useState<BatchAddRow[]>([
    {
      id: '1',
      startTime: '',
      endTime: '',
      priceType: 'Peak',
      unitPrice: '',
    },
  ])

  if (!isOpen) return null

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now().toString(),
        startTime: '',
        endTime: '',
        priceType: 'Peak',
        unitPrice: '',
      },
    ])
  }

  const handleRemoveRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id))
  }

  const handleUpdateRow = (id: string, field: keyof BatchAddRow, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-[800px] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6edf5]">
          <h2 className="text-[16px] font-semibold text-[#0f1724]">Batch Add</h2>
          <button onClick={onClose} className="text-[#8c8c8c] hover:text-[#0f1724] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Weekday Selection */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-medium text-[#0f1724]">Please Select Weekday</h3>
            <div className="flex flex-wrap gap-6">
              {weekdays.map((day) => (
                <label key={day} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="w-4 h-4 rounded border-[#d9d9d9] text-[#1890ff] focus:ring-[#1890ff]"
                  />
                  <span className="text-[13px] text-[#6b7280]">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Source Selection */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-medium text-[#0f1724]">
              Please Select Source<span className="text-[#ff4d4f]">*</span>
            </h3>
            <div className="flex gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="source"
                  value="Grid"
                  checked={source === 'Grid'}
                  onChange={() => setSource('Grid')}
                  className="w-4 h-4 border-[#d9d9d9] text-[#1890ff] focus:ring-[#1890ff]"
                />
                <span className={`text-[13px] ${source === 'Grid' ? 'text-[#1890ff]' : 'text-[#6b7280]'}`}>Grid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="source"
                  value="PV"
                  checked={source === 'PV'}
                  onChange={() => setSource('PV')}
                  className="w-4 h-4 border-[#d9d9d9] text-[#1890ff] focus:ring-[#1890ff]"
                />
                <span className={`text-[13px] ${source === 'PV' ? 'text-[#1890ff]' : 'text-[#6b7280]'}`}>PV</span>
              </label>
            </div>
          </div>

          {/* Time Period List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-medium text-[#0f1724]">Time Period List</h3>
              <button
                onClick={handleAddRow}
                className="flex items-center gap-1 h-8 px-4 rounded bg-[#1890ff] text-white text-[13px] font-medium hover:bg-[#0f7de0] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="border border-[#e6edf5] rounded-lg p-5">
              <div className="grid grid-cols-12 gap-4 text-[12px] font-medium text-[#0f1724] mb-3">
                <div className="col-span-3">Start Time</div>
                <div className="col-span-3">End Time</div>
                <div className="col-span-3">Price Type</div>
                <div className="col-span-2">Unit Price(CNY)</div>
                <div className="col-span-1"></div>
              </div>

              <div className="space-y-3">
                {rows.map((row) => (
                  <div key={row.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </span>
                        <select
                          value={row.startTime}
                          onChange={(e) => handleUpdateRow(row.id, 'startTime', e.target.value)}
                          className="w-full h-9 pl-8 pr-3 rounded border border-[#d9d9d9] bg-white text-[13px] text-[#6b7280] focus:border-[#1890ff] focus:outline-none"
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
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </span>
                        <select
                          value={row.endTime}
                          onChange={(e) => handleUpdateRow(row.id, 'endTime', e.target.value)}
                          className="w-full h-9 pl-8 pr-3 rounded border border-[#d9d9d9] bg-white text-[13px] text-[#6b7280] focus:border-[#1890ff] focus:outline-none"
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
                        className="w-full h-9 px-3 rounded border border-[#d9d9d9] bg-white text-[13px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none"
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
                        placeholder="Please Enter U..."
                        className="w-full h-9 px-3 rounded border border-[#d9d9d9] bg-white text-[13px] text-[#0f1724] placeholder:text-[#bfbfbf] focus:border-[#1890ff] focus:outline-none"
                      />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleRemoveRow(row.id)}
                        className="w-7 h-7 flex items-center justify-center rounded border border-[#d9d9d9] text-[#8c8c8c] hover:text-[#ff4d4f] hover:border-[#ff4d4f] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e6edf5] flex items-center justify-end gap-3 bg-white rounded-b-lg">
          <button
            onClick={onClose}
            className="h-9 px-6 rounded border border-[#d9d9d9] text-[13px] font-medium text-[#0f1724] hover:text-[#1890ff] hover:border-[#1890ff] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="h-9 px-6 rounded bg-[#1890ff] text-white text-[13px] font-medium hover:bg-[#0f7de0] transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
