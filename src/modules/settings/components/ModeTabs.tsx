"use client"

type ModeTabsProps = {
  activeMode: 'manual' | 'auto'
  onModeChange: (mode: 'manual' | 'auto') => void
}

export default function ModeTabs({ activeMode, onModeChange }: ModeTabsProps) {
  return (
    <div className="flex items-center gap-1 px-6 py-3 bg-[#f8f9fc] border-b border-[#e6edf5]">
      <button
        onClick={() => onModeChange('manual')}
        className={`relative px-6 py-2 text-[14px] font-medium transition-colors ${
          activeMode === 'manual'
            ? 'text-[#1890ff]'
            : 'text-[#6b7280] hover:text-[#0f1724]'
        }`}
      >
        Manual
        {activeMode === 'manual' && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1890ff]" />
        )}
      </button>
      <button
        onClick={() => onModeChange('auto')}
        className={`relative px-6 py-2 text-[14px] font-medium transition-colors ${
          activeMode === 'auto'
            ? 'text-[#1890ff]'
            : 'text-[#6b7280] hover:text-[#0f1724]'
        }`}
      >
        Auto
        {activeMode === 'auto' && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1890ff]" />
        )}
      </button>
    </div>
  )
}
