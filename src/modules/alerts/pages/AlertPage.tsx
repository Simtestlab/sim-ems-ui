"use client";

import React, { useEffect, useState } from 'react';
import { useNavStore } from '@/store/useNavStore';
import { AlertsColumn } from '../components/AlertsColumn';
import type { ColItem } from '../types/alerts';
import {
  DEFAULT_CRITICAL_ALERTS,
  DEFAULT_WARNING_ALERTS,
  DEFAULT_FINANCIAL_ALERTS,
  DEFAULT_SYSTEM_ALERTS,
  BETA_CRITICAL_ALERTS,
  BETA_WARNING_ALERTS,
  BETA_FINANCIAL_ALERTS,
  BETA_SYSTEM_ALERTS,
  ALERT_COLUMN_HEIGHT,
  ALERT_COLORS,
} from '../utils/constants';


export default function AlertsPage() {
  const [nowItems, setNowItems] = useState<ColItem[]>(DEFAULT_CRITICAL_ALERTS);
  const [warnItems, setWarnItems] = useState<ColItem[]>(DEFAULT_WARNING_ALERTS);
  const [finItems, setFinItems] = useState<ColItem[]>(DEFAULT_FINANCIAL_ALERTS);
  const [sysItems, setSysItems] = useState<ColItem[]>(DEFAULT_SYSTEM_ALERTS);

  const { selectedSite } = useNavStore();

  useEffect(() => {
    if (selectedSite === 'ems_sim_02') {
      setNowItems(DEFAULT_CRITICAL_ALERTS);
      setWarnItems(DEFAULT_WARNING_ALERTS);
      setFinItems(DEFAULT_FINANCIAL_ALERTS);
      setSysItems(DEFAULT_SYSTEM_ALERTS);
      return;
    }

    if (selectedSite === 'ems_sim_01') {
      setNowItems(BETA_CRITICAL_ALERTS);
      setWarnItems(BETA_WARNING_ALERTS);
      setFinItems(BETA_FINANCIAL_ALERTS);
      setSysItems(BETA_SYSTEM_ALERTS);
      return;
    }

    setNowItems(DEFAULT_CRITICAL_ALERTS);
    setWarnItems(DEFAULT_WARNING_ALERTS);
    setFinItems(DEFAULT_FINANCIAL_ALERTS);
    setSysItems(DEFAULT_SYSTEM_ALERTS);
  }, [selectedSite]);

  const handleRemoveNow = (id: string) => setNowItems((prev) => prev.filter((p) => p.id !== id));
  const handleRemoveWarn = (id: string) => setWarnItems((prev) => prev.filter((p) => p.id !== id));
  const handleRemoveFin = (id: string) => setFinItems((prev) => prev.filter((p) => p.id !== id));
  const handleRemoveSys = (id: string) => setSysItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mt-4 mb-4 flex items-center gap-2">
            <svg className="text-orange-600 h-[1em] w-[1em]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Alerts & Notifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            <AlertsColumn 
              title="Critical Actions" 
              items={nowItems} 
              colorClass={ALERT_COLORS.critical} 
              onRemove={handleRemoveNow} 
              minHeightPx={ALERT_COLUMN_HEIGHT} 
            />
            <AlertsColumn 
              title="Warning" 
              items={warnItems} 
              colorClass={ALERT_COLORS.warning} 
              onRemove={handleRemoveWarn} 
              minHeightPx={ALERT_COLUMN_HEIGHT} 
            />
            <AlertsColumn 
              title="Financial Alerts" 
              items={finItems} 
              colorClass={ALERT_COLORS.financial} 
              onRemove={handleRemoveFin} 
              minHeightPx={ALERT_COLUMN_HEIGHT} 
            />
            <AlertsColumn 
              title="System Alerts" 
              items={sysItems} 
              colorClass={ALERT_COLORS.system} 
              onRemove={handleRemoveSys} 
              minHeightPx={ALERT_COLUMN_HEIGHT} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
