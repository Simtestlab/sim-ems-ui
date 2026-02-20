export function HoldButton({
  isHolding,
  progress,
  onStart,
  onCancel,
  disabled,
  baseText,
  holdingText,
  baseBg = 'bg-red-100 text-red-700 hover:bg-red-200',
  holdBg = 'bg-red-600 text-white',
  overlayBg = 'bg-red-300',
}: {
  isHolding: boolean;
  progress: number;
  onStart: () => void;
  onCancel: () => void;
  disabled?: boolean;
  baseText: string;
  holdingText: string;
  baseBg?: string;
  holdBg?: string;
  overlayBg?: string;
}) {
  return (
    <div className="relative">
      <button
        onMouseDown={disabled ? undefined : onStart}
        onMouseUp={onCancel}
        onMouseLeave={onCancel}
        onTouchStart={disabled ? undefined : onStart}
        onTouchEnd={onCancel}
        disabled={disabled}
        className={`w-32 px-3 py-2 text-sm font-medium rounded transition-colors relative overflow-hidden ${
          disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : isHolding ? holdBg : baseBg
        }`}
      >
        {isHolding && (
          <div className={`absolute inset-0 ${overlayBg} transition-all`} style={{ width: `${progress}%` }} />
        )}
        <span className="relative z-10">{isHolding ? holdingText : baseText}</span>
      </button>
    </div>
  );
}
