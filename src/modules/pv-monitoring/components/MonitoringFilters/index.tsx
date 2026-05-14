"use client";

import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import SharedMonitoringFilters from '@/shared/components/monitoring/Filters'

type MonitoringFiltersProps = {
  query: string
  location: string
  locations: string[]
  onQueryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export default function MonitoringFilters({ 
  query, 
  location, 
  locations, 
  onQueryChange, 
  onLocationChange, 
  onSearch, 
  onReset 
}: MonitoringFiltersProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <SharedMonitoringFilters
      query={query}
      onQueryChange={onQueryChange}
      onSearch={onSearch}
      onReset={onReset}
      controls={
        <div className="flex h-11 items-center gap-3 rounded-[10px] border border-[#dce4ee] bg-white px-4 shadow-[0_2px_7px_rgba(15,23,42,0.03)]">
          <span className="text-[13px] font-semibold text-[#5f6f85]">Installation Location:</span>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex h-8 w-[196px] items-center justify-between rounded px-1 text-[14px] text-gray-500 transition-all group"
            >
              <span className={`font-medium ${location ? 'text-gray-700' : 'text-[#8f9db0]'}`}>{location || 'Please Select'}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform group-hover:text-[#1890ff] ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen ? (
              <div className="absolute left-0 top-11 z-20 w-[196px] rounded-md border border-gray-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onLocationChange('')
                    setDropdownOpen(false)
                  }}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] transition-colors ${location === '' ? 'bg-[#e6f4ff] text-[#1890ff]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Please Select
                </button>
                {locations.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onLocationChange(option)
                      setDropdownOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] transition-colors ${location === option ? 'bg-[#e6f4ff] text-[#1890ff]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      }
    />
  )
}
