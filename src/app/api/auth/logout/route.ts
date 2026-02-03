import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear the access_token cookie
  res.cookies.set('access_token', '', { path: '/', maxAge: 0 });
  return res;
}
