import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 401 }
      );
    }

    // Call Django backend to blacklist token
    const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // Clear cookies regardless of backend response
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    if (!response.ok) {
      console.error('Backend logout failed, but cookies cleared');
    }

    return NextResponse.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear cookies even if backend fails
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json(
      { message: 'Logout successful (cookies cleared)' },
      { status: 200 }
    );
  }
}
