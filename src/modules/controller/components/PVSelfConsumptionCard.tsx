'use client';

import { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { ActionButtons } from './ActionButtons';
import { NumberInput, SmallNumberInput, RadioInput, UnitLabel } from './FormInputs';

export default function PVSelfConsumptionCard() {
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
    <SettingsCard title="PV Self-Consumption" isActive={isActive} onToggle={setIsActive}>
      <div className="space-y-4 mb-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-700">Setpoints</h3>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-32">Export Limit</label>
          <NumberInput value={exportLimit} onChange={(e: any) => setExportLimit(e.target.value)} className="flex-1" />
          <UnitLabel>kW</UnitLabel>
        </div>

        <div className="flex items-start gap-2">
          <label className="text-sm text-gray-600 w-32 pt-2">Mode</label>
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <RadioInput name="mode" value="strict" checked={mode === 'strict'} onChange={(e: any) => setMode(e.target.value)} />
              <span>Strict</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <RadioInput name="mode" value="balanced" checked={mode === 'balanced'} onChange={(e: any) => setMode(e.target.value)} />
              <span>Balanced</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <RadioInput name="mode" value="economic" checked={mode === 'economic'} onChange={(e: any) => setMode(e.target.value)} />
              <span>Economic</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-32">Min / Max SoC</label>
          <SmallNumberInput value={minSoc} onChange={(e: any) => setMinSoc(e.target.value)} />
          <SmallNumberInput value={maxSoc} onChange={(e: any) => setMaxSoc(e.target.value)} />
          <UnitLabel className="text-sm text-gray-500">%</UnitLabel>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-32">Battery Power Limit</label>
          <NumberInput value={batteryPowerLimit} onChange={(e: any) => setBatteryPowerLimit(e.target.value)} className="flex-1" />
          <UnitLabel>kW</UnitLabel>
        </div>
      </div>

      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </SettingsCard>
  );
}
