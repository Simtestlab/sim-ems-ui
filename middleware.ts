import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === '/login';
  const isDashboard = pathname.startsWith('/dashboard');
  const isRoot = pathname === '/';

  // Redirect root to appropriate page based on auth status
  if (isRoot) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to login if accessing dashboard without token
  if (isDashboard && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing login with valid token
  if (isLoginPage && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
