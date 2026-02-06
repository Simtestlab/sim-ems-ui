'use client';

import { RadialEnergyMonitor } from '@/modules/live/components/RadialEnergyMonitor';

export function LivePage() {
  return (
    <div className="flex flex-col flex-1 w-full h-full min-h-0">
      {/* Main Content - Full viewport usage without padding */}
      <div className="flex-1 flex items-center justify-center w-full h-full min-h-0 overflow-hidden bg-gray-50">
        <RadialEnergyMonitor />
      </div>
    </div>
  );
}