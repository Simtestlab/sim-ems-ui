'use client';

import React from 'react';
import type { ColItem } from '../types/alerts';

interface AlertItemProps {
  item: ColItem;
  gradientClass?: string;
  cardBgClass?: string;
  onRemove?: (id: string) => void;
}


export function AlertItem({ item, gradientClass, cardBgClass, onRemove }: AlertItemProps) {
  return (
    <div className="mb-4">
      <div className={`${cardBgClass ?? 'bg-white border border-gray-200'} rounded-lg p-3 border min-h-[96px]`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-gray-600 font-semibold">{item.title}</div>
            <div className="text-sm text-gray-700 mt-1">{item.desc}</div>
            <div className="text-xs text-gray-400 mt-2">{item.time}</div>
          </div>
          <div className="ml-2">
            <button
              aria-label={`Dismiss ${item.title}`}
              onClick={() => onRemove?.(item.id)}
              className="text-gray-400 hover:text-gray-700 rounded-full p-1"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
