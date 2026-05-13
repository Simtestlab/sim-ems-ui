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
        let route = (t.route || '').replace('/pv/pvdetails', '/pv/details')
        let label = t.label || 'Unknown'

        if (route === '/pv') label = 'PV Monitoring'
        else if (route.includes('/pv/details')) label = 'PV Details'

        const key = route.includes('/pv/details') ? '/pv/details' : route
        if (!seen.has(key)) {
          seen.add(key)
          out.push({ label, route })
        }
      }

      // restore original order (but with duplicates collapsed)
      return { tabs: out.reverse() }
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

      if (route.includes('/pv/details')) {
        // If a PV Details tab already exists, update its route to the new one (keep a single details tab)
        const idx = current.findIndex((t) => t.route.includes('/pv/details') || t.label === 'PV Details')
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

      const exists = current.find((t) => t.route === route)
      if (exists) return

      let label = 'Unknown'
      if (route === '/pv') label = 'PV Monitoring'

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
