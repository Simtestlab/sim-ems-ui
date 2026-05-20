"use client"

type RevenueTabsProps = {
  selectedTab: string
  onSelectTab: (tab: string) => void
}

const TABS = ['Revenue Overview', 'Revenue Statistics', 'Revenue Curve']

export default function RevenueTabs({ selectedTab, onSelectTab }: RevenueTabsProps) {
  return (
    <div className="bg-white border-b border-[#e6edf5]">
      <div className="flex gap-8 px-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`relative py-3 text-[14px] transition-colors ${
              selectedTab === tab
                ? 'text-[#0f1724] font-bold'
                : 'text-[#6b7280] hover:text-[#0f1724]'
            }`}
          >
            {tab}
            {selectedTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0f1724] rounded-t-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
