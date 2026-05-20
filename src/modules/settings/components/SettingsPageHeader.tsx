"use client"

type SettingsPageHeaderProps = {
  siteName: string
  operatingMode: string
  remoteControl: string
  currentModeRuntime: string
  totalRuntime: string
  onStop: () => void
}

export default function SettingsPageHeader({
  siteName,
  operatingMode,
  remoteControl,
  currentModeRuntime,
  totalRuntime,
  onStop,
}: SettingsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#e6edf5]">
      {/* Left section */}
      <div className="flex items-center gap-8">
        <div>
          <div className="text-[14px] font-semibold text-[#0f1724]">{siteName}</div>
        </div>
        <div>
          <div className="text-[12px] text-[#6b7280]">Operating Mode:</div>
          <div className="text-[14px] font-semibold text-[#0f1724]">{operatingMode}</div>
        </div>
        <div>
          <div className="text-[12px] text-[#6b7280]">Remote Control</div>
          <div className="text-[14px] font-semibold text-[#0f1724]">{remoteControl}</div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        <div>
          <div className="text-[12px] text-[#6b7280]">Current Mode Runtime</div>
          <div className="text-[14px] font-semibold text-[#0f1724]">{currentModeRuntime}</div>
        </div>
        <div>
          <div className="text-[12px] text-[#6b7280]">Total Runtime</div>
          <div className="text-[14px] font-semibold text-[#0f1724]">{totalRuntime}</div>
        </div>
        <button
          onClick={onStop}
          className="h-10 px-6 rounded-md bg-[#dc2626] text-white text-[14px] font-medium hover:bg-[#b91c1c] transition-colors"
        >
          Stop
        </button>
      </div>
    </div>
  )
}
