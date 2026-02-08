'use client';

import { RadialEnergyMonitor } from '@/modules/live/components/RadialEnergyMonitor';

export function LivePage() {
  return (
    <div className="flex-1 flex items-center justify-center w-full h-full min-h-0 overflow-hidden">
      <RadialEnergyMonitor />
    </div>
  );
}