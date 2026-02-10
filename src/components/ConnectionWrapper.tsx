'use client';
import { useLiveTelemetry } from '@/modules/live/context/LiveTelemetryContext';
import { ConnectionErrorPage } from '@/modules/live/components/ConnectionErrorPage';
import { useState, useEffect } from 'react';

interface ConnectionWrapperProps {
  children: React.ReactNode;
}

export function ConnectionWrapper({ children }: ConnectionWrapperProps) {
  const { isConnected, status } = useLiveTelemetry();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [backendError, setBackendError] = useState<string>('');

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const backendURL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${backendURL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });

      if (!response.ok) {
        throw new Error(`Backend health check failed: ${response.status} ${response.statusText}`);
      }

      setBackendStatus('healthy');
      setBackendError('');
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus('error');
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setBackendError('Unable to connect to backend server');
      } else {
        setBackendError(error instanceof Error ? error.message : 'Backend health check failed');
      }
    }
  };

  // Perform backend health check on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Show error page for backend issues or WebSocket issues
  if (backendStatus === 'error' || status === 'ERROR' || (!isConnected && status === 'DISCONNECTED')) {
    return (
      <ConnectionErrorPage 
        backendStatus={backendStatus}
        backendError={backendError}
        onBackendRetry={checkBackendHealth}
      />
    );
  }

  // Show loading while checking backend
  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Checking System Health...
            </h1>
            <p className="text-gray-600 mb-6">
              Verifying backend connectivity
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show normal app content when both backend and WebSocket are healthy
  return <>{children}</>;
}