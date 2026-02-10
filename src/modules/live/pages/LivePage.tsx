'use client';
import { SolarCard, GridCard, LoadCard, BatteryCard } from '@/modules/live/components/KPICards';
import SystemMetricsBar from '@/modules/live/components/SystemMetricsBar';
import { RadialEnergyMonitor } from '@/modules/live/components/RadialEnergyMonitor';

export function LivePage() {
  return (
    <div className="bg-gray-50 flex flex-col h-screen overflow-hidden">
      {/* Navbar is outside or handled by layout */}

      <main className="flex-1 flex flex-col min-h-0 pb-24"> {/* pb-24 provides even more space for footer */}
        <div className="flex-1 flex flex-col max-w-[1920px] mx-auto w-full p-4 gap-4 h-full">

          {/* TOP SECTION (Most available height, but leave room for metrics bar) */}
          <div className="flex-1 flex flex-row gap-4 min-h-0">

            {/* Left KPI Column (Fixed width, fluid height) */}
            <div className="flex flex-col gap-4 w-[300px] xl:w-[350px] h-full">
              <SolarCard className="flex-1" />
              <GridCard className="flex-1" />
            </div>

            {/* Center Monitor (Fluid) */}
            <div className="flex-1 flex items-center justify-center relative min-w-0">
              <RadialEnergyMonitor />
            </div>

            {/* Right KPI Column */}
            <div className="flex flex-col gap-4 w-[300px] xl:w-[350px] h-full">
              <LoadCard className="flex-1" />
              <BatteryCard className="flex-1" />
            </div>
          </div>

          {/* MIDDLE SECTION (Auto height with explicit bottom margin) */}
          <div className="shrink-0 mb-8">
            <SystemMetricsBar />
          </div>

        </div>
      </main>
    </div>
  );
}