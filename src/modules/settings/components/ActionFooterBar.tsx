"use client"

type ActionFooterBarProps = {
  onSave: () => void
  onEnable: () => void
}

export default function ActionFooterBar({ onSave, onEnable }: ActionFooterBarProps) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-[#e6edf5]">
      <button
        onClick={onSave}
        className="h-10 px-6 rounded-md border border-[#dce4ee] bg-white text-[#0f1724] text-[14px] font-medium hover:bg-[#f8f9fc] transition-colors"
      >
        Save
      </button>
      <button
        onClick={onEnable}
        className="h-10 px-6 rounded-md bg-[#1890ff] text-white text-[14px] font-medium hover:bg-[#0f7ae5] transition-colors"
      >
        Enable
      </button>
    </div>
  )
}
