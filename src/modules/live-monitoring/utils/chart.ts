export function makeTooltipFormatter(unitMap: Record<string, string> = {}) {
  return (params: any) => {
    if (!params || params.length === 0) return "";
    const time = params[0]?.axisValue;
    const visibleParams = params.filter((p: any) => p.data != null);
    if (visibleParams.length === 0) return "";
    const lines: string[] = [`<div style="font-weight:600; margin-bottom:6px">${time}</div>`];
    visibleParams.forEach((p: any) => {
      const value = p.data == null ? "-" : typeof p.data === "number" ? p.data.toFixed(2) : p.data;
      const unit = unitMap[p.seriesName] ?? unitMap["default"] ?? (p.seriesName === "Intensity" ? "W/m²" : "kW");
      lines.push(
        `<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><span style="width:10px;height:10px;border-radius:6px;background:${p.color};display:inline-block;margin-right:8px"></span><strong style="margin-right:6px">${p.seriesName}:</strong> ${value} ${unit}</div>`
      );
    });
    return `<div style="min-width:180px;padding:10px">${lines.join("")}</div>`;
  };
}
