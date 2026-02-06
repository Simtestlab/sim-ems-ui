'use client';
import { Sun, Zap, Battery, BatteryCharging, Home } from 'lucide-react';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useSmoothValue } from '@/modules/live/hooks/useSmoothValue';
import { calculateStrokeWidth, calculateArcAngle, formatEnergyDisplay } from '../utils/animationHelpers';

export function RadialEnergyMonitor() {
  const { solar, grid, battery, home, flows } = useEnergySimulation();

  const smoothSolar = useSmoothValue(solar.value, 0.1);
  const smoothGrid = useSmoothValue(Math.abs(grid.value), 0.1);
  const smoothBattery = useSmoothValue(Math.abs(battery.value), 0.1);
  const smoothHome = useSmoothValue(home.value, 0.1);
  const centerX = 250;
  const centerY = 250;
  const hubRadius = 20;

  const iconPositions = {
    solar: { x: 250, y: 125 },    // Top
    battery: { x: 250, y: 375 },  // Bottom
    grid: { x: 125, y: 250 },     // Left
    home: { x: 375, y: 250 }      // Right
  };

  const textPositions = {
    solar: { x: 250, y: -10, anchor: 'middle' as const },
    battery: { x: 250, y: 495, anchor: 'middle' as const },
    grid: { x: 20, y: 250, anchor: 'end' as const },
    home: { x: 475, y: 250, anchor: 'start' as const }
  };

  // Hardcoded flow line coordinates
  const flowLines = {
    solar: { x1: 250, y1: 215, x2: 250, y2: 150 },
    battery: { x1: 250, y1: 285, x2: 250, y2: 350 },
    grid: { x1: 215, y1: 250, x2: 150, y2: 250 },
    home: { x1: 285, y1: 250, x2: 350, y2: 250 }
  };

  // Modern tech color palette
  const colors = {
    solar: '#6366f1',     // Indigo
    grid: '#8b5cf6',      // Violet  
    battery: '#10b981',   // Emerald
    home: '#f43f5e'       // Rose
  };

  const getPointOnCircle = (angleInDegrees: number, radius: number) => {
    const angleRad = (angleInDegrees - 90) * Math.PI / 180;
    return {
      x: Math.round((centerX + radius * Math.cos(angleRad)) * 1000) / 1000,
      y: Math.round((centerY + radius * Math.sin(angleRad)) * 1000) / 1000
    };
  };

  const positions = {
    solar: { angle: 0, color: colors.solar },      // Top
    home: { angle: 90, color: colors.home },       // Right
    battery: { angle: 180, color: colors.battery }, // Bottom
    grid: { angle: 270, color: colors.grid }       // Left
  };

  // Create arc path for track segments
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = getPointOnCircle(startAngle, radius);
    const end = getPointOnCircle(endAngle, radius);
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // Helper function to calculate animation duration based on energy magnitude
  const calculateAnimationDuration = (value: number, maxValue: number = 10): number => {
    const absValue = Math.abs(value);
    const ratio = Math.min(absValue / maxValue, 1);
    return 3 - (ratio * 2.5);
  };

  // Smart filtering for low-energy flows
  const isFlowSignificant = (value: number): boolean => Math.abs(value) > 0.1;

  // Helper function to determine animation direction based on flow
  const getFlowAnimation = (
    value: number,
    isActive: boolean,
    isFlowingOutward: boolean
  ) => {
    if (!isActive || !isFlowSignificant(value)) {
      return {
        animationPlayState: 'paused'
      };
    }

    const duration = calculateAnimationDuration(value);
    const direction = isFlowingOutward ? 'normal' : 'reverse';

    return {
      animationName: 'dash-move',
      animationDuration: `${duration}s`,
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      animationDirection: direction,
      animationPlayState: 'running'
    };
  };

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      {/* CSS Animations for dynamic vector-flow physics */}
      <style>{`
        @keyframes dash-move {
          0% { 
            stroke-dashoffset: 0;
          }
          100% { 
            stroke-dashoffset: 24;
          }
        }
        
        .solar-flow-animation {
          animation: dash-move 2s linear infinite;
        }
        
        @keyframes breathing-opacity {
          0% { 
            opacity: 0.8;
          }
          50% { 
            opacity: 1;
          }
          100% { 
            opacity: 0.8;
          }
        }
      `}</style>

      <div className="relative">
        {/* Main SVG Canvas */}
        <svg viewBox="-50 -50 650 650" className="w-[calc(100vh-6rem)] h-[calc(100vh-6rem)] max-w-none overflow-visible">
          <defs>
            {/* Colored glow filter for luminescent effects */}
            <filter id="colored-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Hub glow filter for the central core */}
            <filter id="hub-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.1)" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glassmorphism filter */}
            <filter id="glass">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
              <feOffset dx="0" dy="1" result="offset" />
              <feFlood floodColor="rgba(255,255,255,0.2)" />
              <feComposite in2="offset" operator="atop" />
            </filter>
          </defs>

          {/* Background tracks (thin, low opacity) */}
          {Object.entries(positions).map(([key, { angle, color }]) => (
            <path
              key={`track-${key}`}
              d={createArcPath(angle - 40, angle + 40, 210)}
              stroke={color}
              strokeWidth="8"
              strokeOpacity="0.1"
              strokeLinecap="round"
              fill="none"
            />
          ))}

          {/* Dynamic gauge rings based on energy values */}
          <path
            d={(() => {
              const angleSpan = calculateArcAngle(smoothSolar);
              return createArcPath(-angleSpan / 2, angleSpan / 2, 210);
            })()}
            stroke={colors.solar}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#colored-glow)"
            strokeOpacity={flows.isSolarProducing ? "0.9" : "0.4"}
          />

          <path
            d={(() => {
              const angleSpan = calculateArcAngle(smoothHome);
              return createArcPath(90 - angleSpan / 2, 90 + angleSpan / 2, 210);
            })()}
            stroke={colors.home}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#colored-glow)"
            strokeOpacity={flows.isHomeConsuming ? "0.9" : "0.4"}
          />

          <path
            d={(() => {
              const angleSpan = calculateArcAngle(smoothBattery);
              return createArcPath(180 - angleSpan / 2, 180 + angleSpan / 2, 210);
            })()}
            stroke={colors.battery}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#colored-glow)"
            strokeOpacity={(flows.isBatteryCharging || flows.isBatteryDischarging) ? "0.9" : "0.4"}
          />

          <path
            d={(() => {
              const angleSpan = calculateArcAngle(smoothGrid);
              return createArcPath(270 - angleSpan / 2, 270 + angleSpan / 2, 210);
            })()}
            stroke={colors.grid}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#colored-glow)"
            strokeOpacity={(flows.isGridImporting || flows.isGridExporting) ? "0.9" : "0.4"}
          />

          {/* Flow Lines with Visual Weight & Data Hierarchy */}
          {/* Solar Line: Energy flows inward to hub (production) - always false */}
          <line
            x1={flowLines.solar.x1}
            y1={flowLines.solar.y1}
            x2={flowLines.solar.x2}
            y2={flowLines.solar.y2}
            stroke={colors.solar}
            strokeWidth={calculateStrokeWidth(smoothSolar, 2, 12)}
            strokeOpacity={isFlowSignificant(smoothSolar) ? "0.9" : "0.1"}
            strokeLinecap="round"
            strokeDasharray={isFlowSignificant(smoothSolar) ? "4 8" : "none"}
            style={getFlowAnimation(smoothSolar, isFlowSignificant(smoothSolar), false)}
          />

          {/* Battery Line: Outward when charging (value < 0), inward when discharging (value > 0) */}
          <line
            x1={flowLines.battery.x1}
            y1={flowLines.battery.y1}
            x2={flowLines.battery.x2}
            y2={flowLines.battery.y2}
            stroke={colors.battery}
            strokeWidth={calculateStrokeWidth(smoothBattery, 2, 10)}
            strokeOpacity={isFlowSignificant(smoothBattery) ? "0.9" : "0.1"}
            strokeLinecap="round"
            strokeDasharray={isFlowSignificant(smoothBattery) ? "4 8" : "none"}
            style={getFlowAnimation(smoothBattery, isFlowSignificant(smoothBattery), battery.value < 0)}
          />

          {/* Grid Line: Outward when exporting (value < 0), inward when importing (value > 0) */}
          <line
            x1={flowLines.grid.x1}
            y1={flowLines.grid.y1}
            x2={flowLines.grid.x2}
            y2={flowLines.grid.y2}
            stroke={colors.grid}
            strokeWidth={calculateStrokeWidth(smoothGrid, 2, 12)}
            strokeOpacity={isFlowSignificant(smoothGrid) ? "0.9" : "0.1"}
            strokeLinecap="round"
            strokeDasharray={isFlowSignificant(smoothGrid) ? "4 8" : "none"}
            style={getFlowAnimation(smoothGrid, isFlowSignificant(smoothGrid), grid.value < 0)}
          />

          {/* Home Line: Energy always flows outward for consumption - always true */}
          <line
            x1={flowLines.home.x1}
            y1={flowLines.home.y1}
            x2={flowLines.home.x2}
            y2={flowLines.home.y2}
            stroke={colors.home}
            strokeWidth={calculateStrokeWidth(smoothHome, 3, 14)}
            strokeOpacity={isFlowSignificant(smoothHome) ? "0.9" : "0.1"}
            strokeLinecap="round"
            strokeDasharray={isFlowSignificant(smoothHome) ? "4 8" : "none"}
            style={getFlowAnimation(smoothHome, isFlowSignificant(smoothHome), true)}
          />

          {/* Central Hub (Solid Core) */}
          <circle
            cx={centerX}
            cy={centerY}
            r={hubRadius}
            fill="#f3f4f6"
            stroke="#e5e7eb"
            strokeWidth="2"
            filter="url(#hub-glow)"
          />

          {/* Hardcoded nodes with icons and text */}
          {Object.entries(iconPositions).map(([key, pos]) => {
            const color = colors[key as keyof typeof colors];

            // Dynamic icon selection based on battery state
            const getIconComponent = () => {
              if (key === 'solar') return Sun;
              if (key === 'grid') return Zap;
              if (key === 'home') return Home;
              if (key === 'battery') {
                if (flows.isBatteryCharging) return BatteryCharging;
                return Battery;
              }
              return Battery;
            };

            const IconComponent = getIconComponent();
            const energyValue = key === 'solar' ? solar : key === 'grid' ? grid : key === 'battery' ? battery : home;

            // Parse the display value and unit for professional typography
            const rawValue = Math.abs(energyValue.value);
            const unit = 'kW';
            const valueText = rawValue.toFixed(1);

            const textPos = textPositions[key as keyof typeof textPositions];

            return (
              <g key={`node-${key}`}>
                {/* State-aware node with physics effects */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="25"
                  fill="rgba(255,255,255,0.9)"
                  stroke={color}
                  strokeWidth="3"
                  filter="url(#glass)"
                  style={{ backdropFilter: 'blur(10px)' }}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="25"
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