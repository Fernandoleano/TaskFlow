import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/auth/signin', '/auth/signup', '/home'];
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

  // Redirect authenticated users trying to access auth pages to dashboard
  if (isAuthenticated && isPublicPath && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect unauthenticated users trying to access protected pages to login
  if (!isAuthenticated && !isPublicPath && !req.nextUrl.pathname.startsWith('/api')) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Configure protected routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 