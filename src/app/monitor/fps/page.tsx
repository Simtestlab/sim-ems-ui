"use client"

import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import SharedMonitoringFilters from '@/shared/components/monitoring/Filters'
import RealtimeDataCard from '@/modules/fps/components/RealtimeDataCard'
import RealtimeStatusCard from '@/modules/fps/components/RealtimeStatusCard'

export default function Page() {
  const [selectedDevice, setSelectedDevice] = useState('1#DIDO')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <DashboardLayout initialActiveTab="FPS" visitedRoute="/monitor/fps">
      <SharedMonitoringFilters
        className="py-1"
        query={''}
        onQueryChange={() => {}}
        onSearch={() => {}}
        onReset={() => {}}
        queryPlaceholder=""
        queryClassName="w-[240px]"
        showQuery={false}
        showActions={false}
        controls={(
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex h-11 min-w-[240px] items-center justify-between rounded-[8px] border border-[#dce4ee] bg-white px-3 text-[14px] shadow-[0_2px_7px_rgba(15,23,42,0.03)]"
            >
              <span className="text-gray-700">{selectedDevice}</span>
              <svg className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {dropdownOpen ? (
              <div className="absolute left-0 top-12 z-20 min-w-[240px] rounded-md border border-gray-200 bg-white p-1 shadow-lg">
                {['1#DIDO', '2#DIDO', '3#DIDO'].map((opt) => (
                  <button key={opt} type="button" className={`w-full text-left px-3 py-2 text-[13px] ${selectedDevice === opt ? 'bg-[#e6f4ff] text-[#1890ff]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => { setSelectedDevice(opt); setDropdownOpen(false) }}>
                    {opt}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      />

      <main className="mx-0 flex min-w-0 flex-1 overflow-hidden p-2 max-w-none" style={{ maxWidth: 'none', marginInline: 0 }}>
        <div className="w-full space-y-2">
          <RealtimeDataCard />
          <RealtimeStatusCard />
        </div>
      </main>
    </DashboardLayout>
  )
}
