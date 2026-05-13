export interface InverterData {
  id: number
  title: string
  status: string
  branch: string
  location: string
  activePower: string | number
  dailyEnergy: string | number
  loadRatio: string | number
  dailyEffective: string | number
}

export type StatusTab = {
  key: string
  label: string
}

export type Tab = {
  label: string
  route: string
}
