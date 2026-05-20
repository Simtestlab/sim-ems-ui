"use client"

type PriceScheduleBar = {
  startHour: number
  endHour: number
  color?: string
}

type PriceSchedulerTimelineProps = {
  schedule: PriceScheduleBar
}

export default function PriceSchedulerTimeline({ schedule }: PriceSchedulerTimelineProps) {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00')

  const left = (schedule.startHour / 24) * 100
  const width = ((schedule.endHour - schedule.startHour) / 24) * 100
  const barColor = schedule.color || '#52c41a'

  return (
    <div className="bg-white border border-[#e6edf5] rounded px-4 py-3">
      {/* Hour markers */}
      <div className="relative">
        <div className="grid grid-cols-24 text-[10px] text-[#6b7280] mb-3">
          {hours.map((hour) => (
            <div key={hour} className="text-center">
              {hour}
            </div>
          ))}
        </div>

        {/* Timeline track (rounded-rectangle style) */}
        <div className="relative h-16 bg-[#f5f5f5] rounded-lg px-3 py-3">
          {/* Inner track background */}
          <div className="absolute inset-3 bg-white rounded-lg shadow-inner z-0" />

          {/* Hour ticks overlay (one tick per hour) */}
          <div className="absolute inset-3 pointer-events-none z-10">
            {hours.map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${(i / 24) * 100}%` }}
              >
                <div className="w-px h-4 bg-[#0f1724] opacity-20" />
              </div>
            ))}
          </div>

          {/* Schedule bar (rounded rectangle, no handles) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-10 rounded-lg z-20"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              backgroundColor: barColor,
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
