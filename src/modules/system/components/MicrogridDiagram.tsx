"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/* ─── Isometric SVG Icons ───────────────────────────────────────────────── */

const GridIcon = () => (
  <svg width="108" height="102" viewBox="0 0 120 112">
    {/* Tower 1 – front */}
    <line x1="32" y1="8"  x2="40" y2="92" stroke="#475569" strokeWidth="2.5"/>
    <line x1="32" y1="8"  x2="24" y2="92" stroke="#475569" strokeWidth="2.5"/>
    <line x1="29" y1="22" x2="35" y2="22" stroke="#475569" strokeWidth="2"/>
    <line x1="27" y1="38" x2="37" y2="38" stroke="#475569" strokeWidth="2"/>
    <line x1="24" y1="58" x2="40" y2="58" stroke="#475569" strokeWidth="2"/>
    <line x1="21" y1="75" x2="43" y2="75" stroke="#475569" strokeWidth="2"/>
    <line x1="5"  y1="22" x2="59" y2="22" stroke="#475569" strokeWidth="2.5"/>
    <line x1="8"  y1="38" x2="56" y2="38" stroke="#475569" strokeWidth="2"/>
    <path d="M5,22 Q15,30 25,22"  stroke="#94a3b8" strokeWidth="1" fill="none"/>
    <path d="M45,22 Q55,30 59,22" stroke="#94a3b8" strokeWidth="1" fill="none"/>
    <line x1="20" y1="92" x2="12" y2="100" stroke="#475569" strokeWidth="2"/>
    <line x1="28" y1="92" x2="28" y2="100" stroke="#475569" strokeWidth="2"/>
    <line x1="36" y1="92" x2="44" y2="100" stroke="#475569" strokeWidth="2"/>
    {/* Tower 2 – back */}
    <g opacity="0.55">
      <line x1="80" y1="5"  x2="88" y2="88" stroke="#94a3b8" strokeWidth="2"/>
      <line x1="80" y1="5"  x2="72" y2="88" stroke="#94a3b8" strokeWidth="2"/>
      <line x1="77" y1="18" x2="83" y2="18" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1="75" y1="33" x2="85" y2="33" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1="72" y1="52" x2="88" y2="52" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1="69" y1="70" x2="91" y2="70" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1="58" y1="18" x2="102" y2="18" stroke="#94a3b8" strokeWidth="2"/>
      <line x1="61" y1="33" x2="99"  y2="33" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1="68" y1="88" x2="60" y2="96" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1="76" y1="88" x2="76" y2="96" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1="84" y1="88" x2="92" y2="96" stroke="#94a3b8" strokeWidth="1.5"/>
    </g>
    <ellipse cx="32" cy="103" rx="22" ry="3"  fill="#e2e8f0" opacity="0.9"/>
    <ellipse cx="80" cy="98"  rx="18" ry="2.5" fill="#e2e8f0" opacity="0.5"/>
  </svg>
)

const FactoryIcon = () => (
  <svg width="100" height="86" viewBox="0 0 115 100">
    <polygon points="50,8 95,26 50,48 5,30"    fill="#e2e8f0"/>
    <polygon points="5,30 50,48 50,88 5,70"    fill="#cbd5e1"/>
    <polygon points="50,48 95,26 95,66 50,88"  fill="#94a3b8"/>
    <polygon points="12,26 42,37 56,31 26,20"  fill="#f1f5f9"/>
    <polygon points="42,37 72,48 86,42 56,31"  fill="#f1f5f9"/>
    <polygon points="12,42 26,48 26,60 12,54"  fill="#1e3a8a" opacity="0.7"/>
    <polygon points="30,48 44,54 44,66 30,60"  fill="#1e3a8a" opacity="0.7"/>
    <polygon points="56,56 70,50 70,62 56,68"  fill="#1e3a8a" opacity="0.7"/>
    <polygon points="74,50 88,44 88,56 74,62"  fill="#1e3a8a" opacity="0.7"/>
    <polygon points="81,10 88,13 88,26 81,23"  fill="#64748b"/>
    <polygon points="75,13 81,10 81,23 75,20"  fill="#94a3b8"/>
    <ellipse cx="50" cy="90" rx="46" ry="5" fill="#e2e8f0" opacity="0.7"/>
  </svg>
)

