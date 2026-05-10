export type StatusTab = {
  key: string
  label: string
}

export type InverterData = {
  id: number
  title: string
  status: string
  branch: string
  activePower: string
  dailyEnergy: string
  loadRatio: string
  dailyEffective: string
  location?: string
}