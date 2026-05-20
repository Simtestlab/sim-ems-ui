"use client"

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { usePVMonitoringStore } from '@/modules/pv-monitoring/store/pvMonitoringStore'

export default function BreadcrumbNavigation() {
  const router = useRouter()
  const pathname = usePathname() || ''
  
  const visitedTabs = usePVMonitoringStore((s) => s.visitedTabs)
  const removeVisitedTab = usePVMonitoringStore((s) => s.removeVisitedTab)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<Array<HTMLDivElement | null>>([])

  // Get current route for active state
  const [currentRoute, setCurrentRoute] = useState(() => pathname)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const search = typeof window !== 'undefined' ? window.location.search : ''
    setCurrentRoute(pathname + (search || ''))
  }, [pathname])

  useEffect(() => {
    const activeIdx = visitedTabs.findIndex((t) => t.route === currentRoute)
    if (activeIdx >= 0) {
      const el = tabRefs.current[activeIdx]
      const container = containerRef.current
      if (!el || !container) return

      const elRect = el.getBoundingClientRect()
      const contRect = container.getBoundingClientRect()

      const fullyVisible = elRect.left >= contRect.left && elRect.right <= contRect.right
      if (!fullyVisible) {
        // scroll minimally to reveal the tab without recentering
        el.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
      }
    }
  }, [currentRoute, visitedTabs])

  function handleActivate(tab: { label: string; route: string }) {
    router.push(tab.route)
  }

  function handleClose(tabRoute: string, e: React.MouseEvent) {
    e.stopPropagation()
    removeVisitedTab(tabRoute)

    // if the closed tab was active, navigate to the last remaining tab or back to /pv
    if (tabRoute === currentRoute) {
      const remaining = visitedTabs.filter((t) => t.route !== tabRoute)
      const next = remaining.length ? remaining[remaining.length - 1].route : '/monitor/pv'
      router.push(next)
    }
  }

  if (!isMounted) {
    return (
      <div className="bg-white border-b border-[#e8edf4] h-11" />
    )
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onMouseDown={() => containerRef.current?.focus()}
      className="bg-white border-b border-[#e8edf4] overflow-x-auto overflow-y-hidden breadcrumb-scrollbar"
    >
      <div className="flex items-center h-12 px-4 gap-2 min-w-max">
        {visitedTabs.map((tab, idx) => {
          const isActive = tab.route === currentRoute
          return (
            <div
              key={tab.route}
              ref={(el) => { tabRefs.current[idx] = el }}
              className={`group flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-150 cursor-pointer ${
                isActive ? 'bg-[#e6f4ff] text-[#1677ff]' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => handleActivate(tab)}
            >
              <span className="text-[13px] font-medium whitespace-nowrap">{tab.label}</span>
              <button
                onClick={(e) => handleClose(tab.route, e)}
                className={`p-1 rounded hover:bg-gray-200 transition-colors ${isActive ? 'text-[#1677ff]' : 'text-gray-400'}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
