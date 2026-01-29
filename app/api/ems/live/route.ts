/**
 * EMS Live Telemetry API - Proxy to Django Backend
 * 
 * Proxies requests to Django backend at http://localhost:8000
 * Route: GET /api/ems/live
 */

import { NextResponse } from 'next/server';
import { getAuthHeaders } from '../utils';

export const dynamic = 'force-dynamic';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${DJANGO_API_URL}/api/ems/live`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Not authenticated. Please log in.' },
          { status: 401 }
        );
      }
      throw new Error(`Django API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.error('[Proxy /api/ems/live] Error:', error);
    
    const isConnectionError = error.code === 'ECONNREFUSED' || 
                               error.cause?.code === 'ECONNREFUSED';
    
    return NextResponse.json(
      { 
        error: isConnectionError 
          ? 'Backend server is not running. Please start Django server: python3 manage.py runserver'
          : 'Failed to fetch live telemetry',
        backendUrl: DJANGO_API_URL,
        isConnectionError,
      },
      { status: 503 }
    );
  }
}
