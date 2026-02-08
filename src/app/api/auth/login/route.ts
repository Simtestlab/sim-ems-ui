import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body: LoginBody = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Stub authentication: accept any credentials and return a mock user
    const user = {
      id: 'user-1',
      email,
      username: email.split('@')[0],
      first_name: 'Demo',
      last_name: 'User',
      full_name: 'Demo User',
      role: 'admin',
      role_display: 'Administrator',
      organization: { id: 'org-1', name: 'Demo Org' },
      is_active: true,
      date_joined: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    // Create a mock token and attach it as an HttpOnly cookie so server-side
    // checks (like on the dashboard page) can detect authentication.
    const token = 'mock-token-' + Date.now();

    const res = NextResponse.json({ user }, { status: 200 });
    res.cookies.set('access_token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
