"use client"

import HistoricalPriceChartCard from '../components/HistoricalPriceChartCard'
import PriceConfigurationSection from '../components/PriceConfigurationSection'

export default function EconomicsPricePage() {
  return (
    <div className="flex-1 overflow-auto bg-[#f8f9fc]">
      <div className="p-6 space-y-6">
        {/* Historical Price Chart */}
        <HistoricalPriceChartCard />

        {/* Grid Price Configuration */}
        <PriceConfigurationSection 
          title="Grid Price Configuration" 
          buttonLabel="Batch Add" 
          saveLabel="Save Grid Price Config"
        />

        {/* PV Price Configuration */}
        <PriceConfigurationSection 
          title="PV Price Configuration" 
          buttonLabel="Batch Add" 
          saveLabel="Save PV Price Config"
        />
      </div>
    </div>
  )
}
