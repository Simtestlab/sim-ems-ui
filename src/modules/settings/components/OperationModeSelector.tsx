"use client"

type OperationModeSelectorProps = {
  value: 'grid-forming' | 'grid-following'
  onChange: (value: 'grid-forming' | 'grid-following') => void
  description?: string
}

export default function OperationModeSelector({
  value,
  onChange,
  description,
}: OperationModeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="text-[13px] font-medium text-[#0f1724]">Operation Mode</div>
      {description && (
        <div className="text-[11px] text-[#6b7280]">{description}</div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange('grid-forming')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${
            value === 'grid-forming'
              ? 'bg-[#1890ff] text-white'
              : 'bg-[#f0f0f0] text-[#6b7280] hover:bg-[#e6e6e6]'
          }`}
        >
          Grid Forming
        </button>
        <button
          onClick={() => onChange('grid-following')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${
            value === 'grid-following'
              ? 'bg-[#1890ff] text-white'
              : 'bg-[#f0f0f0] text-[#6b7280] hover:bg-[#e6e6e6]'
          }`}
        >
          Grid Following
        </button>
      </div>
    </div>
  )
}
