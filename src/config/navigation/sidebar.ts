import { Network, Settings, BarChart2, LayoutGrid, LineChart, JapaneseYen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type SidebarItem = {
  key: string
  icon: LucideIcon
  label: string
  hasChildren?: boolean
}

/**
 * Top-level sidebar navigation items.
 */
export const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: 'System', icon: Network, label: 'System' },
  { key: 'Settings', icon: Settings, label: 'Settings' },
  { key: 'Monitoring', icon: BarChart2, label: 'Monitoring', hasChildren: true },
  { key: 'Reports', icon: LayoutGrid, label: 'Reports', hasChildren: true },
  { key: 'Economics', icon: LineChart, label: 'Economics', hasChildren: true },
  { key: 'Admin', icon: JapaneseYen, label: 'Admin', hasChildren: true },
]

/**
 * Sub-items shown under collapsible sections.
 */
export const SIDEBAR_SUB_ITEMS: string[] = [
  'Overview',
  'PV',
  'PCS',
  'BMS',
  'DG',
  'EV',
  'Meter',
  'TMS',
  'FPS',
  'Data',
  'Alerts',
]

/**
 * Per-top-level submenu lists. Keys match items in `SIDEBAR_ITEMS`.
 * Use this to render different child menus for Reporting/Economics/Admin.
 */
export const SIDEBAR_SUB_ITEMS_MAP: Record<string, string[]> = {
  Monitoring: ['Overview', 'PV', 'PCS', 'BMS', 'DG', 'EV', 'Meter', 'TMS', 'FPS', 'Data', 'Alerts'],
  Reports: ['Daily', 'Monthly', 'Yearly', 'History', 'Plot'],
  Economics: ['Price', 'Revenue'],
  Admin: ['Station', 'Device'],
}

/**
 * Mapping from sub-item label → Next.js route path.
 * Only items with a defined route will trigger navigation.
 */
export const SIDEBAR_ROUTE_MAP: Record<string, string> = {
  System: '/system',
  Settings: '/settings',
  Overview: '/monitor/overview',
  PV: '/monitor/pv',
  PCS: '/monitor/pcs',
  BMS: '/monitor/bms',
  EV: '/monitor/ev',
  DG: '/monitor/dg',
  Meter: '/monitor/meter',
  TMS: '/monitor/tms',
  FPS: '/monitor/fps',
  Data: '/monitor/data',
  Alerts: '/monitor/alerts',
  Price: '/economics/price',
  Revenue: '/economics/revenue',
  Daily: '/reports/daily',
  Monthly: '/reports/monthly',
  Yearly: '/reports/yearly',
  History: '/reports/history',
  Plot: '/reports/plot',
  Station: '/admin/station',
  Device: '/admin/device',
}
