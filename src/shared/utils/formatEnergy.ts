export function formatEnergy(value: number, unit: 'kWh' | 'MWh' = 'kWh'): string {
  if (unit === 'MWh' && value >= 1000) {
    return `${(value / 1000).toFixed(2)} MWh`
  }
  return `${value.toFixed(2)} ${unit}`
}

export function formatPower(value: number, unit: 'kW' | 'MW' = 'kW'): string {
  if (unit === 'MW' && value >= 1000) {
    return `${(value / 1000).toFixed(2)} MW`
  }
  return `${value.toFixed(2)} ${unit}`
}
