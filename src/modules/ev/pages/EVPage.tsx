"use client"

import { useMemo, useState } from 'react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import EVCard, { type EVData } from '@/modules/ev/components/EVCard'
import EmptyState from '@/shared/components/feedback/EmptyState'
import EVMonitoringFilters from '@/modules/ev/components/MonitoringFilters'
import MonitoringStatusTabs from '@/shared/components/monitoring/StatusTabs'

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'idle', label: 'Idle' },
  { key: 'charging', label: 'Charging' },
  { key: 'completed', label: 'Completed' },
  { key: 'pluggedIn', label: 'Plugged In' },
  { key: 'fault', label: 'Fault' },
  { key: 'offline', label: 'Offline' },
]

const MOCK_DATA: EVData[] = [
  {
    id: 1,
    title: '1#EV',
    status: 'charging',
    realTimePower: 100,
    dailyChargeEnergy: 335,
    dailyDischarge: 0,
    todayPeakPower: null,
    ratedPower: '100kW',
    v2gSupport: true,
  },
]

export default function EVPage() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')
  const [v2gInput, setV2gInput] = useState('')
  const [v2gFilter, setV2gFilter] = useState('')

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: MOCK_DATA.length }
    STATUS_TABS.forEach((t) => {
      if (t.key === 'all') return
      map[t.key] = MOCK_DATA.filter((d) => d.status === t.key).length
    })
    return map
  }, [])

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((d) => {
      if (selectedStatus !== 'all' && d.status !== selectedStatus) return false
      if (query && !d.title.toLowerCase().includes(query.toLowerCase())) return false
      if (v2gFilter === 'Supported' && !d.v2gSupport) return false
      if (v2gFilter === 'Not Supported' && d.v2gSupport) return false
      return true
    })
  }, [selectedStatus, query, v2gFilter])

  function applyFilters() {
    setQuery(queryInput.trim())
    setV2gFilter(v2gInput)
  }

  function resetFilters() {
    setQueryInput('')
    setQuery('')
    setV2gInput('')
    setV2gFilter('')
    setSelectedStatus('all')
  }

  return (
    <DashboardLayout visitedRoute="/monitor/ev" initialActiveTab="EV">
      <EVMonitoringFilters
        query={queryInput}
        v2gSupport={v2gInput}
        onQueryChange={setQueryInput}
        onV2GSupportChange={setV2gInput}
        onSearch={applyFilters}
        onReset={resetFilters}
      />

      <MonitoringStatusTabs
        statusTabs={STATUS_TABS}
        selectedStatus={selectedStatus}
        counts={counts}
        onSelectStatus={setSelectedStatus}
      />

      <main
        className="flex-1 min-w-0 overflow-auto w-full pt-8 pb-6 px-4"
        style={{ maxWidth: 'none', marginInline: 0 }}
      >
        {filtered.length === 0 ? (
          <EmptyState
            title="No devices found"
            description={`There are no devices matching the current filter${selectedStatus !== 'all' ? ` (${STATUS_TABS.find(t => t.key === selectedStatus)?.label ?? selectedStatus})` : ''}.`}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 360px))',
              gap: 16,
              justifyContent: 'start',
              alignContent: 'start',
            }}
          >
            {filtered.map((ev) => (
              <EVCard key={ev.id} ev={ev} />
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
