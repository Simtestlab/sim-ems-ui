'use client';
import { useNavStore } from '@/store/useNavStore';
import { useTelemetryStore } from '@/store/telemetryStore';
import { getSiteConfig } from '@/config/sites';

export default function SiteSidePanel() {
  const selectedSiteId = useNavStore((state) => state.selectedSite);
  const telemetryState = useTelemetryStore((state) => state.sites[selectedSiteId]);
  const config = getSiteConfig(selectedSiteId);

  if (!config) return null;

  const isConnected = telemetryState?.status === 'CONNECTED';
  const statusColor = isConnected ? 'text-green-600' : 'text-red-600';
  const data = telemetryState?.latestTelemetry;

  const MiniRow = ({ label, value, unit = "" }: { label: string; value: any; unit?: string }) => (
    <div className="flex justify-between items-center py-0.5 border-b border-gray-50">
      <span className="text-[10px] text-black font-bold uppercase">{label}:</span>
      <span className="text-[11px] font-bold text-gray-800">
        {value ?? '—'} <span className="text-[9px] font-normal text-gray-400">{unit}</span>
      </span>
    </div>
  );

  return (
    <div className="h-full w-full p-4 flex flex-col justify-between bg-white overflow-hidden text-sm">
      
      {/* 1. SITE IDENTITY & LOCATION */}
      <section>
        <h2 className="text-[11px] font-black text-black uppercase border-b border-black pb-0.5 mb-2">Site Identity</h2>
        <div className="grid grid-cols-2 gap-x-4">
          <MiniRow label="Name" value={config.name} />
          <div className="flex justify-between items-center py-0.5 border-b border-gray-50">
            <span className="text-[10px] text-black font-bold uppercase">Status:</span>
            <span className={`text-[10px] font-black uppercase ${statusColor}`}>● {telemetryState?.status || 'OFFLINE'}</span>
          </div>
          <MiniRow label="Lat" value={config.lat.toFixed(3)} />
          <MiniRow label="Lng" value={config.lng.toFixed(3)} />
          <MiniRow label="Capacity" value={config.capacity} unit="MW" />
          <MiniRow label="ID" value={config.id} /> 
        </div>
      </section>

      {/* 2. BATTERY STORAGE */}
      <section>
        <h2 className="text-[11px] font-black text-black uppercase border-b border-black pb-0.5 mb-2">Battery Storage</h2>
        <div className="grid grid-cols-2 gap-x-4">
          <MiniRow label="SOC" value={data?.battery?.soc ? (data.battery.soc * 100).toFixed(1) : '0'} unit="%" />
          <MiniRow label="SOH" value={data?.battery?.soh ? (data.battery.soh * 100).toFixed(1) : '0'} unit="%" />
          <MiniRow label="Power" value={data?.battery?.power_kw} unit="kW" />
          <MiniRow label="Voltage" value={data?.battery?.voltage} unit="V" />
          <MiniRow label="Current" value={data?.battery?.current} unit="A" />
          <MiniRow label="Temp" value={data?.battery?.temperature_c} unit="°C" />
          <MiniRow label="Cycles" value={data?.battery?.cycle_count} />
          <MiniRow label="Faults" value={data?.battery?.faults?.length || 0} />
        </div>
      </section>

      {/* 3. GRID & SOLAR */}
      <div className="grid grid-cols-2 gap-x-6">
        <section>
          <h2 className="text-[11px] font-black text-black uppercase border-b border-black pb-0.5 mb-2">Grid</h2>
          <MiniRow label="Power" value={data?.grid?.power_kw} unit="kW" />
          <MiniRow label="Freq" value={data?.grid?.frequency} unit="Hz" />
          <MiniRow label="Voltage" value={data?.grid?.voltage} unit="V" />
          <MiniRow label="Price" value={data?.grid?.price} unit="$" />
        </section>
        <section>
          <h2 className="text-[11px] font-black text-black uppercase border-b border-black pb-0.5 mb-2">Solar</h2>
          <MiniRow label="AC" value={data?.solar?.power_ac_kw} unit="kW" />
          <MiniRow label="DC" value={data?.solar?.power_dc_kw} unit="kW" />
          <MiniRow label="Irr" value={data?.solar?.irradiance_w_m2} unit="W" />
          <MiniRow label="Eff" value={data?.solar?.efficiency} unit="%" />
        </section>
      </div>

      {/* 4. INVERTER */}
      <section>
        <h2 className="text-[11px] font-black text-black uppercase border-b border-black pb-0.5 mb-2">Inverter</h2>
        <div className="grid grid-cols-2 gap-x-4">
          <MiniRow label="Action" value={data?.inverter?.action} />
          <MiniRow label="Priority" value={data?.inverter?.priority} />
          <MiniRow label="Threshold" value={data?.inverter?.peak_demand_threshold} unit="kW" />
          <div className="flex justify-between items-center py-0.5 border-b border-gray-50 overflow-hidden">
            <span className="text-[10px] text-black font-bold uppercase">Reason:</span>
            <span className="text-[9px] font-bold text-gray-600 truncate ml-2" title={data?.inverter?.reason}>
                {data?.inverter?.reason?.replace(/_/g, ' ') || 'none'}
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="pt-2 border-t border-dotted border-gray-200 flex justify-between items-center">
         <span className="text-[9px] text-gray-400 font-mono">TS: {data?.timestamp?.split('T')[1].split('.')[0] || '00:00:00'}</span>
         <span className="text-[9px] font-bold text-blue-500 italic uppercase">Live Telemetry</span>
      </div>
    </div>
  );
}