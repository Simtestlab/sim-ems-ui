import React from "react";
import { ENERGY_NODES } from "./energyFlowConfig";
import { getArcPath } from "./arcUtils";

const EnergyFlowGauge = ({
  solar = 2.2,
  battery = 2.2,
  grid = 0,
  load = 4.4,
  size = 350
}) => {
  const center = size / 2;
  const radius = 130;
  const strokeWidth = 20;
  const gapSize = 5;

  const values = { solar, battery, grid, load };
  const maxPossible = Math.max(5, solar, battery, grid, load, (solar + battery + grid + load) / 2);

  const fmt = (v) => `${v.toFixed(1).replace('.', ',')} kW`;

  return (
    <div className="bg-[#fcfdfc] p-8 rounded-lg inline-block font-sans">
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

        {/* Background slots */}
        <g fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth}>
          {Object.values(ENERGY_NODES).map(({ angle }, i) => (
            <path
              key={i}
              d={getArcPath(
                center,
                radius,
                angle[0] + gapSize / 2,
                angle[1] - gapSize / 2
              )}
            />
          ))}
        </g>

        {/* Active segments (scaled by value) */}
        <g fill="none" strokeWidth={strokeWidth}>
          {Object.entries(ENERGY_NODES).map(([key, node]) => {
            const span = node.angle[1] - node.angle[0];
            const start = node.angle[0] + gapSize / 2;
            const proportion = Math.min(1, values[key] / maxPossible || 0);
            const end = start + span * proportion - gapSize;

            return (
              <path
                key={key}
                d={getArcPath(center, radius, start, end)}
                stroke={node.color}
                style={{ transition: 'd 400ms ease' }}
              />
            );
          })}
        </g>

        {/* Center flow indicators - structured to match reference visual */}

        {/* Vertical track */}
        <rect x={center - 6} y={center - 58} width={12} height={116} rx={6} fill="#f5f5f5" />

        {/* Top value (solar) and icon */}
        <g transform={`translate(${center}, ${center - 86})`} textAnchor="middle" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <text x={0} y={0} fontSize={16} fontWeight={700} fill="#111">{fmt(solar)}</text>
          <g transform="translate(-22,12)">
            {(() => {
              const Icon = ENERGY_NODES.solar.Icon;
              return <Icon size={36} color={'#60b4df'} />;
            })()}
          </g>
        </g>

        {/* Vertical chevrons (stacked, animated) - use gradient fill */}
        <g transform={`translate(${center}, ${center - 34})`}>
          <defs>
            <linearGradient id="chevVertGrad" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <g className="chev-vert" style={{ animationDuration: `${Math.max(0.6, 1.6 - (solar / maxPossible))}s` }}>
            <path d="M-12 -2 L0 14 L12 -2 Z" fill="url(#chevVertGrad)" opacity="0.95" />
          </g>
          <g className="chev-vert" style={{ animationDuration: `${Math.max(0.8, 2 - (solar / maxPossible) * 1.2)}s` , animationDelay: '0.25s' }}>
            <path d="M-12 6 L0 22 L12 6 Z" fill="url(#chevVertGrad)" opacity="0.75" />
          </g>
        </g>

        {/* Central horizontal arrows with blended gradient - left (dark), center (grey->white), right (yellow) */}
        <g transform={`translate(${center}, ${center - 4})`}>
          <defs>
            <linearGradient id="hFlowLeft" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="100%" stopColor="#6b6b6b" />
            </linearGradient>
            <linearGradient id="hFlowCenter" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="50%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="hFlowRight" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          <g>
            <path d="M-36 -6 L -10 -6 L -2 -0 L -10 6 L -36 6 Z" fill="url(#hFlowLeft)" />
            <path d="M-8 -6 L 8 -6 L 16 0 L 8 6 L -8 6 Z" fill="url(#hFlowCenter)" />
            <path d="M10 -6 L 36 -6 L 28 0 L 36 6 L 10 6 Z" fill="url(#hFlowRight)" />

            {/* moving white marker across center to indicate flow; speed depends on load */}
            <g className="chev-horz-right" style={{ animationDuration: `${Math.max(0.6, 1.6 - (load / maxPossible))}s` }}>
              <path d="M-6 4 L6 4 L2 0 L2 8 Z" fill="#ffffff" opacity={0.95} transform="translate(0,0)" />
            </g>
          </g>
        </g>

        {/* center downward small green tick (like check) */}
        <g transform={`translate(${center - 6}, ${center + 6})`}>
          <path d="M6 10 L10 14 L18 6" stroke="#10b981" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Bottom battery value and icon */}
        <g transform={`translate(${center}, ${center + 44})`} textAnchor="middle" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <text x={0} y={0} fontSize={16} fontWeight={700} fill="#111">{fmt(battery)}</text>
          <g transform="translate(-22,12)">
            {(() => {
              const Icon = ENERGY_NODES.battery.Icon;
              return <Icon size={36} color={'#10b981'} />;
            })()}
          </g>
        </g>

        {/* Icons & values */}
        {Object.entries(ENERGY_NODES).map(([key, node]) => {
          // avoid rendering quadrant duplicates for solar and battery since
          // those are shown centrally in the gauge (top/bottom)
          if (key === 'solar' || key === 'battery') return null;
          const Icon = node.Icon;

          const positions = {
            solar: { x: center - 40, y: center - 115 },
            load: { x: center + 45, y: center - 40 },
            battery: { x: center - 40, y: center + 60 },
            grid: { x: center - 125, y: center - 40 }
          };

          return (
            <foreignObject
              key={key}
              x={positions[key].x}
              y={positions[key].y}
              width="90"
              height="90"
            >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      color: "#666"
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: "bold" }}>
                      {fmt(values[key])}
                    </span>
                    <Icon size={45} color={node.color} />
                  </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
};

export default EnergyFlowGauge;
