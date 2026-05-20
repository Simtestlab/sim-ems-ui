"use client"

import { useState, useRef, useEffect } from 'react'
import { Battery, Zap, Sun, Car, ChevronDown } from 'lucide-react'
import DeviceControlCard from '../components/DeviceControlCard'
import DeviceIllustration from '../components/DeviceIllustration'
import PowerInputField from '../components/PowerInputField'
import OperationModeSelector from '../components/OperationModeSelector'
import ActionFooterBar from '../components/ActionFooterBar'
import SchedulerLegend from '../components/SchedulerLegend'
import SchedulerTimeline from '../components/SchedulerTimeline'
import StrategyTable from '../components/StrategyTable'
import StrategyEditableTable, { EditableStrategyRow } from '../components/StrategyEditableTable'
import GlobalStrategyParameters from '../components/GlobalStrategyParameters'
import type { AssetSchedule } from '../components/SchedulerTimeline'
import type { StrategyRow } from '../components/StrategyTable'

// Operation color constants
const OPERATION_COLORS = {
  charge: '#86efac',
  discharge: '#fecdd3',
  backflowControl: '#c7d2fe',
  peakShaving: '#fef3c7',
  pvPowerLimit: '#fde68a',
  activate: '#6ee7b7',
  chargingPointPowerLimit: '#ddd6fe',
  v2g: '#f9a8d4',
}

type SettingsPageProps = {
  activeMode?: 'manual' | 'auto'
  onModeChange?: (mode: 'manual' | 'auto') => void
}

