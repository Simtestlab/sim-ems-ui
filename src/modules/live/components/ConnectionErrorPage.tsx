'use client';
import { useLiveTelemetry } from '../context/LiveTelemetryContext';
import { useNavStore } from '@/store/useNavStore';
import { getSiteConfig } from '@/config/sites';

interface ConnectionErrorPageProps {
  backendStatus?: 'checking' | 'healthy' | 'error';
  backendError?: string;
  onBackendRetry?: () => void;
}

export function ConnectionErrorPage({ 
  backendStatus = 'healthy', 
  backendError = '',
  onBackendRetry 
}: ConnectionErrorPageProps) {
    const { connect, isConnected, status } = useLiveTelemetry();
    const { selectedSite } = useNavStore();
    const siteConfig = getSiteConfig(selectedSite);

    console.log("Rendering ConnectionErrorPage - isConnected:", isConnected, "status:", status, "backendStatus:", backendStatus);

    // Determine if this is a backend error or WebSocket error
    const isBackendError = backendStatus === 'error';
    const isWebSocketError = status === 'ERROR' || (!isConnected && status === 'DISCONNECTED');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Error Icon - Different colors for different error types */}
                    <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${
                        isBackendError ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                        {isBackendError ? (
                            // Backend Error Icon
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
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        ) : (
                            // WebSocket Error Icon
                            <svg
                                className="h-8 w-8 text-orange-600"
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
                        )}
                    </div>

                    {/* Error Message */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {isBackendError ? 'Backend Unavailable' : 'Connection Failed'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {isBackendError 
                            ? 'Unable to connect to the backend server. Please check if the server is running.'
                            : `Unable to establish connection with the real-time data server for site "${siteConfig?.name || selectedSite}". Please check your connection and try again.`
                        }
                    </p>

                    {/* Error Details */}
                    {(isBackendError || backendError) && (
                        <div className={`rounded-lg p-3 mb-6 ${
                            isBackendError ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
                        }`}>
                            <p className={`text-sm ${
                                isBackendError ? 'text-red-700' : 'text-orange-700'
                            }`}>
                                {backendError || 'Backend connection failed'}
                            </p>
                        </div>
                    )}

                    {/* Connection Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">System Status</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                                <span>Backend Server:</span>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                        backendStatus === 'healthy' ? 'bg-green-400' : 
                                        backendStatus === 'error' ? 'bg-red-400' : 'bg-blue-400'
                                    }`}></div>
                                    <span className="font-medium capitalize">{backendStatus}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>WebSocket:</span>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                    <span className="font-medium">{status}</span>
                                </div>
                            </div>
                            {!isBackendError && (
                                <>
                                    <div className="flex justify-between">
                                        <span>Site:</span>
                                        <span className="font-medium">{siteConfig?.name || selectedSite}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Server:</span>
                                        <span className="font-mono text-xs break-all">{siteConfig?.wsUrl || 'N/A'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Retry Button */}
                        <button
                            onClick={isBackendError ? onBackendRetry : connect}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                isBackendError
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isBackendError ? 'Check Backend' : 'Reconnect WebSocket'}
                        </button>

                        {/* Site Selection Link */}
                        <button
                            onClick={() => window.location.href = '/sitemap'}
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
                        >
                            Select Site
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 text-xs text-gray-500">
                        {isBackendError 
                            ? 'Contact your system administrator if the problem persists.'
                            : 'If the issue persists, try selecting a different site or contact support.'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}