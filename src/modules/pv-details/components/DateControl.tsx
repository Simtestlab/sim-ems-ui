"use client"

import React from 'react'
import { CalendarDays } from 'lucide-react'

export default function DateControl({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="inline-flex h-11 min-w-[188px] items-center justify-center gap-3 rounded-[8px] border border-[#d9e2ee] bg-white px-4 text-[12px] font-medium text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CalendarDays className="h-4 w-4 text-[#adb8c7]" />
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-[12px] font-medium text-[#34455d] outline-none"
      />
    </label>
  )
}
