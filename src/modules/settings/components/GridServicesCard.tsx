'use client';

import { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { ActionButtons } from './ActionButtons';
import { TextInput, NumberInput, UnitLabel } from './FormInputs';
import { HoldButton } from './HoldButton';

export default function GridServicesCard() {
  const [isEnrolled, setIsEnrolled] = useState(true);
  const [serviceType, setServiceType] = useState('');
  const [committedCapacity, setCommittedCapacity] = useState('');
  
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
    <SettingsCard 
      title="Grid Services" 
      isActive={isEnrolled} 
      onToggle={setIsEnrolled}
      onLabel="ENROLLED"
      offLabel="NOT ENROLLED"
    >
      <div className="space-y-4 mb-6 flex-1">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-36">Service Type</label>
          <TextInput value={serviceType} onChange={(e: any) => setServiceType(e.target.value)} className="flex-1" placeholder="e.g., Frequency Response" />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-36">Committed Capacity</label>
          <NumberInput value={committedCapacity} onChange={(e: any) => setCommittedCapacity(e.target.value)} className="flex-1" />
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

      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </SettingsCard>
  );
}
