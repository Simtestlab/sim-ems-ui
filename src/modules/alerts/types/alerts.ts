

export type ColItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  viewed?: boolean;
};

export type AlertSeverity = 'critical' | 'warning' | 'financial' | 'system';

export interface AlertColumnConfig {
  title: string;
  items: ColItem[];
  colorClass?: string;
  gradientClass?: string;
  onRemove?: (id: string) => void;
  minHeightPx?: number;
}
