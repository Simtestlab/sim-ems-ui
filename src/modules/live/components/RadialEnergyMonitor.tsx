'use client';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useSmoothValue } from '@/modules/live/hooks/useSmoothValue';
import { useEnergyIcons } from '@/modules/live/hooks/useEnergyIcons';
import { useEnergyArcs } from '@/modules/live/hooks/useEnergyArcs';
import { useNavStore } from '@/store/useNavStore';
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
  const { selectedSite } = useNavStore();
  const energyData = useEnergySimulation(selectedSite);

  // Call all hooks before any conditional returns to maintain hook order
  // Provide default values to ensure component can render even without data
  const defaultFlows = {
    isSolarProducing: false,
    isBatteryCharging: false,
    isBatteryDischarging: false,
    isGridImporting: false,
    isGridExporting: false,
    isHomeConsuming: false
  };

  const flows = energyData?.flows || defaultFlows;
  const solar = energyData?.solar || { value: 0, label: '0 kW' };
  const grid = energyData?.grid || { value: 0, label: '0 kW' };
  const battery = energyData?.battery || { value: 0, label: '0 kW' };
  const home = energyData?.home || { value: 0, label: '0 kW' };

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
    <div className="relative w-full h-full flex items-center justify-center min-w-0 min-h-0">
      {/* CSS Animations for dynamic vector-flow physics */}
      <style>{getFlowAnimationStyles()}</style>

      <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">
        {/* Main SVG Canvas - Fully responsive and viewport-aware */}
        <svg 
          viewBox="-10 -30 500 550" 
          className="w-full h-full max-w-full max-h-full overflow-visible drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
        >
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

          {/* Central Hub (Modern Design) */}
          <circle
            cx={LAYOUT_CONFIG.centerX}
            cy={LAYOUT_CONFIG.centerY}
            r={LAYOUT_CONFIG.hubRadius + 8}
            fill="rgba(248, 250, 252, 0.9)"
            stroke="rgba(226, 232, 240, 0.8)"
            strokeWidth="1"
            filter="url(#hub-glow)"
          />
          <circle
            cx={LAYOUT_CONFIG.centerX}
            cy={LAYOUT_CONFIG.centerY}
            r={LAYOUT_CONFIG.hubRadius}
            fill="rgba(255, 255, 255, 0.95)"
            stroke="rgba(203, 213, 225, 0.6)"
            strokeWidth="2"
          />
          {/* Central indicator dot */}
          <circle
            cx={LAYOUT_CONFIG.centerX}
            cy={LAYOUT_CONFIG.centerY}
            r="4"
            fill="rgba(71, 85, 105, 0.8)"
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
                {/* Enhanced nodes with modern styling */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={LAYOUT_CONFIG.nodeRadius + 3}
                  fill="rgba(255,255,255,0.1)"
                  stroke="none"
                  filter="url(#glass)"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={LAYOUT_CONFIG.nodeRadius}
                  fill="rgba(255,255,255,0.95)"
                  stroke={color}
                  strokeWidth="2.5"
                  filter="url(#glass)"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={LAYOUT_CONFIG.nodeRadius - 2}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity="0.3"
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

                {/* Enhanced Typography Hierarchy */}
                {/* Label (Top) */}
                <text
                  x={textPos.x}
                  y={textPos.y - 22}
                  textAnchor={textPos.anchor}
                  dominantBaseline="central"
                  fill={color}
                  fontSize="9"
                  fontWeight="700"
                  style={{ textTransform: 'uppercase', letterSpacing: '1.5px' }}
                >
                  {key}
                </text>

                {/* Value (Middle) */}
                <text
                  x={textPos.x}
                  y={textPos.y + 8}
                  textAnchor={textPos.anchor}
                  dominantBaseline="central"
                  fill="#0f172a"
                  fontSize="22"
                  fontWeight="800"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {valueText}
                </text>

                {/* Unit (Bottom) */}
                <text
                  x={textPos.x}
                  y={textPos.y + 28}
                  textAnchor={textPos.anchor}
                  dominantBaseline="central"
                  fill="#64748b"
                  fontSize="11"
                  fontWeight="600"
                  style={{ letterSpacing: '0.5px' }}
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