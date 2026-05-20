"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { usePVMonitoringStore as useNavigationStore } from '@/modules/pv-monitoring/store/pvMonitoringStore'
import { SIDEBAR_ITEMS, SIDEBAR_SUB_ITEMS, SIDEBAR_SUB_ITEMS_MAP, SIDEBAR_ROUTE_MAP } from '@/config/navigation/sidebar'

export type DashboardSidebarProps = {
  sidebarCollapsed: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
}

/** Returns the top-level menu key that owns `activeTab` as a sub-item. */
function getParentMenu(tab: string): string | null {
  for (const [parent, subs] of Object.entries(SIDEBAR_SUB_ITEMS_MAP)) {
    if (subs.includes(tab)) return parent
  }
  return null
}

/** Checks if a parent menu has an active submenu item. */
function hasActiveSubmenu(menuKey: string, activeTab: string): boolean {
  const subItems = SIDEBAR_SUB_ITEMS_MAP[menuKey]
  return subItems ? subItems.includes(activeTab) : false
}

/**
 * Left navigation sidebar shared across all dashboard pages.
 * Items and routes are driven by config/navigation/sidebar.ts.
 */
export default function DashboardSidebar({
  sidebarCollapsed,
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(getParentMenu(activeTab) ?? 'Monitoring')
  const router = useRouter()
  const addVisitedTab = useNavigationStore((s) => s.addVisitedTab)

  function navigate(key: string) {
    setActiveTab(key)
    const routePath = SIDEBAR_ROUTE_MAP[key]
    if (routePath) {
      try {
        addVisitedTab(routePath)
        router.push(routePath)
      } catch {
        /* ignore */
      }
    }
  }

  function prefetchRoute(key: string) {
    const routePath = SIDEBAR_ROUTE_MAP[key]
    if (routePath) {
      try {
        router.prefetch(routePath)
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <aside
      className={`transition-all duration-300 ease-in-out flex flex-col overflow-hidden shrink-0 z-20 self-stretch ${
        sidebarCollapsed ? 'w-[44px]' : 'w-[222px]'
      } bg-white border-r border-slate-100 text-slate-500`}
    >
      {/* NAVIGATION SECTION */}
      <nav className="flex-1 pt-2 overflow-y-auto scrollbar-thin">
        <ul className="space-y-0.5">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const isOpen = item.hasChildren && openMenu === item.key
            const isDirectlyActive = item.key === activeTab
            const hasActiveSub = hasActiveSubmenu(item.key, activeTab)
            const isActive = isDirectlyActive || hasActiveSub

            return (
              <li key={item.key}>
                <div className="flex flex-col">
                  {/* MAIN MENU ITEM */}
                  <button
                    onClick={() => {
                      if (item.hasChildren) {
                        setOpenMenu((prev) => (prev === item.key ? null : item.key))
                      } else {
                        navigate(item.key)
                      }
                    }}
                    onMouseEnter={() => {
                      if (!item.hasChildren) prefetchRoute(item.key)
                    }}
                    className={`
                      w-full flex items-center transition-all duration-200 group relative
                      ${sidebarCollapsed 
                        ? 'justify-center px-0 py-3.5' 
                        : 'justify-between px-3 py-2 mx-1.5 !w-[calc(100%-12px)] rounded-lg'
                      }
                      ${isDirectlyActive
                        ? 'bg-emerald-50 text-emerald-600 font-semibold shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        className={`
                          w-5 h-5 shrink-0 transition-colors duration-200
                          ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-900'}
                        `} 
                      />
                      {!sidebarCollapsed && (
                        <span className="text-[13px] font-medium">
                          {item.label}
                        </span>
                      )}
                    </div>
                    {!sidebarCollapsed && item.hasChildren && (
                      <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </button>

                  {/* SUBMENU SECTION */}
                  {!sidebarCollapsed && item.hasChildren && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                      <ul className="py-1">
                        {(SIDEBAR_SUB_ITEMS_MAP[item.key] ?? SIDEBAR_SUB_ITEMS).map((sub) => {
                          const isSubActive = sub === activeTab
                          return (
                            <li key={sub}>
                              <button
                                onClick={() => navigate(sub)}
                                onMouseEnter={() => prefetchRoute(sub)}
                                className={`
                                  text-left pl-10 pr-3 py-1.5 text-[13px] mx-1.5 
                                  w-[calc(100%-12px)] rounded-lg
                                  transition-all duration-200 relative
                                  ${isSubActive
                                    ? 'bg-emerald-50 text-emerald-600 font-medium'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                  }
                                `}
                              >
                                {sub}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
