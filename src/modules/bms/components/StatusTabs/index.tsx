"use client"

import SharedMonitoringStatusTabs from '@/shared/components/monitoring/StatusTabs'

type StatusTabItem = { key: string; label: string }

type Props = {
  statusTabs: StatusTabItem[]
  selectedStatus: string
  counts: Record<string, number>
  onSelectStatus: (status: string) => void
}

export default function StatusTabs({ statusTabs, selectedStatus, counts, onSelectStatus }: Props) {
  return (
    <SharedMonitoringStatusTabs
      statusTabs={statusTabs}
      selectedStatus={selectedStatus}
      counts={counts}
      onSelectStatus={onSelectStatus}
      size="large"
    />
  )
}
