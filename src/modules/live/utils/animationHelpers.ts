import { CSSProperties } from 'react';

/**
 * Generates dynamic animation styles for energy flow elements
 * High power values result in faster pulse animations
 * @param isActive - Whether the animation should be active
 * @param value - The energy value (used to calculate pulse speed)
 * @returns CSS style object with animation or empty object
 */
export function getDynamicStyle(isActive: boolean, value: number): CSSProperties {
  if (!isActive) {
    return {};
  }

  // Calculate duration based on energy value
  // High values (closer to 10) get faster animations (closer to 1s)
  // Low values (closer to 0) get slower animations (closer to 4s)
  const duration = Math.max(1, 4 - (Math.abs(value) / 2.5));
  
  return {
    animation: `ring-pulse ${duration.toFixed(1)}s ease-in-out infinite`
  };
}

/**
 * Formats energy value for display with proper sign handling
 * @param value - Raw energy value
 * @param label - Formatted label with units
 * @param showSign - Whether to show +/- signs
 * @returns Formatted display string
 */
export function formatEnergyDisplay(value: number, label: string, showSign: boolean = false): string {
  if (showSign) {
    const sign = value >= 0 ? '+' : '';
    const unit = label.split(' ')[1]; // Extract unit (kW/MW)
    return `${sign}${value.toFixed(1)} ${unit}`;
  }
  return label;
}