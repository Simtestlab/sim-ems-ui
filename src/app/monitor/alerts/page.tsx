"use client"

import { useMemo, useState } from 'react'
import { Search, Clock } from 'lucide-react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import Badge from '@/shared/components/ui/Badge'

type AlertRow = {
  station: string
  eventTime: string
  deviceSN: string
  eventLevel: 'Normal' | 'Alert' | 'Faulty'
  deviceType: string
  eventContent: string
  eventType: string
  action: 'Happen' | 'Disappear'
}

const SAMPLE: AlertRow[] = [
  { station: 'Gvault', eventTime: '2026-05-14 08:20:35', deviceSN: 'EV-001', eventLevel: 'Alert', deviceType: 'EV Charger', eventContent: 'Charging session started at...', eventType: 'EV_START_CHARGE', action: 'Happen' },
  { station: 'Gvault', eventTime: '2026-05-14 07:20:35', deviceSN: 'PCS-001', eventLevel: 'Normal', deviceType: 'PCS', eventContent: 'PCS entered standby mode...', eventType: 'PCS_MODE_CHANGE', action: 'Happen' },
  { station: 'Gvault', eventTime: '2026-05-14 04:20:35', deviceSN: 'DB-GRID-37', eventLevel: 'Alert', deviceType: 'Meter', eventContent: 'Grid import exceeded 180 k...', eventType: 'GRID_IMPORT_HIGH', action: 'Happen' },
  { station: 'Gvault', eventTime: '2026-05-14 02:20:35', deviceSN: 'BC-01-01-37', eventLevel: 'Normal', deviceType: 'BESS', eventContent: 'Cell voltage spread reache...', eventType: 'BMS_VOLTAGE_SPREAD', action: 'Disappear' },
  { station: 'Gvault', eventTime: '2026-05-13 23:20:35', deviceSN: 'NBQ-001', eventLevel: 'Alert', deviceType: 'Inverter', eventContent: 'PV inverter output dropped ...', eventType: 'PV_OUTPUT_DEVIATION', action: 'Happen' },
  { station: 'Gvault', eventTime: '2026-05-13 19:20:35', deviceSN: 'DB-BESS-01-37', eventLevel: 'Normal', deviceType: 'Meter', eventContent: 'Reactive power fluctuation ...', eventType: 'PQ_REACTIVE_RECOVER', action: 'Disappear' },
  { station: 'Gvault', eventTime: '2026-05-13 15:20:35', deviceSN: 'PCS-002', eventLevel: 'Faulty', deviceType: 'PCS', eventContent: 'PCS DC bus voltage deviat...', eventType: 'PCS_DCBUS_WARN', action: 'Happen' },
]

export default function Page() {
  const [station, setStation] = useState('Gvault')
  const [eventLevel, setEventLevel] = useState('')
  const [from, setFrom] = useState('2026-05-13T13:31')
  const [to, setTo] = useState('2026-05-14T13:31')
  const [sn, setSn] = useState('')
  const [q, setQ] = useState('')

  const formatDateTime = (s: string) => (s ? s.replace('T', ' ') : '')

  const rows = useMemo(() => SAMPLE, [])

  return (
    <DashboardLayout initialActiveTab="Alerts" visitedRoute="/monitor/alerts">
      <main className="mx-0 flex min-w-0 flex-1 overflow-auto hide-x-scrollbar p-4 max-w-none" style={{ maxWidth: 'none', marginInline: 0 }}>
        <div className="w-full">
          <div className="mb-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <label className="text-sm">Station:</label>
                <select value={station} onChange={(e) => setStation(e.target.value)} className="h-11 min-w-[180px] rounded-[8px] border border-[#dce4ee] bg-white px-3 text-[14px]">
                  <option>Gvault</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm">Event Level:</label>
                <select value={eventLevel} onChange={(e) => setEventLevel(e.target.value)} className="h-11 min-w-[160px] rounded-[8px] border border-[#dce4ee] bg-white px-3 text-[14px]">
                  <option value="">Please...</option>
                  <option value="Normal">Normal</option>
                  <option value="Alert">Alert</option>
                  <option value="Faulty">Faulty</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm">Date Range:</label>
                <div className="h-11 flex items-center rounded-[8px] border border-[#dce4ee] bg-white px-3 text-[14px] min-w-[420px]">
                  <Clock className="mr-2 w-4 h-4 text-[#9aa4b2]" />
                  <span className="text-[#4b5563]">{formatDateTime(from)} To {formatDateTime(to)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <div className="relative">
                  <input placeholder="Please Enter Device SN" value={sn} onChange={(e) => setSn(e.target.value)} className="h-11 w-[240px] rounded-[8px] border border-[#dce4ee] px-4 pr-10 text-[14px]" />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa4b2] w-4 h-4" />
                </div>
                <div className="relative">
                  <input placeholder="Please Enter" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 w-[240px] rounded-[8px] border border-[#dce4ee] px-4 pr-10 text-[14px]" />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa4b2] w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <button className="h-11 rounded-[8px] bg-[#0f6fff] px-4 text-white mr-3">Search</button>
              <button className="h-11 rounded-[8px] border border-[#dce4ee] px-4">Export</button>
            </div>
          </div>

          <div className="rounded-lg border border-[#e6edf5] bg-white p-0 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#f8fafc]">
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#394047]">Event Time</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#394047]">Device SN</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#394047]">Event Level</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#394047]">Device Type</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#394047]">Event Content</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#394047]">Event Type</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#394047]">Event Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-[#f1f5f9] group hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="py-5 px-6">{r.eventTime}</td>
                      <td className="py-5 px-6">{r.deviceSN}</td>
                    
                    <td className="py-5 px-6">
                      {r.eventLevel === 'Alert' && <Badge variant="warning">Alert</Badge>}
                      {r.eventLevel === 'Normal' && <Badge variant="default">Normal</Badge>}
                      {r.eventLevel === 'Faulty' && <Badge variant="error">Faulty</Badge>}
                    </td>
                    <td className="py-5 px-6">{r.deviceType}</td>
                    <td className="py-5 px-6 max-w-[420px] truncate group-hover:whitespace-normal group-hover:overflow-visible">{r.eventContent}</td>
                    <td className="py-5 px-6">{r.eventType}</td>
                    <td className="py-5 px-6">
                      <div className="opacity-100 group-hover:opacity-100 transition-opacity">
                        <button className={`font-semibold ${r.action === 'Happen' ? 'text-[#ff4d4f]' : 'text-[#16a34a]'}`}>{r.action}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-[#6b7280]">Total {rows.length}</div>
              <div className="flex items-center gap-3">
                <select className="h-9 rounded border border-[#dce4ee] px-2">
                  <option>30/page</option>
                </select>
                <button className="h-9 w-9 rounded border border-[#dce4ee]">&lt;</button>
                <button className="h-9 w-9 rounded bg-[#0f6fff] text-white">1</button>
                <button className="h-9 w-9 rounded border border-[#dce4ee]">&gt;</button>
                <div className="flex items-center gap-2">Go to <input className="h-8 w-14 ml-2 rounded border border-[#dce4ee] px-2" /></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
