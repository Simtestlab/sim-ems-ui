"use client"

import SharedMonitoringFilters from '@/shared/components/monitoring/Filters'
import React from 'react'

type Props = {
  query: string
  onQueryChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
  meterId?: string
  meters?: string[]
}

export default function MonitoringFilters({ query, onQueryChange, onSearch, onReset, meterId, meters = [] }: Props) {
  return (
    <SharedMonitoringFilters
      query={query}
      onQueryChange={onQueryChange}
      onSearch={onSearch}
      onReset={onReset}
      showQuery={false}
      showReset={false}
      showActions={false}
      controls={
        <div className="flex h-11 items-center gap-3 rounded-[10px] border border-[#dce4ee] bg-white px-2 shadow-[0_2px_7px_rgba(15,23,42,0.03)]">
          <label className="text-[13px] font-semibold text-[#5f6f85]">Meter:</label>
          <select value={meterId ?? ''} onChange={(e) => { onQueryChange(e.target.value) }} className="h-8 rounded px-1 text-[13px] border border-transparent">
            {meters.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      }
    />
  )
}
