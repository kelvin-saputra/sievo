import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { permission } from '../rbac-client';
import { verify } from '../jwt';


export async function roleMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

// Search for the matches url
  const perm = permission.find(p => pathname.startsWith(p.path));

// If ALL has access
  if (!perm) return NextResponse.next();

  // Getting the authenticated user and the role of the user
  const token = req.cookies.get("refreshToken")?.value
  const decodedToken = await verify(token as string, process.env.JWT_REFRESH_TOKEN_SECRET!)
  const userRole = (decodedToken as any).role;

  // Getting for the role that have access 
  const allowed = perm.methods[method];

  if (!allowed) {
    return NextResponse.next();
  }

  // Kalau userRole gak ada atau gak termasuk allowed → redirect 403
  if (!userRole || !allowed.includes(userRole)) {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  return NextResponse.next();
}

// Hanya jalankan middleware pada semua path yang ada di permissions
export const config = {
  matcher: permission.map(p => `${p.path}/:path*`),
};
