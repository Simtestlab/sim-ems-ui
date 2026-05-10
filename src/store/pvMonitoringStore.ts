import create from 'zustand'

type State = {
  hoveredId: number | null
  hoveredMetric: string | null
  setHoveredId: (id: number | null) => void
  setHoveredMetric: (key: string | null) => void
}

export const usePVMonitoringStore = create<State>((set) => ({
  hoveredId: null,
  hoveredMetric: null,
  setHoveredId: (id) => set({ hoveredId: id }),
  setHoveredMetric: (key) => set({ hoveredMetric: key }),
}))