const DgIcon = () => (
  <svg width="94" height="78" viewBox="0 0 110 90">
    <polygon points="45,8 82,22 45,40 8,26"   fill="#fbbf24"/>
    <polygon points="8,26 45,40 45,72 8,58"   fill="#d97706"/>
    <polygon points="45,40 82,22 82,54 45,72" fill="#b45309"/>
    <polygon points="14,30 36,38 36,54 14,46" fill="#1e293b"/>
    <line x1="17" y1="34" x2="33" y2="40" stroke="#475569" strokeWidth="1.5"/>
    <line x1="17" y1="38" x2="33" y2="44" stroke="#475569" strokeWidth="1.5"/>
    <line x1="17" y1="42" x2="33" y2="48" stroke="#475569" strokeWidth="1.5"/>
    <rect x="74" y="8" width="5" height="18" rx="2" fill="#475569"/>
    <ellipse cx="76" cy="8" rx="4" ry="2" fill="#64748b"/>
    <circle cx="18" cy="69" r="8" fill="#1e293b"/>
    <circle cx="18" cy="69" r="3.5" fill="#475569"/>
    <circle cx="62" cy="62" r="7" fill="#1e293b"/>
    <circle cx="62" cy="62" r="3"   fill="#475569"/>
    <line x1="6" y1="36" x2="6" y2="56" stroke="#64748b" strokeWidth="3"/>
    <ellipse cx="45" cy="74" rx="38" ry="4" fill="#e2e8f0" opacity="0.6"/>
  </svg>
)

const SwitchIcon = () => (
  <svg width="50" height="60" viewBox="0 0 60 70">
    <polygon points="30,6 48,14 30,22 12,14"  fill="#e2e8f0"/>
    <polygon points="12,14 30,22 30,56 12,48" fill="#cbd5e1"/>
    <polygon points="30,22 48,14 48,48 30,56" fill="#94a3b8"/>
    <polygon points="15,22 30,28 30,46 15,40" fill="#64748b"/>
    <polygon points="30,28 44,22 44,40 30,46" fill="#475569"/>
    <rect x="20" y="10" width="5" height="8" rx="1" fill="#475569"/>
    <rect x="34" y="8"  width="5" height="8" rx="1" fill="#475569"/>
    <circle cx="30" cy="18" r="5"   fill="#22c55e"/>
    <circle cx="30" cy="18" r="2.5" fill="#16a34a"/>
    <ellipse cx="30" cy="58" rx="22" ry="3" fill="#e2e8f0" opacity="0.5"/>
  </svg>
)

const EvIcon = () => (
  <svg width="90" height="98" viewBox="0 0 102 112">
    {/* Charging column */}
    <polygon points="22,5 35,10 22,18 9,13"  fill="#e2e8f0"/>
    <polygon points="9,13 22,18 22,68 9,63"  fill="#cbd5e1"/>
    <polygon points="22,18 35,10 35,60 22,68" fill="#94a3b8"/>
    <polygon points="12,20 22,24 22,40 12,36" fill="#0ea5e9"/>
    <polygon points="19,24 16,31 18,31 15,38 23,29 21,29" fill="#fbbf24"/>
    <circle cx="28" cy="54" r="4" fill="#475569"/>
    <circle cx="28" cy="54" r="2" fill="#64748b"/>
    <path d="M28,58 Q40,64 55,66" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Car */}
    <g transform="translate(30,56)">
      <polygon points="30,5 60,16 30,30 0,19"  fill="#f8fafc"/>
      <polygon points="0,19 30,30 30,44 0,33"  fill="#e2e8f0"/>
      <polygon points="30,30 60,16 60,28 30,44" fill="#cbd5e1"/>
      <polygon points="8,18 22,23 22,30 8,25"  fill="#93c5fd"/>
      <polygon points="35,23 48,18 48,25 35,29" fill="#93c5fd"/>
      <circle cx="8"  cy="40" r="6"   fill="#1e293b"/>
      <circle cx="8"  cy="40" r="2.5" fill="#475569"/>
      <circle cx="48" cy="34" r="6"   fill="#1e293b"/>
      <circle cx="48" cy="34" r="2.5" fill="#475569"/>
    </g>
    <ellipse cx="55" cy="104" rx="46" ry="5" fill="#e2e8f0" opacity="0.5"/>
  </svg>
)

