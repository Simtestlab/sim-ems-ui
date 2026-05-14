"use client"

import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import SharedMonitoringStatusTabs from '@/shared/components/monitoring/StatusTabs'
import StackCard from '@/modules/bms/components/StackCard'

const STATUS_TABS = [
  { key: 'stack', label: 'Stack' },
  { key: 'cluster', label: 'Cluster' },
  { key: 'cell', label: 'Cell' },
  { key: 'balancing', label: 'Balancing' },
]

export default function Page() {
  const [selectedTab, setSelectedTab] = useState('stack')
  const [selectedStack, setSelectedStack] = useState('1#Stack')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <DashboardLayout initialActiveTab="BMS" visitedRoute="/monitor/bms">
      <SharedMonitoringStatusTabs
        statusTabs={STATUS_TABS}
        selectedStatus={selectedTab}
        counts={{ stack: 1, cluster: 0, cell: 0, balancing: 0 }}
        onSelectStatus={(s) => setSelectedTab(s)}
      />

      <div className="border-b border-[#edf1f5] bg-white px-4 py-2 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#6b7280]">Stack:</span>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex h-11 min-w-[280px] items-center justify-between rounded-[10px] border border-[#dce4ee] bg-white px-4 text-[14px] shadow-[0_2px_7px_rgba(15,23,42,0.03)]"
              >
                <span className="font-medium text-gray-700">BMS / {selectedStack}</span>
                <svg className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {dropdownOpen ? (
                <div className="absolute left-0 top-12 z-20 min-w-[280px] rounded-md border border-gray-200 bg-white p-1 shadow-lg">
                  {['1#Stack', '2#Stack', '3#Stack'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedStack(opt)
                        setDropdownOpen(false)
                      }}
                      className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] transition-colors ${selectedStack === opt ? 'bg-[#e6f4ff] text-[#1890ff]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      BMS / {opt}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <button className="h-11 rounded-[10px] bg-[#2563f6] px-8 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(37,99,246,0.24)] transition-all hover:bg-[#3c75f8]">
            Search
          </button>
        </div>
      </div>
      <main className="mx-0 flex min-w-0 flex-1 overflow-auto p-0 max-w-none" style={{ maxWidth: 'none', marginInline: 0, paddingRight: 0 }}>
        <div className="w-full pr-0">
          <StackCard />
        </div>
      </main>
    </DashboardLayout>
  )
}
