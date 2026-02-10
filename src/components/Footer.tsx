export default function Footer() {
  return (
    <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-10 items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Simtestlab EMS" className="w-4 h-4 object-contain" />
          <div className="flex items-center gap-3">
            <div className="font-semibold text-gray-800 text-sm">Simtestlab EMS</div>
            <div className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">v2026.1.0</div>
          </div>
        </div>

        <div className="text-[10px] text-gray-500">© 2026 Simtestlab Sweden AB. All rights reserved</div>
      </div>
    </footer>
  );
}
