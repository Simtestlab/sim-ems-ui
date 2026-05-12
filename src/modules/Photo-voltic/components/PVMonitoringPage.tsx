"use client";

import { useEffect, useMemo, useState } from 'react';
import MonitoringSidebar from './MonitoringSidebar';
import InverterCard from './InverterCard';
import PVMonitoringBreadcrumb from './PVMonitoringBreadcrumb';
import PVMonitoringEmptyState from './PVMonitoringEmptyState';
import PVMonitoringFilters from './PVMonitoringFilters';
import PVMonitoringHeader from './PVMonitoringHeader';
import PVMonitoringStatusTabs from './PVMonitoringStatusTabs';
import type { InverterData } from '../types';
import { usePVMonitoringStore } from '@/store/pvMonitoringStore'

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'standby', label: 'Standby' },
  { key: 'normal', label: 'Normal' },
  { key: 'shutdown', label: 'Shutdown' },
  { key: 'alarm', label: 'Alarm' },
  { key: 'fault', label: 'Fault' },
  { key: 'communicationLoss', label: 'Communication Loss' },
]

export default function PVMonitoringPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('PV');
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [queryInput, setQueryInput] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState<string[]>(['PV Monitoring'])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Add PV overview to navigation history when this page mounts
  const addVisitedTab = usePVMonitoringStore((s) => s.addVisitedTab)
  useEffect(() => {
    addVisitedTab('/pv')
  }, [addVisitedTab])

  const formatDateTime = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`
  }

  const data = useMemo<InverterData[]>(
    () => [
      { id: 1, title: '1#Inverter', status: 'normal', branch: 'normal', location: 'Demo Site', activePower: '95.94', dailyEnergy: '311.5', loadRatio: '76.75', dailyEffective: '3.69' },
      { id: 2, title: '2#Inverter', status: 'normal', branch: 'normal', location: 'Demo Site', activePower: '78.48', dailyEnergy: '254.8', loadRatio: '62.78', dailyEffective: '3.69' },
    ],
    [],
  )

  const locations = useMemo(() => {
    return Array.from(new Set(data.map(item => item.location).filter((item): item is string => Boolean(item))))
  }, [data])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: data.length }
    STATUS_TABS.forEach(t => {
      if (t.key === 'all') return
      map[t.key] = data.filter(d => d.status === t.key).length
    })
    return map
  }, [data])

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (selectedStatus !== 'all' && d.status !== selectedStatus) return false
      if (location && location !== '' && (d as { location?: string }).location !== location) return false
      if (query && !d.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [data, selectedStatus, location, query])

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  function resetFilters() {
    setQueryInput('')
    setLocationInput('')
    setQuery('')
    setLocation('')
    setSelectedStatus('all')
  }

  function applyFilters() {
    setQuery(queryInput.trim())
    setLocation(locationInput)
  }

  return (
    <div className="h-screen bg-[#f5f7fa] font-sans text-gray-800 flex flex-col text-[14px] ui-compact">
      <PVMonitoringHeader
        sidebarCollapsed={sidebarCollapsed}
        currentTimeLabel={formatDateTime(currentTime)}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        <MonitoringSidebar sidebarCollapsed={sidebarCollapsed} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 min-w-0 overflow-hidden flex flex-col bg-[#f5f7fa]">
          <PVMonitoringBreadcrumb />
          <PVMonitoringFilters
            query={queryInput}
            location={locationInput}
            locations={locations}
            onQueryChange={setQueryInput}
            onLocationChange={setLocationInput}
            onSearch={applyFilters}
            onReset={resetFilters}
          />
          <PVMonitoringStatusTabs
            statusTabs={STATUS_TABS}
            selectedStatus={selectedStatus}
            counts={counts}
            onSelectStatus={setSelectedStatus}
          />

          <main className="flex-1 min-w-0 overflow-hidden w-full pt-8 pb-6 px-4 max-w-none mx-0" style={{ maxWidth: 'none', marginInline: 0 }}>
            {filtered.length === 0 ? (
              <PVMonitoringEmptyState />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 360px))', gap: 16, justifyContent: 'start', alignContent: 'start' }}>
                {filtered.map(inverter => (
                  <InverterCard
                    key={inverter.id}
                    inverter={inverter}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}