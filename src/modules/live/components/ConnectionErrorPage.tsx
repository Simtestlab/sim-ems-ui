'use client';
import { useLiveTelemetry } from '../context/LiveTelemetryContext';
import { useNavStore } from '@/store/useNavStore';
import { getSiteConfig } from '@/config/sites';

export function ConnectionErrorPage() {
    const { connect, isConnected, status } = useLiveTelemetry();
    const { selectedSite } = useNavStore();
    const siteConfig = getSiteConfig(selectedSite);

    console.log("Rendering ConnectionErrorPage - isConnected:", isConnected, "status:", status);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Error Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <svg
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Connection Failed
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Unable to establish connection with the real-time data server for site "{siteConfig?.name || selectedSite}".
                        Please check your connection and try again.
                    </p>

                    {/* Connection Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Connection Status</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                                <span>WebSocket:</span>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                    <span className="font-medium">{status}</span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span>Site:</span>
                                <span className="font-medium">{siteConfig?.name || selectedSite}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Server:</span>
                                <span className="font-mono text-xs break-all">{siteConfig?.wsUrl || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={connect}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Retry Connection
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 text-xs text-gray-500">
                        <p>If the problem persists, please contact system administrator.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}