'use client';
import { useSiteStore } from '@/store/useSiteStore';
import { ExtendedSiteConfig } from '../constants/mockData';

export default function SiteSidePanel() {
  const activeSite = useSiteStore((state) => state.activeSite) as ExtendedSiteConfig | null;

  if (!activeSite) return null;

  const getStatusColor = (cap: number) => {
    if (cap > 12) return 'text-green-600';
    if (cap >= 7) return 'text-orange-500';
    return 'text-red-600';
  };

  const colorClass = getStatusColor(activeSite.capacity);

  return (
    <div className="p-8 space-y-12 font-sans text-gray-800">
      {/* Site Identity */}
      <section>
        <h2 className="text-xl font-bold border-b border-gray-100 pb-2 mb-6 tracking-tight">Site Identity</h2>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500">Site Name:</span>
            <span className="font-semibold text-right w-1/2">{activeSite.name}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500">Location:</span>
            <span className="font-medium text-right w-1/2">{activeSite.locationName}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500">System Capacity:</span>
            <span className={`font-bold ${colorClass}`}>{activeSite.capacity} kW</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500">Status:</span>
            <span className={`font-bold uppercase ${colorClass}`}>● Online</span>
          </div>
        </div>
      </section>

      {/* Live Health */}
      <section>
        <h2 className="text-xl font-bold border-b border-gray-100 pb-2 mb-6 tracking-tight">Live Health</h2>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Connection Quality:</span>
            <span className={`font-bold ${colorClass}`}>Strong</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Last Active:</span>
            <span className="font-medium">2 seconds ago</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Current Mode:</span>
            <span className={`font-bold ${colorClass}`}>{activeSite.capacity} kW</span>
          </div>
        </div>
      </section>

      {/* Energy Pulse (Text Only) */}
      <section>
        <h2 className="text-xl font-bold border-b border-gray-100 pb-2 mb-6 tracking-tight">Energy Pulse</h2>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Battery Status:</span>
            <span className={`font-bold ${colorClass}`}>85%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Grid Status:</span>
            <span className="font-bold italic text-orange-600">Exporting 200W</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Active Issues:</span>
            <span className="font-bold">1 Alerts</span>
          </div>
        </div>
      </section>
    </div>
  );
}