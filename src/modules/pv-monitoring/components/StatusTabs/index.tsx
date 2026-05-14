import BranchIcon from '@/shared/components/pv/BranchIcon'
import SharedMonitoringStatusTabs from '@/shared/components/monitoring/StatusTabs'
import Tooltip from '@/shared/components/ui/Tooltip'
import type { StatusTab } from '@/modules/pv-monitoring/types'

const BRANCH_FILTERS = [
  { key: 'normal', label: 'Normal', className: 'text-[#52c41a]' },
  { key: 'low', label: 'Low Output', className: 'text-yellow-500' },
  { key: 'zero', label: 'Zero Output', className: 'text-red-500' },
  { key: 'disconnected', label: 'Disconnected', className: 'text-gray-400' },
] as const

type StatusTabsProps = {
  statusTabs: StatusTab[]
  selectedStatus: string
  counts: Record<string, number>
  onSelectStatus: (status: string) => void
}

export default function StatusTabs({ 
  statusTabs, 
  selectedStatus, 
  counts, 
  onSelectStatus 
}: StatusTabsProps) {
  return (
    <SharedMonitoringStatusTabs
      statusTabs={statusTabs}
      selectedStatus={selectedStatus}
      counts={counts}
      onSelectStatus={onSelectStatus}
      secondaryRow={
        <div className="flex flex-wrap items-center gap-4 whitespace-nowrap">
          <span className="font-semibold text-[#66768b]">Branch Status:</span>
          {BRANCH_FILTERS.map((filter) => (
            <Tooltip key={filter.key} content={filter.label} className="cursor-default">
              <div className="flex select-none items-center gap-1.5 whitespace-nowrap">
                <BranchIcon className={`${filter.className} h-3 w-3`} />
                <span className="text-[13px] font-medium text-[#56667c]">{filter.label}</span>
              </div>
            </Tooltip>
          ))}
        </div>
      }
    />
  )
}
