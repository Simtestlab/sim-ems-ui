"use client";
 
import { useMemo, useState, useEffect } from 'react';
import {
  Menu, ChevronDown, Monitor, Globe, Search, Zap, Lightbulb, BarChart2, Clock, CheckCircle2, X
} from 'lucide-react';
import Sidebar from './Sidebar';



// Custom Logo Icon (Gauge/Styled D)
const LogoIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <path d="M12 12L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Branch Icon component (hollow vertical barbell style)
const BranchIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-3 h-5 ${className}`} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="2.2" />
    <line x1="6" y1="7" x2="6" y2="13" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="6" cy="15.5" r="2.5" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

// Detailed Solar panel icon (Isometric Diamond with grid)
const SolarPanelIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-10 h-10 ${className}`} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" fill="#1890FF" fillOpacity="0.15" stroke="#1890FF" strokeWidth="2" />
    <path d="M14 9L34 19M10 16L38 30M14 29L34 39" stroke="#1890FF" strokeWidth="1" strokeOpacity="0.4" />
    <path d="M24 14V34M14 19V39M34 9V29" stroke="#1890FF" strokeWidth="1" strokeOpacity="0.4" />
    {/* Base support */}
    <path d="M22 38V42M26 38V42M18 42H30" stroke="#8c8c8c" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);




