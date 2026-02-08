'use client';
import { Sun, Zap, Battery, BatteryCharging, Home, LucideIcon } from 'lucide-react';

/**
 * Icon selection logic for energy sources based on their current state
 */
export function useEnergyIcons(flows: {
  isBatteryCharging: boolean;
}) {
  const getIconComponent = (key: string): LucideIcon => {
    if (key === 'solar') return Sun;
    if (key === 'grid') return Zap;
    if (key === 'home') return Home;
    if (key === 'battery') {
      if (flows.isBatteryCharging) return BatteryCharging;
      return Battery;
    }
    return Battery;
  };

  return { getIconComponent };
}