"use client"

type WeekdayTabsProps = {
  selectedDay: string
  onSelectDay: (day: string) => void
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function WeekdayTabs({ selectedDay, onSelectDay }: WeekdayTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-[#e6edf5] px-6 py-3 bg-white">
      {WEEKDAYS.map((day) => (
        <button
          key={day}
          onClick={() => onSelectDay(day)}
          className={`relative px-2 py-2 text-[13px] transition-colors ${
            selectedDay === day ? 'text-[#0f1724] font-semibold' : 'text-[#6b7280] font-medium hover:text-[#0f1724]'
          }`}
        >
          {day}
          {selectedDay === day && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0f1724]" />
          )}
        </button>
      ))}
    </div>
  )
}
