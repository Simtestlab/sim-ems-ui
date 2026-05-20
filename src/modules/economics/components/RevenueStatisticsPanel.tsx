"use client"

import { useState } from 'react'

export default function RevenueStatisticsPanel() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  })
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day')
  const [keyword, setKeyword] = useState('')

  const sources = ['Grid-es', 'PV-ES', 'ES']
  const priceTypes = ['Peak', 'Valley', 'Flat', 'Total']

  const rows = sources.flatMap((src) =>
    priceTypes.map((pt) => ({
      source: src,
      priceType: pt,
      charge: '0.00',
      discharge: '0.00',
      income: '0.00',
      cost: '0.00',
      profit: '0.00',
    }))
  )

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-[#0f1724] mr-2">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 px-3 rounded border border-[#d9d9d9] text-[13px]"
          />

          <input
            type="text"
            placeholder="Please Enter Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-9 px-3 rounded border border-[#d9d9d9] text-[13px] ml-3"
          />

          <button className="h-9 px-4 rounded bg-[#1890ff] text-white ml-2">Search</button>
          <button className="h-9 px-4 rounded border border-[#d9d9d9] ml-2">Reset</button>
        </div>

        <div className="flex items-center gap-2">
          {(['day', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 h-9 text-[13px] font-medium transition-colors ${
                period === p ? 'bg-[#f3f6fb] text-[#0f1724]' : 'bg-white text-[#6b7280] hover:bg-[#f8f9fc]'
              } ${p !== 'day' ? 'border-l border-[#e6edf5]' : ''}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-[13px] text-[#6b7280]">
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Price Type</th>
              <th className="py-3 px-4">Charge (kwh)</th>
              <th className="py-3 px-4">Discharge (kwh)</th>
              <th className="py-3 px-4">Income (CNY)</th>
              <th className="py-3 px-4">Cost (CNY)</th>
              <th className="py-3 px-4">Profit (CNY)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.source}-${r.priceType}-${idx}`} className="border-t border-[#f0f2f5] even:bg-[#fbfdff]">
                <td className="py-3 px-4 text-[14px] text-[#0f1724]">{r.source}</td>
                <td className="py-3 px-4 text-[14px] text-[#0f1724]">{r.priceType}</td>
                <td className="py-3 px-4">{r.charge}</td>
                <td className="py-3 px-4">{r.discharge}</td>
                <td className="py-3 px-4">{r.income}</td>
                <td className="py-3 px-4">{r.cost}</td>
                <td className="py-3 px-4">{r.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
