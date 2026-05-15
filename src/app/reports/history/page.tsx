"use client"

import { useMemo, useState, useEffect } from 'react'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

type HistoryRow = {
  date: string
  chargeEnergy: number
  dischargeEnergy: number
  roundTripEfficiency: number
  energyLoss: number
  chargingCost: number
  dischargeRevenue: number
}

const toLocalDatetimeInputValue = (d: Date) => {
  const tzOffset = d.getTimezoneOffset() * 60000
  const local = new Date(d.getTime() - tzOffset)
  return local.toISOString().slice(0, 16)
}

const generateHistoryRows = (fromIso: string, toIso: string, count = 31): HistoryRow[] => {
  const from = new Date(fromIso)
  const to = new Date(toIso)
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return []
  const start = Math.min(from.getTime(), to.getTime())
  const end = Math.max(from.getTime(), to.getTime())
  if (start === end) {
    return [{
      date: new Date(start).toISOString().replace('T', ' ').slice(0, 19),
      chargeEnergy: 0,
      dischargeEnergy: 0,
      roundTripEfficiency: 0,
      energyLoss: 0,
      chargingCost: 0,
      dischargeRevenue: 0,
    }]
  }

  return Array.from({ length: count }).map((_, i) => {
    const t = start + Math.round((end - start) * (i / Math.max(1, count - 1)))
    const d = new Date(t)
    return {
      date: d.toISOString().replace('T', ' ').slice(0, 19),
      chargeEnergy: Math.round(50 + i * 2.3),
      dischargeEnergy: Math.round(40 + i * 1.9),
      roundTripEfficiency: Math.round(70 + (i % 10)),
      energyLoss: Math.round((i % 5) * 1),
      chargingCost: Math.round((i + 1) * 1.5),
      dischargeRevenue: Math.round((i + 1) * 2.1),
    }
  }).reverse()
}

export default function Page() {
  const [device, setDevice] = useState('')
  const [from, setFrom] = useState(() => toLocalDatetimeInputValue(new Date(Date.now() - 24 * 60 * 60 * 1000)))
  const [to, setTo] = useState(() => toLocalDatetimeInputValue(new Date()))

  const [allRows, setAllRows] = useState<HistoryRow[]>([])
  const [pageSize, setPageSize] = useState(10)
  const totalItems = allRows.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const [page, setPage] = useState(1)
  const [gotoValue, setGotoValue] = useState('')

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
    if (page < 1) setPage(1)
  }, [page, totalPages])

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return allRows.slice(start, start + pageSize)
  }, [allRows, page, pageSize])

  const onSearch = () => {
    if (!device) {
      setAllRows([])
      setPage(1)
      return
    }
    const rows = generateHistoryRows(from, to, 31)
    setAllRows(rows)
    setPage(1)
  }

  return (
    <DashboardLayout initialActiveTab="History" visitedRoute="/reports/history">
      <main className="mx-0 flex min-w-0 flex-1 flex-col overflow-auto p-0" style={{ maxWidth: 'none', marginInline: 0 }}>
        <div className="p-6">
          <div className="rounded-lg border border-[#e6edf5] bg-white p-4 mb-6">
            <div className="flex items-center gap-4">
              <select value={device} onChange={(e) => setDevice(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]">
                <option value="">Please Select Device</option>
                <option value="dev-1">Device 1</option>
                <option value="dev-2">Device 2</option>
              </select>

              <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]" />
              <span className="text-sm text-[#6b7280]">To</span>
              <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]" />

              <button onClick={onSearch} className="inline-flex h-9 items-center gap-2 rounded bg-[#0f6fff] px-4 text-[13px] font-medium text-white"><Search className="w-4 h-4" />Search</button>
            </div>
          </div>

          <div className="rounded-lg border border-[#e6edf5] bg-white p-4">
            <div className="flex justify-end items-center gap-3 mb-2">
              <button className="h-9 rounded border border-[#dce4ee] px-3 text-sm inline-flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
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
                  {totalItems === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#9aa3ad]">暂无数据</td>
                    </tr>
                  ) : (
                    pagedRows.map((r, i) => (
                      <tr key={(page - 1) * pageSize + i} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                        <td className="py-4 px-4">{r.date}</td>
                        <td className="py-4 px-4">{r.chargeEnergy}</td>
                        <td className="py-4 px-4">{r.dischargeEnergy}</td>
                        <td className="py-4 px-4">{r.roundTripEfficiency}</td>
                        <td className="py-4 px-4">{r.energyLoss}</td>
                        <td className="py-4 px-4">{r.chargingCost}</td>
                        <td className="py-4 px-4">{r.dischargeRevenue}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalItems > 0 && (
              <div className="flex items-center justify-between px-2 pt-4">
                <div className="text-sm text-[#6b7280]">Total {totalItems}</div>
                <div className="flex items-center gap-3">
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }} className="h-9 rounded border border-[#dce4ee] px-2 text-sm">
                    <option value={10}>10/page</option>
                    <option value={20}>20/page</option>
                    <option value={50}>50/page</option>
                  </select>

                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="h-9 w-9 rounded border border-[#dce4ee]">
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} className={`h-9 w-9 rounded ${p === page ? 'bg-[#0f6fff] text-white' : 'border border-[#dce4ee]'}`}>{p}</button>
                  ))}

                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="h-9 w-9 rounded border border-[#dce4ee]">
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    Go to
                    <input value={gotoValue} onChange={(e) => setGotoValue(e.target.value)} onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const n = Number(gotoValue)
                        if (!Number.isNaN(n) && n >= 1 && n <= totalPages) setPage(n)
                        setGotoValue('')
                      }
                    }} className="h-8 w-14 ml-2 rounded border border-[#dce4ee] px-2 text-sm" />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}