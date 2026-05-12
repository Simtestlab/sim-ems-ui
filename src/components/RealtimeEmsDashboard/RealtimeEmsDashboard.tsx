"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import * as echarts from "echarts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReactECharts = dynamic(() => import("echarts-for-react").then((m) => m.default), { ssr: false });

type Point = [string, number | null];

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function solarFactor(hour: number) {
  const sunrise = 6;
  const sunset = 18.4;
  if (hour <= sunrise || hour >= sunset) return 0;
  const progress = (hour - sunrise) / (sunset - sunrise);
  return Math.pow(Math.sin(progress * Math.PI), 1.18);
}

function oscillation(seed: number, hour: number, channel: number) {
  return (
    Math.sin(hour * 1.63 + seed * 0.0019 + channel) +
    Math.cos(hour * 0.71 + seed * 0.0008 + channel * 0.7) * 0.45
  );
}

function buildTimeLabels(step = 0.25) {
  const labels: string[] = [];
  for (let h = 0; h < 24; h += step) {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    labels.push(`${String(hh).padStart(2, "0")}:%${mm === 0 ? "00" : String(mm).padStart(2, "0")}`.replace("%", ""));
  }
  return labels;
}

function buildHours(step = 0.25) {
  const hours: number[] = [];
  for (let h = 0; h < 24; h += step) hours.push(Number(h.toFixed(2)));
  hours.push(23);
  return hours;
}

