/**
 * Constants and configuration for the RadialEnergyMonitor component
 */

export const LAYOUT_CONFIG = {
  centerX: 250,
  centerY: 250,
  hubRadius: 20,
  trackRadius: 210,
  nodeRadius: 25
} as const;

export const ICON_POSITIONS = {
  solar: { x: 250, y: 125 },    // Top
  battery: { x: 250, y: 375 },  // Bottom
  grid: { x: 125, y: 250 },     // Left
  home: { x: 375, y: 250 }      // Right
} as const;

export const TEXT_POSITIONS = {
  solar: { x: 250, y: -10, anchor: 'middle' as const },
  battery: { x: 250, y: 495, anchor: 'middle' as const },
  grid: { x: 20, y: 250, anchor: 'end' as const },
  home: { x: 475, y: 250, anchor: 'start' as const }
} as const;

export const FLOW_LINES = {
  solar: { x1: 250, y1: 215, x2: 250, y2: 150 },
  battery: { x1: 250, y1: 285, x2: 250, y2: 350 },
  grid: { x1: 215, y1: 250, x2: 150, y2: 250 },
  home: { x1: 285, y1: 250, x2: 350, y2: 250 }
} as const;

export const COLORS = {
  solar: '#6366f1',     // Indigo
  grid: '#8b5cf6',      // Violet  
  battery: '#10b981',   // Emerald
  home: '#f43f5e'       // Rose
} as const;

export const POSITION_CONFIG = {
  solar: { angle: 0, color: COLORS.solar },      // Top
  home: { angle: 90, color: COLORS.home },       // Right
  battery: { angle: 180, color: COLORS.battery }, // Bottom
  grid: { angle: 270, color: COLORS.grid }       // Left
} as const;

export const ENERGY_UNIT = 'kW';

export const FLOW_SIGNIFICANCE_THRESHOLD = 0.1;