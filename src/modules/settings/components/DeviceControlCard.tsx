"use client"

type DeviceControlCardProps = {
  title: string
  children: React.ReactNode
}

export default function DeviceControlCard({ title, children }: DeviceControlCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] shadow-sm">
      <div className="px-5 py-3 border-b border-[#e6edf5]">
        <h3 className="text-[16px] font-semibold text-[#0f1724]">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
