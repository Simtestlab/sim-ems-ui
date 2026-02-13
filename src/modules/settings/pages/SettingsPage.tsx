'use client';

import { SetStateAction, useEffect, useState } from 'react';

// Reusable status indicator + optional toggle
function StatusToggle({
  statusOn,
  onToggle,
  onLabel = 'ACTIVE',
  offLabel = 'IDLE',
  showToggle = true,
}: {
  statusOn: boolean;
  onToggle?: (s: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  showToggle?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusOn ? 'bg-emerald-500' : 'bg-gray-400'}`} />
        <span className="text-xs font-medium text-gray-600">{statusOn ? onLabel : offLabel}</span>
      </div>
      {showToggle && (
        <>
          <button
            onClick={() => onToggle && onToggle(!statusOn)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              statusOn ? 'bg-gray-300' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                statusOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-xs font-medium text-gray-500">ON</span>
        </>
      )}
    </div>
  );
}

// Reusable action buttons (Apply / Reset)
function ActionButtons({ onApply, onReset }: { onApply: () => void; onReset: () => void }) {
  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={onApply}
        className="w-32 px-3 py-2 bg-emerald-400 text-white text-sm font-medium rounded hover:bg-emerald-600 transition-colors"
      >
        Apply
      </button>
      <button
        onClick={onReset}
        className="w-32 px-3 py-2 bg-red-100 text-gray-700 text-sm font-medium rounded hover:bg-red-200 transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

// Generic hold-to-confirm button with progress overlay
function HoldButton({
  isHolding,
  progress,
  onStart,
  onCancel,
  disabled,
  baseText,
  holdingText,
  baseBg = 'bg-red-100 text-red-700 hover:bg-red-200',
  holdBg = 'bg-red-600 text-white',
  overlayBg = 'bg-red-300',
}: {
  isHolding: boolean;
  progress: number;
  onStart: () => void;
  onCancel: () => void;
  disabled?: boolean;
  baseText: string;
  holdingText: string;
  baseBg?: string;
  holdBg?: string;
  overlayBg?: string;
}) {
  return (
    <div className="relative">
      <button
        onMouseDown={disabled ? undefined : onStart}
        onMouseUp={onCancel}
        onMouseLeave={onCancel}
        onTouchStart={disabled ? undefined : onStart}
        onTouchEnd={onCancel}
        disabled={disabled}
        className={`w-32 px-3 py-2 text-sm font-medium rounded transition-colors relative overflow-hidden ${
          disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : isHolding ? holdBg : baseBg
        }`}
      >
        {isHolding && (
          <div className={`absolute inset-0 ${overlayBg} transition-all`} style={{ width: `${progress}%` }} />
        )}
        <span className="relative z-10">{isHolding ? holdingText : baseText}</span>
      </button>
    </div>
  );
}

// Reusable form controls using black focus ring
function TextInput(props: any) {
  const { className = '', ...rest } = props;
  return (
    <input
      {...rest}
      className={`px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  );
}

