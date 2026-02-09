'use client';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useSmoothValue } from '@/modules/live/hooks/useSmoothValue';
import { useEnergyIcons } from '@/modules/live/hooks/useEnergyIcons';
import { useEnergyArcs } from '@/modules/live/hooks/useEnergyArcs';
import { calculateStrokeWidth } from '../utils/animationHelpers';
import { isFlowSignificant } from '../utils/svgHelpers';
import { getFlowAnimation, getFlowAnimationStyles } from '../utils/flowAnimations';
import { getSvgFilterDefs } from '../utils/svgFilters';
import {
  LAYOUT_CONFIG,
  ICON_POSITIONS,
  TEXT_POSITIONS,
  FLOW_LINES,
  COLORS,
  ENERGY_UNIT
} from '../utils/constants';

export function RadialEnergyMonitor() {
  const energyData = useEnergySimulation();

  // Return null only if completely disconnected (error page will show)
  if (!energyData) {
    return null;
  }

  const { solar, grid, battery, home, flows } = energyData;
  const { getIconComponent } = useEnergyIcons(flows);

  const smoothSolar = useSmoothValue(solar.value, 0.1);
  const smoothGrid = useSmoothValue(Math.abs(grid.value), 0.1);
  const smoothBattery = useSmoothValue(Math.abs(battery.value), 0.1);
  const smoothHome = useSmoothValue(home.value, 0.1);

  const { arcPaths, trackPaths } = useEnergyArcs({
    solar: smoothSolar,
    grid: smoothGrid,
    battery: smoothBattery,
    home: smoothHome
  });

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      {/* CSS Animations for dynamic vector-flow physics */}
      <style>{getFlowAnimationStyles()}</style>

      <div className="relative">
        {/* Main SVG Canvas */}
        <svg viewBox="-50 -50 650 650" className="w-[calc(100vh-6rem)] h-[calc(100vh-6rem)] max-w-none overflow-visible">
          {getSvgFilterDefs()}

          {/* Background tracks (thin, low opacity) */}
          {trackPaths.map(({ key, path, color }) => (
            <path
              key={`track-${key}`}
              d={path}
              stroke={color}
              strokeWidth="8"
              strokeOpacity="0.1"
              strokeLinecap="round"
              fill="none"
            />
          ))}

          {/* Dynamic gauge rings based on energy values */}
          <path
            d={arcPaths.solar}
            stroke={COLORS.solar}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#colored-glow)"
            strokeOpacity={flows.isSolarProducing ? "0.9" : "0.4"}
          />

          <path
            d={arcPaths.home}
            stroke={COLORS.home}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#colored-glow)"
            strokeOpacity={flows.isHomeConsuming ? "0.9" : "0.4"}
          />

          <path
            d={arcPaths.battery}
            stroke={COLORS.battery}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#colored-glow)"
            strokeOpacity={(flows.isBatteryCharging || flows.isBatteryDischarging) ? "0.9" : "0.4"}
          />

          <path
            d={arcPaths.grid}
            stroke={COLORS.grid}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#colored-glow)"
            strokeOpacity={(flows.isGridImporting || flows.isGridExporting) ? "0.9" : "0.4"}
          />

          {/* Flow Lines with Visual Weight & Data Hierarchy */}
          {/* Solar Line: Energy flows inward to hub (production) - always false */}
          <line
            x1={FLOW_LINES.solar.x1}
            y1={FLOW_LINES.solar.y1}
            x2={FLOW_LINES.solar.x2}
            y2={FLOW_LINES.solar.y2}
            stroke={COLORS.solar}
            strokeWidth={calculateStrokeWidth(smoothSolar, 2, 12)}
            strokeOpacity={isFlowSignificant(smoothSolar) ? "0.9" : "0.1"}
            strokeLinecap="round"
            strokeDasharray={isFlowSignificant(smoothSolar) ? "4 8" : "none"}
            style={getFlowAnimation(smoothSolar, isFlowSignificant(smoothSolar), false)}
          />

          {/* Battery Line: Outward when charging (value < 0), inward when discharging (value > 0) */}
          <line
            x1={FLOW_LINES.battery.x1}
            y1={FLOW_LINES.battery.y1}
            x2={FLOW_LINES.battery.x2}
            y2={FLOW_LINES.battery.y2}
            stroke={COLORS.battery}
            strokeWidth={calculateStrokeWidth(smoothBattery, 2, 10)}
            strokeOpacity={isFlowSignificant(smoothBattery) ? "0.9" : "0.1"}
            strokeLinecap="round"
            strokeDasharray={isFlowSignificant(smoothBattery) ? "4 8" : "none"}
            style={getFlowAnimation(smoothBattery, isFlowSignificant(smoothBattery), battery.value < 0)}
          />

          {/* Grid Line: Outward when exporting (value < 0), inward when importing (value > 0) */}
          <line
            x1={FLOW_LINES.grid.x1}
            y1={FLOW_LINES.grid.y1}
            x2={FLOW_LINES.grid.x2}
            y2={FLOW_LINES.grid.y2}
            stroke={COLORS.grid}
            strokeWidth={calculateStrokeWidth(smoothGrid, 2, 12)}
            strokeOpacity={isFlowSignificant(smoothGrid) ? "0.9" : "0.1"}
            strokeLinecap="round"
            strokeDasharray={isFlowSignificant(smoothGrid) ? "4 8" : "none"}
            style={getFlowAnimation(smoothGrid, isFlowSignificant(smoothGrid), grid.value < 0)}
          />

          {/* Home Line: Energy always flows outward for consumption - always true */}
          <line
            x1={FLOW_LINES.home.x1}
            y1={FLOW_LINES.home.y1}
            x2={FLOW_LINES.home.x2}
            y2={FLOW_LINES.home.y2}
            stroke={COLORS.home}
            strokeWidth={calculateStrokeWidth(smoothHome, 3, 14)}
            strokeOpacity={isFlowSignificant(smoothHome) ? "0.9" : "0.1"}
            strokeLinecap="round"
            strokeDasharray={isFlowSignificant(smoothHome) ? "4 8" : "none"}
            style={getFlowAnimation(smoothHome, isFlowSignificant(smoothHome), true)}
          />

          {/* Central Hub (Solid Core) */}
          <circle
            cx={LAYOUT_CONFIG.centerX}
            cy={LAYOUT_CONFIG.centerY}
            r={LAYOUT_CONFIG.hubRadius}
            fill="#f3f4f6"
            stroke="#e5e7eb"
            strokeWidth="2"
            filter="url(#hub-glow)"
          />

          {/* Hardcoded nodes with icons and text */}
          {Object.entries(ICON_POSITIONS).map(([key, pos]) => {
            const color = COLORS[key as keyof typeof COLORS];
            const IconComponent = getIconComponent(key);
            const energyValue = key === 'solar' ? solar : key === 'grid' ? grid : key === 'battery' ? battery : home;

            // Parse the display value and unit for professional typography
            const rawValue = Math.abs(energyValue.value);
            const unit = ENERGY_UNIT;
            const valueText = rawValue.toFixed(1);

            const textPos = TEXT_POSITIONS[key as keyof typeof TEXT_POSITIONS];

            return (
              <g key={`node-${key}`}>
                {/* State-aware node with physics effects */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={LAYOUT_CONFIG.nodeRadius}
                  fill="rgba(255,255,255,0.9)"
                  stroke={color}
                  strokeWidth="3"
                  filter="url(#glass)"
                  style={{ backdropFilter: 'blur(10px)' }}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={LAYOUT_CONFIG.nodeRadius}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                />
                <foreignObject
                  x={pos.x - 14}
                  y={pos.y - 14}
                  width="28"
                  height="28"
                >
                  <IconComponent
                    size={28}
                    style={{ color }}
                  />
                </foreignObject>

                {/* Professional Typography Hierarchy */}
                {/* Label (Top) */}
                <text
                  x={textPos.x}
                  y={textPos.y - 20}
                  textAnchor={textPos.anchor}
                  dominantBaseline="central"
                  fill={color}
                  fontSize="10"
                  fontWeight="600"
                  style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                  {key}
                </text>

                {/* Value (Middle) */}
                <text
                  x={textPos.x}
                  y={textPos.y + 5}
                  textAnchor={textPos.anchor}
                  dominantBaseline="central"
                  fill="#111827"
                  fontSize="24"
                  fontWeight="700"
                >
                  {valueText}
                </text>

                {/* Unit (Bottom) */}
                <text
                  x={textPos.x}
                  y={textPos.y + 25}
                  textAnchor={textPos.anchor}
                  dominantBaseline="central"
                  fill="#6b7280"
                  fontSize="12"
                  fontWeight="500"
                >
                  {unit}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}