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
        // Normalize legacy/alternate paths (remove /monitor prefix and normalize pv details path)
        let route = (t.route || '').replace('/pv/pvdetails', '/pv/details').replace('/monitor', '')
        let label = t.label || 'Unknown'

        if (route === '/dashboard') label = 'Overview'
        else if (route === '/pv') label = 'PV'
        else if (route === '/dg') label = 'DG'
        else if (route.includes('/pv/details')) label = 'PV Details'
        else if (route === '/pcs') label = 'PCS'
        else if (route === '/ev') label = 'EV'
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
        const key = route.includes('/pv/details') ? '/pv/details' : route.includes('/pcs/details') ? '/pcs/details' : route
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

      // EV detail pages — each device gets its own tab (one per route)
      if (route.includes('/ev/details')) {
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

      // PCS detail pages — collapse to a single PCS Details slot (keep last visited route)
      if (route.includes('/pcs/details')) {
        const idx = current.findIndex((t) => t.route.includes('/pcs/details') || t.label === 'PCS Details')
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
      if (route === '/dashboard') label = 'Overview'
      else if (route === '/pv') label = 'PV'
      else if (route === '/dg') label = 'DG'
      else if (route === '/pcs') label = 'PCS'
      else if (route === '/ev') label = 'EV'

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
