"use client"

type Metric = { id: string; label: string; value: React.ReactNode; unit?: string }

type Props = { metrics?: Metric[] }

export default function RealtimeDataCard({ metrics }: Props) {
  const defaults: Metric[] = [
    { id: 'pressure', label: 'Pipeline Pressure', value: '0.8', unit: 'MPa' },
    { id: 'tank', label: 'Tank Level', value: '67.1', unit: '%' },
    { id: 'room', label: 'Room Temperature', value: '22.9', unit: '°C' },
    { id: 'backup', label: 'Backup Power Voltage', value: '24.6', unit: 'V' },
    { id: 'signal', label: 'Signal Strength', value: '-59', unit: 'dBm' },
  ]

  const list = metrics ?? defaults

  return (
    <section className="rounded-lg border border-[#e6edf5] bg-white p-3 shadow-sm w-full">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-[15px] font-semibold text-[#0f1724]">Real-time Data</h4>
      </div>
      <div className="min-h-[110px]">
        <div className="grid grid-cols-3 gap-2">
          {list.map((m) => (
            <div key={m.id} className="flex flex-col px-2 py-1">
              <div className="text-[12px] font-medium text-[#6b7280] mb-1">{m.label}</div>
              <div className="flex items-baseline gap-2">
                <div className="text-[20px] font-semibold text-[#0f1724] leading-none">{m.value}</div>
                {m.unit ? <div className="text-[12px] text-[#9aa4b2]">{m.unit}</div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
