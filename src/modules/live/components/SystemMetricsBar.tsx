"use client";
import React from 'react';

export default function SystemMetricsBar() {
  return (
    <div className="w-full flex justify-center p-6">
      <div className="max-w-4xl w-full bg-white/80 dark:bg-slate-800/70 rounded-full border border-gray-200 dark:border-slate-700 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Self-Consumption:</span>
            <span className="font-medium">86%</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Efficiency:</span>
            <span className="font-medium">37%</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Cost-Savings:</span>
            <span className="font-medium">$100</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">CO₂ Saved:</span>
            <span className="font-medium">420kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
