import { ReactNode } from 'react';
import { StatusToggle } from './StatusToggle';

export function SettingsCard({
  title,
  isActive,
  onToggle,
  onLabel,
  offLabel,
  customHeader,
  children,
}: {
  title: string;
  isActive?: boolean;
  onToggle?: (v: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  customHeader?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {customHeader || (isActive !== undefined && onToggle && (
          <StatusToggle 
            statusOn={isActive} 
            onToggle={onToggle}
            onLabel={onLabel}
            offLabel={offLabel}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
