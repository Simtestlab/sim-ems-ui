"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

/* ─── Node icons (PNG assets in /public) ────────────────────────────────── */

const ICON_SHADOW = 'drop-shadow-[0_4px_6px_rgba(15,23,36,0.12)]'

const GridIcon = () => (
  <Image src="/grid-icon.png" alt="Grid" width={170} height={160}
    className={`${ICON_SHADOW} object-contain`} priority />
)

const FactoryIcon = () => (
  <Image src="/load-icon.png" alt="Load" width={160} height={140}
    className={`${ICON_SHADOW} object-contain`} priority />
)

const DgIcon = () => (
  <Image src="/genset-icon.png" alt="Diesel Generator" width={150} height={125}
    className={`${ICON_SHADOW} object-contain`} priority />
)

const SwitchIcon = () => (
  <Image src="/switch-icon.png" alt="Switch" width={80} height={96}
    className={`${ICON_SHADOW} object-contain`} priority />
)

const EvIcon = () => (
  <Image src="/ev-icon.png" alt="EV Charger" width={140} height={155}
    className={`${ICON_SHADOW} object-contain`} priority />
)

const PvIcon = () => (
  <Image src="/solar-icon.png" alt="Photovoltaic" width={175} height={140}
    className={`${ICON_SHADOW} object-contain`} priority />
)

