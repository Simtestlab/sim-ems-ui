import { LAYOUT_CONFIG } from './constants';

/**
 * Calculates a point on a circle given an angle and radius
 */
export function getPointOnCircle(angleInDegrees: number, radius: number) {
  const angleRad = (angleInDegrees - 90) * Math.PI / 180;
  return {
    x: Math.round((LAYOUT_CONFIG.centerX + radius * Math.cos(angleRad)) * 1000) / 1000,
    y: Math.round((LAYOUT_CONFIG.centerY + radius * Math.sin(angleRad)) * 1000) / 1000
  };
}

/**
 * Creates an SVG arc path between two angles
 */
export function createArcPath(startAngle: number, endAngle: number, radius: number): string {
  const start = getPointOnCircle(startAngle, radius);
  const end = getPointOnCircle(endAngle, radius);
  const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

/**
 * Calculates animation duration based on energy magnitude
 */
export function calculateAnimationDuration(value: number, maxValue: number = 10): number {
  const absValue = Math.abs(value);
  const ratio = Math.min(absValue / maxValue, 1);
  return 3 - (ratio * 2.5);
}

/**
 * Determines if a flow is significant enough to show visual effects
 */
export function isFlowSignificant(value: number, threshold: number = 0.1): boolean {
  return Math.abs(value) > threshold;
}