export default function PVMonitoringUI() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('PV');
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [branchFilter, setBranchFilter] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState<string[]>(['PV'])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDateTime = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`
  }




  const data = useMemo(
    () => [
      { id: 1, title: '1#Inverter', status: 'normal', branch: 'normal', activePower: '95.94', dailyEnergy: '311.5', loadRatio: '76.75', dailyEffective: '3.69' },
      { id: 2, title: '2#Inverter', status: 'normal', branch: 'normal', activePower: '78.48', dailyEnergy: '254.8', loadRatio: '62.78', dailyEffective: '3.69' },
    ],
    [],
  )

  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'standby', label: 'Standby' },
    { key: 'normal', label: 'Normal' },
    { key: 'shutdown', label: 'Shutdown' },
    { key: 'alarm', label: 'Alarm' },
    { key: 'fault', label: 'Fault' },
    { key: 'communicationLoss', label: 'Communication Loss' },
  ]

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: data.length }
    statusTabs.forEach(t => {
      if (t.key === 'all') return
      map[t.key] = data.filter(d => d.status === t.key).length
    })
    return map
  }, [data])

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (selectedStatus !== 'all' && d.status !== selectedStatus) return false
      if (branchFilter && d.branch !== branchFilter) return false
      if (location && location !== '' && (d as any).location !== location) return false
      if (query && !d.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [data, selectedStatus, branchFilter, location, query])

  function toggleBranch(filter: string | null) {
    setBranchFilter(prev => prev === filter ? null : filter)
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }




  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800 flex flex-col text-[14px] ui-compact">
      {/* Top Header */}
      <header className="bg-white h-14 flex items-center justify-between text-[13px] z-30 sticky top-0 shadow-sm">
        <div className="flex items-center h-full">
          {/* Logo Area / Collapse Toggle */}
          <div className={`flex items-center h-full transition-all duration-300 ${sidebarCollapsed ? 'w-12' : 'w-60'} bg-[#002140]`}>
            <div className="flex items-center px-3 gap-2">
              <LogoIcon className="text-orange-500 w-5 h-5" />
              {!sidebarCollapsed && (
                <span className="text-white font-semibold text-[16px] tracking-tight">DEMO</span>
              )}
            </div>
          </div>

          <button onClick={() => setSidebarCollapsed(s => !s)} className="ml-4 p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
            <Menu className="w-5 h-5" />
          </button>

          <div className="ml-4 flex items-center bg-gray-50 border border-gray-200 rounded px-3 h-9 cursor-pointer hover:border-[#1890ff] hover:bg-white transition-all min-w-[220px] justify-between group shadow-sm" style={{ paddingInline: 12, borderRadius: 8 }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1890ff]" />
              <span className="text-[14px] text-gray-800 font-medium">Demo</span>
              <span className="text-[12px] text-gray-400 ml-1">(100kW / 215kWh)</span>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#1890ff]" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-600 px-4 h-full">
          <div className="text-gray-400 text-[10px] flex items-center">
            UTC+8 <span className="ml-2 font-medium text-gray-600">{mounted ? formatDateTime(currentTime) : '\u00A0'}</span>
          </div>
          <div className="w-px h-3 bg-gray-200 mx-0.5"></div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 hover:text-[#1890ff] transition-colors text-[11px]">
              <Monitor className="w-3.5 h-3.5" />
              <span>Enter Screen</span>
            </button>
            <button className="flex items-center gap-1 hover:text-[#1890ff] transition-colors text-[11px]">
              <Globe className="w-3.5 h-3.5" />
              <span>English</span>
            </button>
            <div className="flex items-center gap-1.5 cursor-pointer group ml-0.5">
              <LogoIcon className="text-orange-500 w-5 h-5" />
              <span className="text-[11px] font-medium text-gray-600">demo</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebarCollapsed={sidebarCollapsed} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 overflow-y-auto flex flex-col bg-[#f8fafc]">


          {/* Breadcrumb / Tags */}
          <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center gap-2">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1 gap-2 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1890ff]" />
              <span className="text-[12px] font-semibold text-gray-700">PV Monitoring</span>
              <button aria-label="close tag" className="text-gray-400 hover:text-gray-600 ml-2 transition-colors" onClick={() => removeTag('PV')}>
                <X className="w-3 h-3" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Enter equipment name..."
                    className="border border-gray-200 bg-gray-50 rounded-lg px-3 h-10 text-[14px] w-56 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-[#1890ff]/20 focus:border-[#1890ff] transition-all"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1890ff] transition-colors" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-gray-600">Installation Location:</span>
                <div className="border border-gray-200 bg-gray-50 rounded px-3 h-10 flex items-center justify-between w-52 text-[14px] text-gray-500 cursor-pointer hover:border-[#1890ff] hover:bg-white transition-all group shadow-sm" style={{ borderRadius: 8 }}>
                  <span className="font-medium">All Locations</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1890ff]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-[#1890ff] hover:bg-[#40a9ff] text-white h-10 px-5 rounded-lg text-[14px] font-medium transition-all shadow-sm active:scale-95">Search</button>
              <button className="bg-white border border-gray-200 hover:border-gray-300 h-10 px-4 rounded-lg text-[14px] font-medium text-gray-500 transition-all active:scale-95">Reset</button>
            </div>
          </div>

          {/* Status Tabs & Legend */}
          <div className="px-4 border-b border-gray-100 flex items-end justify-between bg-white sticky top-0 z-10 shadow-sm">
            <div className="flex gap-4 text-[14px]">
              {statusTabs.map(t => (
                <button key={t.key} onClick={() => setSelectedStatus(t.key)} className={`py-2.5 px-2 relative transition-all group ${selectedStatus === t.key ? 'text-[#1890ff] font-semibold' : 'text-gray-500 hover:text-gray-800'}`}>
                  <span className="flex items-center gap-2">
                    {t.label}
                    <span className={`px-1 py-0.5 rounded-full text-[10px] ${selectedStatus === t.key ? 'bg-[#1890ff]/10' : 'bg-gray-100 group-hover:bg-gray-200'} transition-colors`}>{counts[t.key] ?? 0}</span>
                  </span>
                  {selectedStatus === t.key && <div className="absolute left-0 w-full bottom-0 h-[2px] bg-[#1890ff] shadow-[0_-2px_8px_rgba(24,144,255,0.4)]" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 pb-2 text-[12px]">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Branch Status:</span>
              <div onClick={() => toggleBranch('normal')} className="flex items-center gap-2 cursor-pointer group">
                <BranchIcon className="text-[#52c41a] w-3 h-3" />
                <span className="text-gray-600 text-[13px] font-medium group-hover:text-gray-900">Normal</span>
              </div>
              <div onClick={() => toggleBranch('low')} className="flex items-center gap-2 cursor-pointer group">
                <BranchIcon className="text-yellow-500 w-3 h-3" />
                <span className="text-gray-600 text-[13px] font-medium group-hover:text-gray-900">Low Output</span>
              </div>
              <div onClick={() => toggleBranch('zero')} className="flex items-center gap-2 cursor-pointer group">
                <BranchIcon className="text-red-500 w-3 h-3" />
                <span className="text-gray-600 text-[13px] font-medium group-hover:text-gray-900">Zero Output</span>
              </div>
              <div onClick={() => toggleBranch('disconnected')} className="flex items-center gap-2 cursor-pointer group">
                <BranchIcon className="text-gray-400 w-3 h-3" />
                <span className="text-gray-600 text-[13px] font-medium group-hover:text-gray-900">Disconnected</span>
              </div>
            </div>
          </div>

          <main className="px-4 py-3 flex-1 min-w-0 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                  <svg className="w-56 h-56 drop-shadow-2xl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M70 165 Q100 175 130 165" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                    <path d="M85 175 Q100 182 115 175" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
                    <path d="M100 150L160 120V70L100 100V150Z" fill="#f0f9ff" />
                    <path d="M40 120L100 150V100L40 70V120Z" fill="#e0f2fe" />
                    <path d="M40 70L100 40L160 70L100 100L40 70Z" fill="#bae6fd" />
                    <path d="M40 70L15 45L75 15L100 40L40 70Z" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
                    <path d="M160 70L185 45L125 15L100 40L160 70Z" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
                    <path d="M98 100V150H102V100L160 71V67L100 97L40 67V71L98 100Z" fill="#f59e0b" opacity="0.8" />
                  </svg>
                  <span className="mt-6 text-slate-400 text-base font-bold tracking-widest uppercase">No Active Systems Found</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {filtered.map(inv => (
                  <article key={inv.id} className="relative bg-white border border-gray-100 transition-all group" style={{ width: 420, padding: 18, borderRadius: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.04)', background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 100%)' }}>
                    <header className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f0f9ff] rounded-xl border border-blue-50 flex items-center justify-center p-1 transition-transform group-hover:scale-105 duration-300">
                          <SolarPanelIcon className="w-9 h-9" />
                        </div>
                        <div>
                          <h3 className="text-[18px] font-semibold text-slate-800 leading-tight mb-1">{inv.title}</h3>
                          <div className="flex items-center text-[13px] text-slate-400 font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-blue-400" />
                            Rated Power: 125kW
                          </div>
                        </div>
                      </div>
                      <div style={{ height: 26 }} className="flex items-center gap-1 bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] px-2 rounded-full text-[12px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                        NORMAL
                      </div>
                    </header>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: 'Active Power', value: inv.activePower, unit: 'kW', icon: Zap },
                        { label: 'Daily Energy', value: inv.dailyEnergy, unit: 'kWh', icon: Lightbulb },
                        { label: 'Load Ratio', value: inv.loadRatio, unit: '%', icon: BarChart2 },
                        { label: 'Daily Duration', value: inv.dailyEffective, unit: 'h', icon: Clock }
                      ].map((metric, idx) => (
                        <div key={idx} className="relative bg-white/60 rounded-lg p-3 border border-gray-50 transition-all hover:bg-white hover:border-blue-100 group/metric overflow-hidden">
                          <div className="text-[11px] text-slate-400 font-medium mb-1 uppercase tracking-wide">{metric.label}</div>
                          <div className="flex items-baseline relative z-10">
                            <span className="text-[28px] font-semibold text-slate-800 tracking-tight">{metric.value}</span>
                            <span className="ml-2 text-[13px] text-slate-400 font-medium">{metric.unit}</span>
                          </div>
                          <metric.icon className="absolute -right-2 -bottom-2 text-blue-500/6 group-hover/metric:text-blue-500/10 transition-colors w-10 h-10" strokeWidth={1.2} />
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-50 mt-4 pt-3">
                      <div className="flex justify-start space-x-2">
                        {Array.from({ length: 11 }).map((_, i) => (
                          <BranchIcon key={i} className="text-[#22c55e] w-3 h-3" />
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


