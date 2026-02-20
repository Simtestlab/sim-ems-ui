'use client';

import { usePermissions } from '@/modules/auth/hooks/usePermissions';
import { useNavStore } from '@/store/useNavStore';
import { getSiteConfig } from '@/config/sites';
import PeakShavingCard from '@/modules/controller/components/PeakShavingCard';
import PVSelfConsumptionCard from '@/modules/controller/components/PVSelfConsumptionCard';
import TimeOfUseOptimizationCard from '@/modules/controller/components/TimeOfUseOptimizationCard';
import MicrogridIslandingCard from '@/modules/controller/components/MicrogridIslandingCard';
import GridServicesCard from '@/modules/controller/components/GridServicesCard';

export default function ControllerPage() {
  const { canModifySettings } = usePermissions();
  const { selectedSite } = useNavStore();
  const siteConfig = getSiteConfig(selectedSite);
  const siteName = siteConfig?.name ?? selectedSite;

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
      <div className="h-full max-w-[1400px] mx-auto px-6 pt-2 pb-6 flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
          <div key={selectedSite} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
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
