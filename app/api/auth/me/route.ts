import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Call Django backend to get user info
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Token might be expired, try to refresh
      const refreshToken = cookieStore.get('refresh_token')?.value;
      
      if (!refreshToken) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        );
      }

      // Try to refresh the token
      const refreshResponse = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!refreshResponse.ok) {
        // Refresh failed, clear cookies
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        );
      }

      const refreshData = await refreshResponse.json();
      
      // Update access token cookie
      cookieStore.set('access_token', refreshData.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15, // 15 minutes
        path: '/',
      });

      // Retry getting user info with new token
      const retryResponse = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${refreshData.access}`,
        },
      });

      if (!retryResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch user' },
          { status: retryResponse.status }
        );
      }

      const userData = await retryResponse.json();
      return NextResponse.json({ user: userData });
    }

    const data = await response.json();
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