function formatTimeLabel(hour: number) {
  const whole = Math.floor(hour);
  const minutes = Math.round((hour - whole) * 60);
  return `${String(whole).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function generateDayData(seed: number, date: Date, branchCount = 10, step = 0.25) {
  const hours = buildHours(step);
  const todayLabel = date.toDateString();
  const now = new Date();
  const isToday = now.toDateString() === todayLabel;
  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const availableHour = isToday ? clamp(currentHour, 0.25, 23) : 23;

  const powerSamples: { hour: number; activePower: number; dcPower: number; intensity: number }[] = hours.map((hour) => {
    const solar = solarFactor(hour);
    const activePower = clamp(solar * (79 + (seed % 7)) + oscillation(seed, hour, 0.2) * 1.6, 0, 98);
    const dcPower = clamp(activePower + 1.8 + solar * 2.3 + oscillation(seed, hour, 1.1) * 1.2, 0, 100);
    const intensity = clamp(solar * (640 + (seed % 33)) + oscillation(seed, hour, 1.8) * 12, 0, 700);
    return { hour, activePower, dcPower, intensity };
  });

  // Create branch currents
  const branchPages: { label: string; points: { hour: number; current: number }[] }[] = [];
  for (let b = 0; b < branchCount; b++) {
    const points = hours.map((hour) => {
      const solar = solarFactor(hour);
      const current = clamp(solar * (6.0 - (b * 0.05)) + oscillation(seed + b * 97, hour, b) * 0.12, 0, 7);
      return { hour, current };
    });
    branchPages.push({ label: `Branch ${String(b + 1).padStart(2, "0")}`, points });
  }

  // Build series arrays with nulls for hours beyond availableHour (simulate not-yet-plotted)
  const labels = hours.map((h) => formatTimeLabel(h));
  const active = hours.map((h) => (h <= availableHour ? powerSamples.find((s) => s.hour === h)!.activePower : null));
  const dc = hours.map((h) => (h <= availableHour ? powerSamples.find((s) => s.hour === h)!.dcPower : null));
  const intensity = hours.map((h) => (h <= availableHour ? powerSamples.find((s) => s.hour === h)!.intensity : null));

  const branches = branchPages.map((br) => br.points.map((p) => (p.hour <= availableHour ? p.current : null)));

  return {
    labels,
    hours,
    active,
    dc,
    intensity,
    branches,
    availableHour,
  };
}

export default function RealtimeEmsDashboard({ seed = 12345 }: { seed?: number }) {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [nowTick, setNowTick] = useState<number>(Date.now());
  const [branchPage, setBranchPage] = useState(0);
  const [pageSize] = useState(4);
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    "Active Power": true,
    "DC Power": true,
    Intensity: true,
  });

  const branchColors = ["#17a86b", "#36dff2", "#f4c36f", "#9ec5ff", "#ffb1d4", "#00bfa5", "#00a2ff", "#ffcc80", "#8fd3c7", "#00c2a8"];

  // regenerate data every 2-4 seconds (simulate real-time)
  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 3000 + Math.floor(Math.random() * 2000));
    return () => clearInterval(t);
  }, []);

  const dateObj = useMemo(() => new Date(date), [date]);
  const sim = useMemo(() => generateDayData(seed, dateObj, 10, 0.25), [seed, dateObj, nowTick]);

  // power chart option
  const powerOption = useMemo(() => {
    const activeSeries = {
      name: "Active Power",
      type: "line",
      smooth: true,
      showSymbol: false,
      yAxisIndex: 0,
      data: sim.active,
      lineStyle: { width: 2, color: "#28b3d6", shadowBlur: 8, shadowColor: "rgba(40,179,214,0.15)" },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(40,179,214,0.28)" },
          { offset: 1, color: "rgba(40,179,214,0)" },
        ]),
      },
      emphasis: { focus: "series" },
    } as any;

    const dcSeries = {
      name: "DC Power",
      type: "line",
      smooth: true,
      showSymbol: false,
      yAxisIndex: 0,
      data: sim.dc,
      lineStyle: { width: 2, color: "#ea5aad", shadowBlur: 8, shadowColor: "rgba(234,90,173,0.12)" },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(234,90,173,0.22)" },
          { offset: 1, color: "rgba(234,90,173,0)" },
        ]),
      },
      emphasis: { focus: "series" },
    } as any;

    const intensitySeries = {
      name: "Intensity",
      type: "line",
      smooth: true,
      showSymbol: false,
      yAxisIndex: 1,
      data: sim.intensity,
      lineStyle: { width: 2, color: "#ffa42b", shadowBlur: 8, shadowColor: "rgba(255,164,43,0.12)" },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255,164,43,0.22)" },
          { offset: 1, color: "rgba(255,164,43,0)" },
        ]),
      },
      emphasis: { focus: "series" },
    } as any;

    const series = [] as any[];
    if (visibleSeries["Active Power"] !== false) series.push(activeSeries);
    if (visibleSeries["DC Power"] !== false) series.push(dcSeries);
    if (visibleSeries["Intensity"] !== false) series.push(intensitySeries);

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line", snap: true, lineStyle: { color: "#c2c8d1", width: 1 } },
        formatter: (params: any) => {
          if (!params || params.length === 0) return "";
          const time = params[0]?.axisValue;
          const visibleParams = params.filter((p: any) => p.data != null && (!p.seriesIndex || true));
          if (visibleParams.length === 0) return "";
          const lines = [`<div style=\"font-weight:600; margin-bottom:6px\">${time}</div>`];
          visibleParams.forEach((p: any) => {
            const value = p.data == null ? "-" : typeof p.data === "number" ? p.data.toFixed(2) : p.data;
            lines.push(`<div style=\"display:flex;align-items:center;gap:8px;margin:6px 0\"><span style=\"width:10px;height:10px;border-radius:6px;background:${p.color};display:inline-block;margin-right:8px\"></span><strong style=\"margin-right:6px\">${p.seriesName}:</strong> ${value} ${p.seriesName === 'Intensity' ? 'W/m²' : 'kW'}</div>`);
          });
          return `<div style=\"min-width:180px;padding:10px\">${lines.join("")}</div>`;
        },
      },
      grid: { left: 56, right: 44, top: 48, bottom: 28 },
      xAxis: {
        type: "category",
        data: sim.labels,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#8ba0c7", fontSize: 12, margin: 8 },
        splitLine: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "kW",
          axisLabel: { color: "#8ba0c7", fontSize: 12 },
          splitLine: { lineStyle: { color: "rgba(20,40,60,0.04)" } },
        },
        {
          type: "value",
          name: "W/m²",
          position: "right",
          axisLabel: { color: "#8ba0c7", fontSize: 12 },
          splitLine: { show: false },
        },
      ],
      series,
      animationDuration: 1200,
      animationEasing: "cubicOut",
    } as any;
  }, [sim, visibleSeries]);

  const branchPageCount = Math.ceil(sim.branches.length / pageSize);
  const branchPageSeries = useMemo(() => {
    const start = branchPage * pageSize;
    const page = sim.branches.slice(start, start + pageSize);
    return page.map((arr, idx) => ({ name: `Branch ${String(start + idx + 1).padStart(2, "0")}`, data: arr, color: branchColors[(start + idx) % branchColors.length] }));
  }, [sim, branchPage, pageSize]);

  const currentOption = useMemo(() => {
    const series = branchPageSeries
      .filter((s) => visibleSeries[s.name] !== false)
      .map((s, i) => ({
        name: s.name,
        type: "line",
        smooth: true,
        showSymbol: false,
        data: s.data,
        lineStyle: { width: 2, color: s.color, shadowBlur: 8, shadowColor: `${s.color}44` },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${s.color}33` },
            { offset: 1, color: `${s.color}00` },
          ]),
        },
      } as any));

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line", snap: true, lineStyle: { color: "#c2c8d1", width: 1 } },
        formatter: (params: any) => {
          if (!params || params.length === 0) return "";
          const time = params[0]?.axisValue;
          const visibleParams = params.filter((p: any) => p.data != null);
          if (visibleParams.length === 0) return "";
          const lines = [`<div style=\"font-weight:600; margin-bottom:6px\">${time}</div>`];
          visibleParams.forEach((p: any) => {
            const value = p.data == null ? "-" : typeof p.data === "number" ? p.data.toFixed(2) : p.data;
            lines.push(`<div style=\"display:flex;align-items:center;gap:8px;margin:6px 0\"><span style=\"width:10px;height:10px;border-radius:6px;background:${p.color};display:inline-block;margin-right:8px\"></span><strong style=\"margin-right:6px\">${p.seriesName}:</strong> ${value} A</div>`);
          });
          return `<div style=\"min-width:180px;padding:10px\">${lines.join("")}</div>`;
        },
      },
      grid: { left: 56, right: 36, top: 48, bottom: 28 },
      xAxis: {
        type: "category",
        data: sim.labels,
        boundaryGap: false,
        axisLine: { show: false },
        axisLabel: { color: "#8ba0c7", fontSize: 12, margin: 8 },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "A",
        axisLabel: { color: "#8ba0c7", fontSize: 12 },
        splitLine: { lineStyle: { color: "rgba(20,40,60,0.04)" } },
      },
      series,
      animationDuration: 1000,
      animationEasing: "cubicOut",
    } as any;
  }, [sim, branchPageSeries, visibleSeries]);

  function toggleSeries(label: string) {
    setVisibleSeries((prev) => ({ ...prev, [label]: !(prev[label] !== false) }));
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 xl:col-span-6">
          <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col min-h-[460px] h-[460px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[18px] font-semibold tracking-tight text-[#101828]">Power Curves</h3>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 rounded-md border border-[#e6edf5] bg-white px-3 text-[13px] text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 flex-nowrap overflow-x-auto text-[12px]">
                {[
                  { label: "Active Power", color: "#28b3d6" },
                  { label: "DC Power", color: "#ea5aad" },
                  { label: "Intensity", color: "#ffa42b" },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => toggleSeries(s.label)}
                    className={`flex items-center gap-2 text-[12px] font-medium ${visibleSeries[s.label] === false ? "opacity-40" : ""}`}
                  >
                    <span style={{ background: s.color }} className="h-3 w-3 rounded-full border-2 border-white shadow-sm" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 mt-0">
              <ReactECharts option={powerOption} style={{ height: '100%', width: '100%' }} lazyUpdate={true} />
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-6">
          <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col min-h-[460px] h-[460px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[18px] font-semibold tracking-tight text-[#101828]">Current Curves</h3>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 rounded-md border border-[#e6edf5] bg-white px-3 text-[13px] text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 flex-nowrap overflow-x-auto text-[12px]">
                {branchPageSeries.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => toggleSeries(s.name)}
                    className={`flex items-center gap-2 text-[12px] font-medium ${visibleSeries[s.name] === false ? "opacity-40" : ""}`}
                  >
                    <span style={{ background: s.color }} className="h-3 w-3 rounded-full border-2 border-white shadow-sm" />
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-[12px] text-[#3f4f64]">
                <button type="button" onClick={() => setBranchPage((p) => Math.max(0, p - 1))} disabled={branchPage === 0} className="disabled:opacity-40">
                  <ChevronLeft />
                </button>
                <div>{branchPage + 1}/{branchPageCount}</div>
                <button type="button" onClick={() => setBranchPage((p) => Math.min(branchPageCount - 1, p + 1))} disabled={branchPage === branchPageCount - 1} className="disabled:opacity-40">
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="flex-1 mt-0">
              <ReactECharts option={currentOption} style={{ height: '100%', width: '100%' }} lazyUpdate={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
