"use client"

type LegendItem = {
  label: string
  color: string
}

type SchedulerLegendProps = {
  items: LegendItem[]
}

export default function SchedulerLegend({ items }: SchedulerLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-white border-b border-[#e6edf5]">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[12px] text-[#6b7280]">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
