'use client';
import { useEffect, useState } from 'react';
import { Sun, Zap, Battery, Home } from 'lucide-react';

interface EnergyData {
  solar: number;
  grid: number;
  battery: number;
  home: number;
}

export function RadialEnergyMonitor() {
  // Fixed state to verify layout - all elements visible and active
  const [energyData] = useState<EnergyData>({
    solar: 5.0,    // Max value (Top visible)
    grid: 2.5,     // Positive import (Left visible)
    battery: -2.0, // Charging (Bottom visible)
    home: 4.5      // Consumption (Right visible)
  });

  const formatPower = (value: number) => {
    return `${Math.abs(value).toFixed(1)} kW`;
  };

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
    solar: { x: 250, y: 85, anchor: 'middle' as const },     // Above icon
    battery: { x: 250, y: 430, anchor: 'middle' as const },  // Below icon
    grid: { x: 80, y: 250, anchor: 'end' as const },         // Left of icon
    home: { x: 420, y: 250, anchor: 'start' as const }       // Right of icon
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

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      {/* CSS Animations for modern effects */}
      <style>{`
        @keyframes hub-pulse {
          0%, 100% { 
            stroke-opacity: 0.4;
            r: 30;
          }
          50% { 
            stroke-opacity: 0.8;
            r: 35;
          }
        }
        
        @keyframes flow-pulse {
          0%, 100% { stroke-opacity: 0.4; }
          50% { stroke-opacity: 1.0; }
        }
        
        .hub-pulse {
          animation: hub-pulse 2s ease-in-out infinite;
        }
        
        .flow-pulse {
          animation: flow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative">
        {/* Main SVG Canvas */}
        <svg viewBox="-20 -20 540 540" className="w-[calc(100vh-6rem)] h-[calc(100vh-6rem)] max-w-none overflow-visible">
          <defs>
            {/* Gradients for flow effects */}
            <linearGradient id="solarFlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.solar} />
              <stop offset="100%" stopColor={colors.battery} />
            </linearGradient>
            <linearGradient id="homeFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.battery} />
              <stop offset="100%" stopColor={colors.home} />
            </linearGradient>
            <linearGradient id="gridFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.grid} />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
            
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

          {/* Active indicators (thick, full opacity) */}
          <path
            d={createArcPath(-40, 40, 210)}
            stroke={colors.solar}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
          />
          
          <path
            d={createArcPath(50, 130, 210)}
            stroke={colors.home}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
          />
          
          <path
            d={createArcPath(140, 220, 210)}
            stroke={colors.battery}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
          />
          
          <path
            d={createArcPath(230, 310, 210)}
            stroke={colors.grid}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
          />

          {/* Hardcoded Flow Lines (Simple and Visible) */}
          <line
            x1={flowLines.solar.x1}
            y1={flowLines.solar.y1}
            x2={flowLines.solar.x2}
            y2={flowLines.solar.y2}
            stroke={colors.solar}
            strokeWidth="6"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          
          <line
            x1={flowLines.battery.x1}
            y1={flowLines.battery.y1}
            x2={flowLines.battery.x2}
            y2={flowLines.battery.y2}
            stroke={colors.battery}
            strokeWidth="6"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          
          <line
            x1={flowLines.grid.x1}
            y1={flowLines.grid.y1}
            x2={flowLines.grid.x2}
            y2={flowLines.grid.y2}
            stroke={colors.grid}
            strokeWidth="6"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          
          <line
            x1={flowLines.home.x1}
            y1={flowLines.home.y1}
            x2={flowLines.home.x2}
            y2={flowLines.home.y2}
            stroke={colors.home}
            strokeWidth="6"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />

          {/* Central Hub (Hollow Ring) */}
          <circle
            cx={centerX}
            cy={centerY}
            r={hubRadius}
            fill="none"
            stroke="#374151"
            strokeWidth="4"
            className="hub-pulse"
            filter="url(#glow)"
          />

          {/* Hardcoded nodes with icons and text */}
          {Object.entries(iconPositions).map(([key, pos]) => {
            const color = colors[key as keyof typeof colors];
            const IconComponent = key === 'solar' ? Sun : 
                               key === 'grid' ? Zap :
                               key === 'battery' ? Battery : Home;
            const value = energyData[key as keyof EnergyData];
            const displayValue = key === 'grid' || key === 'battery' 
              ? `${value >= 0 ? '+' : ''}${value.toFixed(1)}` 
              : formatPower(value);
            const textPos = textPositions[key as keyof typeof textPositions];
            
            return (
              <g key={`node-${key}`}>
                {/* Glassmorphism icon circle */}
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
                  {displayValue} kW
                </text>
              </g>
            );
          })}

          {/* Energy Hub Label */}
          <text
            x={centerX}
            y={centerY + 65}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#6b7280"
            fontSize="12"
            fontWeight="500"
          >
            Energy Hub
          </text>
        </svg>
      </div>
    </div>
  );
}