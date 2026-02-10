export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 h-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-full items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Simtestlab EMS" className="w-5 h-5 object-contain" />
          <div>
            <div className="font-medium text-gray-800 text-sm">Simtestlab EMS</div>
            <div className="text-[10px] text-gray-500">Version 2026.1.0</div>
          </div>
        </div>

        <div className="text-[10px] text-gray-500">© 2026 Simtestlab Sweden AB. All rights reserved</div>
      </div>
    </footer>
  );
}
