

import type { ColItem } from '../types/alerts';

export function removeAlertById(alerts: ColItem[], id: string): ColItem[] {
  return alerts.filter(alert => alert.id !== id);
}

export function markAlertAsViewed(alerts: ColItem[], id: string): ColItem[] {
  return alerts.map(alert => 
    alert.id === id ? { ...alert, viewed: true } : alert
  );
}

export function getUnviewedCount(alerts: ColItem[]): number {
  return alerts.filter(alert => !alert.viewed).length;
}

export function sortAlertsByTime(alerts: ColItem[]): ColItem[] {
  return [...alerts].sort((a, b) => {
    return b.time.localeCompare(a.time);
  });
}


export function getGradientFromColorClass(colorClass?: string, gradientClass?: string): string {
  if (gradientClass) return gradientClass;
  
  if (colorClass?.includes('red')) {
    return 'bg-gradient-to-r from-red-500 to-red-600';
  }
  if (colorClass?.includes('yellow')) {
    return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
  }
  if (colorClass?.includes('green')) {
    return 'bg-gradient-to-r from-green-500 to-green-600';
  }
  if (colorClass?.includes('blue')) {
    return 'bg-gradient-to-r from-blue-500 to-blue-600';
  }
  
  return 'bg-gradient-to-r from-orange-400 to-orange-600';
}


export function getCardBgFromGradient(gradientClass: string): string {
  if (gradientClass.includes('red')) return 'bg-red-50 border-red-100';
  if (gradientClass.includes('yellow')) return 'bg-yellow-50 border-yellow-100';
  if (gradientClass.includes('green')) return 'bg-green-50 border-green-100';
  if (gradientClass.includes('blue')) return 'bg-blue-50 border-blue-100';
  return 'bg-orange-50 border-orange-100';
}
