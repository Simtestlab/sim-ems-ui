"use client"

export type OperationBar = {
  startHour: number
  endHour: number
  label: string
  color: string
}

type TimelineAssetRowProps = {
  assetName: string
  operations: OperationBar[]
}

export default function TimelineAssetRow({ assetName, operations }: TimelineAssetRowProps) {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

  return (
    <div className="flex border-b border-[#e6edf5]">
      <div className="w-32 flex-shrink-0 px-4 py-3 border-r border-[#e6edf5] bg-[#f8f9fc] flex items-center">
        <span className="text-[13px] font-medium text-[#0f1724]">{assetName}</span>
      </div>
      <div className="flex-1 relative">
        <div className="grid grid-cols-24 h-full">
          {hours.map((hour) => (
            <div
              key={hour}
              className="border-r border-[#e6edf5] min-w-[40px]"
            />
          ))}
        </div>
        <div className="absolute inset-0 px-1 py-2">
          {operations.map((op, index) => {
            const left = (op.startHour / 24) * 100
            const width = ((op.endHour - op.startHour) / 24) * 100
            return (
              <div
                key={index}
                className="absolute h-7 rounded flex items-center justify-center"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: op.color,
                  border: `1px solid ${op.color}`,
                  opacity: 0.85,
                }}
              >
                <span className="text-[11px] font-medium text-[#0f1724] truncate px-2">
                  {op.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
