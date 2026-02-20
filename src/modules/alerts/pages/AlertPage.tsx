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
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pt-6 px-2 sm:px-4 lg:px-4 pb-2">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-1 gap-2 items-stretch">
          <AlertsColumn 
            title="Critical Actions" 
            items={nowItems} 
            colorClass={ALERT_COLORS.critical} 
            onRemove={handleRemoveNow} 
          />
          <AlertsColumn 
            title="Warning" 
            items={warnItems} 
            colorClass={ALERT_COLORS.warning} 
            onRemove={handleRemoveWarn} 
          />
          <AlertsColumn 
            title="Financial Alerts" 
            items={finItems} 
            colorClass={ALERT_COLORS.financial} 
            onRemove={handleRemoveFin} 
          />
          <AlertsColumn 
            title="System Alerts" 
            items={sysItems} 
            colorClass={ALERT_COLORS.system} 
            onRemove={handleRemoveSys} 
          />
        </div>
      </div>
    </div>
  );
}
