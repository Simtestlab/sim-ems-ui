import React from "react";

type Props = {
  title: string;
  headerControls?: React.ReactNode;
  leftLegend?: React.ReactNode;
  rightControls?: React.ReactNode;
  children: React.ReactNode;
};

export default function ChartCard({ title, headerControls, leftLegend, rightControls, children }: Props) {
  return (
    <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col min-h-[460px] h-[460px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[18px] font-semibold tracking-tight text-[#101828]">{title}</h3>
        <div className="flex items-center gap-3">{headerControls}</div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 flex-nowrap overflow-x-auto text-[12px]">{leftLegend}</div>
        <div className="flex items-center gap-3 text-[12px] text-[#3f4f64]">{rightControls}</div>
      </div>

      <div className="flex-1 mt-0">{children}</div>
    </div>
  );
}
