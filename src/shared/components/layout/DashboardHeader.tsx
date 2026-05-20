"use client"

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Menu } from 'lucide-react'

const SITES = [
  { id: 'gvault', label: 'Gvault Site', capacity: '100kW / 215kWh' },
  { id: 'beta', label: 'Beta Plant', capacity: '250kW / 514kWh' },
]

export type DashboardHeaderProps = {
  sidebarCollapsed: boolean
  currentTimeLabel: string
  onToggleSidebar: () => void
}

/**
 * Top header bar shared across all dashboard pages.
 * Contains: logo, site selector, clock, fullscreen, language and user controls.
 */
export default function DashboardHeader({
  sidebarCollapsed,
  currentTimeLabel,
  onToggleSidebar,
}: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState(SITES[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isDropdownOpen])

  return (
    <header className="h-16 flex items-center text-[13px] z-30 sticky top-0 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      {/* Logo area — unified white background, no dark split */}
      <div
        className={`h-full shrink-0 bg-white border-r border-gray-100 flex items-center transition-all duration-300 ${
          sidebarCollapsed ? 'w-11 justify-center px-0' : 'w-56 px-4'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src="/logo.png"
            alt="Gvault EMS"
            width={32}
            height={32}
            className="shrink-0 object-contain"
            priority
          />
          {!sidebarCollapsed && (
            <span className="text-[14px] font-bold tracking-wide text-slate-800 whitespace-nowrap">Gvault EMS</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between flex-1 h-full bg-white">
        <div className="flex items-center h-full px-4 gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Site selector dropdown */}
          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => setIsDropdownOpen((o) => !o)}
              className="flex items-center bg-white border border-slate-200 rounded-[12px] px-4 h-11 cursor-pointer hover:border-emerald-300 transition-all min-w-[420px] justify-between group shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[15px] text-slate-800 font-semibold">{selectedSite.label}</span>
                <span className="text-[12px] text-slate-400">({selectedSite.capacity})</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-slate-100 z-50 overflow-hidden">
                {SITES.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => { setSelectedSite(site); setIsDropdownOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-emerald-50 hover:text-emerald-700 ${
                      selectedSite.id === site.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${selectedSite.id === site.id ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold leading-tight">{site.label}</span>
                      <span className="text-[12px] text-slate-400">{site.capacity}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 text-gray-600 px-6 h-full">
          <div className="text-slate-400 text-[12px] flex items-center font-medium">
            UTC+8{' '}
            <span suppressHydrationWarning className="ml-3 text-[14px] text-slate-700 font-semibold">
              {currentTimeLabel}
            </span>
          </div>
          <div className="w-px h-5 bg-slate-100" />
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <Image
              src="/logo.png"
              alt="Gvault EMS"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-[12px] font-semibold text-slate-700">Gvault</span>
          </div>
        </div>
      </div>
    </header>
  )
}
