import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
   const token = request.cookies.get('accessToken')?.value;

   if (!token) {
      const protectedRoutes = [
         '/dashboard',
         '/product',
         '/category',
         '/transaction',
         '/inventory',
         '/user',
         '/destination',
         '/location',
         '/',
      ]

      const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

      if (isProtectedRoute) {
         return NextResponse.redirect(new URL('/auth', request.url));
      }
   }
   return NextResponse.next();
}

export const config = {
   matcher: [
      '/',
      '/dashboard/:path*',
      '/(product|category|transaction|inventory|user|destination|location)/:path*', // Proteksi route yang di-matching dengan pola ini
   ],
}