export default function SettingsPage({ activeMode: controlledMode, onModeChange }: SettingsPageProps = {}) {
  const [internalMode, setInternalMode] = useState<'manual' | 'auto'>('auto')
  
  const activeMode = controlledMode ?? internalMode
  const setActiveMode = onModeChange ?? setInternalMode
  
  // Manual mode state
  const [bessPowered, setBessPowered] = useState(true)
  const [bessActivePower, setBessActivePower] = useState('80')
  const [bessReactivePower, setBessReactivePower] = useState('8')
  const [bessOperationMode, setBessOperationMode] = useState<'grid-forming' | 'grid-following'>('grid-following')
  const [dgPowered, setDgPowered] = useState(false)
  const [dgActivePower, setDgActivePower] = useState('0')
  const [dgReactivePower, setDgReactivePower] = useState('0')
  const [dgOperationMode, setDgOperationMode] = useState<'grid-forming' | 'grid-following'>('grid-following')
  const [pvPowered, setPvPowered] = useState(true)
  const [pvMaxPower, setPvMaxPower] = useState('176.5')
  const [evPowered, setEvPowered] = useState(false)
  const [evActivePower, setEvActivePower] = useState('0')
  const [evLimitPower, setEvLimitPower] = useState('0')

  // Auto mode state - Active Value
  const [activeSchedules] = useState<AssetSchedule[]>([
    {
      assetName: 'BESS',
      operations: [
        { startHour: 0, endHour: 5, label: 'Discharge', color: OPERATION_COLORS.discharge },
        { startHour: 9, endHour: 15, label: 'Charge', color: OPERATION_COLORS.charge },
        { startHour: 18, endHour: 23, label: 'Discharge', color: OPERATION_COLORS.discharge },
      ],
    },
    {
      assetName: 'PV',
      operations: [
        { startHour: 6, endHour: 18, label: 'Power Limit', color: OPERATION_COLORS.pvPowerLimit },
      ],
    },
    {
      assetName: 'Charging Point',
      operations: [
        { startHour: 10, endHour: 12, label: 'Power Limit', color: OPERATION_COLORS.chargingPointPowerLimit },
        { startHour: 23, endHour: 23.99, label: 'Power Limit', color: OPERATION_COLORS.chargingPointPowerLimit },
      ],
    },
  ])

  const [activeStrategyRows] = useState<StrategyRow[]>([
    { asset: 'BESS', startTime: '09:00', endTime: '15:00', operationMode: 'Charge', powerLimit: '80 kW', minSOC: '10%', maxSOC: '100%', colorIndicator: OPERATION_COLORS.charge },
    { asset: 'BESS', startTime: '18:00', endTime: '03:00', operationMode: 'Discharge', powerLimit: '150 kW', minSOC: '10%', maxSOC: '100%', colorIndicator: OPERATION_COLORS.discharge },
    { asset: 'BESS', startTime: '18:00', endTime: '03:00', operationMode: 'Discharge', powerLimit: '150 kW', minSOC: '10%', maxSOC: '100%', colorIndicator: OPERATION_COLORS.discharge },
    { asset: 'PV', startTime: '06:00', endTime: '18:00', operationMode: 'Power Limit', powerLimit: '200 kW', minSOC: '-', maxSOC: '-', colorIndicator: OPERATION_COLORS.pvPowerLimit },
    { asset: 'Charging Point', startTime: '10:00', endTime: '12:00', operationMode: 'Power Limit', powerLimit: '50 kW', minSOC: '-', maxSOC: '-', colorIndicator: OPERATION_COLORS.chargingPointPowerLimit },
    { asset: 'Charging Point', startTime: '00:00', endTime: '03:00', operationMode: 'Power Limit', powerLimit: '100 kW', minSOC: '-', maxSOC: '-', colorIndicator: OPERATION_COLORS.chargingPointPowerLimit },
    { asset: 'Charging Point', startTime: '23:00', endTime: '23:59', operationMode: 'Power Limit', powerLimit: '100 kW', minSOC: '-', maxSOC: '-', colorIndicator: OPERATION_COLORS.chargingPointPowerLimit },
  ])

  // UI controls: export dropdown and period buttons
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily')
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef<HTMLDivElement | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>('Monday')

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!exportRef.current) return
      if (!exportRef.current.contains(e.target as Node)) setExportOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // Auto mode state - Draft Value
  const [draftSchedules, setDraftSchedules] = useState<AssetSchedule[]>([
    {
      assetName: 'BESS',
      operations: [
        { startHour: 0, endHour: 4, label: 'Discharge', color: OPERATION_COLORS.discharge },
        { startHour: 9, endHour: 15, label: 'Charge', color: OPERATION_COLORS.charge },
        { startHour: 18, endHour: 23, label: 'Discharge', color: OPERATION_COLORS.discharge },
      ],
    },
    {
      assetName: 'PV',
      operations: [
        { startHour: 6, endHour: 18, label: 'Power Limit', color: OPERATION_COLORS.pvPowerLimit },
      ],
    },
    {
      assetName: 'Diesel Generator',
      operations: [],
    },
    {
      assetName: 'Charging Point',
      operations: [
        { startHour: 10, endHour: 12, label: 'Power Limit', color: OPERATION_COLORS.chargingPointPowerLimit },
        { startHour: 23, endHour: 23.99, label: 'Power Limit', color: OPERATION_COLORS.chargingPointPowerLimit },
      ],
    },
  ])

  const [draftStrategyRows, setDraftStrategyRows] = useState<EditableStrategyRow[]>([
    { id: '1', asset: 'BESS', startTime: '09:00', endTime: '15:00', operationMode: 'Charge', powerLimit: '80', minSOC: '10', maxSOC: '100', colorIndicator: OPERATION_COLORS.charge },
    { id: '2', asset: 'BESS', startTime: '18:00', endTime: '03:00', operationMode: 'Discharge', powerLimit: '150', minSOC: '10', maxSOC: '100', colorIndicator: OPERATION_COLORS.discharge },
    { id: '3', asset: 'PV', startTime: '06:00', endTime: '18:00', operationMode: 'Power Limit', powerLimit: '200', minSOC: '-', maxSOC: '-', colorIndicator: OPERATION_COLORS.pvPowerLimit },
    { id: '4', asset: 'Charging Point', startTime: '00:00', endTime: '03:00', operationMode: 'Power Limit', powerLimit: '100', minSOC: '-', maxSOC: '-', colorIndicator: OPERATION_COLORS.chargingPointPowerLimit },
    { id: '5', asset: 'Charging Point', startTime: '10:00', endTime: '12:00', operationMode: 'Power Limit', powerLimit: '50', minSOC: '-', maxSOC: '-', colorIndicator: OPERATION_COLORS.chargingPointPowerLimit },
    { id: '6', asset: 'Charging Point', startTime: '23:00', endTime: '23:59', operationMode: 'Power Limit', powerLimit: '100', minSOC: '-', maxSOC: '-', colorIndicator: OPERATION_COLORS.chargingPointPowerLimit },
  ])

  // Global strategy parameters
  const [globalMinSOC, setGlobalMinSOC] = useState('10')
  const [globalMaxSOC, setGlobalMaxSOC] = useState('100')
  const [backflowControl, setBackflowControl] = useState('Disable')
  const [bessPowerLimit, setBessPowerLimit] = useState('')

  const legendItems = [
    { label: 'Charge', color: OPERATION_COLORS.charge },
    { label: 'Discharge', color: OPERATION_COLORS.discharge },
    { label: 'Backflow Control', color: OPERATION_COLORS.backflowControl },
    { label: 'Peak Shaving', color: OPERATION_COLORS.peakShaving },
    { label: 'PV Power Limit', color: OPERATION_COLORS.pvPowerLimit },
    { label: 'Activate (a Plan)', color: OPERATION_COLORS.activate },
    { label: 'Charging Point Power Limit', color: OPERATION_COLORS.chargingPointPowerLimit },
    { label: 'V2G', color: OPERATION_COLORS.v2g },
  ]

  const handleUpdateRow = (id: string, field: keyof EditableStrategyRow, value: string) => {
    setDraftStrategyRows(prev => prev.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ))
  }

  const handleRemoveRow = (id: string) => {
    setDraftStrategyRows(prev => prev.filter(row => row.id !== id))
  }

  const handleAddRow = (asset: string) => {
    const newRow: EditableStrategyRow = {
      id: Date.now().toString(),
      asset,
      startTime: '00:00',
      endTime: '00:00',
      operationMode: 'Charge',
      powerLimit: '0',
      minSOC: '10',
      maxSOC: '100',
      colorIndicator: OPERATION_COLORS.charge,
    }
    setDraftStrategyRows(prev => [...prev, newRow])
  }

  const handleSave = () => {
    console.log('Save settings')
  }

  const handleEnable = () => {
    console.log('Enable settings')
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto bg-[#f8f9fc]">
        {activeMode === 'manual' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BESS */}
              <DeviceControlCard title="BESS">
                <div className="space-y-4">
                  <div className="text-[11px] text-[#6b7280]">
                    These Settings Apply To All BESS Units In The System.
                  </div>
                  
                  <OperationModeSelector
                    value={bessOperationMode}
                    onChange={setBessOperationMode}
                    description="When PCS Is In Grid Forming Mode, Active Power And Reactive Power Setpoints Are Disabled."
                  />

                  <DeviceIllustration
                    deviceName="BESS"
                    isPowered={bessPowered}
                    onPowerOn={() => setBessPowered(true)}
                    onPowerOff={() => setBessPowered(false)}
                    illustrationContent={
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="160" height="120" viewBox="0 0 160 120">
                          {/* Cabinet 1 */}
                          <polygon points="35,18 60,28 35,42 10,32" fill="#64748b"/>
                          <polygon points="10,32 35,42 35,90 10,80" fill="#334155"/>
                          <polygon points="35,42 60,28 60,76 35,90" fill="#475569"/>
                          <rect x="14" y="46" width="14" height="26" rx="1" fill="#475569"/>
                          <rect x="15" y="47" width="10" height="12" rx="1" fill="#94a3b8"/>
                          <circle cx="19" cy="70" r="3.5" fill="#22c55e"/>
                          <polygon points="10,32 35,18 60,28 35,42" fill="#60a5fa" opacity="0.28"/>
                          {/* Cabinet 2 */}
                          <polygon points="80,12 105,22 80,36 55,26" fill="#64748b"/>
                          <polygon points="55,26 80,36 80,84 55,74" fill="#334155"/>
                          <polygon points="80,36 105,22 105,70 80,84" fill="#475569"/>
                          <rect x="59" y="40" width="14" height="26" rx="1" fill="#475569"/>
                          <rect x="60" y="41" width="10" height="12" rx="1" fill="#94a3b8"/>
                          <circle cx="64" cy="64" r="3.5" fill="#22c55e"/>
                          <polygon points="55,26 80,12 105,22 80,36" fill="#60a5fa" opacity="0.28"/>
                          {/* Cabinet 3 */}
                          <polygon points="125,8 150,18 125,30 100,20" fill="#64748b"/>
                          <polygon points="100,20 125,30 125,78 100,68" fill="#334155"/>
                          <polygon points="125,30 150,18 150,62 125,78" fill="#475569"/>
                          <rect x="104" y="34" width="14" height="26" rx="1" fill="#475569"/>
                          <rect x="105" y="35" width="10" height="12" rx="1" fill="#94a3b8"/>
                          <circle cx="109" cy="58" r="3.5" fill="#22c55e"/>
                          <polygon points="100,20 125,8 150,18 125,30" fill="#60a5fa" opacity="0.28"/>
                          <ellipse cx="80" cy="96" rx="74" ry="7" fill="#e2e8f0" opacity="0.6"/>
                        </svg>
                      </div>
                    }
                  />

                  <PowerInputField
                    label="Active Power"
                    value={bessActivePower}
                    onChange={setBessActivePower}
                    unit="kW"
                    measured="85 kW"
                    commanded="80 kW"
                  />

                  <PowerInputField
                    label="Reactive Power"
                    value={bessReactivePower}
                    onChange={setBessReactivePower}
                    unit="kVar"
                  />

                  <div className="text-[11px] text-[#6b7280]">
                    Reactive Power Support Is Available Only In Grid Following Mode.
                  </div>
                </div>
              </DeviceControlCard>

              {/* DG */}
              <DeviceControlCard title="DG">
                <div className="space-y-4">
                  <OperationModeSelector
                    value={dgOperationMode}
                    onChange={setDgOperationMode}
                    description="When Generator Is In Grid Forming Mode, Active Power Support Is Disabled."
                  />

                  <DeviceIllustration
                    deviceName="DG"
                    isPowered={dgPowered}
                    onPowerOn={() => setDgPowered(true)}
                    onPowerOff={() => setDgPowered(false)}
                    illustrationContent={
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="150" height="120" viewBox="0 0 150 120">
                          <polygon points="75,10 128,30 75,55 22,35"   fill="#fbbf24"/>
                          <polygon points="22,35 75,55 75,100 22,80"   fill="#d97706"/>
                          <polygon points="75,55 128,30 128,75 75,100" fill="#b45309"/>
                          <polygon points="30,40 62,52 62,76 30,64"    fill="#1e293b"/>
                          <line x1="34" y1="46" x2="58" y2="56" stroke="#475569" strokeWidth="2"/>
                          <line x1="34" y1="52" x2="58" y2="62" stroke="#475569" strokeWidth="2"/>
                          <line x1="34" y1="58" x2="58" y2="68" stroke="#475569" strokeWidth="2"/>
                          <rect x="118" y="10" width="7" height="24" rx="2" fill="#475569"/>
                          <ellipse cx="121" cy="10" rx="5" ry="2.5" fill="#64748b"/>
                          <circle cx="28" cy="94" r="11" fill="#1e293b"/>
                          <circle cx="28" cy="94" r="5" fill="#475569"/>
                          <circle cx="100" cy="88" r="10" fill="#1e293b"/>
                          <circle cx="100" cy="88" r="4.5" fill="#475569"/>
                          <line x1="8" y1="46" x2="8" y2="80" stroke="#64748b" strokeWidth="4"/>
                          <ellipse cx="75" cy="103" rx="56" ry="6" fill="#e2e8f0" opacity="0.6"/>
                        </svg>
                      </div>
                    }
                  />

                  <PowerInputField
                    label="Active Power"
                    value={dgActivePower}
                    onChange={setDgActivePower}
                    unit="kW"
                    measured="0"
                    commanded="0"
                  />

                  <PowerInputField
                    label="Reactive Power"
                    value={dgReactivePower}
                    onChange={setDgReactivePower}
                    unit="kVar"
                  />

                  <div className="text-[11px] text-[#6b7280]">
                    Generator Output Support.
                  </div>
                </div>
              </DeviceControlCard>

              {/* PV */}
              <DeviceControlCard title="PV">
                <div className="space-y-4">
                  <DeviceIllustration
                    deviceName="PV"
                    isPowered={pvPowered}
                    onPowerOn={() => setPvPowered(true)}
                    onPowerOff={() => setPvPowered(false)}
                    illustrationContent={
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="160" height="110" viewBox="0 0 160 110">
                          <polygon points="80,6 142,28 80,55 18,33"  fill="#1d4ed8"/>
                          <polygon points="18,33 80,55 80,68 18,46"  fill="#1e3a8a"/>
                          <line x1="28" y1="12" x2="90" y2="34"  stroke="#3b82f6" strokeWidth="2" opacity="0.8"/>
                          <line x1="48" y1="19" x2="110" y2="41" stroke="#3b82f6" strokeWidth="2" opacity="0.8"/>
                          <line x1="68" y1="26" x2="130" y2="48" stroke="#3b82f6" strokeWidth="2" opacity="0.8"/>
                          <line x1="142" y1="28" x2="80" y2="6"  stroke="#3b82f6" strokeWidth="1.5" opacity="0.45"/>
                          <line x1="112" y1="38" x2="50" y2="16" stroke="#3b82f6" strokeWidth="1.5" opacity="0.45"/>
                          <line x1="32" y1="60" x2="32" y2="82" stroke="#94a3b8" strokeWidth="3.5"/>
                          <line x1="80" y1="65" x2="80" y2="87" stroke="#94a3b8" strokeWidth="3.5"/>
                          <line x1="128" y1="57" x2="128" y2="79" stroke="#94a3b8" strokeWidth="3.5"/>
                          <line x1="20" y1="82" x2="44" y2="82" stroke="#94a3b8" strokeWidth="4"/>
                          <line x1="68" y1="87" x2="92" y2="87" stroke="#94a3b8" strokeWidth="4"/>
                          <line x1="116" y1="79" x2="140" y2="79" stroke="#94a3b8" strokeWidth="4"/>
                          <ellipse cx="80" cy="96" rx="72" ry="7" fill="#e2e8f0" opacity="0.6"/>
                        </svg>
                      </div>
                    }
                  />

                  <PowerInputField
                    label="Maximum Power"
                    value={pvMaxPower}
                    onChange={setPvMaxPower}
                    unit="kW"
                    measured="182.8 kW"
                    commanded="182.8 kW"
                  />

                  <div className="text-[11px] text-[#6b7280]">
                    Limit PV Generation Output
                  </div>
                </div>
              </DeviceControlCard>

              {/* EV */}
              <DeviceControlCard title="EV">
                <div className="space-y-4">
                  <DeviceIllustration
                    deviceName="EV"
                    isPowered={evPowered}
                    onPowerOn={() => setEvPowered(true)}
                    onPowerOff={() => setEvPowered(false)}
                    illustrationContent={
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="150" height="120" viewBox="0 0 150 120">
                          {/* Charging column */}
                          <polygon points="28,6 44,13 28,22 12,15"  fill="#e2e8f0"/>
                          <polygon points="12,15 28,22 28,78 12,71"  fill="#cbd5e1"/>
                          <polygon points="28,22 44,13 44,71 28,78" fill="#94a3b8"/>
                          <polygon points="15,24 28,29 28,50 15,45" fill="#0ea5e9"/>
                          <polygon points="24,29 20,38 23,38 19,47 30,36 27,36" fill="#fbbf24"/>
                          <circle cx="36" cy="64" r="5" fill="#475569"/>
                          <circle cx="36" cy="64" r="2.5" fill="#64748b"/>
                          <path d="M36,69 Q54,76 76,78" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round"/>
                          {/* Car */}
                          <g transform="translate(46,64)">
                            <polygon points="37,6 74,20 37,37 0,23"  fill="#f8fafc"/>
                            <polygon points="0,23 37,37 37,54 0,40"  fill="#e2e8f0"/>
                            <polygon points="37,37 74,20 74,34 37,54" fill="#cbd5e1"/>
                            <polygon points="10,22 27,28 27,36 10,30"  fill="#93c5fd"/>
                            <polygon points="43,28 58,22 58,30 43,36" fill="#93c5fd"/>
                            <circle cx="10" cy="49" r="7.5" fill="#1e293b"/>
                            <circle cx="10" cy="49" r="3" fill="#475569"/>
                            <circle cx="58" cy="43" r="7.5" fill="#1e293b"/>
                            <circle cx="58" cy="43" r="3" fill="#475569"/>
                          </g>
                          <ellipse cx="80" cy="114" rx="70" ry="6" fill="#e2e8f0" opacity="0.5"/>
                        </svg>
                      </div>
                    }
                  />

                  <PowerInputField
                    label="Active Power"
                    value={evActivePower}
                    onChange={setEvActivePower}
                    unit="kW"
                    measured="0 kW"
                    commanded="50 kW"
                  />

                  <PowerInputField
                    label="Limit Power"
                    value={evLimitPower}
                    onChange={setEvLimitPower}
                    unit="kW"
                    measured="0 kW"
                    commanded="50 kW"
                  />

                  <div className="text-[11px] text-[#6b7280]">
                    Limit Total Charger Consumption
                  </div>
                </div>
              </DeviceControlCard>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Active Value Section */}
            <div className="space-y-4">
              {period === 'weekly' ? (
                <div className="bg-white rounded-lg border border-[#e6edf5] px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-[14px]">
                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDay(d)}
                        className={`px-3 py-2 rounded text-[13px] ${selectedDay === d ? 'text-[#1890ff] border-b-2 border-[#1890ff]' : 'text-[#6b7280] hover:text-[#0f1724]'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2" ref={exportRef}>
                    <div className="relative">
                      <button
                        onClick={() => setExportOpen((s) => !s)}
                        className="h-9 pl-3 pr-2 flex items-center gap-2 rounded border border-[#dce4ee] bg-white text-[13px] text-[#0f1724] hover:bg-[#f8f9fc] transition-colors"
                      >
                        <span>Export</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {exportOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e6edf5] rounded shadow-md z-20">
                          <button
                            onClick={() => { console.log('Export Active Value'); setExportOpen(false) }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50"
                          >
                            Active Value
                          </button>
                          <button
                            onClick={() => { console.log('Export Draft Value'); setExportOpen(false) }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50"
                          >
                            Draft Value
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setPeriod('weekly')}
                      className="h-9 px-4 rounded border text-[13px] transition-colors border-[#1890ff] text-[#1890ff] font-medium"
                    >
                      Weekly
                    </button>

                    <button
                      onClick={() => setPeriod('daily')}
                      className="h-9 px-4 rounded border text-[13px] transition-colors border-[#dce4ee] text-[#0f1724] hover:bg-[#f8f9fc]"
                    >
                      Daily
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-semibold text-[#0f1724]">Active Value</h2>
                  <div className="flex items-center gap-2" ref={exportRef}>
                    <div className="relative">
                      <button
                        onClick={() => setExportOpen((s) => !s)}
                        className="h-9 pl-3 pr-2 flex items-center gap-2 rounded border border-[#dce4ee] bg-white text-[13px] text-[#0f1724] hover:bg-[#f8f9fc] transition-colors"
                      >
                        <span>Export</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {exportOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e6edf5] rounded shadow-md z-20">
                          <button
                            onClick={() => { console.log('Export Active Value'); setExportOpen(false) }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50"
                          >
                            Active Value
                          </button>
                          <button
                            onClick={() => { console.log('Export Draft Value'); setExportOpen(false) }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50"
                          >
                            Draft Value
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setPeriod('weekly')}
                      className="h-9 px-4 rounded border text-[13px] transition-colors border-[#dce4ee] text-[#0f1724] hover:bg-[#f8f9fc]"
                    >
                      Weekly
                    </button>

                    <button
                      onClick={() => setPeriod('daily')}
                      className="h-9 px-4 rounded border text-[13px] transition-colors border-[#1890ff] text-[#1890ff] font-medium"
                    >
                      Daily
                    </button>
                  </div>
                </div>
              )}

              {period === 'weekly' && (
                <div className="mt-4">
                  <h2 className="text-[18px] font-semibold text-[#0f1724]">Active Value</h2>
                </div>
              )}

              <div className="bg-white rounded-lg border border-[#e6edf5] overflow-hidden">
                <SchedulerLegend items={legendItems} />
                <SchedulerTimeline schedules={activeSchedules} />
              </div>

              <div className="bg-white rounded-lg border border-[#e6edf5] overflow-hidden">
                <StrategyTable rows={activeStrategyRows} />
              </div>
            </div>

            {/* Draft Value Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#0f1724]">Draft Value</h2>
                <div className="flex items-center gap-2">
                  <button className="h-9 px-4 rounded border border-[#dce4ee] bg-white text-[13px] text-[#0f1724] hover:bg-[#f8f9fc] transition-colors">
                    Upload Draft
                  </button>
                  <button className="h-9 px-4 rounded border border-[#dce4ee] bg-white text-[13px] text-[#0f1724] hover:bg-[#f8f9fc] transition-colors">
                    Import Active Value
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#e6edf5] overflow-hidden">
                <SchedulerTimeline schedules={draftSchedules} />
              </div>

              <div className="bg-white rounded-lg border border-[#e6edf5] p-4">
                <StrategyEditableTable
                  rows={draftStrategyRows}
                  onUpdateRow={handleUpdateRow}
                  onRemoveRow={handleRemoveRow}
                  onAddRow={handleAddRow}
                />
              </div>
            </div>

            {/* Global Strategy Parameters */}
            <GlobalStrategyParameters
              globalMinSOC={globalMinSOC}
              globalMaxSOC={globalMaxSOC}
              backflowControl={backflowControl}
              bessPowerLimit={bessPowerLimit}
              onUpdateGlobalMinSOC={setGlobalMinSOC}
              onUpdateGlobalMaxSOC={setGlobalMaxSOC}
              onUpdateBackflowControl={setBackflowControl}
              onUpdateBessPowerLimit={setBessPowerLimit}
            />
          </div>
        )}
      </div>

      <ActionFooterBar onSave={handleSave} onEnable={handleEnable} />
    </div>
  )
}
