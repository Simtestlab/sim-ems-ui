"use client";

import { useLiveTelemetry } from '@/modules/live/context/LiveTelemetryContext';

export default function SystemMetricsBar() {
  const { isConnected } = useLiveTelemetry();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="w-full flex justify-center p-6">
      <div className="max-w-4xl w-full bg-white/80 dark:bg-slate-800/70 rounded-full border border-gray-200 dark:border-slate-700 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Connection:</span>
            <span className="font-medium text-green-600">LIVE DATA</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Source:</span>
            <span className="font-medium">WebSocket</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Status:</span>
            <span className="font-medium text-blue-600">REAL-TIME</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Update Rate:</span>
            <span className="font-medium">1Hz</span>
          </div>
        </div>
      </div>
    </div>
  );
}
