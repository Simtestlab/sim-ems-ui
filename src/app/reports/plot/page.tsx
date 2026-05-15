"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

export default function Page() {
  const today = new Date().toISOString().split('T')[0]
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)

  const [sel1, setSel1] = useState('')
  const [sel2, setSel2] = useState('')
  const [sel3, setSel3] = useState('')
  const [series, setSeries] = useState<string[]>([])

  const onAdd = () => {
    const label = `${sel1 || 'N/A'} / ${sel2 || 'N/A'} / ${sel3 || 'N/A'}`
    if (!series.includes(label)) setSeries((s) => [...s, label])
    setSel1('')
    setSel2('')
    setSel3('')
  }

  const onSearch = () => {
    // Placeholder: in real app this would query the API and update the chart
    console.log('Search', { from, to, sel1, sel2, sel3, series })
  }

  return (
    <DashboardLayout initialActiveTab="Plot" visitedRoute="/reports/plot">
      <main className="mx-0 flex min-w-0 flex-1 flex-col overflow-auto p-0" style={{ maxWidth: 'none', marginInline: 0 }}>
        <div className="p-6">
          <div className="rounded-lg border border-[#e6edf5] bg-white p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]" />
                <span className="text-sm text-[#6b7280]">To</span>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]" />
              </div>

              <button onClick={onSearch} className="ml-auto inline-flex h-9 items-center gap-2 rounded bg-[#0f6fff] px-4 text-[13px] font-medium text-white"><Search className="w-4 h-4"/>Search</button>
            </div>
          </div>

          <div className="rounded-lg border border-[#e6edf5] bg-white p-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-[#394047] mb-2 block">Search</label>
                <div className="flex gap-3">
                  <select value={sel1} onChange={(e)=>setSel1(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-sm">
                    <option value="">Please Select ...</option>
                    <option value="opt-1">Option 1</option>
                    <option value="opt-2">Option 2</option>
                  </select>

                  <select value={sel2} onChange={(e)=>setSel2(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-sm">
                    <option value="">Please Select Device</option>
                    <option value="dev-1">Device 1</option>
                    <option value="dev-2">Device 2</option>
                  </select>

                  <select value={sel3} onChange={(e)=>setSel3(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-sm">
                    <option value="">Please Select A Device...</option>
                    <option value="d-1">D1</option>
                    <option value="d-2">D2</option>
                  </select>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button onClick={onSearch} className="inline-flex h-9 items-center gap-2 rounded bg-[#0f6fff] px-4 text-[13px] font-medium text-white"><Search className="w-4 h-4"/>Search</button>
              </div>
            </div>

            <div className="mt-4">
              <button onClick={onAdd} className="w-full h-9 rounded bg-[#0f6fff] text-white">+ Add</button>
            </div>
          </div>

          <div className="rounded-lg border border-[#e6edf5] bg-white p-4">
            <div className="mb-4">
              {series.length === 0 ? (
                <div className="text-sm text-[#9aa3ad]">No series added.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {series.map((s, i) => (
                    <div key={i} className="rounded bg-[#f1f5f9] px-3 py-1 text-sm">{s}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="min-h-[360px] flex items-center justify-center text-[#9aa3ad]">Chart placeholder</div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
