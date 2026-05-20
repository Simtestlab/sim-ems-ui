import SharedMonitoringStatusTabs from '@/shared/components/monitoring/StatusTabs'
import type { StatusTab } from '@/modules/pv-monitoring/types'

type PCSStatusTabsProps = {
  statusTabs: StatusTab[]
  selectedStatus: string
  counts: Record<string, number>
  onSelectStatus: (status: string) => void
}

export default function PCSStatusTabs({
  statusTabs,
  selectedStatus,
  counts,
  onSelectStatus,
}: PCSStatusTabsProps) {
  const pcsStatusTabs = statusTabs.some((tab) => tab.key === 'startingUp')
    ? statusTabs
    : [...statusTabs, { key: 'startingUp', label: 'Starting Up' }]

  return (
    <SharedMonitoringStatusTabs
      statusTabs={pcsStatusTabs}
      selectedStatus={selectedStatus}
      counts={counts}
      onSelectStatus={onSelectStatus}
    />
  )
}
