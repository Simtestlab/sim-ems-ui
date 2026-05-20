"use client"

import { useEffect, useRef, useState } from 'react'
import { Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

type DeviceRow = {
  deviceSn: string
  name: string
  location: string
  model: string
  status: string
  batteryCapacity: string
  initialPower: string
  meterType: string
  switchgearType: string
  meterMultiplier: string
  weatherAngle: string
  mainWeatherStation: string
  remarks: string
}

const COLUMNS: { key: keyof DeviceRow; label: string; defaultWidth: number }[] = [
  { key: 'deviceSn',           label: 'Device Sn',            defaultWidth: 120 },
  { key: 'name',               label: 'Equipment Name',        defaultWidth: 130 },
  { key: 'location',           label: 'Installation Location', defaultWidth: 140 },
  { key: 'model',              label: 'Model',                 defaultWidth: 100 },
  { key: 'status',             label: 'Device Status',         defaultWidth: 110 },
  { key: 'batteryCapacity',    label: 'Battery Capacity',      defaultWidth: 120 },
  { key: 'initialPower',       label: 'Initial Power',         defaultWidth: 110 },
  { key: 'meterType',          label: 'Meter Type',            defaultWidth: 110 },
  { key: 'switchgearType',     label: 'Switchgear Type',       defaultWidth: 120 },
  { key: 'meterMultiplier',    label: 'Meter Multiplier',      defaultWidth: 120 },
  { key: 'weatherAngle',       label: 'Weather Station Angle', defaultWidth: 140 },
  { key: 'mainWeatherStation', label: 'Main Weather Station',  defaultWidth: 150 },
  { key: 'remarks',            label: 'Remarks',               defaultWidth: 120 },
]

const SAMPLE_ROWS: DeviceRow[] = [] // replace with real data

export default function Page() {
  const [station, setStation] = useState('Gvault')
  const [equipmentName, setEquipmentName] = useState('')
  const [colWidths, setColWidths] = useState<number[]>(COLUMNS.map(c => c.defaultWidth))
  const [allChecked, setAllChecked] = useState(false)
  const [checked, setChecked] = useState<boolean[]>(SAMPLE_ROWS.map(() => false))
  const MIN_COL_WIDTH = 60

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const resizing = useRef<{ col: number; startX: number; startW: number; startTotal: number } | null>(null)

  // track container width
  useEffect(() => {
    const update = () => {
      if (wrapperRef.current) setContainerWidth(wrapperRef.current.clientWidth)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // mouse move/up handlers for resizing (mounted once)
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
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [containerWidth])

  const startResize = (e: React.MouseEvent, colIdx: number) => {
    e.preventDefault()
    const startTotal = colWidths.reduce((a, b) => a + b, 0)
    resizing.current = { col: colIdx, startX: e.clientX, startW: colWidths[colIdx], startTotal }
  }

  const rows = SAMPLE_ROWS

  return (
    <DashboardLayout initialActiveTab="Device" visitedRoute="/admin/device">
      <main
        className="mx-0 flex min-w-0 flex-1 flex-col overflow-auto p-0"
        style={{ maxWidth: 'none', marginInline: 0 }}
      >
        {/* ── Filter card ─────────────────────────────────────────── */}
        <div className="border-b border-[#e6edf5] bg-white px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[13px] font-medium text-[#394047]">
                Belonging Power Station
              </span>
              <div className="relative">
                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="h-9 appearance-none rounded border border-[#dce4ee] bg-white pl-3 pr-8 text-[13px] text-[#394047] focus:outline-none focus:ring-1 focus:ring-[#0f6fff]"
                  style={{ minWidth: 200 }}
                >
                  <option>Gvault</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9aa4b2]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 4l4 4 4-4"/></svg>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[13px] font-medium text-[#394047]">
                Equipment Name
              </span>
              <input
                placeholder="Equipment Name"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="h-9 rounded border border-[#dce4ee] px-3 text-[13px] text-[#394047] focus:outline-none focus:ring-1 focus:ring-[#0f6fff]"
                style={{ minWidth: 200 }}
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="inline-flex h-9 items-center gap-2 rounded bg-[#0f6fff] px-5 text-[13px] font-medium text-white hover:bg-[#0a5de6]">
                <Search className="h-[14px] w-[14px]" />
                Search
              </button>
              <button className="inline-flex h-9 items-center gap-2 rounded border border-[#dce4ee] bg-white px-5 text-[13px] font-medium text-[#394047] hover:bg-[#f8fafc]">
                <RefreshCw className="h-[14px] w-[14px]" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── Table card ──────────────────────────────────────────── */}
        <div className="flex-1">
          <div className="rounded-lg border border-[#e6edf5] bg-white relative overflow-hidden">
            {/* top-right icon buttons */}
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6edf5] bg-white text-[#9aa4b2] hover:border-[#0f6fff] hover:text-[#0f6fff]">
                <Search className="h-[14px] w-[14px]" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6edf5] bg-white text-[#9aa4b2] hover:border-[#0f6fff] hover:text-[#0f6fff]">
                <RefreshCw className="h-[14px] w-[14px]" />
              </button>
            </div>

            <div className="p-6 pb-6">
              {/* spacer so icons don't overlap table */}
              <div className="h-12 border-b border-[#e6edf5]" />

              <div ref={wrapperRef} className="overflow-x-auto hide-x-scrollbar">
                <table
                  className="border-collapse text-[13px]"
                  style={{ tableLayout: 'fixed', width: 48 + colWidths.reduce((a, b) => a + b, 0) }}
                >
                  <colgroup>
                    <col style={{ width: 48 }} />
                    {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
                  </colgroup>

                  <thead>
                    <tr className="bg-[#f8fafc]">
                      {/* checkbox header */}
                      <th className="border-b border-r border-[#e6edf5] py-3 px-3 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={(e) => {
                            setAllChecked(e.target.checked)
                            setChecked(rows.map(() => e.target.checked))
                          }}
                          className="h-4 w-4 cursor-pointer accent-[#0f6fff]"
                        />
                      </th>

                      {COLUMNS.map((col, i) => (
                        <th
                          key={col.key}
                          className="relative border-b border-r border-[#e6edf5] py-3 px-4 align-middle font-semibold text-[#394047] text-center"
                          style={{ width: colWidths[i], minWidth: 60 }}
                        >
                          <span className="block whitespace-normal leading-snug">{col.label}</span>
                          {/* resize handle */}
                          <div
                            onMouseDown={(e) => startResize(e, i)}
                            className="absolute right-0 top-0 z-10 h-full w-[5px] cursor-col-resize select-none hover:bg-[#0f6fff]/30"
                            style={{ touchAction: 'none' }}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={COLUMNS.length + 1}
                          className="py-16 text-center text-[13px] text-[#9aa4b2]"
                        >
                          No Data
                        </td>
                      </tr>
                    ) : (
                      rows.map((r, i) => (
                        <tr key={i} className="border-b border-[#f1f5f9] hover:bg-[#f5f8ff]">
                          <td className="border-r border-[#e6edf5] py-3 px-3 text-center align-middle">
                            <input
                              type="checkbox"
                              checked={!!checked[i]}
                              onChange={(e) => {
                                const next = [...checked]
                                next[i] = e.target.checked
                                setChecked(next)
                              }}
                              className="h-4 w-4 cursor-pointer accent-[#0f6fff]"
                            />
                          </td>
                          {COLUMNS.map((col) => (
                            <td key={col.key} className="overflow-hidden text-ellipsis whitespace-nowrap border-r border-[#e6edf5] py-3 px-4 text-[#394047]">
                              {r[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                </div>

                <div className="flex items-center justify-between px-2 pt-4">
                  <div className="text-sm text-[#6b7280]">Total {rows.length}</div>
                  <div className="flex items-center gap-3">
                    <select className="h-9 rounded border border-[#dce4ee] px-2 text-sm"><option>10/page</option></select>
                    <button className="h-9 w-9 rounded border border-[#dce4ee] flex items-center justify-center"><ChevronLeft className="w-4 h-4"/></button>
                    <button className="h-9 w-9 rounded bg-[#0f6fff] text-white">1</button>
                    <button className="h-9 w-9 rounded border border-[#dce4ee] flex items-center justify-center"><ChevronRight className="w-4 h-4"/></button>
                    <div className="flex items-center gap-2">Go to <input className="h-8 w-14 ml-2 rounded border border-[#dce4ee] px-2 text-sm" /></div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
