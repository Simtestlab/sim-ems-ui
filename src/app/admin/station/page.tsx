"use client"

import { useEffect, useRef, useState } from 'react'
import { Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import Badge from '@/shared/components/ui/Badge'

type StationRow = {
  id: string
  name: string
  abbreviation: string
  aggregated: string
  parent: string
  code: string
  address: string
  type: string
  status: string
  operationDate: string
  capacityKw: string
  sorting: string
  version: string
}

const COLUMNS: { key: keyof StationRow; label: string; defaultWidth: number }[] = [
  { key: 'id',           label: 'Power Station ID',               defaultWidth: 90 },
  { key: 'name',         label: 'Power Station Name',             defaultWidth: 150 },
  { key: 'abbreviation', label: 'Power Station Abbreviation',     defaultWidth: 150 },
  { key: 'aggregated',   label: 'Plant Aggregated Attributes',    defaultWidth: 160 },
  { key: 'parent',       label: 'Parent Station',                 defaultWidth: 120 },
  { key: 'code',         label: 'Power Station Code',             defaultWidth: 120 },
  { key: 'address',      label: 'Detailed Address',               defaultWidth: 180 },
  { key: 'type',         label: 'Power Station Type',             defaultWidth: 140 },
  { key: 'status',       label: 'Operation Status',               defaultWidth: 120 },
  { key: 'operationDate',label: 'Operation Date',                 defaultWidth: 120 },
  { key: 'capacityKw',   label: 'Installed Capacity (kw)',       defaultWidth: 120 },
  { key: 'sorting',      label: 'Sorting',                        defaultWidth: 80 },
  { key: 'version',      label: 'Power Station Version',          defaultWidth: 120 },
]

const SAMPLE_ROWS: StationRow[] = [
  {
    id: '37', name: 'Demo', abbreviation: '', aggregated: 'Normal Station', parent: '—', code: 'Demo',
    address: '', type: 'PV+storage', status: 'In Operation', operationDate: '2026-03-18', capacityKw: '100', sorting: '10', version: 'New Version'
  }
]

export default function Page() {
  const [powerStationName, setPowerStationName] = useState('')
  const [powerStationType, setPowerStationType] = useState('')

  const [colWidths, setColWidths] = useState<number[]>(COLUMNS.map(c => c.defaultWidth))
  const [allChecked, setAllChecked] = useState(false)
  const [checked, setChecked] = useState<boolean[]>(SAMPLE_ROWS.map(() => false))

  const MIN_COL_WIDTH = 60
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const resizing = useRef<{ col: number; startX: number; startW: number; startTotal: number } | null>(null)

  useEffect(() => {
    const update = () => { if (wrapperRef.current) setContainerWidth(wrapperRef.current.clientWidth) }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizing.current) return
      const { col, startX, startW, startTotal } = resizing.current
      const delta = e.clientX - startX
      const maxIncrease = Math.max(0, (wrapperRef.current ? wrapperRef.current.clientWidth : containerWidth) - startTotal)
      const minAllowed = MIN_COL_WIDTH - startW
      const allowed = Math.max(minAllowed, Math.min(delta, maxIncrease))
      setColWidths(prev => {
        const next = [...prev]
        next[col] = Math.max(MIN_COL_WIDTH, Math.min(startW + allowed, startW + maxIncrease))
        return next
      })
    }
    const onUp = () => { resizing.current = null }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  }, [containerWidth])

  const startResize = (e: React.MouseEvent, colIdx: number) => {
    e.preventDefault()
    const startTotal = colWidths.reduce((a, b) => a + b, 0)
    resizing.current = { col: colIdx, startX: e.clientX, startW: colWidths[colIdx], startTotal }
  }

  const rows = SAMPLE_ROWS

  return (
    <DashboardLayout initialActiveTab="Station" visitedRoute="/admin/station">
      <main className="mx-0 flex min-w-0 flex-1 flex-col overflow-auto p-0" style={{ maxWidth: 'none', marginInline: 0 }}>
        {/* Filter */}
        <div className="border-b border-[#e6edf5] bg-white px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[13px] font-medium text-[#394047]">Power Station Name</span>
              <input placeholder="Please Enter Power Station Name" value={powerStationName} onChange={(e)=>setPowerStationName(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]" style={{ minWidth: 220 }} />
            </div>

            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[13px] font-medium text-[#394047]">Power Station Type</span>
              <select value={powerStationType} onChange={(e)=>setPowerStationType(e.target.value)} className="h-9 rounded border border-[#dce4ee] px-3 text-[13px]" style={{ minWidth: 220 }}>
                <option value="">Please Select Power Station ...</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="inline-flex h-9 items-center gap-2 rounded bg-[#0f6fff] px-5 text-[13px] font-medium text-white"><Search className="h-[14px] w-[14px]"/>Search</button>
              <button className="inline-flex h-9 items-center gap-2 rounded border border-[#dce4ee] bg-white px-5 text-[13px] font-medium text-[#394047]"><RefreshCw className="h-[14px] w-[14px]"/>Reset</button>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="flex-1">
          <div className="rounded-lg border border-[#e6edf5] bg-white relative overflow-hidden">
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6edf5] bg-white text-[#9aa4b2]"><Search className="h-[14px] w-[14px]"/></button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6edf5] bg-white text-[#9aa4b2]"><RefreshCw className="h-[14px] w-[14px]"/></button>
            </div>

            <div className="p-6 pb-4">
              <div className="h-12 border-b border-[#e6edf5]" />

              <div ref={wrapperRef} className="overflow-x-auto hide-x-scrollbar">
                <table className="border-collapse text-[13px]" style={{ tableLayout: 'fixed', width: 48 + colWidths.reduce((a,b)=>a+b,0) }}>
                  <colgroup>
                    <col style={{ width: 48 }} />
                    {colWidths.map((w,i)=><col key={i} style={{ width: w }} />)}
                  </colgroup>

                  <thead>
                    <tr className="bg-[#f8fafc]">
                      <th className="border-b border-r border-[#e6edf5] py-3 px-3 text-center align-middle">
                        <input type="checkbox" checked={allChecked} onChange={(e)=>{ setAllChecked(e.target.checked); setChecked(rows.map(()=>e.target.checked)) }} className="h-4 w-4 cursor-pointer accent-[#0f6fff]" />
                      </th>

                      {COLUMNS.map((col,i)=> (
                        <th key={col.key} className="relative border-b border-r border-[#e6edf5] py-3 px-4 align-middle font-semibold text-[#394047] text-center" style={{ width: colWidths[i], minWidth: 60 }}>
                          <span className="block whitespace-normal leading-snug">{col.label}</span>
                          <div onMouseDown={(e)=>startResize(e,i)} className="absolute right-0 top-0 z-10 h-full w-[5px] cursor-col-resize select-none hover:bg-[#0f6fff]/30" style={{ touchAction: 'none' }} />
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={COLUMNS.length+1} className="py-16 text-center text-[13px] text-[#9aa4b2]">No Data</td>
                      </tr>
                    ) : (
                      rows.map((r,i)=> (
                        <tr key={i} className="border-b border-[#f1f5f9] hover:bg-[#f5f8ff]">
                          <td className="border-r border-[#e6edf5] py-3 px-3 text-center align-middle">
                            <input type="checkbox" checked={!!checked[i]} onChange={(e)=>{ const next=[...checked]; next[i]=e.target.checked; setChecked(next)}} className="h-4 w-4 cursor-pointer accent-[#0f6fff]" />
                          </td>
                          <td className="py-3 px-4">{r.id}</td>
                          <td className="py-3 px-4">{r.name}</td>
                          <td className="py-3 px-4">{r.abbreviation}</td>
                          <td className="py-3 px-4"><Badge variant="default">{r.aggregated}</Badge></td>
                          <td className="py-3 px-4">{r.parent}</td>
                          <td className="py-3 px-4">{r.code}</td>
                          <td className="py-3 px-4">{r.address}</td>
                          <td className="py-3 px-4"><Badge variant="info">{r.type}</Badge></td>
                          <td className="py-3 px-4"><Badge variant="success">{r.status}</Badge></td>
                          <td className="py-3 px-4">{r.operationDate}</td>
                          <td className="py-3 px-4">{r.capacityKw}</td>
                          <td className="py-3 px-4">{r.sorting}</td>
                          <td className="py-3 px-4"><Badge variant="default">{r.version}</Badge></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-[#6b7280]">Total {rows.length}</div>
                <div className="flex items-center gap-3">
                  <select className="h-9 rounded border border-[#dce4ee] px-2 text-sm"><option>10/page</option></select>
                  <button className="h-9 w-9 rounded border border-[#dce4ee]"> <ChevronLeft className="w-4 h-4"/> </button>
                  <button className="h-9 w-9 rounded bg-[#0f6fff] text-white">1</button>
                  <button className="h-9 w-9 rounded border border-[#dce4ee]"> <ChevronRight className="w-4 h-4"/> </button>
                  <div className="flex items-center gap-2">Go to <input className="h-8 w-14 ml-2 rounded border border-[#dce4ee] px-2 text-sm"/></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
