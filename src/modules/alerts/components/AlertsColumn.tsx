'use client';

import { AlertItem } from './AlertItem';
import type { ColItem } from '../types/alerts';

interface AlertsColumnProps {
  title: string;
  items: ColItem[];
  colorClass?: string;
  gradientClass?: string;
  onRemove?: (id: string) => void;
  minHeightPx?: number;
}

export function AlertsColumn({
  title,
  items,
  colorClass,
  gradientClass,
  onRemove,
  minHeightPx,
}: AlertsColumnProps) {
  const count = items.length;

  const headerGradient =
    gradientClass ??
    (colorClass?.includes('red')
      ? 'bg-gradient-to-r from-red-500 to-red-600'
      : colorClass?.includes('yellow')
      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
      : colorClass?.includes('green')
      ? 'bg-gradient-to-r from-green-500 to-green-600'
      : colorClass?.includes('blue')
      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
      : 'bg-gradient-to-r from-orange-400 to-orange-600');

  const cardBgClass = headerGradient.includes('red')
    ? 'bg-red-50 border-red-100'
    : headerGradient.includes('yellow')
    ? 'bg-yellow-50 border-yellow-100'
    : headerGradient.includes('green')
    ? 'bg-green-50 border-green-100'
    : headerGradient.includes('blue')
    ? 'bg-blue-50 border-blue-100'
    : 'bg-orange-50 border-orange-100';

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl p-4 flex-1 flex flex-col"
      style={minHeightPx ? { height: `${minHeightPx}px` } : { height: '100%', minHeight: '320px' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`${headerGradient} bg-clip-text text-transparent font-semibold text-lg`}>
            {title}
          </div>
        </div>
        <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
          {count}
        </div>
      </div>
     
      <div className="flex-1 mt-1 overflow-y-auto pr-2 min-h-0 alerts-scroll">
        {items.map((it, idx) => {
          const key = it.id ? `${title}-${it.id}` : `${title}-idx-${idx}`;
          return (
            <AlertItem
              key={key}
              item={it}
              gradientClass={headerGradient}
              cardBgClass={cardBgClass}
              onRemove={onRemove}
            />
          );
        })}
      </div>

      <style jsx>{`
        .alerts-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .alerts-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .alerts-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(107,114,128,0.20);
          border-radius: 9999px;
          border: 1px solid transparent;
          background-clip: padding-box;
        }
        .alerts-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(107,114,128,0.20) transparent;
        }
      `}</style>

      <div className="mt-2 pt-1 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
        <div>{items.length} active alerts</div>
        <div>Last updated: 10:02:56 PM</div>
      </div>
    </div>
  );
}