const PvIcon = () => (
  <svg width="110" height="86" viewBox="0 0 126 100">
    <polygon points="62,5 112,22 62,45 12,28"  fill="#1d4ed8"/>
    <polygon points="12,28 62,45 62,58 12,41"  fill="#1e3a8a"/>
    <line x1="22" y1="11"  x2="72" y2="28"  stroke="#3b82f6" strokeWidth="1.5" opacity="0.85"/>
    <line x1="37" y1="17"  x2="87" y2="34"  stroke="#3b82f6" strokeWidth="1.5" opacity="0.85"/>
    <line x1="52" y1="23"  x2="102" y2="40" stroke="#3b82f6" strokeWidth="1.5" opacity="0.85"/>
    <line x1="112" y1="22" x2="62" y2="5"   stroke="#3b82f6" strokeWidth="1"   opacity="0.5"/>
    <line x1="92"  y1="29" x2="42" y2="12"  stroke="#3b82f6" strokeWidth="1"   opacity="0.5"/>
    <line x1="72"  y1="36" x2="22" y2="19"  stroke="#3b82f6" strokeWidth="1"   opacity="0.5"/>
    <polygon points="12,28 37,37 37,28 12,19" fill="#60a5fa" opacity="0.2"/>
    <line x1="24" y1="47" x2="24" y2="70" stroke="#94a3b8" strokeWidth="3"/>
    <line x1="62" y1="55" x2="62" y2="78" stroke="#94a3b8" strokeWidth="3"/>
    <line x1="100" y1="47" x2="100" y2="70" stroke="#94a3b8" strokeWidth="3"/>
    <line x1="14" y1="70" x2="34"  y2="70" stroke="#94a3b8" strokeWidth="3.5"/>
    <line x1="52" y1="78" x2="72"  y2="78" stroke="#94a3b8" strokeWidth="3.5"/>
    <line x1="90" y1="70" x2="110" y2="70" stroke="#94a3b8" strokeWidth="3.5"/>
    <ellipse cx="62" cy="84" rx="56" ry="6" fill="#e2e8f0" opacity="0.6"/>
  </svg>
)

const BessIcon = () => (
  <svg width="108" height="88" viewBox="0 0 122 100">
    <g transform="translate(2,5)">
      {/* Cabinet 1 */}
      <polygon points="22,12 42,20 22,32 2,24"  fill="#64748b"/>
      <polygon points="2,24 22,32 22,72 2,64"   fill="#334155"/>
      <polygon points="22,32 42,20 42,60 22,72" fill="#475569"/>
      <rect x="6"  y="34" width="10" height="20" rx="1" fill="#475569"/>
      <rect x="8"  y="36" width="6"  height="8"  rx="1" fill="#94a3b8"/>
      <circle cx="11" cy="52" r="2" fill="#22c55e"/>
      {/* Cabinet 2 */}
      <polygon points="42,8 62,16 42,28 22,20"  fill="#64748b"/>
      <polygon points="22,20 42,28 42,68 22,60"  fill="#334155"/>
      <polygon points="42,28 62,16 62,56 42,68" fill="#475569"/>
      <rect x="26" y="30" width="10" height="20" rx="1" fill="#475569"/>
      <rect x="28" y="32" width="6"  height="8"  rx="1" fill="#94a3b8"/>
      <circle cx="31" cy="48" r="2" fill="#22c55e"/>
      {/* Cabinet 3 */}
      <polygon points="62,4 82,12 62,24 42,16"  fill="#64748b"/>
      <polygon points="42,16 62,24 62,64 42,56"  fill="#334155"/>
      <polygon points="62,24 82,12 82,52 62,64" fill="#475569"/>
      <rect x="46" y="26" width="10" height="20" rx="1" fill="#475569"/>
      <rect x="48" y="28" width="6"  height="8"  rx="1" fill="#94a3b8"/>
      <circle cx="51" cy="44" r="2" fill="#22c55e"/>
      {/* Roof tint */}
      <polygon points="2,24 22,12 42,8 22,20"  fill="#60a5fa" opacity="0.35"/>
      <polygon points="22,20 42,8 62,4 42,16"  fill="#60a5fa" opacity="0.35"/>
      <polygon points="42,16 62,4 82,12 62,12" fill="#60a5fa" opacity="0.35"/>
      <ellipse cx="42" cy="74" rx="46" ry="5" fill="#e2e8f0" opacity="0.7"/>
    </g>
  </svg>
)

