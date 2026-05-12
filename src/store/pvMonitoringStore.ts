import { create } from 'zustand'

type Tab = { label: string; route: string }

type State = {
  hoveredId: number | null
  hoveredMetric: string | null
  visitedTabs: Tab[]
  activeRoute: string | null
  addVisitedTab: (route: string) => void
  removeVisitedTab: (label: string) => void
  setActiveRoute: (route: string | null) => void
  clearVisitedTabs: () => void
  setHoveredId: (id: number | null) => void
  setHoveredMetric: (key: string | null) => void
}

export const usePVMonitoringStore = create<State>((set, get) => {
  const loadFromSession = () => {
    if (typeof window === 'undefined') return { tabs: [] as Tab[], active: null as string | null }
    try {
      const tabs = JSON.parse(sessionStorage.getItem('visitedTabs') || 'null') as Tab[] | null
      const active = sessionStorage.getItem('activeRoute') || null
      return { tabs: tabs ?? [], active }
    } catch {
      return { tabs: [] as Tab[], active: null }
    }
  }

  const stored = loadFromSession()

  const getLabelForRoute = (r: string) => {
    const path = r.split('?')[0]
    const segs = path.split('/').filter(Boolean)
    if (r.includes('pvdetails') || r.includes('/pv/details')) return 'PV Details'
    if (segs[0] === 'pv') return 'PV'
    if (segs.length === 0) return r
    return segs[0].charAt(0).toUpperCase() + segs[0].slice(1)
  }

  return {
    hoveredId: null,
    hoveredMetric: null,
    visitedTabs: stored.tabs,
    activeRoute: stored.active,

    addVisitedTab: (route: string) => {
      const label = getLabelForRoute(route)
      set((state) => {
        const existsIndex = state.visitedTabs.findIndex((t) => t.label === label)
        if (existsIndex !== -1) {
          // update route for existing tab (useful for PV Details to remember last id)
          const updated = [...state.visitedTabs]
          updated[existsIndex] = { label, route }
          if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
          if (typeof window !== 'undefined') sessionStorage.setItem('activeRoute', route)
          return { visitedTabs: updated, activeRoute: route }
        }

        const newTabs = [...state.visitedTabs, { label, route }]
        if (typeof window !== 'undefined') sessionStorage.setItem('visitedTabs', JSON.stringify(newTabs))
        if (typeof window !== 'undefined') sessionStorage.setItem('activeRoute', route)
        return { visitedTabs: newTabs, activeRoute: route }
      })
    },

    removeVisitedTab: (label: string) => {
      set((state) => {
        const idx = state.visitedTabs.findIndex((t) => t.label === label)
        if (idx === -1) return {}
        const updated = state.visitedTabs.filter((t) => t.label !== label)
        let newActive = state.activeRoute
        if (state.activeRoute && state.visitedTabs[idx] && state.visitedTabs[idx].label === label) {
          const prev = updated[idx - 1] ?? updated[0]
          newActive = prev?.route ?? '/pv'
        }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('visitedTabs', JSON.stringify(updated))
          sessionStorage.setItem('activeRoute', newActive ?? '')
        }
        return { visitedTabs: updated, activeRoute: newActive }
      })
    },

    setActiveRoute: (route: string | null) => {
      set(() => {
        if (typeof window !== 'undefined') sessionStorage.setItem('activeRoute', route ?? '')
        return { activeRoute: route }
      })
    },

    clearVisitedTabs: () => {
      set(() => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('visitedTabs')
          sessionStorage.removeItem('activeRoute')
        }
        return { visitedTabs: [], activeRoute: null }
      })
    },

    setHoveredId: (id) => set({ hoveredId: id }),
    setHoveredMetric: (key) => set({ hoveredMetric: key }),
  }
})
