'use client';
import { Sun, Zap, Battery, BatteryCharging, Home } from 'lucide-react';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useSmoothValue } from '@/modules/live/hooks/useSmoothValue';
import { calculateStrokeWidth, calculateArcAngle, formatEnergyDisplay } from '../utils/animationHelpers';

export function RadialEnergyMonitor() {
  // Use the centralized energy simulation hook
  const { solar, grid, battery, home, flows } = useEnergySimulation();

  // Smooth value interpolation to prevent SVG path distortion
  const smoothSolar = useSmoothValue(solar.value, 0.1);
  const smoothGrid = useSmoothValue(Math.abs(grid.value), 0.1);
  const smoothBattery = useSmoothValue(Math.abs(battery.value), 0.1);
  const smoothHome = useSmoothValue(home.value, 0.1);

  // Fixed coordinate system (500x500 Canvas)
  const centerX = 250;
  const centerY = 250;
  const hubRadius = 35;

  // Hardcoded icon positions (cardinal directions)
  const iconPositions = {
    solar: { x: 250, y: 125 },    // Top
    battery: { x: 250, y: 375 },  // Bottom
    grid: { x: 125, y: 250 },     // Left
    home: { x: 375, y: 250 }      // Right
  };

  // Hardcoded text positions (clear of icons)
  const textPositions = {
    solar: { x: 250, y: 10, anchor: 'middle' as const },     // Much higher above icon
    battery: { x: 250, y: 495, anchor: 'middle' as const },  // Much lower below icon
    grid: { x: 20, y: 250, anchor: 'end' as const },         // Much further left
    home: { x: 475, y: 250, anchor: 'start' as const }       // Much further right
  };

  // Hardcoded flow line coordinates
  const flowLines = {
    solar: { x1: 250, y1: 215, x2: 250, y2: 150 },    // Hub top to Solar bottom
    battery: { x1: 250, y1: 285, x2: 250, y2: 350 },  // Hub bottom to Battery top
    grid: { x1: 215, y1: 250, x2: 150, y2: 250 },     // Hub left to Grid right
    home: { x1: 285, y1: 250, x2: 350, y2: 250 }      // Hub right to Home left
  };

  // Modern tech color palette
  const colors = {
    solar: '#6366f1',     // Indigo
    grid: '#8b5cf6',      // Violet  
    battery: '#10b981',   // Emerald
    home: '#f43f5e'       // Rose
  };

  // Polar coordinate helper function (kept for track arcs only)
  const getPointOnCircle = (angleInDegrees: number, radius: number) => {
    const angleRad = (angleInDegrees - 90) * Math.PI / 180; // -90 to start from top
    return {
      x: Math.round((centerX + radius * Math.cos(angleRad)) * 1000) / 1000,
      y: Math.round((centerY + radius * Math.sin(angleRad)) * 1000) / 1000
    };
  };

  // Calculate positions for each energy source (for track arcs)
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
    // Interpolate between 3s (slow, low power) and 0.8s (fast, high power)
    return 3 - (ratio * 2.2); // Returns 3s to 0.8s
  };

  // Smart filtering for low-energy flows
  const isFlowSignificant = (value: number): boolean => Math.abs(value) > 0.1;

  // Helper function to determine animation direction based on flow
  const getFlowAnimation = (
    value: number,
    isActive: boolean,
    isFlowingOutward: boolean // true if energy flows AWAY from hub, false if TO hub
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
            stroke-dashoffset: 20;
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
        <svg viewBox="-20 -20 580 580" className="w-[calc(100vh-6rem)] h-[calc(100vh-6rem)] max-w-none overflow-visible">
          <defs>
            {/* Glow filter for active elements */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Drop shadow filter for depth */}
            <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
            </filter>
            
            {/* Glassmorphism filter */}
            <filter id="glass">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
              <feOffset dx="0" dy="1" result="offset"/>
              <feFlood floodColor="rgba(255,255,255,0.2)"/>
              <feComposite in2="offset" operator="atop"/>
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
              filter="url(#dropshadow)"
            />
          ))}

          {/* Dynamic gauge rings based on energy values */}
          <path
            d={(() => {
              const angleSpan = calculateArcAngle(smoothSolar);
              return createArcPath(-angleSpan/2, angleSpan/2, 210);
            })()}
            stroke={colors.solar}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
            strokeOpacity={flows.isSolarProducing ? "0.9" : "0.4"}
          />
          
          <path
            d={(() => {
              const angleSpan = calculateArcAngle(smoothHome);
              return createArcPath(90 - angleSpan/2, 90 + angleSpan/2, 210);
            })()}
            stroke={colors.home}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
            strokeOpacity={flows.isHomeConsuming ? "0.9" : "0.4"}
          />
          
          <path
            d={(() => {
              const angleSpan = calculateArcAngle(smoothBattery);
              return createArcPath(180 - angleSpan/2, 180 + angleSpan/2, 210);
            })()}
            stroke={colors.battery}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
            strokeOpacity={(flows.isBatteryCharging || flows.isBatteryDischarging) ? "0.9" : "0.4"}
          />
          
          <path
            d={(() => {
              const angleSpan = calculateArcAngle(smoothGrid);
              return createArcPath(270 - angleSpan/2, 270 + angleSpan/2, 210);
            })()}
            stroke={colors.grid}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
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
            strokeDasharray={isFlowSignificant(smoothSolar) ? "10 5" : "none"}
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
            strokeDasharray={isFlowSignificant(smoothBattery) ? "10 5" : "none"}
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
            strokeDasharray={isFlowSignificant(smoothGrid) ? "10 5" : "none"}
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
            strokeDasharray={isFlowSignificant(smoothHome) ? "10 5" : "none"}
            style={getFlowAnimation(smoothHome, isFlowSignificant(smoothHome), true)}
          />

          {/* Central Hub (Hollow Ring) */}
          <circle
            cx={centerX}
            cy={centerY}
            r={hubRadius}
            fill="none"
            stroke="#374151"
            strokeWidth="4"
            filter="url(#glow)"
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
                return Battery; // Default for discharging or idle
              }
              return Battery;
            };
            
            const IconComponent = getIconComponent();
            const energyValue = key === 'solar' ? solar :
                             key === 'grid' ? grid :
                             key === 'battery' ? battery : home;
            const displayValue = key === 'grid' || key === 'battery' 
              ? formatEnergyDisplay(energyValue.value, energyValue.label, true)
              : energyValue.label;
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
                  filter="url(#dropshadow)"
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
                
                {/* Hardcoded text labels */}
                <text
                  x={textPos.x}
                  y={textPos.y - 10}
                  textAnchor={textPos.anchor}
                  dominantBaseline="central"
                  fill={color}
                  fontSize="16"
                  fontWeight="600"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </text>
                <text
                  x={textPos.x}
                  y={textPos.y + 10}
                  textAnchor={textPos.anchor}
                  dominantBaseline="central"
                  fill="#374151"
                  fontSize="14"
                  fontWeight="700"
                >
                  {displayValue}
                </text>
              </g>
            );
          })}

          {/* Energy Hub Label */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#6b7280"
            fontSize="10"
            fontWeight="500"
          >
            Energy Hub
          </text>
        </svg>
      </div>
    </div>
  );
}