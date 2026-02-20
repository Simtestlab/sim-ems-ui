'use client';

export function StatusToggle({
  statusOn,
  onToggle,
  onLabel = 'ACTIVE',
  offLabel = 'IDLE',
  showToggle = true,
}: {
  statusOn: boolean;
  onToggle?: (s: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  showToggle?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusOn ? 'bg-emerald-500' : 'bg-gray-400'}`} />
        <span className="text-xs font-medium text-gray-600">{statusOn ? onLabel : offLabel}</span>
      </div>
      {showToggle && (
        <>
          <button
            onClick={() => onToggle && onToggle(!statusOn)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              statusOn ? 'bg-gray-300' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                statusOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-xs font-medium text-gray-500">ON</span>
        </>
      )}
    </div>
  );
}
