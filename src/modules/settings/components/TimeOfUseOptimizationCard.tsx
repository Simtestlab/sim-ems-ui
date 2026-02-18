'use client';

import { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { ActionButtons } from './ActionButtons';
import { NumberInput } from './FormInputs';
import { TimeRangeEditor } from './TimeRangeEditor';

export default function TimeOfUseOptimizationCard() {
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
    <SettingsCard title="Time-of-Use Optimization" isActive={isActive} onToggle={setIsActive}>
      <div className="space-y-4 mb-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-700">Schedule</h3>

        <TimeRangeEditor value={schedule} onChange={(s: string) => setSchedule(s)} />

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-24">Target SoC</label>
          <NumberInput value={targetSoc} onChange={(e: any) => setTargetSoc(e.target.value)} className="flex-1" />
          <span className="text-sm text-gray-500 w-8">%</span>
        </div>
      </div>

      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </SettingsCard>
  );
}
