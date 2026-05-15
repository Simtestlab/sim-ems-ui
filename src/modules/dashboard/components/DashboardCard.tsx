"use client"

import React from 'react'
import { Settings } from 'lucide-react'

type Props = {
  title: React.ReactNode
  settings?: boolean
  headerRight?: React.ReactNode
  children?: React.ReactNode
  className?: string
  compact?: boolean
}
export default function DashboardCard({ title, settings = false, headerRight, children, className = '', compact = false }: Props) {
  const paddingClass = compact ? 'p-3' : 'p-6'
  const headerMb = compact ? 'mb-3' : 'mb-5'
  const titleSize = compact ? 'text-[18px]' : 'text-[22px]'

  return (
    <section className={`flex flex-col h-full rounded-none border border-[#e6edf5] bg-white ${paddingClass} shadow-[0_6px_24px_rgba(15,23,42,0.04)] ${className}`}>
      <header className={`flex items-start justify-between ${headerMb} gap-4`}>
        <h3 className={`${titleSize} font-semibold tracking-tight text-[#0f1724]`}>{title}</h3>

        <div className="ml-auto flex items-center gap-3">
          {headerRight}
          {settings ? (
            <button type="button" className="h-8 w-8 inline-flex items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f4f7fb]">
              <Settings className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </header>

      <div className="flex-1 overflow-hidden text-sm text-[#263245]">{children}</div>
    </section>
  )
}