/* ─── Telemetry label ────────────────────────────────────────────────────── */

type LabelProps = {
  title: string
  p?: number | string
  q?: number | string
  soc?: number | string
  status?: string
  align?: 'left' | 'right'
}

const Label = ({ title, p, q, soc, status, align = 'right' }: LabelProps) => (
  <div className={`flex flex-col leading-snug ${align === 'left' ? 'items-end' : 'items-start'}`}>
    <span className="text-[13px] font-bold text-[#0f1724] whitespace-nowrap mb-0.5">{title}</span>
    {status && (
      <span className="flex items-center gap-1 mb-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0"/>
        <span className="text-[11px] font-semibold text-[#22c55e] whitespace-nowrap">{status}</span>
      </span>
    )}
    {p !== undefined && (
      <span className="flex items-center gap-1.5">
        <span className="text-[11px] text-[#64748b] whitespace-nowrap">P(kw)</span>
        <span className="text-[12px] font-bold text-[#0f1724]">{p}</span>
      </span>
    )}
    {q !== undefined && (
      <span className="flex items-center gap-1.5">
        <span className="text-[11px] text-[#64748b] whitespace-nowrap">Q(kvar)</span>
        <span className="text-[12px] font-bold text-[#0f1724]">{q}</span>
      </span>
    )}
    {soc !== undefined && (
      <span className="flex items-center gap-2">
        <div className="w-10 h-1.5 bg-[#e2e8f0] rounded-sm overflow-hidden">
          <div
            className="h-full bg-[#22c55e] rounded-sm transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, Number(soc)))}%` }}
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] text-[#64748b] whitespace-nowrap">SOC(%)</span>
          <span className="text-[12px] font-bold text-[#22c55e]">{soc}</span>
        </div>
      </span>
    )}
  </div>
)

/* ─── Main component ─────────────────────────────────────────────────────── */

// All node positions are in a fixed 1400 × 680 coordinate space.
// The outer container uses aspect-ratio:1400/680 so every pixel
// maps 1-to-1 via percentage. The SVG uses the same viewBox so
// flow lines align perfectly with the icon divs.

const W = 1400
const H = 680

// Path connection points to trace the exact isometric topology
const P = {
  grid_out:  { x: 220, y: 440 },
  grid_turn: { x: 280, y: 470 },
  sw_in:     { x: 410, y: 470 },
  sw_out:    { x: 460, y: 470 },
  j1:        { x: 650, y: 375 },
  load_in:   { x: 500, y: 300 },
  ev_in:     { x: 750, y: 425 },
  j2:        { x: 850, y: 275 },
  dg_in:     { x: 730, y: 215 },
  pv_in:     { x: 1000, y: 350 },
  bess_turn: { x: 950, y: 225 },
  bess_in:   { x: 1100, y: 225 },
}

const toLeft = (x: number) => `${(x / W * 100).toFixed(3)}%`
const toTop  = (y: number) => `${(y / H * 100).toFixed(3)}%`

