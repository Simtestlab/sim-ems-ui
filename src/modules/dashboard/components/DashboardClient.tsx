'use client';
import { SelectedSite } from './SelectedSite';

export function DashboardClient() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="pt-4 sm:pt-6 md:pt-8 h-full">
          <div className="pt-2">
          <SelectedSite />
          </div>
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Live</p>
              <p className="text-sm">Site-specific widgets and data will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
