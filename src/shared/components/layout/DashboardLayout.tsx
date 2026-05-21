"use client"

import React, { useEffect, useState } from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import BreadcrumbNavigation from '@/modules/pv-monitoring/components/BreadcrumbNavigation'
import { formatDateTime } from '@/shared/utils/formatDateTime'
import { usePVMonitoringStore as useNavigationStore } from '@/modules/pv-monitoring/store/pvMonitoringStore'

export type DashboardLayoutProps = {
  /** Child content rendered inside the main scrollable area. */
  children: React.ReactNode
  /**
   * The sidebar sub-item key that should be highlighted on mount.
   * Matches a value in SIDEBAR_SUB_ITEMS, e.g. "PV", "PCS", "Overview".
   */
  initialActiveTab?: string
  /**
   * When provided, this route is registered in the breadcrumb tab bar on mount.
   */
  visitedRoute?: string
  /** Optional page-level status bar (secondary tabs) provided by the page. */
  statusBar?: React.ReactNode
  /** Optional search / controls row (search column) provided by the page. */
  searchColumn?: React.ReactNode
}

/**
 * Canonical reusable dashboard layout.
 *
 * Renders the shared header, collapsible sidebar, breadcrumb tab bar and a
 * flex column that stretches to fill the viewport.  Page-specific content
 * (filters, status tabs, card grids, charts…) is passed as `children`.
 *
 * Usage:
 * ```tsx
 * <DashboardLayout title="PV Monitoring" initialActiveTab="PV" visitedRoute="/monitor/pv">
 *   <PVMonitoringContent />
 * </DashboardLayout>
 * ```
 */
export default function DashboardLayout({
  children,
  initialActiveTab = 'PV',
  visitedRoute,
  statusBar,
  searchColumn,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState(initialActiveTab)
  const [currentTime, setCurrentTime] = useState(new Date())

  const addVisitedTab = useNavigationStore((s) => s.addVisitedTab)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (visitedRoute) addVisitedTab(visitedRoute)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitedRoute])

  return (
    <div className="h-full bg-[#f7fbfc] font-sans text-gray-800 flex flex-col text-[14px]">
      <DashboardHeader
        sidebarCollapsed={sidebarCollapsed}
        currentTimeLabel={formatDateTime(currentTime)}
        onToggleSidebar={() => setSidebarCollapsed((s) => !s)}
      />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          sidebarCollapsed={sidebarCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 min-w-0 overflow-hidden flex flex-col bg-[#f5f7fa]">
          <BreadcrumbNavigation />

          {statusBar ? statusBar : null}
          {searchColumn ? searchColumn : null}

          {children}
        </div>
      </div>
    </div>
  )
}
