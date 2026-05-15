"use client"

import { STATUS_COLORS } from '@/shared/constants/status'

type StatusItem = { key: string; label: string; active?: boolean }

type Props = { statuses?: StatusItem[] }

export default function RealtimeStatusCard({ statuses }: Props) {
  const defaults: StatusItem[] = [
    { key: 'communication', label: 'Communication Normal', active: true },
    { key: 'power', label: 'Main Power Normal', active: true },
    { key: 'pump', label: 'Fire Pump Running', active: false },
    { key: 'valve', label: 'Main Valve Open', active: false },
    { key: 'alarm', label: 'Fire Alarm', active: false },
    { key: 'fault', label: 'Fault', active: false },
  ]

  const list = statuses ?? defaults

  return (
    <section className="rounded-lg border border-[#e6edf5] bg-white p-3 shadow-sm w-full">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-[15px] font-semibold text-[#0f1724]">Real-time Status</h4>
      </div>
      <div className="min-h-[70px] flex items-center">
        <div className="w-full grid grid-cols-4 gap-2">
          {list.map((s) => {
            const isActive = !!s.active
            const dotColor = isActive ? STATUS_COLORS.normal.dot : STATUS_COLORS.offline.dot

            return (
              <div key={s.key} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2">
                  <span style={{ background: dotColor }} className="w-2 h-2 rounded-full inline-block" />
                  <span className="text-[12px] font-medium text-[#4b5563]">{s.label}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
