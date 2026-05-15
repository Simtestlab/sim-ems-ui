"use client"

import { useMemo, useState, useEffect } from 'react'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

type MonthlyRow = {
  month: string
  chargeEnergy: number
  dischargeEnergy: number
  roundTripEfficiency: number
  energyLoss: number
  chargingCost: number
  dischargeRevenue: number
}

const parseMonth = (m: string) => {
  const [y, mm] = m.split('-').map(Number)
  return new Date(y, mm - 1, 1)
}

const formatMonth = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

const generateMonthsBetween = (from: string, to: string): MonthlyRow[] => {
  let start = parseMonth(from)
  let end = parseMonth(to)
  if (start > end) { const t = start; start = end; end = t }
  const rows: MonthlyRow[] = []
  for (let dt = new Date(end); dt >= start; dt.setMonth(dt.getMonth() - 1)) {
    const idx = rows.length
    rows.push({
      month: formatMonth(new Date(dt)),
      chargeEnergy: Math.round(100 + idx * 4.2),
      dischargeEnergy: Math.round(80 + idx * 3.1),
      roundTripEfficiency: Math.round(80 + (idx % 10)),
      energyLoss: Math.round((idx % 5) * 1.5),
      chargingCost: Math.round((idx + 1) * 2.3),
      dischargeRevenue: Math.round((idx + 1) * 3.4),
    })
  }
  return rows
}

export default function Page() {
  const [from, setFrom] = useState('2026-05')
  const [to, setTo] = useState('2026-05')

  const [pageSize, setPageSize] = useState(10)
  const allRows = useMemo(() => generateMonthsBetween(from, to), [from, to])
  const totalItems = allRows.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const [page, setPage] = useState(1)
  const [gotoValue, setGotoValue] = useState('')

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return allRows.slice(start, start + pageSize)
  }, [allRows, page, pageSize])

  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages])

  return (
    <DashboardLayout initialActiveTab="Monthly" visitedRoute="/reports/monthly">
      <main className="mx-0 flex min-w-0 flex-1 flex-col overflow-auto p-0" style={{ maxWidth: 'none', marginInline: 0 }}>
        <div className="p-6">
          <div className="rounded-lg border border-[#e6edf5] bg-white p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="month" value={from} onChange={(e)=>setFrom(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]" />
                <span className="text-sm text-[#6b7280]">To</span>
                <input type="month" value={to} onChange={(e)=>setTo(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]" />
              </div>

              <button onClick={()=>setPage(1)} className="inline-flex h-9 items-center gap-2 rounded bg-[#0f6fff] px-4 text-[13px] font-medium text-white"><Search className="w-4 h-4"/>Search</button>
            </div>
          </div>

          <div className="rounded-lg border border-[#e6edf5] bg-white p-4">
            <div className="flex justify-end items-center gap-3 mb-2">
              <button className="h-9 rounded border border-[#dce4ee] px-3 text-sm inline-flex items-center gap-2"><Download className="w-4 h-4"/>Export</button>
            </div>

            <div className="overflow-x-auto hide-x-scrollbar">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="py-3 px-4 font-semibold text-[#394047]">Date</th>
                    <th className="py-3 px-4 font-semibold text-[#394047]">Charge Energy (kwh)</th>
                    <th className="py-3 px-4 font-semibold text-[#394047]">Discharge Energy (kwh)</th>
                    <th className="py-3 px-4 font-semibold text-[#394047]">Round-trip Efficiency (%)</th>
                    <th className="py-3 px-4 font-semibold text-[#394047]">Energy Loss (kwh)</th>
                    <th className="py-3 px-4 font-semibold text-[#394047]">Charging Cost</th>
                    <th className="py-3 px-4 font-semibold text-[#394047]">Discharge Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((r, i) => (
                    <tr key={(page - 1) * pageSize + i} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                      <td className="py-4 px-4">{r.month}</td>
                      <td className="py-4 px-4">{r.chargeEnergy}</td>
                      <td className="py-4 px-4">{r.dischargeEnergy}</td>
                      <td className="py-4 px-4">{r.roundTripEfficiency}</td>
                      <td className="py-4 px-4">{r.energyLoss}</td>
                      <td className="py-4 px-4">{r.chargingCost}</td>
                      <td className="py-4 px-4">{r.dischargeRevenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-2 pt-4">
              <div className="text-sm text-[#6b7280]">Total {totalItems}</div>
              <div className="flex items-center gap-3">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="h-9 rounded border border-[#dce4ee] px-2 text-sm"
                >
                  <option value={10}>10/page</option>
                  <option value={20}>20/page</option>
                  <option value={50}>50/page</option>
                </select>

                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-9 w-9 rounded border border-[#dce4ee]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded ${p === page ? 'bg-[#0f6fff] text-white' : 'border border-[#dce4ee]'}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-9 w-9 rounded border border-[#dce4ee]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  Go to
                  <input
                    value={gotoValue}
                    onChange={(e) => setGotoValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const n = Number(gotoValue)
                        if (!Number.isNaN(n) && n >= 1 && n <= totalPages) setPage(n)
                        setGotoValue('')
                      }
                    }}
                    className="h-8 w-14 ml-2 rounded border border-[#dce4ee] px-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
