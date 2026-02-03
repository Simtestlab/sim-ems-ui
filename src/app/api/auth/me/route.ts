import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  // Return a mock user when token exists. Replace with real session lookup.
  const user = {
    id: 'user-1',
    email: 'admin@simtestlab.com',
    username: 'admin',
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

  return NextResponse.json({ user });
}
