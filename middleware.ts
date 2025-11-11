import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/../lib/auth.server'; // Using our server-only decrypt function

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that are considered part of the admin area but need to be handled differently
  const adminLoginPath = '/admin/login';
  
  // Check if the current path is within the admin area
  if (pathname.startsWith('/admin')) {
    // Get the session from the cookie
    const sessionCookie = request.cookies.get('session')?.value;
    const session = await decrypt(sessionCookie);

    const isAdmin = session?.role === 'ADMIN';

    // If user is trying to access the login page while already being an admin, redirect them to the dashboard
    if (isAdmin && pathname === adminLoginPath) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If user is not an admin and is trying to access any admin page (except the login page), redirect to login
    if (!isAdmin && pathname !== adminLoginPath) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}

// The 'matcher' configuration tells Next.js which paths this middleware should run on.
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