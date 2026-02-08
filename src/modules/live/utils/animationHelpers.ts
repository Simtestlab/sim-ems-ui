import { CSSProperties } from 'react';

/**
 * Maps energy values to stroke width for visual proportionality
 * @param value - The energy value (0-10kW typical range)
 * @param min - Minimum stroke width in pixels
 * @param max - Maximum stroke width in pixels
 * @returns Calculated stroke width
 */
export function calculateStrokeWidth(value: number, min: number = 2, max: number = 10): number {
  const absValue = Math.abs(value);
  const maxCapacity = 10; // Assume 10kW as max for scaling
  const ratio = Math.min(absValue / maxCapacity, 1); // Cap at 1.0
  return min + (ratio * (max - min));
}

/**
 * Calculates arc angle span based on energy value for gauge-like rings
 * @param value - The energy value
 * @param maxCapacity - Maximum capacity for scaling (default 10kW)
 * @param maxAngleSpan - Maximum angle span in degrees (default 80°)
 * @param minAngleSpan - Minimum angle span in degrees (default 10°)
 * @returns Angle span in degrees
 */
export function calculateArcAngle(value: number, maxCapacity: number = 10, maxAngleSpan: number = 80, minAngleSpan: number = 10): number {
  const absValue = Math.abs(value);
  const ratio = Math.min(absValue / maxCapacity, 1);
  return minAngleSpan + (ratio * (maxAngleSpan - minAngleSpan));
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