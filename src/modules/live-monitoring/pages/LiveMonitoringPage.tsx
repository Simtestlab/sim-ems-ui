"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import * as echarts from "echarts";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ChartCard from "../components/ChartCard";
import { generateDayData } from "../utils/simulation";
import { makeTooltipFormatter } from "../utils/chart";

const ReactECharts = dynamic(() => import("echarts-for-react").then((m) => m.default), { ssr: false });



export default function LiveMonitoringPage({ seed = 12345 }: { seed?: number }) {
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
        formatter: makeTooltipFormatter({ Intensity: "W/m²", default: "kW" }),
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
        formatter: makeTooltipFormatter({ default: "A" }),
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
          <ChartCard
            title="Power Curves"
            headerControls={
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 rounded-md border border-[#e6edf5] bg-white px-3 text-[13px] text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              />
            }
            leftLegend={
              <>
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
              </>
            }
          >
            <ReactECharts option={powerOption} style={{ height: '100%', width: '100%' }} lazyUpdate={true} />
          </ChartCard>
        </div>

        <div className="col-span-12 xl:col-span-6">
          <ChartCard
            title="Current Curves"
            headerControls={
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 rounded-md border border-[#e6edf5] bg-white px-3 text-[13px] text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              />
            }
            leftLegend={
              <>
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
              </>
            }
            rightControls={
              <>
                <button type="button" onClick={() => setBranchPage((p) => Math.max(0, p - 1))} disabled={branchPage === 0} className="disabled:opacity-40">
                  <ChevronLeft />
                </button>
                <div>{branchPage + 1}/{branchPageCount}</div>
                <button type="button" onClick={() => setBranchPage((p) => Math.min(branchPageCount - 1, p + 1))} disabled={branchPage === branchPageCount - 1} className="disabled:opacity-40">
                  <ChevronRight />
                </button>
              </>
            }
          >
            <ReactECharts option={currentOption} style={{ height: '100%', width: '100%' }} lazyUpdate={true} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
