"use client"

import TimelineAssetRow, { OperationBar } from './TimelineAssetRow'

export type AssetSchedule = {
  assetName: string
  operations: OperationBar[]
}

type SchedulerTimelineProps = {
  schedules: AssetSchedule[]
}

export default function SchedulerTimeline({ schedules }: SchedulerTimelineProps) {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] overflow-hidden">
      {/* Hour headers */}
      <div className="flex border-b border-[#e6edf5]">
        <div className="w-32 flex-shrink-0 px-4 py-2 border-r border-[#e6edf5] bg-[#f8f9fc]">
          <span className="text-[12px] font-semibold text-[#6b7280]">ASSET</span>
        </div>
        <div className="flex-1 overflow-x-auto">
          <div className="grid grid-cols-24 min-w-max">
            {hours.map((hour) => (
              <div
                key={hour}
                className="px-2 py-2 border-r border-[#e6edf5] text-center min-w-[40px]"
              >
                <span className="text-[11px] text-[#6b7280]">{hour}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset rows */}
      {schedules.map((schedule, index) => (
        <TimelineAssetRow
          key={index}
          assetName={schedule.assetName}
          operations={schedule.operations}
        />
      ))}
    </div>
  )
}