const BessIcon = () => (
  <Image src="/bess-icon.png" alt="BESS" width={170} height={140}
    className={`${ICON_SHADOW} object-contain`} priority />
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

// 2D-isometric layout. Main bus diagonal: y = -0.5x + 665 (slope -0.5,
// bottom-left → top-right). All branches use slope +0.5 (the perpendicular
// isometric axis). Every line below has slope ±0.5 by construction.
const P = {
  grid_out:  { x: 250, y: 540 },   // right-mid of Grid icon (on main diagonal)
  sw_in:     { x: 350, y: 490 },   // left edge of Switch  (on main diagonal)
  sw_out:    { x: 430, y: 450 },   // right edge of Switch (on main diagonal)
  j1:        { x: 570, y: 380 },   // junction 1            (on main diagonal)
  load_in:   { x: 390, y: 290 },   // bottom-right of Load  (branch slope +0.5)
  ev_in:     { x: 750, y: 470 },   // top-left of EV        (branch slope +0.5)
  j2:        { x: 870, y: 230 },   // junction 2            (on main diagonal)
  dg_in:     { x: 690, y: 140 },   // bottom-right of DG    (branch slope +0.5)
  pv_in:     { x: 1050, y: 320 },  // top-left of PV        (branch slope +0.5)
  bess_turn: { x: 1000, y: 165 },  // collinear intermediate (on main diagonal)
  bess_in:   { x: 1130, y: 100 },  // left-mid of BESS      (on main diagonal)
}

const toLeft = (x: number) => `${(x / W * 100).toFixed(3)}%`
const toTop  = (y: number) => `${(y / H * 100).toFixed(3)}%`

// Approximate polyline length (sum of segment distances). Used to give every
// path the same arrow VELOCITY rather than the same arrow DURATION — so short
// segments don't crawl while long ones sprint.
const polylineLength = (points: {x: number, y: number}[]) => {
  let len = 0
  for (let i = 0; i < points.length - 1; i++) {
    len += Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y)
  }
  return len
}

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
    { id: 'grid-sw',   points: [P.grid_out, P.sw_in], active: true, rev: data.grid.p < 0 },
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

      {/* ── SVG – lines + animated arrows ─────────────────────── */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%" height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        {/* Flow lines with rounded corners */}
        {paths.map(path => {
          const d = roundedPath(path.points, 14)
          return (
            <g key={path.id}>
              <path
                d={d}
                stroke={path.active ? '#86efac' : '#e2e8f0'}
                strokeWidth={path.active ? 2.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {path.active && (
                <path id={`p_${path.id}`} d={d} fill="none" stroke="none"/>
              )}
            </g>
          )
        })}

        {/* Animated flow arrows – uniform velocity, evenly spaced per path */}
        {mounted && paths.filter(p => p.active).map(path => {
          const len = polylineLength(path.points)
          const SPEED = 170           // px / second along the path
          const SPACING = 130         // approx distance between successive arrows
          const dur = Math.max(0.6, len / SPEED)
          const count = Math.max(1, Math.round(len / SPACING))
          return (
            <React.Fragment key={`a_${path.id}`}>
              {Array.from({ length: count }).map((_, i) => (
                <polygon
                  key={i}
                  points="-5,-3 4,0 -5,3"
                  fill="#16a34a"
                >
                  <animateMotion
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                    keyPoints={path.rev ? '1;0' : '0;1'}
                    keyTimes="0;1"
                    calcMode="linear"
                    begin={`-${((i * dur) / count).toFixed(3)}s`}
                  >
                    <mpath href={`#p_${path.id}`}/>
                  </animateMotion>
                </polygon>
              ))}
            </React.Fragment>
          )
        })}
      </svg>

      {/* ── Node: Grid ────────────────────────────────────────── */}
      {/* Icon 170×160. Right-mid (250, 540) = P.grid_out. */}
      <div className="absolute flex items-center gap-3"
        style={{ left: toLeft(80), top: toTop(460) }}>
        <GridIcon/>
        <Label title="Grid" p={data.grid.p} q={data.grid.q}/>
      </div>

      {/* ── Node: Load ────────────────────────────────────────── */}
      {/* Icon 160×140. Bottom-right (390, 290) = P.load_in. Label sits left of icon. */}
      <div className="absolute cursor-pointer group"
        style={{ left: toLeft(230), top: toTop(150) }}
        onClick={() => router.push('/monitor/meter')}
        title="Go to Meter">
        <div className="transition-transform group-hover:scale-105"><FactoryIcon/></div>
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap">
          <Label title="Load" p={data.load.p} q={data.load.q} align="left"/>
        </div>
      </div>

      {/* ── Node: Switch ──────────────────────────────────────── */}
      {/* Icon 80×96. Diagonal crosses through: P.sw_in (350,490) at left edge,
          P.sw_out (430,450) at right edge. Label hangs below. */}
      <div className="absolute" style={{ left: toLeft(350), top: toTop(422) }}>
        <SwitchIcon/>
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 text-center whitespace-nowrap">
          <div className="text-[12px] font-bold text-[#0f1724]">Switch</div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"/>
            <span className="text-[11px] font-semibold text-[#22c55e]">ON</span>
          </div>
        </div>
      </div>

      {/* ── Node: DG ─────────────────────────────────────────── */}
      {/* Icon 150×125. Bottom-right (690, 140) = P.dg_in. Label sits left of icon. */}
      <div className="absolute cursor-pointer group"
        style={{ left: toLeft(540), top: toTop(15) }}
        onClick={() => setModal('dg')}
        title="Genset Details">
        <div className="transition-transform group-hover:scale-105"><DgIcon/></div>
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap">
          <Label title="DG (1)" p={data.dg.p} q={data.dg.q} align="left"/>
        </div>
      </div>

      {/* ── Node: EV ─────────────────────────────────────────── */}
      {/* Icon 140×155. Top-left (750, 470) = P.ev_in. */}
      <div className="absolute flex items-end gap-2 cursor-pointer group"
        style={{ left: toLeft(750), top: toTop(470) }}
        onClick={() => setModal('ev')}
        title="EV Charger Details">
        <div className="transition-transform group-hover:scale-105"><EvIcon/></div>
        <Label title="EV (1)" p={data.ev.p} q={data.ev.q}/>
      </div>

      {/* ── Node: PV ─────────────────────────────────────────── */}
      {/* Icon 175×140. Top-left (1050, 320) = P.pv_in. */}
      <div className="absolute flex items-center gap-2 cursor-pointer group"
        style={{ left: toLeft(1050), top: toTop(320) }}
        onClick={() => setModal('pv')}
        title="PV Details">
        <div className="transition-transform group-hover:scale-105"><PvIcon/></div>
        <Label title="PV (2)" p={data.pv.p} q={data.pv.q}/>
      </div>

      {/* ── Node: BESS ───────────────────────────────────────── */}
      {/* Icon 170×140. Left-mid (1130, 100) = P.bess_in. */}
      <div className="absolute flex items-center gap-2 cursor-pointer group"
        style={{ left: toLeft(1130), top: toTop(30) }}
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
                        <Image src="/bess-icon.png" alt="BESS" width={110} height={92}
                          className={`${ICON_SHADOW} object-contain`} />
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

