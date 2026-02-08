'use client';
import { calculateArcAngle } from '../utils/animationHelpers';
import { createArcPath } from '../utils/svgHelpers';
import { POSITION_CONFIG, LAYOUT_CONFIG } from '../utils/constants';

/**
 * Hook for calculating dynamic arc paths for energy gauges
 */
export function useEnergyArcs(energyValues: {
  solar: number;
  grid: number;
  battery: number;
  home: number;
}) {
  const getArcPath = (key: keyof typeof energyValues, value: number): string => {
    const config = POSITION_CONFIG[key];
    const angleSpan = calculateArcAngle(value);
    return createArcPath(
      config.angle - angleSpan / 2,
      config.angle + angleSpan / 2,
      LAYOUT_CONFIG.trackRadius
    );
  };

  const arcPaths = {
    solar: getArcPath('solar', energyValues.solar),
    grid: getArcPath('grid', energyValues.grid),
    battery: getArcPath('battery', energyValues.battery),
    home: getArcPath('home', energyValues.home)
  };

  const trackPaths = Object.entries(POSITION_CONFIG).map(([key, { angle, color }]) => ({
    key,
    path: createArcPath(angle - 40, angle + 40, LAYOUT_CONFIG.trackRadius),
    color
  }));

  return { arcPaths, trackPaths };
}