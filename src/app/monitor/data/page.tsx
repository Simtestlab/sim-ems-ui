"use client"

import { useState } from 'react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

export default function Page() {
  const [filter, setFilter] = useState('')
  const tabs = ['Date', 'Status', 'Telepulse', 'Telemetry Volume', 'Telecommunication Calculation']
  const [activeTab, setActiveTab] = useState(0)

  return (
    <DashboardLayout initialActiveTab="Data" visitedRoute="/monitor/data">
      <main className="mx-0 flex min-w-0 flex-1 overflow-hidden p-2 max-w-none" style={{ maxWidth: 'none', marginInline: 0 }}>
        <div className="w-full flex gap-4">
          <aside className="w-[280px]">
            <section className="rounded-lg border border-[#e6edf5] bg-white p-4 shadow-sm">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter Keyword"
                className="h-11 w-full rounded-[10px] border border-[#dce4ee] px-3 text-[14px] placeholder-[#9da9b8]"
              />

              <div className="mt-6 text-center text-[#9aa4b2]">No Data</div>
            </section>
          </aside>

          <div className="flex-1">
            <div className="mb-3 flex items-center justify-between">
              <nav role="tablist" aria-label="Data tabs" className="flex gap-4 items-center">
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={activeTab === i}
                    tabIndex={activeTab === i ? 0 : -1}
                    onClick={() => setActiveTab(i)}
                    className={`pb-3 px-3 -mb-0.5 ${activeTab === i ? 'text-[#0f1724] font-semibold border-b-2 border-[#0f1724]' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    {t}
                  </button>
                ))}
              </nav>

              <div className="w-[320px]">
                <input placeholder="Please InputName" className="h-11 w-full rounded-[10px] border border-[#dce4ee] px-3 text-[14px] placeholder-[#9da9b8]" />
              </div>
            </div>

            <div className="rounded-lg border border-[#e6edf5] bg-white p-4 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600 text-[14px]">
                    <th className="py-3 px-4">Number</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Numerical Value</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Event Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#9aa4b2]">No Data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
