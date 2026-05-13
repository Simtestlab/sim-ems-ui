"use client"

import React from 'react'

const STATUSES = [
  { label: 'Running', active: true },
  { label: 'Communication Normal', active: true },
  { label: 'Alarm', active: false },
  { label: 'Fault', active: false },
  { label: 'Derating Running', active: false },
]

export default function StatusPanel() {
  return (
    <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-6 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <h3 className="mb-7 text-[22px] font-semibold tracking-tight text-[#101828]">Device Status</h3>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 text-[16px] text-[#2b3441] md:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((status) => (
          <div key={status.label} className="flex items-center gap-3">
            <span className={`h-3.5 w-3.5 rounded-full ${status.active ? 'bg-[#4dd390]' : 'bg-[#b9bdc2]'}`} />
            <span>{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
