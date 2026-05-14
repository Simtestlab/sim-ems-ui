"use client"

import MetricTile from './MetricTile'

type Metric = {
  id: string
  label: string
  value: React.ReactNode
  unit?: string
}

type Props = {
  metrics?: Metric[]
}

export default function RealtimeMetrics({ metrics }: Props) {
  const defaults: Metric[] = [
    { id: 'soc', label: 'SOC', value: '51.2', unit: '%' },
    { id: 'soh', label: 'SOH', value: '98.4', unit: '%' },
    { id: 'voltage', label: 'Pack Voltage', value: '616.2', unit: 'V' },
    { id: 'current', label: 'Pack Current', value: '129.8', unit: 'A' },
    { id: 'power', label: 'Pack Power', value: '80', unit: 'kW' },
    { id: 'energy', label: 'Available Energy', value: '263.2', unit: 'kWh' },
    { id: 'temp', label: 'Average Temperature', value: '29.3', unit: '°C' },
    { id: 'insulation', label: 'Insulation Resistance', value: '548', unit: 'kOhm' },
  ]

  const list = metrics ?? defaults

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {list.map((m) => (
        <MetricTile key={m.id} label={m.label} value={m.value} unit={m.unit} />
      ))}
    </div>
  )
}
