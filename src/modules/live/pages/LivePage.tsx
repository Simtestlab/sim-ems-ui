'use client';
import { SolarCard, GridCard, LoadCard, BatteryCard } from '@/modules/live/components/KPICards';
import SystemMetricsBar from '@/modules/live/components/SystemMetricsBar';
import { RadialEnergyMonitor } from '@/modules/live/components/RadialEnergyMonitor';
import { AdvancedTelemetryGrid } from '@/modules/live/components/AdvancedTelemetryGrid';

export function LivePage() {
  return (
    <div className="bg-gray-50 flex flex-col flex-1 min-h-screen">
      {/* Main Content - Energy Monitor */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gray-50">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-6 flex gap-2 items-stretch justify-center">
            {/* Left KPI column */}
              <div className="w-[640px] flex flex-col gap-4">
              <SolarCard />
              <GridCard />
            </div>

            {/* Center monitor (raised slightly to reveal metrics bar below) */}
            <div className="flex-1 flex items-start justify-center -mt-6">
              <RadialEnergyMonitor />
            </div>

            {/* Right KPI column */}
              <div className="w-[640px] flex flex-col gap-4">
                <LoadCard />
                <BatteryCard />
            </div>
          </div>

          {/* System metrics bar */}
          <div className="w-full">
            <SystemMetricsBar />
          </div>

          {/* Advanced Telemetry Grid */}
          <AdvancedTelemetryGrid />

        </div>
      </main>
    </div>
  );
}