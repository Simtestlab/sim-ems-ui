export function ActionButtons({ onApply, onReset }: { onApply: () => void; onReset: () => void }) {
  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={onApply}
        className="w-32 px-3 py-2 bg-emerald-400 text-white text-sm font-medium rounded hover:bg-emerald-600 transition-colors"
      >
        Apply
      </button>
      <button
        onClick={onReset}
        className="w-32 px-3 py-2 bg-red-100 text-gray-700 text-sm font-medium rounded hover:bg-red-200 transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
