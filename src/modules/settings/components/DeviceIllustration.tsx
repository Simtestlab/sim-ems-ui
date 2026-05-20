"use client"

import { Power, PowerOff } from 'lucide-react'

type DeviceIllustrationProps = {
  deviceName: string
  isPowered: boolean
  onPowerOn: () => void
  onPowerOff: () => void
  illustrationContent?: React.ReactNode
}

export default function DeviceIllustration({
  deviceName,
  isPowered,
  onPowerOn,
  onPowerOff,
  illustrationContent,
}: DeviceIllustrationProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* Device illustration placeholder */}
      <div className="w-32 h-32 flex items-center justify-center">
        {illustrationContent || (
          <div className="w-full h-full bg-[#f0f4f8] rounded-lg flex items-center justify-center text-[#9aa4b2] text-[12px]">
            {deviceName}
          </div>
        )}
      </div>

      {/* Power controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPowerOn}
          className={`flex flex-col items-center gap-1 group ${
            isPowered ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isPowered
                ? 'bg-[#1890ff] text-white'
                : 'bg-[#e6edf5] text-[#6b7280] group-hover:bg-[#d9e3f0]'
            }`}
          >
            <Power className="w-5 h-5" />
          </div>
          <span className="text-[11px] text-[#6b7280]">Power On</span>
        </button>

        <button
          onClick={onPowerOff}
          className={`flex flex-col items-center gap-1 group ${
            !isPowered ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              !isPowered
                ? 'bg-[#1890ff] text-white'
                : 'bg-[#e6edf5] text-[#6b7280] group-hover:bg-[#d9e3f0]'
            }`}
          >
            <PowerOff className="w-5 h-5" />
          </div>
          <span className="text-[11px] text-[#6b7280]">Power Off</span>
        </button>
      </div>
    </div>
  )
}
