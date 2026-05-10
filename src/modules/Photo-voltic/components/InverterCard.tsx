import { BarChart2, CheckCircle2, Clock, Lightbulb, LucideIcon, Zap } from 'lucide-react'
import BranchIcon from './BranchIcon'
import SolarPanelIcon from './SolarPanelIcon'
import Tooltip from './Tooltip'
import type { InverterData } from '../types'

const METRIC_ICONS: Array<{ label: string; valueKey: keyof Pick<InverterData, 'activePower' | 'dailyEnergy' | 'loadRatio' | 'dailyEffective'>; unit: string; icon: LucideIcon }> = [
  { label: 'Active Power', valueKey: 'activePower', unit: 'kW', icon: Zap },
  { label: 'Daily Energy', valueKey: 'dailyEnergy', unit: 'kWh', icon: Lightbulb },
  { label: 'Load Ratio', valueKey: 'loadRatio', unit: '%', icon: BarChart2 },
  { label: 'Daily Duration', valueKey: 'dailyEffective', unit: 'h', icon: Clock },
]

type InverterCardProps = {
  inverter: InverterData
}

export default function InverterCard({ inverter }: InverterCardProps) {
  const statusLabel = inverter.status.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
  const ratedPowerLabel = 'Rated Power: 125kW'
  const branchTooltips = Array.from({ length: 11 }, (_, index) => {
    const channelNumber = String(index + 1).padStart(2, '0')
    return `MPPT${channelNumber}: Normal (${(5.2 + index * 0.17).toFixed(2)}A) , Average (${(7.1 + index * 0.11).toFixed(2)}A) , Total Current (${(78.2 + index * 0.37).toFixed(2)}A)`
  })

  return (
    <article className="relative border transition-all w-full max-w-[380px]" style={{ padding: 16, borderRadius: 20, borderColor: '#dfeaf8', boxShadow: '0 8px 22px rgba(15,23,42,0.05)', background: 'linear-gradient(180deg, #fbfdff 0%, #ffffff 100%)' }}>
      <header className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-[56px] h-[56px] bg-white rounded-[18px] border border-[#eef4fb] flex items-center justify-center p-2 shadow-[0_6px_16px_rgba(15,23,42,0.05)]">
            <SolarPanelIcon className="w-8 h-8" />
          </div>
          <div>
            <Tooltip content={inverter.title} className="mb-1">
              <h3 className="text-[16px] font-semibold text-[#2c3b52] leading-tight">{inverter.title}</h3>
            </Tooltip>
            <Tooltip content={ratedPowerLabel}>
              <div className="flex items-center text-[12px] text-[#9fb0c9] font-medium cursor-default">
                <CheckCircle2 className="w-3 h-3 mr-1 text-[#c7d8ee]" />
                {ratedPowerLabel}
              </div>
            </Tooltip>
          </div>
        </div>
        <div style={{ height: 24 }} className="flex items-center gap-1 bg-[#effcf5] border border-[#bcefcf] text-[#29c77c] px-2.5 rounded-full text-[11px] font-semibold tracking-[0.02em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#26c281]" />
          {statusLabel}
        </div>
      </header>

      <div className="border-t border-[#edf3fb] pt-3" />

      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {METRIC_ICONS.map(metric => (
          <div key={metric.label} className="relative bg-white rounded-[16px] p-3.5 border border-[#eff4fb] overflow-hidden min-h-[84px] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <div className="text-[11px] text-[#9cb0cb] font-semibold mb-2 uppercase tracking-wide leading-tight">{metric.label}</div>
            <div className="flex items-baseline relative z-10">
              <span className="text-[18px] font-semibold text-[#29384d] tracking-tight">{inverter[metric.valueKey]}</span>
              <span className="ml-1.5 text-[12px] text-[#9aaec7] font-semibold">{metric.unit}</span>
            </div>
            <metric.icon className="absolute right-3 bottom-3 text-[#e3eefb] w-5 h-5" strokeWidth={1.3} />
          </div>
        ))}
      </div>

      <div className="border-t border-[#edf3fb] mt-1 pt-2.5">
        <div className="flex justify-start space-x-1.5">
          {branchTooltips.map((tooltip, index) => (
            <Tooltip key={index} content={tooltip} bubbleClassName="max-w-none">
              <span className="cursor-default">
                <BranchIcon className="text-[#48d486] w-3 h-3" />
              </span>
            </Tooltip>
          ))}
        </div>
      </div>
    </article>
  )
}