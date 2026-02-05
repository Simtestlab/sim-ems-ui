import { SelectedSite } from '@/modules/dashboard/components/SelectedSite';

export default function AlertsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="pt-4 sm:pt-6 md:pt-8 h-full">
          <div className="pt-2">
          <SelectedSite />
          </div>
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Alerts</p>
              <p className="text-sm">Site-specific alerts and data will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
