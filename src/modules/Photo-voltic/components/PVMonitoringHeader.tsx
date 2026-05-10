import { ChevronDown, Globe, Menu, Monitor } from 'lucide-react'
import LogoIcon from './LogoIcon'

type PVMonitoringHeaderProps = {
  sidebarCollapsed: boolean
  currentTimeLabel: string
  onToggleSidebar: () => void
}

export default function PVMonitoringHeader({ sidebarCollapsed, currentTimeLabel, onToggleSidebar }: PVMonitoringHeaderProps) {
  return (
    <header className="h-16 flex items-center text-[13px] z-30 sticky top-0 border-b border-[#edf1f5] shadow-sm bg-white">
      <div className={`h-full shrink-0 bg-[#001529] border-r border-white/10 flex items-center transition-all duration-300 ${sidebarCollapsed ? 'w-11 justify-center px-0' : 'w-56 px-4'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <LogoIcon className="text-[#ff6a00] w-6 h-6 shrink-0" />
          {!sidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight text-white uppercase">DEMO</span>}
        </div>
      </div>

      <div className="flex items-center justify-between flex-1 h-full bg-white">
        <div className="flex items-center h-full px-4 gap-4">
        <button onClick={onToggleSidebar} className="p-1.5 rounded-md hover:bg-gray-100 text-[#808b9a] hover:text-[#4f5d73] transition-all">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center bg-white border border-[#dce4ee] rounded-[12px] px-4 h-11 cursor-pointer hover:border-[#b8d3ff] transition-all min-w-[420px] justify-between group shadow-[0_2px_7px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3b9cff]" />
            <span className="text-[15px] text-[#25364d] font-semibold">Demo</span>
            <span className="text-[12px] text-[#9ca8b8]">(100kW / 215kWh)</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#b2bcc9] group-hover:text-[#7d8a9a]" />
        </div>
      </div>

        <div className="flex items-center gap-5 text-gray-600 px-6 h-full">
          <div className="text-[#7b8798] text-[12px] flex items-center font-medium">
            UTC+8 <span suppressHydrationWarning className="ml-3 text-[14px] text-[#24354c] font-semibold">{currentTimeLabel}</span>
          </div>
          <div className="w-px h-5 bg-[#e8edf3]"></div>
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 hover:text-[#1677ff] transition-colors text-[12px] text-[#4f5d73]">
              <Monitor className="w-4 h-4" />
              <span>Enter Screen</span>
            </button>
            <div className="w-px h-5 bg-[#e8edf3]"></div>
            <button className="flex items-center gap-2 hover:text-[#1677ff] transition-colors text-[12px] text-[#4f5d73]">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </button>
            <div className="w-px h-5 bg-[#e8edf3]"></div>
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <LogoIcon className="text-[#ff6a00] w-6 h-6" />
              <span className="text-[12px] font-semibold text-[#24354c]">demo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
