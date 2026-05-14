"use client"

import { useState } from 'react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import MonitoringStatusTabs from '@/shared/components/monitoring/StatusTabs'
import MonitoringFilters from '@/shared/components/monitoring/Filters'
import StackCard from '../../../modules/bms/components/StackCard'

const STATUS_TABS = [
  { key: 'stack', label: 'Stack' },
  { key: 'cluster', label: 'Cluster' },
  { key: 'cell', label: 'Cell' },
  { key: 'balancing', label: 'Balancing' },
]

export default function Page() {
  const [selectedTab, setSelectedTab] = useState('stack')
  const [query, setQuery] = useState('')
  const [selectedStack, setSelectedStack] = useState('1#Stack')

  return (
    <DashboardLayout initialActiveTab="BMS" visitedRoute="/monitor/bms">
      <main className="flex-1 overflow-auto p-6">
        <MonitoringStatusTabs
          statusTabs={STATUS_TABS}
          selectedStatus={selectedTab}
          counts={{ stack: 1, cluster: 0, cell: 0, balancing: 0 }}
          onSelectStatus={(s) => setSelectedTab(s)}
          size="large"
        />

        <div className="mt-4">
          <MonitoringFilters
            query={query}
            onQueryChange={setQuery}
            onSearch={() => {}}
            onReset={() => { setQuery('') }}
            queryPlaceholder="Stack: BMS / 1#Stack"
            controls={(
              <select
                value={selectedStack}
                onChange={(e) => setSelectedStack(e.target.value)}
                className="h-11 w-[280px] rounded-[10px] border border-[#dce4ee] bg-white px-3 text-[14px] placeholder-[#9da9b8] shadow-[0_2px_7px_rgba(15,23,42,0.03)]"
              >
                <option>1#Stack</option>
                <option>2#Stack</option>
                <option>3#Stack</option>
              </select>
            )}
          />
        </div>

        <div className="mt-6">
          <StackCard />
        </div>
      </main>
    </DashboardLayout>
  )
}
