import { X } from 'lucide-react'

type PVMonitoringBreadcrumbProps = {
  tags: string[]
  onRemoveTag: (tag: string) => void
}

export default function PVMonitoringBreadcrumb({ tags, onRemoveTag }: PVMonitoringBreadcrumbProps) {
  return (
    <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center gap-2">
      {tags.map(tag => (
        <div key={tag} className="flex items-center bg-white border border-[#dce4ee] rounded-[8px] px-2.5 py-1.5 gap-2 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="w-2 h-2 rounded-full bg-[#3b9cff]" />
          <span className="text-[12px] font-medium text-[#4d5f77]">{tag}</span>
          <button aria-label={`close ${tag} tag`} className="text-gray-400 hover:text-gray-600 ml-1 transition-colors" onClick={() => onRemoveTag(tag)}>
            <X className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  )
}