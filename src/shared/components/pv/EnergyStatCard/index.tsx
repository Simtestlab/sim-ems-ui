import { LucideIcon } from 'lucide-react'

type EnergyStatCardProps = {
  label: string
  value: number
  unit: string
  icon: LucideIcon
  className?: string
}

export default function EnergyStatCard({ label, value, unit, icon: Icon, className = '' }: EnergyStatCardProps) {
  return (
    <div className={`relative bg-white rounded-[16px] p-3.5 border border-[#eff4fb] overflow-hidden min-h-[84px] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-150 ${className}`}>
      <div className="text-[11px] text-[#9cb0cb] font-semibold mb-2 uppercase tracking-wide leading-tight">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[20px] font-bold text-[#2c3b52]">{value}</span>
        <span className="text-[12px] text-[#9cb0cb] font-semibold">{unit}</span>
      </div>
      <Icon className="absolute bottom-2.5 right-2.5 w-6 h-6 text-[#d9e9ff] opacity-80" />
    </div>
  )
}
