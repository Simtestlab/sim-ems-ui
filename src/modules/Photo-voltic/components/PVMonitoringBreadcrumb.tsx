"use client"

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { usePVMonitoringStore } from '@/store/pvMonitoringStore'

export default function PVMonitoringBreadcrumb() {
  const router = useRouter()
  const pathname = usePathname() || ''

  const visitedTabs = usePVMonitoringStore((s) => s.visitedTabs)
  const activeRoute = usePVMonitoringStore((s) => s.activeRoute)
  const addVisitedTab = usePVMonitoringStore((s) => s.addVisitedTab)
  const removeVisitedTab = usePVMonitoringStore((s) => s.removeVisitedTab)
  const setActiveRoute = usePVMonitoringStore((s) => s.setActiveRoute)

  // Keep store activeRoute in sync with actual path
  useEffect(() => {
    const full = typeof window !== 'undefined' ? window.location.pathname + window.location.search : pathname
    setActiveRoute(full)
  }, [pathname, setActiveRoute])

  // When store's activeRoute changes (for example after closing a tab), navigate to it
  useEffect(() => {
    if (!activeRoute) return
    const current = typeof window !== 'undefined' ? window.location.pathname + window.location.search : pathname
    if (activeRoute !== current) router.push(activeRoute)
  }, [activeRoute, pathname, router])

  const tabRefs = useRef<Array<HTMLDivElement | null>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    // auto-scroll active tab into view when it changes
    const idx = visitedTabs.findIndex((t) => t.route === activeRoute || (t.label === 'PV Details' && activeRoute?.includes('pvdetails')))
    if (idx >= 0) {
      const el = tabRefs.current[idx]
      el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeRoute, visitedTabs])

  function handleActivate(tab: { label: string; route: string }) {
    setActiveRoute(tab.route)
    router.push(tab.route)
  }

  function handleClose(tabLabel: string) {
    removeVisitedTab(tabLabel)
  }

  return (
    <div className="px-4 py-2 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {mounted && visitedTabs.map((tab, i) => {
          const isActive = activeRoute === tab.route || (tab.label === 'PV Details' && activeRoute?.includes('pvdetails'))
          return (
            <div
              key={tab.label}
              ref={(el) => { tabRefs.current[i] = el }}
              className={`flex items-center px-2.5 py-1.5 gap-2 rounded-[8px] border shadow-[0_1px_4px_rgba(15,23,42,0.04)] transition-colors cursor-pointer ${isActive ? 'bg-[#e9f3ff] border-[#bcd8ff]' : 'bg-white border-[#dce4ee]'}`}
            >
              <div className="w-2 h-2 rounded-full bg-[#3b9cff]" />
              <button onClick={() => handleActivate(tab)} className="text-[12px] font-medium text-[#4d5f77]">{tab.label}</button>
              {!isActive ? (
                <button aria-label={`close ${tab.label} tab`} onClick={() => handleClose(tab.label)} className="ml-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}