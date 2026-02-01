import React from 'react';
import { PiSolarPanelFill, PiBatteryHighBold } from "react-icons/pi";
import { GiWatchtower } from "react-icons/gi";
import { IoBulb } from "react-icons/io5";

const EnergyMonitor = ({ 
  solar = 2.2, 
  battery = 2.2, 
  grid = 0, 
  load = 4.4,
  size = 350
}) => {
  const center = size / 2;
  const radius = 130;
  const strokeWidth = 20;
  
  // This defines the white space between the segments
  const gapSize = 5; 

  const containerStyle = { 
    background: '#fcfdfc', 
    padding: '30px', 
    borderRadius: '16px', 
    width: 'fit-content', 
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif' 
  };

  // Improved Arc Calculation for perfectly straight, segmented edges
  const getArcPath = (startAngle, endAngle) => {
    const start = { 
      x: center + radius * Math.cos((startAngle - 90) * Math.PI / 180.0), 
      y: center + radius * Math.sin((startAngle - 90) * Math.PI / 180.0) 
    };
    const end = { 
      x: center + radius * Math.cos((endAngle - 90) * Math.PI / 180.0), 
      y: center + radius * Math.sin((endAngle - 90) * Math.PI / 180.0) 
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  return (
    <div style={containerStyle}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="verticalFlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8e95e" />
            <stop offset="48%" stopColor="#fcf7d1" />
            <stop offset="52%" stopColor="#eee8e8" />
            <stop offset="100%" stopColor="#6B7280" />
          </linearGradient>

          <linearGradient id="horizontalFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="30%" stopColor="#405988" />
            <stop offset="100%" stopColor="#0a3ead" />
          </linearGradient>
        </defs>

        {/* --- 1. BACKGROUND SEGMENTS (Grey Slots) --- */}
        <g fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth} strokeLinecap="butt">
          <path d={getArcPath(315 + gapSize/2, 405 - gapSize/2)} />
          <path d={getArcPath(45 + gapSize/2, 135 - gapSize/2)} />
          <path d={getArcPath(135 + gapSize/2, 225 - gapSize/2)} />
          <path d={getArcPath(225 + gapSize/2, 315 - gapSize/2)} />
        </g>

        {/* --- 2. COLORED PROGRESS SEGMENTS --- */}
        <g fill="none" strokeWidth={strokeWidth} strokeLinecap="butt">
          {/* Solar (Top) - Starts exactly at the beginning of the slot */}
          <path d={getArcPath(315 + gapSize/2, 370)} stroke="#F59E0B" />
          
          {/* Load (Right) */}
          <path d={getArcPath(45 + gapSize/2, 110)} stroke="#0a3ead" />
          
          {/* Battery (Bottom) */}
          <path d={getArcPath(135 + gapSize/2, 180)} stroke="#6B7280" />
          
          {/* Grid/Tower (Left) */}
          <path d={getArcPath(225 + gapSize/2, 270)} stroke="#2c5324" />
        </g>

        {/* --- CENTRAL FLOW ARROWS --- */}
        <rect x={center - 5} y={center - 50} width="10" height="110" rx="5" fill="url(#verticalFlow)" />
        
        <g transform={`translate(${center + 12}, ${center - 11})`}>
          <path 
            d="M 0 11 C 0 4, 5 4, 10 4 L 35 4 C 42 4, 45 0, 55 11 C 45 22, 42 18, 35 18 L 10 18 C 5 18, 0 18, 0 11 Z" 
            fill="url(#horizontalFlow)" 
          />
        </g>

        {/* --- ICONS & VALUES --- */}
        <foreignObject x={center - 40} y={center - 115} width="80" height="80">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{solar} kW</span>
            <PiSolarPanelFill size={45} color="#F59E0B" />
          </div>
        </foreignObject>

        <foreignObject x={center + 45} y={center - 40} width="90" height="80">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{load} kW</span>
            <IoBulb size={45} color="#0a3ead" />
          </div>
        </foreignObject>

        <foreignObject x={center - 40} y={center + 55} width="80" height="90">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666' }}>
            <PiBatteryHighBold size={45} color="#6B7280" />
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{battery} kW</span>
          </div>
        </foreignObject>

        <foreignObject x={center - 125} y={center - 40} width="80" height="80">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{grid} kW</span>
            <GiWatchtower size={45} color="#2c5324" />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

export default EnergyMonitor;