// Helper to draw paths with rounded corners
const roundedPath = (points: {x: number, y: number}[], radius = 12) => {
  if (points.length === 2) {
    return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`
  }
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const pPrev = points[i - 1]
    const pCurr = points[i]
    const pNext = points[i + 1]
    
    const dPrev = Math.hypot(pCurr.x - pPrev.x, pCurr.y - pPrev.y)
    const dNext = Math.hypot(pNext.x - pCurr.x, pNext.y - pCurr.y)
    const r = Math.min(radius, dPrev / 2, dNext / 2)
    
    const uPrev = { x: (pPrev.x - pCurr.x) / dPrev, y: (pPrev.y - pCurr.y) / dPrev }
    const uNext = { x: (pNext.x - pCurr.x) / dNext, y: (pNext.y - pCurr.y) / dNext }
    
    const pStart = { x: pCurr.x + uPrev.x * r, y: pCurr.y + uPrev.y * r }
    const pEnd = { x: pCurr.x + uNext.x * r, y: pCurr.y + uNext.y * r }
    
    d += ` L${pStart.x},${pStart.y} Q${pCurr.x},${pCurr.y} ${pEnd.x},${pEnd.y}`
  }
  const pLast = points[points.length - 1]
  d += ` L${pLast.x},${pLast.y}`
  return d
}

export default function MicrogridDiagram() {
  const [mounted, setMounted] = useState(false)
  const [modal, setModal] = useState<'ev' | 'bess' | 'pv' | 'dg' | null>(null)
  const router = useRouter()

  // ── Live telemetry state (initial values from reference) ────────────────
  const [data, setData] = useState({
    grid:  { p: 20,    q: 1.98 },
    load:  { p: 100,   q: 8.37 },
    dg:    { p: 0,     q: 0 },
    ev:    { p: 0,     q: 0 },
    pv:    { p: 200,   q: 22.21 },
    bess:  { p: 80,    q: 7.57, soc: 61.9, status: 'Normal' },
  })

  useEffect(() => {
    setMounted(true)

    // Simulate real-time data updates every 2 seconds
    const tick = setInterval(() => {
      setData(prev => {
        // PV with mean reversion toward 200 kW (prevents drift)
        const pvTarget = 200
        const pvDrift = (Math.random() - 0.5) * 10
        const pvReversion = (pvTarget - prev.pv.p) * 0.15
        const pvP = +Math.min(220, Math.max(160, prev.pv.p + pvDrift + pvReversion)).toFixed(2)
        
        // BESS with mean reversion toward 70 kW discharge
        const bessTarget = 70
        const bessDrift = (Math.random() - 0.5) * 6
        const bessReversion = (bessTarget - prev.bess.p) * 0.12
        const bessP = +Math.min(100, Math.max(40, prev.bess.p + bessDrift + bessReversion)).toFixed(2)
        
        // Load with mean reversion toward 100 kW
        const loadTarget = 100
        const loadDrift = (Math.random() - 0.5) * 5
        const loadReversion = (loadTarget - prev.load.p) * 0.15
        const loadP = +Math.min(120, Math.max(85, prev.load.p + loadDrift + loadReversion)).toFixed(2)
        
        // EV constant charging
        const evP = prev.ev.p
        
        // Grid absorbs / provides the residual (positive = grid importing, negative = grid exporting)
        const gridP = +(loadP + evP - pvP - bessP).toFixed(2)
        
        // SOC decreases slowly while discharging (0.08% per 2s tick)
        const newSoc = +Math.min(100, Math.max(10,
          prev.bess.soc + (bessP > 0 ? -0.08 : 0.05)
        )).toFixed(1)

        return {
          grid:  { p: gridP,  q: +(gridP  * 0.062).toFixed(2) },
          load:  { p: loadP,  q: +(loadP  * 0.125).toFixed(2) },
          dg:    { p: 0,      q: 0 },
          ev:    { p: evP,    q: +(evP    * 0.095).toFixed(2) },
          pv:    { p: pvP,    q: +(pvP    * 0.104).toFixed(2) },
          bess:  { p: bessP,  q: +(bessP  * 0.076).toFixed(2), soc: newSoc, status: 'Normal' },
        }
      })
    }, 2000)

    return () => clearInterval(tick)
  }, [])

  // Explicit isometric flow paths matching the UI reference
  const paths = [
    { id: 'grid-sw',   points: [P.grid_out, P.grid_turn, P.sw_in], active: true, rev: data.grid.p < 0 },
    { id: 'sw-jct1',   points: [P.sw_out, P.j1], active: true, rev: false },
    { id: 'jct1-load', points: [P.j1, P.load_in], active: true, rev: false },
    { id: 'jct1-ev',   points: [P.j1, P.ev_in], active: data.ev.p > 0, rev: false },
    { id: 'jct1-jct2', points: [P.j1, P.j2], active: true, rev: false },
    { id: 'jct2-dg',   points: [P.dg_in, P.j2], active: data.dg.p !== 0, rev: false },
    { id: 'pv-jct2',   points: [P.pv_in, P.j2], active: data.pv.p > 0, rev: false },
    { id: 'jct2-bess', points: [P.bess_in, P.bess_turn, P.j2], active: data.bess.p !== 0, rev: data.bess.p < 0 },
  ]

  return (
    <div className="relative w-full bg-white overflow-hidden" style={{ aspectRatio: `${W} / ${H}` }}>

      {/* ── Station Status (top-left) ──────────────── */}
      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <span className="text-[13px] font-medium text-[#64748b]">Station Status:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]"/>
          <span className="text-[13px] font-bold text-[#22c55e]">Normal</span>
        </span>
      </div>

      {/* ── PV & BESS capacity cards (top-right) ──────────────── */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <div className="bg-white border border-[#e2e8f0] rounded shadow-sm px-4 py-2 text-center min-w-[90px]">
          <div className="text-[10px] text-[#94a3b8] font-medium leading-tight">PV Capacity</div>
          <div className="text-[16px] font-black text-[#0f1724] leading-snug">
            200 <span className="text-[11px] font-semibold text-[#64748b]">kWp</span>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded shadow-sm px-4 py-2 text-center min-w-[120px]">
          <div className="text-[10px] text-[#94a3b8] font-medium leading-tight">BESS Capacity</div>
          <div className="text-[16px] font-black text-[#0f1724] leading-snug">
            250/514 <span className="text-[11px] font-semibold text-[#64748b]">kW/kWh</span>
          </div>
        </div>
      </div>

      {/* ── SVG – lines + animated arrows ─────────────────────── */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%" height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Isometric flow lines with rounded corners */}
        {paths.map(path => {
          const d = roundedPath(path.points, 12)
          return (
            <g key={path.id}>
              <path
                d={d}
                stroke={path.active ? '#86efac' : '#e2e8f0'}
                strokeWidth={path.active ? 3.5 : 2.5}
                strokeLinecap="round"
                fill="none"
              />
              {path.active && (
                <path id={`p_${path.id}`} d={d} fill="none" stroke="none"/>
              )}
            </g>
          )
        })}

        {/* Animated flow arrows */}
        {mounted && paths.filter(p => p.active).map(path => (
          <React.Fragment key={`a_${path.id}`}>
            {/* Arrow 1 */}
            <polygon points="-9,-5 9,0 -9,5" fill="#22c55e" filter="url(#glow)">
              <animateMotion dur="1.8s" repeatCount="indefinite" rotate="auto"
                keyPoints={path.rev ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear">
                <mpath href={`#p_${path.id}`}/>
              </animateMotion>
            </polygon>
            {/* Arrow 2 – offset by 0.6s */}
            <polygon points="-9,-5 9,0 -9,5" fill="#22c55e" filter="url(#glow)" opacity="0.7">
              <animateMotion dur="1.8s" repeatCount="indefinite" rotate="auto"
                keyPoints={path.rev ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear" begin="0.6s">
                <mpath href={`#p_${path.id}`}/>
              </animateMotion>
            </polygon>
            {/* Arrow 3 – offset by 1.2s */}
            <polygon points="-9,-5 9,0 -9,5" fill="#22c55e" filter="url(#glow)" opacity="0.4">
              <animateMotion dur="1.8s" repeatCount="indefinite" rotate="auto"
                keyPoints={path.rev ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear" begin="1.2s">
                <mpath href={`#p_${path.id}`}/>
              </animateMotion>
            </polygon>
          </React.Fragment>
        ))}
      </svg>

      {/* ── Node: Grid ────────────────────────────────────────── */}
      <div className="absolute flex items-center gap-3"
        style={{ left: toLeft(110), top: toTop(340) }}>
        <GridIcon/>
        <Label title="Grid" p={data.grid.p} q={data.grid.q}/>
      </div>

      {/* ── Node: Load ────────────────────────────────────────── */}
      <div className="absolute flex items-center gap-2 cursor-pointer group"
        style={{ right: `calc(100% - ${toLeft(510)})`, top: toTop(215) }}
        onClick={() => router.push('/monitor/meter')}
        title="Go to Meter">
        <Label title="Load" p={data.load.p} q={data.load.q} align="left"/>
        <div className="transition-transform group-hover:scale-105"><FactoryIcon/></div>
      </div>

      {/* ── Node: Switch ──────────────────────────────────────── */}
      <div className="absolute flex flex-col items-center gap-0.5"
        style={{ left: toLeft(410), top: toTop(430) }}>
        <SwitchIcon/>
        <div className="text-center -mt-0.5">
          <div className="text-[12px] font-bold text-[#0f1724]">Switch</div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"/>
            <span className="text-[11px] font-semibold text-[#22c55e]">ON</span>
          </div>
        </div>
      </div>

      {/* ── Node: DG ─────────────────────────────────────────── */}
      <div className="absolute flex items-center gap-2 cursor-pointer group"
        style={{ right: `calc(100% - ${toLeft(740)})`, top: toTop(140) }}
        onClick={() => setModal('dg')}
        title="Genset Details">
        <Label title="DG (1)" p={data.dg.p} q={data.dg.q} align="left"/>
        <div className="transition-transform group-hover:scale-105"><DgIcon/></div>
      </div>

      {/* ── Node: EV ─────────────────────────────────────────── */}
      <div className="absolute flex items-end gap-2 cursor-pointer group"
        style={{ left: toLeft(725), top: toTop(355) }}
        onClick={() => setModal('ev')}
        title="EV Charger Details">
        <div className="transition-transform group-hover:scale-105"><EvIcon/></div>
        <Label title="EV (1)" p={data.ev.p} q={data.ev.q}/>
      </div>

      {/* ── Node: PV ─────────────────────────────────────────── */}
      <div className="absolute flex items-center gap-2 cursor-pointer group"
        style={{ left: toLeft(945), top: toTop(270) }}
        onClick={() => setModal('pv')}
        title="PV Details">
        <div className="transition-transform group-hover:scale-105"><PvIcon/></div>
        <Label title="PV (2)" p={data.pv.p} q={data.pv.q}/>
      </div>

      {/* ── Node: BESS ───────────────────────────────────────── */}
      <div className="absolute flex items-center gap-2 cursor-pointer group"
        style={{ left: toLeft(1090), top: toTop(175) }}
        onClick={() => setModal('bess')}
        title="BESS Details">
        <div className="transition-transform group-hover:scale-105"><BessIcon/></div>
        <Label title="BESS (2)" p={data.bess.p} q={data.bess.q} soc={data.bess.soc} status={data.bess.status}/>
      </div>

      {/* ── Device detail modals ────────────────────────────── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45"
          onClick={() => setModal(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-[500px] max-w-[92vw] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-[17px] font-bold text-[#0f1724]">
                {modal === 'ev' ? 'EV Charger Details'
                  : modal === 'bess' ? 'BESS Details'
                  : modal === 'pv' ? 'PV Details'
                  : 'Genset Details'}
              </h2>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-colors text-[18px]"
                onClick={() => setModal(null)}
              >✕</button>
            </div>

            {/* Body */}
            <div className="px-6 pt-6 pb-8">
              {/* Devices + bus bar visualization */}
              {modal === 'ev' && (
                <div className="flex flex-col items-center">
                  <div className="flex justify-center gap-16 w-full mb-0">
                    <div className="flex flex-col items-center gap-1">
                      <EvIcon/>
                      <div className="text-[13px] font-bold text-[#0f1724]">1#EV</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: data.ev.p > 0 ? '#22c55e' : '#94a3b8' }}/>
                        <span className="text-[12px] font-semibold" style={{ color: data.ev.p > 0 ? '#22c55e' : '#64748b' }}>
                          {data.ev.p > 0 ? 'Charging' : 'Idle'}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#64748b]">P(kw) <b className="text-[#0f1724]">{data.ev.p}</b></div>
                      <div className="text-[12px] text-[#64748b]">Q(kvar) <b className="text-[#0f1724]">{data.ev.q}</b></div>
                    </div>
                  </div>
                  <div className="flex justify-center w-full mt-1 mb-1">
                    <div className="w-1 h-6" style={{ background: data.ev.p > 0 ? '#22c55e' : '#cbd5e1' }}/>
                  </div>
                  <div className="w-full h-3 rounded-full" style={{ background: data.ev.p > 0 ? '#22c55e' : '#cbd5e1' }}/>
                </div>
              )}

              {modal === 'bess' && (
                <div className="flex flex-col items-center">
                  <div className="flex justify-around w-full mb-0">
                    {[1, 2].map(i => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <svg width="68" height="62" viewBox="0 0 80 72">
                          <polygon points="40,5 64,15 40,26 16,16" fill="#64748b"/>
                          <polygon points="16,16 40,26 40,60 16,50" fill="#334155"/>
                          <polygon points="40,26 64,15 64,49 40,60" fill="#475569"/>
                          <rect x="20" y="30" width="14" height="20" rx="1" fill="#475569"/>
                          <rect x="21" y="31" width="10" height="10" rx="1" fill="#94a3b8"/>
                          <circle cx="25" cy="49" r="3" fill="#22c55e"/>
                          <polygon points="16,16 40,5 64,15 40,26" fill="#60a5fa" opacity="0.28"/>
                          <ellipse cx="40" cy="62" rx="30" ry="4" fill="#e2e8f0" opacity="0.6"/>
                        </svg>
                        <div className="text-[13px] font-bold text-[#0f1724]">{i}#PCS</div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#22c55e]"/>
                          <span className="text-[12px] font-semibold text-[#22c55e]">Running</span>
                        </div>
                        <div className="text-[12px] text-[#64748b]">P(kw) <b className="text-[#0f1724]">{+(data.bess.p / 2).toFixed(2)}</b></div>
                        <div className="text-[12px] text-[#64748b]">Q(kvar) <b className="text-[#0f1724]">{+(data.bess.q / 2).toFixed(2)}</b></div>
                        <div className="text-[12px] text-[#64748b]">SOC(%) <b className="text-[#22c55e]">{data.bess.soc}</b></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-around w-full mt-1 mb-1 px-[25%]">
                    <div className="w-1 h-6 bg-[#22c55e]"/>
                    <div className="w-1 h-6 bg-[#22c55e]"/>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#22c55e]"/>
                </div>
              )}

              {modal === 'pv' && (
                <div className="flex flex-col items-center">
                  <div className="flex justify-around w-full mb-0">
                    {[1, 2].map(i => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <PvIcon/>
                        <div className="text-[13px] font-bold text-[#0f1724]">{i}#PV</div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: data.pv.p > 0 ? '#22c55e' : '#94a3b8' }}/>
                          <span className="text-[12px] font-semibold" style={{ color: data.pv.p > 0 ? '#22c55e' : '#64748b' }}>
                            {data.pv.p > 0 ? 'Running' : 'Stopped'}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#64748b]">P(kw) <b className="text-[#0f1724]">{+(data.pv.p / 2).toFixed(2)}</b></div>
                        <div className="text-[12px] text-[#64748b]">Q(kvar) <b className="text-[#0f1724]">{+(data.pv.q / 2).toFixed(2)}</b></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-around w-full mt-1 mb-1 px-[25%]">
                    <div className="w-1 h-6" style={{ background: data.pv.p > 0 ? '#22c55e' : '#cbd5e1' }}/>
                    <div className="w-1 h-6" style={{ background: data.pv.p > 0 ? '#22c55e' : '#cbd5e1' }}/>
                  </div>
                  <div className="w-full h-3 rounded-full" style={{ background: data.pv.p > 0 ? '#22c55e' : '#cbd5e1' }}/>
                </div>
              )}

              {modal === 'dg' && (
                <div className="flex flex-col items-center">
                  <div className="flex justify-center gap-16 w-full mb-0">
                    <div className="flex flex-col items-center gap-1">
                      <DgIcon/>
                      <div className="text-[13px] font-bold text-[#0f1724]">GEN-1</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: data.dg.p > 0 ? '#22c55e' : '#94a3b8' }}/>
                        <span className="text-[12px] font-semibold" style={{ color: data.dg.p > 0 ? '#22c55e' : '#64748b' }}>
                          {data.dg.p > 0 ? 'Running' : 'Stopped'}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#64748b]">P(kw) <b className="text-[#0f1724]">{data.dg.p}</b></div>
                      <div className="text-[12px] text-[#64748b]">Q(kvar) <b className="text-[#0f1724]">{data.dg.q}</b></div>
                    </div>
                  </div>
                  <div className="flex justify-center w-full mt-1 mb-1">
                    <div className="w-1 h-6" style={{ background: data.dg.p > 0 ? '#22c55e' : '#cbd5e1' }}/>
                  </div>
                  <div className="w-full h-3 rounded-full" style={{ background: data.dg.p > 0 ? '#22c55e' : '#cbd5e1' }}/>
                </div>
              )}

              {/* Navigation arrows */}
              <div className="flex justify-between mt-5">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
                  ◁ Prev
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
                  Next ▷
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

