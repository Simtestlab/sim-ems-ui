"use client";

import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
    <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-4 shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <input
              type="text"
              placeholder="Equipment Name"
              value={query}
              onChange={event => onQueryChange(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  onSearch()
                }
              }}
              className="border border-[#dce4ee] bg-white rounded-[10px] px-4 h-11 text-[14px] w-[330px] placeholder-[#c0cad6] focus:outline-none focus:ring-2 focus:ring-[#1890ff]/15 focus:border-[#1890ff] transition-all shadow-[0_2px_7px_rgba(15,23,42,0.03)]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1890ff] transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[10px] border border-[#dce4ee] bg-white px-4 h-11 shadow-[0_2px_7px_rgba(15,23,42,0.03)]">
          <span className="text-[13px] font-semibold text-[#5f6f85]">Installation Location:</span>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(prev => !prev)}
              className="rounded px-1 h-8 flex items-center justify-between w-[196px] text-[14px] text-gray-500 cursor-pointer transition-all group"
            >
              <span className={`font-medium ${location ? 'text-gray-700' : 'text-[#8f9db0]'}`}>{location || 'All Locations'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-[#1890ff] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-11 z-20 w-[196px] rounded-md border border-gray-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onLocationChange('')
                    setDropdownOpen(false)
                  }}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] transition-colors ${location === '' ? 'bg-[#e6f4ff] text-[#1890ff]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Locations
                </button>
                {locations.map(option => (
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
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onSearch} className="bg-[#2f8cf0] hover:bg-[#4a9df4] text-white h-11 px-8 rounded-[10px] text-[14px] font-semibold transition-all shadow-[0_4px_12px_rgba(47,140,240,0.24)]">Search</button>
          <button onClick={onReset} className="bg-white border border-[#dce4ee] hover:border-gray-400 h-11 px-6 rounded-[10px] text-[14px] font-semibold text-[#617187] transition-all shadow-[0_2px_7px_rgba(15,23,42,0.03)]">Reset</button>
        </div>
      </div>
    </div>
  )
}
