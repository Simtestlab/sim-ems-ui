"use client"

import StatusBadge from '@/shared/components/pv/StatusBadge'
import DashboardCard from '@/modules/dashboard/components/DashboardCard'
import { ChevronRight } from 'lucide-react'
import FaultAlertCard from './FaultAlertCard'
import RealtimeMetrics from './RealtimeMetrics'

export default function StackCard() {
  return (
    <DashboardCard className="rounded-lg p-4 w-full" title={null} settings={false}>
      <div className="flex gap-4 min-h-[380px]">
        {/* LEFT STACK PANEL */}
        <div className="w-[320px] flex-shrink-0 flex flex-col rounded-[12px] border border-[#e6edf5] bg-white p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h4 className="text-[20px] font-semibold text-[#111827]">1#Stack</h4>
              <button className="text-[#9aa4b2] hover:text-[#111827]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="ml-auto">
              <StatusBadge status="normal" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            {/* BESS isometric cabinet illustration */}
            <svg width="220" height="190" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(20, 10)">

                {/* ── Cabinet 1 (leftmost / front) ── */}
                {/* Top face */}
                <polygon points="20,58 62,38 104,58 62,78" fill="#dde3ed"/>
                {/* Left face */}
                <polygon points="20,58 20,148 62,168 62,78" fill="#b8c4d8"/>
                {/* Right face */}
                <polygon points="62,78 104,58 104,148 62,168" fill="#cdd6e8"/>
                {/* Front panel rows */}
                {[0,1,2,3,4,5].map(i => (
                  <g key={i}>
                    <polygon
                      points={`23,${68+i*13} 61,${50+i*13} 61,${59+i*13} 23,${77+i*13}`}
                      fill={i % 2 === 0 ? '#c5cfe0' : '#bac5d6'}
                    />
                    <polygon
                      points={`61,${50+i*13} 101,${68+i*13} 101,${77+i*13} 61,${59+i*13}`}
                      fill={i % 2 === 0 ? '#d2dae8' : '#c8d1e2'}
                    />
                  </g>
                ))}
                {/* Cabinet 1 handle/strip */}
                <polygon points="25,72 59,55 59,58 25,75" fill="#9aadc4"/>
                <polygon points="59,55 99,73 99,76 59,58" fill="#a8b9cc"/>
                {/* Indicator lights */}
                <circle cx="32" cy="152" r="2.5" fill="#22c55e"/>
                <circle cx="39" cy="156" r="2.5" fill="#22c55e"/>

                {/* ── Cabinet 2 (middle) ── */}
                {/* Top face */}
                <polygon points="62,38 104,18 146,38 104,58" fill="#e2e8f4"/>
                {/* Left face */}
                <polygon points="62,78 62,168 104,148 104,58" fill="#c5d0e2"/>
                {/* Right face */}
                <polygon points="104,58 146,38 146,128 104,148" fill="#d5dff0"/>
                {/* Front panel rows */}
                {[0,1,2,3,4,5].map(i => (
                  <g key={i}>
                    <polygon
                      points={`65,${88+i*13} 103,${70+i*13} 103,${79+i*13} 65,${97+i*13}`}
                      fill={i % 2 === 0 ? '#ccd6e5' : '#c0cbdb'}
                    />
                    <polygon
                      points={`103,${70+i*13} 143,${88+i*13} 143,${97+i*13} 103,${79+i*13}`}
                      fill={i % 2 === 0 ? '#d8e0ee' : '#cfd8ea'}
                    />
                  </g>
                ))}
                {/* Cabinet 2 handle/strip */}
                <polygon points="67,92 101,75 101,78 67,95" fill="#9aadc4"/>
                <polygon points="101,75 141,93 141,96 101,78" fill="#a8b9cc"/>
                {/* Indicator lights */}
                <circle cx="74" cy="132" r="2.5" fill="#22c55e"/>
                <circle cx="81" cy="136" r="2.5" fill="#22c55e"/>

                {/* ── Cabinet 3 (rightmost / back) ── */}
                {/* Top face */}
                <polygon points="104,18 146,0 188,20 146,38" fill="#e8eef8"/>
                {/* Left face */}
                <polygon points="104,58 104,148 146,128 146,38" fill="#cdd7e8"/>
                {/* Right face */}
                <polygon points="146,38 188,20 188,110 146,128" fill="#dce5f2"/>
                {/* Front panel rows */}
                {[0,1,2,3,4,5].map(i => (
                  <g key={i}>
                    <polygon
                      points={`107,${68+i*13} 145,${50+i*13} 145,${59+i*13} 107,${77+i*13}`}
                      fill={i % 2 === 0 ? '#d2daea' : '#c8d1e0'}
                    />
                    <polygon
                      points={`145,${50+i*13} 185,${68+i*13} 185,${77+i*13} 145,${59+i*13}`}
                      fill={i % 2 === 0 ? '#dde5f3' : '#d4dced'}
                    />
                  </g>
                ))}
                {/* Cabinet 3 handle/strip */}
                <polygon points="109,72 143,55 143,58 109,75" fill="#9aadc4"/>
                <polygon points="143,55 183,73 183,76 143,58" fill="#a8b9cc"/>
                {/* Indicator lights */}
                <circle cx="116" cy="112" r="2.5" fill="#22c55e"/>
                <circle cx="123" cy="116" r="2.5" fill="#22c55e"/>

                {/* ── Ground shadow ── */}
                <ellipse cx="104" cy="185" rx="105" ry="10" fill="#c8d3e6" opacity="0.35"/>
              </g>
            </svg>
          </div>

          <div className="mt-4 flex gap-4">
            <FaultAlertCard label="Total Faults" value={0} icon="fault" />
            <FaultAlertCard label="Total Alerts" value={0} icon="alert" />
          </div>
        </div>

        {/* RIGHT REALTIME PANEL */}
        <div className="flex-1 rounded-[12px] border border-[#e6edf5] bg-white p-4">
          <header className="mb-3">
            <h3 className="text-[20px] font-semibold text-[#0f1724]">Real-time Data</h3>
          </header>

          <RealtimeMetrics />
        </div>
      </div>
    </DashboardCard>
  )
}
