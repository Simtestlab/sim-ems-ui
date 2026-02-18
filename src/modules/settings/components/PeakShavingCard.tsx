'use client';

import { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { ActionButtons } from './ActionButtons';
import { NumberInput, SmallNumberInput, CheckboxInput, UnitLabel } from './FormInputs';

export default function PeakShavingCard() {
  const [isActive, setIsActive] = useState(true);
  const [peakLimit, setPeakLimit] = useState('');
  const [deadband, setDeadband] = useState('');
  const [minOn, setMinOn] = useState('');
  const [minOff, setMinOff] = useState('');
  const [hvacEnabled, setHvacEnabled] = useState(true);
  const [evEnabled, setEvEnabled] = useState(true);

  const handleApply = () => {
    console.log('Applying Peak Shaving settings...');
  };

  const handleReset = () => {
    setPeakLimit('');
    setDeadband('');
    setMinOn('');
    setMinOff('');
  };

  return (
    <SettingsCard title="Peak Shaving" isActive={isActive} onToggle={setIsActive}>
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700">Setpoints</h3>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-28">Peak Limit</label>
          <NumberInput value={peakLimit} onChange={(e: any) => setPeakLimit(e.target.value)} className="flex-1" />
          <UnitLabel>kW</UnitLabel>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-28">Deadband</label>
          <NumberInput value={deadband} onChange={(e: any) => setDeadband(e.target.value)} className="flex-1" />
          <UnitLabel>kW</UnitLabel>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-28">Min ON / OFF</label>
          <SmallNumberInput value={minOn} onChange={(e: any) => setMinOn((e.target as HTMLInputElement).value)} />
          <SmallNumberInput value={minOff} onChange={(e: any) => setMinOff((e.target as HTMLInputElement).value)} />
          <span className="text-sm text-gray-500">sec</span>
        </div>

        <div className="pt-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Load Priority</h4>
          <div className="space-y-1.5 bg-gray-50 p-3 rounded">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <CheckboxInput checked={hvacEnabled} onChange={(e: any) => setHvacEnabled(e.target.checked)} />
              <span>1 HVAC 50kW</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <CheckboxInput checked={evEnabled} onChange={(e: any) => setEvEnabled(e.target.checked)} />
              <span>2 EV 40kW</span>
            </label>
          </div>
        </div>
      </div>

      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </SettingsCard>
  );
}
