
import type { ColItem } from '../types/alerts';

export const DEFAULT_CRITICAL_ALERTS: ColItem[] = [
  { 
    id: 'a1', 
    title: 'High Grid Demand', 
    desc: 'Grid import at 863 kW, approaching peak demand.', 
    time: '10:02:52 AM' 
  },
  { 
    id: 'a2', 
    title: 'High Load Demand', 
    desc: 'Load consumption at 848 kW. Monitor energy usage.', 
    time: '10:02:52 AM' 
  },
];

export const DEFAULT_WARNING_ALERTS: ColItem[] = [
  { 
    id: 'w1', 
    title: 'Battery Low', 
    desc: 'Battery charge at 12% — consider backup.', 
    time: '09:58:11 AM' 
  },
];

export const DEFAULT_FINANCIAL_ALERTS: ColItem[] = [
  { 
    id: 'f1', 
    title: 'Tariff Spike', 
    desc: 'Peak tariff expected at 5:00 PM.', 
    time: '08:22:10 AM' 
  },
];

export const DEFAULT_SYSTEM_ALERTS: ColItem[] = [
  { 
    id: 's1', 
    title: 'Sensor Fault', 
    desc: 'Temperature sensor disconnected.', 
    time: '07:12:03 AM' 
  },
  { 
    id: 's2', 
    title: 'Comm Delay', 
    desc: 'Telemetry update delayed 10m.', 
    time: '07:15:44 AM' 
  },
];


export const BETA_CRITICAL_ALERTS: ColItem[] = [
  { 
    id: 'b-a1', 
    title: 'Beta Grid Spike', 
    desc: 'Beta site grid spike at 920 kW.', 
    time: '11:12:01 AM' 
  },
];

export const BETA_WARNING_ALERTS: ColItem[] = [
  { 
    id: 'b-w1', 
    title: 'Beta Battery Warm', 
    desc: 'Battery temp above threshold (45°C).', 
    time: '10:58:11 AM' 
  },
];

export const BETA_FINANCIAL_ALERTS: ColItem[] = [
  { 
    id: 'b-f1', 
    title: 'Beta Billing Update', 
    desc: 'Projected billing change for next cycle.', 
    time: '09:22:10 AM' 
  },
];

export const BETA_SYSTEM_ALERTS: ColItem[] = [
  { 
    id: 'b-s1', 
    title: 'Beta Comm Restore', 
    desc: 'Communication restored after brief outage.', 
    time: '08:12:03 AM' 
  },
];


export const ALERT_COLUMN_HEIGHT = 390;

export const ALERT_COLORS = {
  critical: 'text-red-600',
  warning: 'text-yellow-500',
  financial: 'text-green-600',
  system: 'text-blue-600',
} as const;
