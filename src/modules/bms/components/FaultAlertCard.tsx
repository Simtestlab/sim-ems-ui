"use client"

import { AlertTriangle, Bell } from 'lucide-react'

type FaultAlertCardProps = {
  label: string
  value: number | string
  icon?: 'fault' | 'alert'
}

export default function FaultAlertCard({ label, value, icon = 'fault' }: FaultAlertCardProps) {
  const Icon = icon === 'fault' ? AlertTriangle : Bell

  return (
    <div className="flex items-center gap-3 w-full sm:w-[200px] rounded-[10px] border border-[#e6edf5] bg-white px-3 py-2 shadow-[0_2px_7px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-center h-9 w-9 rounded-md bg-[#fbfdff] border border-[#eef4fb] text-[#6b7280]">
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1">
        <div className="text-[13px] font-medium text-[#7b8896]">{label}</div>
        <div className="text-[18px] font-semibold text-[#111827] mt-1">{value}</div>
      </div>
    </div>
  )
}
