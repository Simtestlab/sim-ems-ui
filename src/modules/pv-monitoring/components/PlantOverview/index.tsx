import React from 'react'
import { Settings } from 'lucide-react'

/* ─── Components ─────────────────────────────────────────────────────────── */

function GaugeChart({ value, max, label, color = '#3b82f6' }: { value: number; max: number; label: string; color?: string }) {
  const percentage = (value / max) * 100
  const radius = 45
  const circumference = Math.PI * radius
  const strokeDasharray = (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative h-[80px] w-[160px] overflow-hidden">
        {/* Background track */}
        <svg className="h-[160px] w-[160px] rotate-[-180deg]">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${strokeDasharray} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <div className="text-[18px] font-bold text-[#0f172a]">{value.toLocaleString()} <span className="text-[12px] font-normal text-slate-500">{label}</span></div>
        </div>
      </div>
    </div>
  )
}

function MetricRow({ label, value, unit, isDark }: { label: string; value: string | number; unit?: string; isDark?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2 text-[13px] ${isDark ? 'bg-slate-50' : 'bg-white'}`}>
      <span className="text-slate-500 font-medium">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-[#0f172a]">{value}</span>
        {unit && <span className="text-[11px] font-medium text-slate-400">{unit}</span>}
      </div>
    </div>
  )
}

const BessIllustration = () => (
  <svg width="180" height="90" viewBox="0 0 180 100">
    <g transform="translate(2,4)">
      {/* Cabinet 1 */}
      <polygon points="32,14 54,23 32,34 10,25"  fill="#64748b"/>
      <polygon points="10,25 32,34 32,74 10,65"  fill="#334155"/>
      <polygon points="32,34 54,23 54,63 32,74"  fill="#475569"/>
      <rect x="14" y="38" width="12" height="20" rx="1" fill="#475569"/>
      <rect x="15" y="39" width="8"  height="9"  rx="1" fill="#94a3b8"/>
      <circle cx="18" cy="57" r="2.5" fill="#22c55e"/>
      <polygon points="10,25 32,14 54,23 32,34" fill="#60a5fa" opacity="0.28"/>
      {/* Cabinet 2 */}
      <polygon points="76,8 98,17 76,28 54,19"  fill="#64748b"/>
      <polygon points="54,19 76,28 76,68 54,59"  fill="#334155"/>
      <polygon points="76,28 98,17 98,57 76,68"  fill="#475569"/>
      <rect x="58" y="32" width="12" height="20" rx="1" fill="#475569"/>
      <rect x="59" y="33" width="8"  height="9"  rx="1" fill="#94a3b8"/>
      <circle cx="62" cy="51" r="2.5" fill="#22c55e"/>
      <polygon points="54,19 76,8 98,17 76,28" fill="#60a5fa" opacity="0.28"/>
      {/* Cabinet 3 */}
      <polygon points="120,4 142,13 120,24 98,15"  fill="#64748b"/>
      <polygon points="98,15 120,24 120,64 98,55"  fill="#334155"/>
      <polygon points="120,24 142,13 142,53 120,64" fill="#475569"/>
      <rect x="102" y="28" width="12" height="20" rx="1" fill="#475569"/>
      <rect x="103" y="29" width="8"  height="9"  rx="1" fill="#94a3b8"/>
      <circle cx="106" cy="47" r="2.5" fill="#22c55e"/>
      <polygon points="98,15 120,4 142,13 120,24" fill="#60a5fa" opacity="0.28"/>
      <ellipse cx="76" cy="78" rx="70" ry="6" fill="#e2e8f0" opacity="0.6"/>
    </g>
  </svg>
)

function StatisticColumn({ title, subTitle, value, max, unit, color, metrics, illustration }: { 
  title: string; 
  subTitle: string; 
  value: number; 
  max: number; 
  unit: string; 
  color?: string;
  illustration?: React.ReactNode;
  metrics: { label: string; value: string | number; unit?: string }[]
}) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden min-w-[240px] flex-1">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight">{title}</h3>
        <Settings className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
      </div>
      {illustration && (
        <div className="flex justify-center items-center pt-3 pb-1 px-4 bg-[#f8fafc]">
          {illustration}
        </div>
      )}
      <div className="flex flex-col items-center pt-4 px-4">
        <span className="text-[12px] font-medium text-slate-400">{subTitle}</span>
        <GaugeChart value={value} max={max} label={unit} color={color} />
      </div>
      <div className="flex flex-col border-t border-slate-100">
        {metrics.map((m, i) => (
          <MetricRow key={m.label} label={m.label} value={m.value} unit={m.unit} isDark={i % 2 === 1} />
        ))}
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function PlantOverview() {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {/* Project Information */}
      <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm p-5 min-w-[300px] w-[300px] shrink-0">
        <h2 className="text-[20px] font-bold text-[#0f172a] mb-6">Project Information</h2>
        
        <div className="mb-6 overflow-hidden rounded-lg">
          <div
            className="w-full h-[160px] rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-[13px] select-none"
          >
            Project Site
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-slate-500">BESS Capacity:</span>
              <span className="text-[14px] font-bold text-[#0f172a]">250kW/514kWh</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-slate-500">PV Capacity:</span>
              <span className="text-[14px] font-bold text-[#0f172a]">200kWp</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-slate-500">On-grid Date:</span>
              <span className="text-[14px] font-bold text-[#0f172a]">2026-02-06</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-slate-500">Running Days:</span>
              <span className="text-[14px] font-bold text-[#0f172a]">96 Days</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <div className="flex flex-col">
              <span className="text-[12px] text-slate-400">Cluster:</span>
              <span className="text-[14px] font-bold">1*2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-slate-400">Inverter:</span>
              <span className="text-[14px] font-bold">2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-slate-400">PCS:</span>
              <span className="text-[14px] font-bold">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Columns */}
      <StatisticColumn
        title="BESS Operation Statistics"
        subTitle="BESS Real-time Power"
        illustration={<BessIllustration />}
        value={0}
        max={250}
        unit="kW"
        metrics={[
          { label: 'Daily Charge', value: '0.00', unit: 'kWh' },
          { label: 'Daily Discharge', value: '462.60', unit: 'kWh' },
          { label: 'Cumulative Charge', value: '40.86', unit: 'MWh' },
          { label: 'Cumulative Discharge', value: '44.87', unit: 'MWh' },
          { label: 'SOC', value: '100', unit: '%' },
          { label: 'SOH', value: '98.6', unit: '%' },
          { label: 'Round-trip Efficiency', value: '92', unit: '%' },
          { label: 'Cumulative Cycles', value: '97' },
          { label: 'Remaining Discharge Duration', value: '2.06', unit: 'Hours' },
          { label: 'Remaining Energy', value: '514', unit: 'kWh' },
        ]}
      />

      <StatisticColumn
        title="PV Operation Statistics"
        subTitle="PV Real-time Power"
        value={134.21}
        max={200}
        unit="kW"
        color="#f59e0b"
        metrics={[
          { label: 'Daily Generation', value: '1.30', unit: 'MWh' },
          { label: 'Monthly Generation', value: '19.56', unit: 'MWh' },
          { label: 'Yearly Generation', value: '71.31', unit: 'MWh' },
          { label: 'Cumulative Generation', value: '147.42', unit: 'MWh' },
          { label: 'Combined Efficiency', value: '88.99', unit: '%' },
          { label: 'Load Factor', value: '67.11', unit: '%' },
          { label: 'Daily Effective Duration', value: '6.48', unit: 'h' },
          { label: 'CO2 Reduction', value: '88.45', unit: 't' },
        ]}
      />

      <StatisticColumn
        title="DG Operation Statistics"
        subTitle="DG Real-time Power"
        value={0}
        max={100}
        unit="kW"
        metrics={[
          { label: 'Daily Generation', value: '0.00', unit: 'kWh' },
          { label: 'Monthly Generation', value: '0.00', unit: 'kWh' },
          { label: 'Yearly Generation', value: '0.00', unit: 'kWh' },
          { label: 'Total Generation', value: '0.00', unit: 'kWh' },
          { label: 'Cumulative Starts', value: '0' },
          { label: 'Load Factor', value: '0', unit: '%' },
          { label: 'Normal Running', value: '0' },
          { label: 'Warning Running', value: '0' },
        ]}
      />

      <StatisticColumn
        title="EV Operation Statistics"
        subTitle="EV Real-time Power"
        value={0}
        max={150}
        unit="kW"
        metrics={[
          { label: 'Daily Charge Energy', value: '400.00', unit: 'kWh' },
          { label: 'Monthly Charge Energy', value: '6.40', unit: 'MWh' },
          { label: 'Yearly Charge Energy', value: '48.40', unit: 'MWh' },
          { label: 'Cumulative Charge Energy', value: '48.40', unit: 'MWh' },
          { label: 'Active Chargers', value: '0' },
          { label: 'Idle Chargers', value: '1' },
          { label: 'Fault Chargers', value: '0' },
          { label: 'Today Peak Power', value: '100', unit: 'kW' },
        ]}
      />
    </div>
  )
}
