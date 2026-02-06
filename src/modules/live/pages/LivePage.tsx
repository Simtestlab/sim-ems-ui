'use client';

import { Header } from '@/components/Header';
import { SiteTabs } from '@/components/SiteTabs';
import Footer from '@/components/Footer';
import { RadialEnergyMonitor } from '@/modules/live/components/RadialEnergyMonitor';

export function LivePage() {
  return (
    <div className="bg-gray-50 flex flex-col flex-1 min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <Header />
        <SiteTabs />
      </div>

      {/* Main Content - Energy Monitor */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gray-50">
        <div className="flex-1 flex items-center justify-center w-full h-full min-h-0 overflow-hidden">
          <RadialEnergyMonitor />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}