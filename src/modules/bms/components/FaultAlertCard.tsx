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
    <div className="flex items-center gap-3 w-full sm:w-[220px] rounded-[10px] border border-[#eef3f7] bg-white px-4 py-3 shadow-[0_2px_7px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#fbfcfe] border border-[#eef4fb] text-[#6b7280]">
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1">
        <div className="text-[13px] text-[#7b8896]">{label}</div>
        <div className="text-[20px] font-semibold text-[#111827] mt-1">{value}</div>
      </div>
    </div>
  )
}
