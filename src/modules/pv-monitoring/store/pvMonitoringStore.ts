import { create } from 'zustand'

type Tab = { label: string; route: string }

type State = {
  hoveredId: number | null
  hoveredMetric: string | null
  visitedTabs: Tab[]
  addVisitedTab: (route: string) => void
  removeVisitedTab: (route: string) => void
  clearVisitedTabs: () => void
  setHoveredId: (id: number | null) => void
  setHoveredMetric: (key: string | null) => void
}

export const usePVMonitoringStore = create<State>((set, get) => {
  const loadFromSession = () => {
    if (typeof window === 'undefined') return { tabs: [] as Tab[] }
    try {
      const raw = JSON.parse(sessionStorage.getItem('visitedTabs') || 'null') as Tab[] | null

      // Normalize and collapse detail tabs so there's only one "PV Details" entry.
      const seen = new Set<string>()
      const out: Tab[] = []

      const list = raw ?? []
      // iterate from the end so the last-seen detail route is preserved
      for (let i = list.length - 1; i >= 0; i--) {
        const t = list[i]
        // Migrate legacy short-form routes (pre-/monitor) to canonical /monitor/* paths
        let route = (t.route || '')
          .replace('/pv/pvdetails', '/monitor/pv/details')
          .replace(/^\/pv\/details/, '/monitor/pv/details')
          .replace(/^\/pcs\/details/, '/monitor/pcs/details')
          .replace(/^\/ev\/details/, '/monitor/ev/details')
          .replace(/^\/dashboard$/, '/monitor/overview')
          .replace(/^\/pv$/, '/monitor/pv')
          .replace(/^\/dg$/, '/monitor/dg')
          .replace(/^\/pcs$/, '/monitor/pcs')
          .replace(/^\/ev$/, '/monitor/ev')
          .replace(/^\/tms$/, '/monitor/tms')
          .replace(/^\/fps$/, '/monitor/fps')
          .replace(/^\/meter$/, '/monitor/meter')
          .replace(/^\/data$/, '/monitor/data')
          .replace(/^\/alerts$/, '/monitor/alerts')
        let label = t.label || 'Unknown'

        if (route === '/monitor/overview') label = 'Overview'
        else if (route === '/monitor/pv') label = 'PV'
        else if (route === '/monitor/dg') label = 'DG'
        else if (route.includes('/monitor/pv/details')) label = 'PV Details'
        else if (route === '/monitor/pcs') label = 'PCS'
        else if (route === '/monitor/ev') label = 'EV'
        else if (route === '/monitor/bms') label = 'BMS'
        else if (route === '/monitor/tms') label = 'TMS'
        else if (route === '/monitor/meter') label = 'Meter'
        else if (route === '/monitor/fps') label = 'FPS'
        else if (route === '/monitor/data') label = 'Data'
        else if (route === '/monitor/alerts') label = 'Alerts'
        else if (route === '/system') label = 'System'
        else if (route === '/settings') label = 'Settings'
        else if (route === '/admin/station') label = 'Station'
        else if (route === '/admin/device') label = 'Device'
        else if (route.startsWith('/economics/price')) label = 'Price'
        else if (route.startsWith('/economics/revenue')) label = 'Revenue'
        else if (route.startsWith('/reports/daily')) label = 'Daily'
        else if (route.startsWith('/reports/monthly')) label = 'Monthly'
        else if (route.startsWith('/reports/yearly')) label = 'Yearly'
        else if (route.startsWith('/reports/history')) label = 'History'
        else if (route.startsWith('/reports/plot')) label = 'Plot'
        else if (route.includes('/ev/details')) {
          try {
            const evId = new URL(route, 'http://x').searchParams.get('id')
            if (evId) {
              const low = evId.toLowerCase()
              if (low.includes('#ev')) label = 'EV Details'
              else if (low.includes('#pc')) label = 'PCS Details'
              else label = decodeURIComponent(evId)
            } else {
              label = 'EV Details'
            }
          } catch {
            label = 'EV Details'
          }
        } else if (route.includes('/pcs/details')) {
          try {
            const pcsId = new URL(route, 'http://x').searchParams.get('id')
            if (pcsId) {
              const low = pcsId.toLowerCase()
              if (low.includes('#pc')) label = 'PCS Details'
              else if (low.includes('#ev')) label = 'EV Details'
              else label = decodeURIComponent(pcsId)
            } else {
              label = 'PCS Details'
            }
          } catch {
            label = 'PCS Details'
          }
        }

        // PV and PCS detail tabs collapse to a single slot (keep last-visited route).
        // Other routes keep their full route so they can appear individually.
        // Skip any entry that could not be resolved to a known label — navigating
        // to such a route would produce a 404 page.
        if (label === 'Unknown') continue

        const key = route.includes('/monitor/pv/details') ? '/monitor/pv/details' : route.includes('/monitor/pcs/details') ? '/monitor/pcs/details' : route
        if (!seen.has(key)) {
          seen.add(key)
          out.push({ label, route })
        }
      }

      // restore original order (but with duplicates collapsed)
      const cleaned = out.reverse()
      // Write cleaned list back so stale/unknown entries are immediately purged
      // from sessionStorage and won't reappear on the next reload.
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('visitedTabs', JSON.stringify(cleaned))
      }
      return { tabs: cleaned }
    } catch {
      return { tabs: [] as Tab[] }
    }
  }

  const stored = loadFromSession()

  return {
    hoveredId: null,
    hoveredMetric: null,
    visitedTabs: stored.tabs,

    setHoveredId: (id) => set({ hoveredId: id }),
    setHoveredMetric: (key) => set({ hoveredMetric: key }),

    addVisitedTab: (route) => {
      const current = get().visitedTabs

      if (route.includes('/monitor/pv/details')) {
        // If a PV Details tab already exists, update its route to the new one (keep a single details tab)
        const idx = current.findIndex((t) => t.route.includes('/monitor/pv/details') || t.label === 'PV Details')
        if (idx >= 0) {
          const updated = current.slice()
          updated[idx] = { label: 'PV Details', route }
          set({ visitedTabs: updated })
          if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
          return
        }

        // otherwise add a new PV Details tab
        const updated = [...current, { label: 'PV Details', route }]
        set({ visitedTabs: updated })
        if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
        return
      }

      // EV detail pages — each device gets its own tab (one per route)
      if (route.includes('/monitor/ev/details')) {
        const exists = current.find((t) => t.route === route)
        if (exists) return
        let evLabel = 'EV Details'
        try {
          const evId = new URL(route, 'http://x').searchParams.get('id')
          if (evId) {
            const low = evId.toLowerCase()
            if (low.includes('#ev')) evLabel = 'EV Details'
            else if (low.includes('#pc')) evLabel = 'PCS Details'
            else evLabel = decodeURIComponent(evId)
          }
        } catch { /* empty */ }
        const updated = [...current, { label: evLabel, route }]
        set({ visitedTabs: updated })
        if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
        return
      }

      // DG detail pages — collapse to a single DG Details slot (keep last visited route)
      if (route.includes('/monitor/dg/details')) {
        const idx = current.findIndex((t) => t.route.includes('/monitor/dg/details') || t.label === 'DG Details')
        if (idx >= 0) {
          const updated = current.slice()
          updated[idx] = { label: 'DG Details', route }
          set({ visitedTabs: updated })
          if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
          return
        }

        const updated = [...current, { label: 'DG Details', route }]
        set({ visitedTabs: updated })
        if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
        return
      }

      // PCS detail pages — collapse to a single PCS Details slot (keep last visited route)
      if (route.includes('/monitor/pcs/details')) {
        const idx = current.findIndex((t) => t.route.includes('/monitor/pcs/details') || t.label === 'PCS Details')
        if (idx >= 0) {
          const updated = current.slice()
          updated[idx] = { label: 'PCS Details', route }
          set({ visitedTabs: updated })
          if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
          return
        }

        const updated = [...current, { label: 'PCS Details', route }]
        set({ visitedTabs: updated })
        if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
        return
      }

      let label = 'Unknown'
      if (route === '/monitor/overview' || route === '/dashboard') label = 'Overview'
      else if (route === '/monitor/pv') label = 'PV'
      else if (route === '/monitor/dg') label = 'DG'
      else if (route === '/monitor/pcs') label = 'PCS'
      else if (route === '/monitor/ev') label = 'EV'
      else if (route === '/monitor/bms') label = 'BMS'
      else if (route === '/monitor/tms') label = 'TMS'
      else if (route === '/monitor/meter') label = 'Meter'
      else if (route === '/monitor/fps') label = 'FPS'
      else if (route === '/monitor/data') label = 'Data'
      else if (route === '/monitor/alerts') label = 'Alerts'
      else if (route === '/system') label = 'System'
      else if (route === '/settings') label = 'Settings'
      else if (route === '/admin/station') label = 'Station'
      else if (route === '/admin/device') label = 'Device'
      else if (route.startsWith('/economics/price')) label = 'Price'
      else if (route.startsWith('/economics/revenue')) label = 'Revenue'
      else if (route.startsWith('/reports/daily')) label = 'Daily'
      else if (route.startsWith('/reports/monthly')) label = 'Monthly'
      else if (route.startsWith('/reports/yearly')) label = 'Yearly'
      else if (route.startsWith('/reports/history')) label = 'History'
      else if (route.startsWith('/reports/plot')) label = 'Plot'

      const existingIndex = current.findIndex((t) => t.route === route)
      if (existingIndex >= 0) {
        if (current[existingIndex].label !== label && label !== 'Unknown') {
          const updated = current.slice()
          updated[existingIndex] = { label, route }
          set({ visitedTabs: updated })
          if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
        }
        return
      }

      // Do not create a tab for unrecognised routes
      if (label === 'Unknown') return

      const updated = [...current, { label, route }]
      set({ visitedTabs: updated })
      if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
    },

    removeVisitedTab: (route) => {
      const updated = get().visitedTabs.filter((t) => t.route !== route)
      set({ visitedTabs: updated })
      if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
    },

    clearVisitedTabs: () => {
      set({ visitedTabs: [] })
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('visitedTabs')
      }
    },
  }
})
