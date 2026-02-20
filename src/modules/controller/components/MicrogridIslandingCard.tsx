'use client';

import { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { ActionButtons } from './ActionButtons';
import { HoldButton } from './HoldButton';
import { NumberInput, UnitLabel } from './FormInputs';

export default function MicrogridIslandingCard() {
  const [status, setStatus] = useState('GRID CONNECTED');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [voltage, setVoltage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [droopVF, setDroopVF] = useState('');
  
  const [isHoldingManualIsland, setIsHoldingManualIsland] = useState(false);
  const [manualIslandProgress, setManualIslandProgress] = useState(0);
  const [manualIslandTimer, setManualIslandTimer] = useState<NodeJS.Timeout | null>(null);
  const [manualIslandInterval, setManualIslandInterval] = useState<NodeJS.Timeout | null>(null);
  
  const [isHoldingBlackStart, setIsHoldingBlackStart] = useState(false);
  const [blackStartProgress, setBlackStartProgress] = useState(0);
  const [blackStartTimer, setBlackStartTimer] = useState<NodeJS.Timeout | null>(null);
  const [blackStartInterval, setBlackStartInterval] = useState<NodeJS.Timeout | null>(null);

  const handleManualIslandStart = () => {
    setIsHoldingManualIsland(true);
    setManualIslandProgress(0);
    const interval = setInterval(() => {
      setManualIslandProgress((prev) => {
        const next = prev + 3.33; 
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
    <SettingsCard 
      title="Microgrid / Islanding"
      customHeader={
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span className="text-xs font-medium text-gray-600">{status}</span>
        </div>
      }
    >
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

        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 w-24">Voltage</label>
              <NumberInput value={voltage} onChange={(e: any) => setVoltage(e.target.value)} className="flex-1" />
              <UnitLabel>V</UnitLabel>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 w-24">Frequency</label>
              <NumberInput value={frequency} onChange={(e: any) => setFrequency(e.target.value)} className="flex-1" />
              <UnitLabel>Hz</UnitLabel>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 w-24">Droop V/F</label>
              <NumberInput value={droopVF} onChange={(e: any) => setDroopVF(e.target.value)} className="w-24" />
              <UnitLabel className="text-sm text-gray-500">%</UnitLabel>
              <NumberInput className="w-24" />
              <UnitLabel>Hz</UnitLabel>
            </div>
          </div>
        )}
      </div>

      <ActionButtons onApply={handleApply} onReset={handleReset} />
    </SettingsCard>
  );
}
