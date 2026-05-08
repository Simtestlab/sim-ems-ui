"use client";

import { useState } from 'react';
import { Network, Settings, BarChart2, LayoutGrid, LineChart, JapaneseYen, ChevronDown } from 'lucide-react';

const LogoIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <path d="M12 12L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Sidebar({ sidebarCollapsed, activeTab, setActiveTab }: { sidebarCollapsed: boolean; activeTab: string; setActiveTab: (s: string) => void }) {
  const [openMenu, setOpenMenu] = useState<string | null>('Monitoring');

  const items = [
    { key: 'System', icon: Network, label: 'System' },
    { key: 'Settings', icon: Settings, label: 'Settings' },
    { key: 'Monitoring', icon: BarChart2, label: 'Monitoring', hasChildren: true },
    { key: 'Reports', icon: LayoutGrid, label: 'Reports', hasChildren: true },
    { key: 'Economics', icon: LineChart, label: 'Economics', hasChildren: true },
    { key: 'Admin', icon: JapaneseYen, label: 'Admin', hasChildren: true },
  ];

  const subs = ['Overview', 'PV', 'Genset', 'PCS', 'BMS', 'FPS', 'Cooling', 'Meter', 'EV', 'Data'];

  return (
    <aside className={`bg-[#001529] transition-all duration-300 flex flex-col overflow-y-auto shrink-0 z-20 ${sidebarCollapsed ? 'w-12' : 'w-60'}`}>

      <nav className="flex-1 py-3">
        <ul className="space-y-0.5">
          {items.map(item => (
            <li key={item.key} className="px-2">
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    if (item.hasChildren) setOpenMenu(prev => prev === item.key ? null : item.key);
                    if (item.key === 'System') setActiveTab('System');
                  }}
                  className={`w-full flex items-center justify-between px-3 rounded-md transition-all duration-200 group ${sidebarCollapsed ? 'justify-center' : ''} ${item.key === activeTab || (item.hasChildren && openMenu === item.key) ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  style={{ height: 44 }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 shrink-0 transition-colors ${item.key === activeTab || (item.hasChildren && openMenu === item.key) ? 'text-[#1890ff]' : 'text-gray-400 group-hover:text-white'}`} />
                    {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.hasChildren && (
                    <div className={`transition-transform duration-200 ${openMenu === item.key ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </div>
                  )}
                </button>

                {!sidebarCollapsed && item.hasChildren && (
                  <div className={`overflow-hidden transition-all duration-300 ${openMenu === item.key ? 'max-h-[360px] mt-1' : 'max-h-0'}`}>
                    <ul className="space-y-0.5">
                      {subs.map(sub => (
                        <li key={sub}>
                          <button
                            onClick={() => setActiveTab(sub)}
                            className={`w-full text-left pl-11 pr-3 py-2 text-[12px] rounded-md transition-all duration-200 ${sub === activeTab ? 'bg-[#1890ff] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
