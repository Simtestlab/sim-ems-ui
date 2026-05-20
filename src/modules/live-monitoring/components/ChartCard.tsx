import React from "react";

type Props = {
  title: string;
  headerControls?: React.ReactNode;
  leftLegend?: React.ReactNode;
  rightControls?: React.ReactNode;
  children: React.ReactNode;
  /** Compact mode reduces padding and height for denser layouts */
  compact?: boolean;
};

export default function ChartCard({ title, headerControls, leftLegend, rightControls, children, compact = false }: Props) {
  const paddingClass = compact ? 'px-4 py-4' : 'px-5 py-5'
  const heightClass = compact ? 'min-h-[340px] h-[340px]' : 'min-h-[420px] h-[420px]'

  return (
    <div className={`rounded-[20px] border border-[#e6edf5] bg-white ${paddingClass} shadow-[0_6px_24px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col ${heightClass}`}>
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