function NumberInput(props: any) {
  const { className = '', ...rest } = props;
  return (
    <input
      type="number"
      {...rest}
      className={`px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  );
}

function SmallNumberInput(props: any) {
  const { className = '', ...rest } = props;
  return (
    <input
      type="number"
      {...rest}
      className={`w-20 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  );
}

function TextAreaInput(props: any) {
  const { className = '', ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  );
}

function CheckboxInput(props: any) {
  const { className = '', ...rest } = props;
  return (
    <input
      type="checkbox"
      {...rest}
      className={`w-4 h-4 accent-blue focus:ring-black rounded ${className}`}
    />
  );
}

function RadioInput(props: any) {
  const { className = '', ...rest } = props;
  return (
    <input
      type="radio"
      {...rest}
      className={`w-4 h-4 accent-blue focus:ring-black ${className}`}
    />
  );
}

// Reusable unit label
function UnitLabel({ children, className = 'text-sm text-gray-500 w-8' }: { children: React.ReactNode; className?: string }) {
  return <span className={`${className}`}>{children}</span>;
}

// Time picker grid: 24 hourly slots that can be Off / Charge / Discharge
// Time range editor: editable list of HH:MM-HH:MM Charge/Discharge ranges
function TimeRangeEditor({ value, onChange }: { value: any; onChange: (s: string) => void }) {
  type Range = { start: string; end: string; mode: 'Charge' | 'Discharge' };
  const [ranges, setRanges] = useState<Range[]>(() => parseRanges(value || ''));

  function parseRanges(s: string) {
    if (!s) return [];
    return String(s)
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(' ');
        const range = parts[0] || '00:00-00:00';
        const label = parts.slice(1).join(' ') || 'Charge';
        const [start, end] = range.split('-');
        return { start: start || '00:00', end: end || '00:00', mode: label.toLowerCase().includes('discharge') ? 'Discharge' : 'Charge' } as Range;
      });
  }

  function formatRanges(rs: Range[]) {
    return rs.map((r) => `${r.start}-${r.end} ${r.mode}`).join('\n');
  }

  useEffect(() => {
    setRanges(parseRanges(value || ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    onChange(formatRanges(ranges));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranges]);

  function updateRange(i: number, patch: Partial<Range>) {
    setRanges((prev) => {
      const next = prev.slice();
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  function addRange() {
    setRanges((prev) => [...prev, { start: '00:00', end: '01:00', mode: 'Charge' }]);
  }

  function removeRange(i: number) {
    setRanges((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      {ranges.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="time"
            value={r.start}
            onChange={(e) => updateRange(i, { start: e.target.value })}
            className="px-2 py-1 text-sm border rounded"
            style={{ background: 'var(--color-input)', color: 'var(--color-card-foreground)', borderColor: 'var(--color-border)' }}
          />
          <span className="text-sm text-gray-600">:</span>
          <input
            type="time"
            value={r.end}
            onChange={(e) => updateRange(i, { end: e.target.value })}
            className="px-2 py-1 text-sm border rounded"
            style={{ background: 'var(--color-input)', color: 'var(--color-card-foreground)', borderColor: 'var(--color-border)' }}
          />
                <select
                  value={r.mode}
                  onChange={(e) => updateRange(i, { mode: e.target.value as any })}
                  className="px-2 py-1 text-sm border rounded w-24"
                  style={{ background: r.mode === 'Charge' ? 'var(--color-accent)' : 'var(--secondary)', color: r.mode === 'Charge' ? 'var(--color-accent-foreground)' : 'var(--secondary-foreground)', borderColor: 'var(--color-border)' }}
                >
            <option>Charge</option>
            <option>Discharge</option>
          </select>
          <button type="button" onClick={() => removeRange(i)} className="text-sm" style={{ color: 'var(--color-accent-foreground)', background: 'transparent' }}>Remove</button>
        </div>
      ))}
      <div>
        <button
          type="button"
          onClick={addRange}
          className="px-3 py-1 text-sm rounded"
          style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid var(--color-border)' }}
        >
          Add Range
        </button>
      </div>
    </div>
  );
}
import { useAuth } from '@/modules/auth/context/AuthContext';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';

export default function SettingsPage() {
  const { user } = useAuth();
  const { canModifySettings } = usePermissions();

  if (!canModifySettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">
            You do not have permission to access system settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-full max-w-[1400px] mx-auto px-6 py-6 flex flex-col">
        {/* Header */}
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">EMS Logic Controller</h1>
          <p className="text-sm text-gray-500 mt-1">
            Control & Setpoints (Monitoring handled in Analytics)
          </p>
        </div>

        {/* Grid Layout - Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {/* Peak Shaving Card */}
            <PeakShavingCard />

            {/* PV Self-Consumption Card */}
            <PVSelfConsumptionCard />

            {/* Time-of-Use Optimization Card */}
            <TimeOfUseOptimizationCard />

            {/* Microgrid / Islanding Card */}
            <MicrogridIslandingCard />

            {/* Grid Services Card */}
            <GridServicesCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// Peak Shaving Card Component
function PeakShavingCard() {
  const [isActive, setIsActive] = useState(true);
  const [peakLimit, setPeakLimit] = useState('');
  const [deadband, setDeadband] = useState('');
  const [minOn, setMinOn] = useState('');
  const [minOff, setMinOff] = useState('');
  const [hvacEnabled, setHvacEnabled] = useState(true);
  const [evEnabled, setEvEnabled] = useState(true);

  const handleApply = () => {
    console.log('Applying Peak Shaving settings...');
    // API call would go here
  };

  const handleReset = () => {
    setPeakLimit('');
    setDeadband('');
    setMinOn('');
    setMinOff('');
  };

  return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Peak Shaving</h2>
        <StatusToggle statusOn={isActive} onToggle={(v) => setIsActive(v)} />
      </div>

      {/* Setpoints */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700">Setpoints</h3>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-28">Peak Limit</label>
            <NumberInput
              value={peakLimit}
              onChange={(e: any) => setPeakLimit(e.target.value)}
            className="flex-1"
          />
          <UnitLabel>kW</UnitLabel>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-28">Deadband</label>
            <NumberInput
              value={deadband}
              onChange={(e: any) => setDeadband(e.target.value)}
            className="flex-1"
          />
          <UnitLabel>kW</UnitLabel>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-28">Min ON / OFF</label>
          <SmallNumberInput
            value={minOn}
            onChange={(e: any) => setMinOn((e.target as HTMLInputElement).value)}
          />
          <SmallNumberInput
            value={minOff}
            onChange={(e: any) => setMinOff((e.target as HTMLInputElement).value)}
          />
          <span className="text-sm text-gray-500">sec</span>
        </div>

        {/* Load Priority */}
        <div className="pt-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Load Priority</h4>
          <div className="space-y-1.5 bg-gray-50 p-3 rounded">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <CheckboxInput
                checked={hvacEnabled}
                onChange={(e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => setHvacEnabled(e.target.checked)}
              />
              <span>1 HVAC 50kW</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <CheckboxInput
                checked={evEnabled}
                onChange={(e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => setEvEnabled(e.target.checked)}
              />
              <span>2 EV 40kW</span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </div>
  );
}

// PV Self-Consumption Card Component
function PVSelfConsumptionCard() {
  const [isActive, setIsActive] = useState(false);
  const [exportLimit, setExportLimit] = useState('');
  const [mode, setMode] = useState('balanced');
  const [minSoc, setMinSoc] = useState('');
  const [maxSoc, setMaxSoc] = useState('');
  const [batteryPowerLimit, setBatteryPowerLimit] = useState('');

  const handleApply = () => {
    console.log('Applying PV Self-Consumption settings...');
  };

  const handleReset = () => {
    setExportLimit('');
    setMode('balanced');
    setMinSoc('');
    setMaxSoc('');
    setBatteryPowerLimit('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">PV Self-Consumption</h2>
        <StatusToggle statusOn={isActive} onToggle={(v) => setIsActive(v)} />
      </div>

      {/* Setpoints */}
      <div className="space-y-4 mb-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-700">Setpoints</h3>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-32">Export Limit</label>
            <NumberInput
              value={exportLimit}
              onChange={(e: any) => setExportLimit(e.target.value)}
            className="flex-1"
          />
          <UnitLabel>kW</UnitLabel>
        </div>

        <div className="flex items-start gap-2">
          <label className="text-sm text-gray-600 w-32 pt-2">Mode</label>
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <RadioInput
                  name="mode"
                  value="strict"
                  checked={mode === 'strict'}
                   onChange={(e: any) => setMode(e.target.value)}
                />
              <span>Strict</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <RadioInput
                name="mode"
                value="balanced"
                checked={mode === 'balanced'}
                 onChange={(e: any) => setMode(e.target.value)}
              />
              <span>Balanced</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <RadioInput
                name="mode"
                value="economic"
                checked={mode === 'economic'}
                 onChange={(e: any) => setMode(e.target.value)}
              />
              <span>Economic</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-32">Min / Max SoC</label>
          <SmallNumberInput
            value={minSoc}
              onChange={(e: any) => setMinSoc(e.target.value)}
          />
          <SmallNumberInput
            value={maxSoc}
              onChange={(e: any) => setMaxSoc(e.target.value)}
          />
          <UnitLabel className="text-sm text-gray-500">%</UnitLabel>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-32">Battery Power Limit</label>
          <NumberInput
            value={batteryPowerLimit}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setBatteryPowerLimit(e.target.value)}
            className="flex-1"
          />
          <UnitLabel>kW</UnitLabel>
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </div>
  );
}

// Time-of-Use Optimization Card Component
function TimeOfUseOptimizationCard() {
  const [isActive, setIsActive] = useState(true);
  const [schedule, setSchedule] = useState('00:00-06:00 Charge\n17:00-21:00 Discharge');
  const [targetSoc, setTargetSoc] = useState('');

  const handleApply = () => {
    console.log('Applying Time-of-Use Optimization settings...');
  };

  const handleReset = () => {
    setSchedule('00:00-06:00 Charge\n17:00-21:00 Discharge');
    setTargetSoc('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Time-of-Use Optimization</h2>
        <StatusToggle statusOn={isActive} onToggle={(v) => setIsActive(v)} />
      </div>

      {/* Schedule */}
      <div className="space-y-4 mb-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-700">Schedule</h3>

        <TimeRangeEditor value={schedule} onChange={(s: string) => setSchedule(s)} />

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-24">Target SoC</label>
          <NumberInput
            value={targetSoc}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setTargetSoc(e.target.value)}
            className="flex-1"
          />
          <span className="text-sm text-gray-500 w-8">%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </div>
  );
}

// Microgrid / Islanding Card Component
function MicrogridIslandingCard() {
  const [status, setStatus] = useState('GRID CONNECTED');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [voltage, setVoltage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [droopVF, setDroopVF] = useState('');
  
  // Manual Island hold state
  const [isHoldingManualIsland, setIsHoldingManualIsland] = useState(false);
  const [manualIslandProgress, setManualIslandProgress] = useState(0);
  const [manualIslandTimer, setManualIslandTimer] = useState<NodeJS.Timeout | null>(null);
  const [manualIslandInterval, setManualIslandInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Black Start hold state
  const [isHoldingBlackStart, setIsHoldingBlackStart] = useState(false);
  const [blackStartProgress, setBlackStartProgress] = useState(0);
  const [blackStartTimer, setBlackStartTimer] = useState<NodeJS.Timeout | null>(null);
  const [blackStartInterval, setBlackStartInterval] = useState<NodeJS.Timeout | null>(null);

  const handleManualIslandStart = () => {
    setIsHoldingManualIsland(true);
    setManualIslandProgress(0);
    
    const interval = setInterval(() => {
      setManualIslandProgress((prev) => {
        const next = prev + 3.33; // 100% / 30 steps (3000ms / 100ms)
        return next >= 100 ? 100 : next;
      });
    }, 100);
    setManualIslandInterval(interval);
    
    const timer = setTimeout(() => {
      handleManualIslandComplete();
    }, 3000);
    setManualIslandTimer(timer);
  };

  const handleManualIslandComplete = () => {
    console.log('Manual Island initiated...');
    setStatus('ISLANDED');
    handleManualIslandCancel();
  };

  const handleManualIslandCancel = () => {
    setIsHoldingManualIsland(false);
    setManualIslandProgress(0);
    if (manualIslandTimer) {
      clearTimeout(manualIslandTimer);
      setManualIslandTimer(null);
    }
    if (manualIslandInterval) {
      clearInterval(manualIslandInterval);
      setManualIslandInterval(null);
    }
  };

  const handleBlackStartStart = () => {
    setIsHoldingBlackStart(true);
    setBlackStartProgress(0);
    
    const interval = setInterval(() => {
      setBlackStartProgress((prev) => {
        const next = prev + 3.33;
        return next >= 100 ? 100 : next;
      });
    }, 100);
    setBlackStartInterval(interval);
    
    const timer = setTimeout(() => {
      handleBlackStartComplete();
    }, 3000);
    setBlackStartTimer(timer);
  };

  const handleBlackStartComplete = () => {
    handleBlackStartCancel();
    if (confirm('Are you sure you want to perform a Black Start? This operation requires guarded confirmation.')) {
      console.log('Black Start initiated...');
    }
  };

  const handleBlackStartCancel = () => {
    setIsHoldingBlackStart(false);
    setBlackStartProgress(0);
    if (blackStartTimer) {
      clearTimeout(blackStartTimer);
      setBlackStartTimer(null);
    }
    if (blackStartInterval) {
      clearInterval(blackStartInterval);
      setBlackStartInterval(null);
    }
  };

  const handleApply = () => {
    console.log('Applying Microgrid/Islanding settings...');
  };

  const handleReset = () => {
    setVoltage('');
    setFrequency('');
    setDroopVF('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Microgrid / Islanding</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span className="text-xs font-medium text-gray-600">{status}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 mb-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-700">Actions</h3>

        <div className="flex justify-center gap-3">
          <HoldButton
            isHolding={isHoldingManualIsland}
            progress={manualIslandProgress}
            onStart={handleManualIslandStart}
            onCancel={handleManualIslandCancel}
            baseText={'Manual Island (Hold 3s)'}
            holdingText={`Hold (${Math.ceil(3 - (manualIslandProgress * 0.03))}s)`}
            baseBg={'bg-red-100 text-red-700 hover:bg-red-200'}
            holdBg={'bg-red-600 text-white'}
            overlayBg={'bg-red-300'}
          />

          <HoldButton
            isHolding={isHoldingBlackStart}
            progress={blackStartProgress}
            onStart={handleBlackStartStart}
            onCancel={handleBlackStartCancel}
            baseText={'Black Start (Hold 3s)'}
            holdingText={`Hold (${Math.ceil(3 - (blackStartProgress * 0.03))}s)`}
            baseBg={'bg-red-100 text-red-700 hover:bg-red-200'}
            holdBg={'bg-red-700 text-white'}
            overlayBg={'bg-red-400'}
          />
        </div>

        {/* Advanced Settings Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="font-medium">Advanced Settings</span>
          <svg
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Advanced Settings Content */}
        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 w-24">Voltage</label>
                <NumberInput
                  value={voltage}
                  onChange={(e: any) => setVoltage(e.target.value)}
                className="flex-1"
              />
              <UnitLabel>V</UnitLabel>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 w-24">Frequency</label>
                <NumberInput
                  value={frequency}
                  onChange={(e: any) => setFrequency(e.target.value)}
                className="flex-1"
              />
              <UnitLabel>Hz</UnitLabel>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 w-24">Droop V/F</label>
                <NumberInput
                  value={droopVF}
                  onChange={(e: any) => setDroopVF(e.target.value)}
                className="w-24"
              />
              <UnitLabel className="text-sm text-gray-500">%</UnitLabel>
              <NumberInput className="w-24" />
              <UnitLabel>Hz</UnitLabel>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </div>
  );
}

// Grid Services Card Component
function GridServicesCard() {
  const [isEnrolled, setIsEnrolled] = useState(true);
  const [serviceType, setServiceType] = useState('');
  const [committedCapacity, setCommittedCapacity] = useState('');
  
  // Opt-Out hold state
  const [isHoldingOptOut, setIsHoldingOptOut] = useState(false);
  const [optOutProgress, setOptOutProgress] = useState(0);
  const [optOutTimer, setOptOutTimer] = useState<NodeJS.Timeout | null>(null);
  const [optOutInterval, setOptOutInterval] = useState<NodeJS.Timeout | null>(null);

  const handleOptOutStart = () => {
    setIsHoldingOptOut(true);
    setOptOutProgress(0);
    
    const interval = setInterval(() => {
      setOptOutProgress((prev) => {
        const next = prev + 3.33;
        return next >= 100 ? 100 : next;
      });
    }, 100);
    setOptOutInterval(interval);
    
    const timer = setTimeout(() => {
      handleOptOutComplete();
    }, 3000);
    setOptOutTimer(timer);
  };

  const handleOptOutComplete = () => {
    handleOptOutCancel();
    if (confirm('Are you sure you want to opt out of Grid Services?')) {
      console.log('Opting out of Grid Services...');
      setIsEnrolled(false);
    }
  };

  const handleOptOutCancel = () => {
    setIsHoldingOptOut(false);
    setOptOutProgress(0);
    if (optOutTimer) {
      clearTimeout(optOutTimer);
      setOptOutTimer(null);
    }
    if (optOutInterval) {
      clearInterval(optOutInterval);
      setOptOutInterval(null);
    }
  };

  const handleApply = () => {
    console.log('Applying Grid Services settings...');
  };

  const handleReset = () => {
    setServiceType('');
    setCommittedCapacity('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Grid Services</h2>
        <StatusToggle statusOn={isEnrolled} onToggle={(v) => setIsEnrolled(v)} onLabel={'ENROLLED'} offLabel={'NOT ENROLLED'} />
      </div>

      {/* Settings */}
      <div className="space-y-4 mb-6 flex-1">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-36">Service Type</label>
            <TextInput
              value={serviceType}
              onChange={(e: any) => setServiceType(e.target.value)}
            className="flex-1"
            placeholder="e.g., Frequency Response"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-36">Committed Capacity</label>
            <NumberInput
              value={committedCapacity}
              onChange={(e: any) => setCommittedCapacity(e.target.value)}
            className="flex-1"
          />
          <UnitLabel>kW</UnitLabel>
        </div>

        <div className="relative flex justify-center">
          <HoldButton
            isHolding={isHoldingOptOut}
            progress={optOutProgress}
            onStart={handleOptOutStart}
            onCancel={handleOptOutCancel}
            disabled={!isEnrolled}
            baseText={isEnrolled ? 'Opt-Out (Hold 3s)' : 'Opt-Out'}
            holdingText={`Hold (${Math.ceil(3 - (optOutProgress * 0.03))}s)`}
            baseBg={'bg-red-100 text-red-700 hover:bg-red-200'}
            holdBg={'bg-red-600 text-white'}
            overlayBg={'bg-red-300'}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </div>
  );
}
