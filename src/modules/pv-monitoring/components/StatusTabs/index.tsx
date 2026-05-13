import BranchIcon from '@/shared/components/pv/BranchIcon'
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
    <div className="px-4 border-b border-[#e9eef5] bg-white sticky top-0 z-10 overflow-visible shadow-sm">
      <div className="flex items-center gap-5 text-[14px] whitespace-nowrap min-w-max w-full">
        {statusTabs.map(tab => (
          <button 
            key={tab.key} 
            onClick={() => onSelectStatus(tab.key)} 
            className={`py-3 px-0 relative transition-all group whitespace-nowrap ${selectedStatus === tab.key ? 'text-[#2f8cf0] font-semibold' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedStatus === tab.key ? 'bg-[#eef5ff] text-[#7aa6e8]' : 'bg-[#f2f4f7] text-[#9aa6b5]'}`}>
                {counts[tab.key] ?? 0}
              </span>
            </span>
            {selectedStatus === tab.key && <div className="absolute left-0 w-full bottom-0 h-[2px] bg-[#2f8cf0]" />}
          </button>
        ))}

        <div className="flex items-center gap-4 ml-auto pl-8 text-[13px] whitespace-nowrap">
          <span className="text-[#66768b] font-semibold whitespace-nowrap">Branch Status:</span>
          {BRANCH_FILTERS.map(filter => (
            <Tooltip key={filter.key} content={filter.label} className="cursor-default">
              <div className="flex items-center gap-1.5 whitespace-nowrap select-none">
                <BranchIcon className={`${filter.className} w-3 h-3`} />
                <span className="text-[13px] font-medium text-[#56667c]">{filter.label}</span>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  )
}
