'use client';

import { usePermissions } from '@/modules/auth/hooks/usePermissions';
import PeakShavingCard from '@/modules/settings/components/PeakShavingCard';
import PVSelfConsumptionCard from '@/modules/settings/components/PVSelfConsumptionCard';
import TimeOfUseOptimizationCard from '@/modules/settings/components/TimeOfUseOptimizationCard';
import MicrogridIslandingCard from '@/modules/settings/components/MicrogridIslandingCard';
import GridServicesCard from '@/modules/settings/components/GridServicesCard';

export default function SettingsPage() {
  const { canModifySettings } = usePermissions();

  if (!canModifySettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">
            You do not have permission to access system settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-full max-w-[1400px] mx-auto px-6 py-6 flex flex-col">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">EMS Logic Controller</h1>
          <p className="text-sm text-gray-500 mt-1">
            Control & Setpoints (Monitoring handled in Analytics)
          </p>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            <PeakShavingCard />

            <PVSelfConsumptionCard />

            <TimeOfUseOptimizationCard />

            <MicrogridIslandingCard />

            <GridServicesCard />
          </div>
        </div>
      </div>
    </div>
  );
}
